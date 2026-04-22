import json
import os
import base64
import re
from datetime import datetime
import psycopg2
import boto3

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    'Access-Control-Max-Age': '86400',
}


def handler(event, context):
    """CRUD прайс-листов с загрузкой файла (PDF/XLSX) в S3 через base64."""
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        if method == 'GET':
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id, name, size_label, date_label, file_url FROM price_lists ORDER BY id DESC"
                )
                rows = cur.fetchall()
            data = [
                {'id': r[0], 'name': r[1], 'size': r[2], 'date': r[3], 'url': r[4]}
                for r in rows
            ]
            return _json(200, {'items': data})

        if not _check_auth(event, conn):
            return _json(401, {'error': 'unauthorized'})

        body = json.loads(event.get('body') or '{}')

        if method == 'POST':
            file_b64 = body.get('fileBase64')
            filename = body.get('filename') or 'pricelist.pdf'
            file_url = body.get('url', '')
            size_label = body.get('size', '')

            if file_b64:
                safe_name = re.sub(r'[^A-Za-z0-9._-]+', '_', filename)
                key = f'prices/{int(datetime.utcnow().timestamp())}_{safe_name}'
                raw = base64.b64decode(file_b64)
                ctype = body.get('contentType') or _guess_ct(safe_name)
                s3 = boto3.client(
                    's3',
                    endpoint_url='https://bucket.poehali.dev',
                    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
                )
                s3.put_object(Bucket='files', Key=key, Body=raw, ContentType=ctype)
                file_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
                if not size_label:
                    size_label = _fmt_size(len(raw))

            if not file_url:
                return _json(400, {'error': 'file or url required'})

            today = datetime.utcnow().strftime('%d.%m.%Y')
            with conn.cursor() as cur:
                cur.execute(
                    """INSERT INTO price_lists (name, size_label, date_label, file_url)
                       VALUES (%s, %s, %s, %s) RETURNING id""",
                    (body.get('name', filename), size_label, body.get('date', today), file_url),
                )
                new_id = cur.fetchone()[0]
                conn.commit()
            return _json(200, {'id': new_id, 'url': file_url})

        if method == 'DELETE':
            item_id = body.get('id') or (event.get('queryStringParameters') or {}).get('id')
            if not item_id:
                return _json(400, {'error': 'id required'})
            with conn.cursor() as cur:
                cur.execute("DELETE FROM price_lists WHERE id=%s", (int(item_id),))
                conn.commit()
            return _json(200, {'ok': True})

        return _json(405, {'error': 'Method Not Allowed'})
    finally:
        conn.close()


def _guess_ct(filename):
    low = filename.lower()
    if low.endswith('.pdf'):
        return 'application/pdf'
    if low.endswith('.xlsx'):
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    if low.endswith('.xls'):
        return 'application/vnd.ms-excel'
    return 'application/octet-stream'


def _fmt_size(n):
    if n < 1024:
        return f'{n} Б'
    if n < 1024 * 1024:
        return f'{n // 1024} КБ'
    return f'{round(n / (1024 * 1024), 1)} МБ'


def _check_auth(event, conn):
    headers = event.get('headers') or {}
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    if not token:
        return False
    with conn.cursor() as cur:
        cur.execute("SELECT expires_at FROM admin_sessions WHERE token=%s", (token,))
        row = cur.fetchone()
    return bool(row and row[0] > datetime.utcnow())


def _json(status, data):
    return {
        'statusCode': status,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False),
    }
