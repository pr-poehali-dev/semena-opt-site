import json
import os
import secrets
from datetime import datetime, timedelta
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    'Access-Control-Max-Age': '86400',
}


def handler(event, context):
    """Авторизация админа: проверка пароля, выдача/проверка токена сессии."""
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
            password = body.get('password', '')
            expected = os.environ.get('ADMIN_PASSWORD', '')
            if not expected or password != expected:
                return _json(401, {'error': 'Неверный пароль'})
            token = secrets.token_hex(32)
            expires = datetime.utcnow() + timedelta(days=7)
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO admin_sessions (token, expires_at) VALUES (%s, %s)",
                    (token, expires),
                )
                conn.commit()
            return _json(200, {'token': token})

        if method == 'GET':
            token = (event.get('headers') or {}).get('X-Auth-Token') or (event.get('headers') or {}).get('x-auth-token')
            if not token:
                return _json(401, {'error': 'no token'})
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT expires_at FROM admin_sessions WHERE token = %s",
                    (token,),
                )
                row = cur.fetchone()
            if not row or row[0] < datetime.utcnow():
                return _json(401, {'error': 'invalid token'})
            return _json(200, {'ok': True})

        return _json(405, {'error': 'Method Not Allowed'})
    finally:
        conn.close()


def _json(status, data):
    return {
        'statusCode': status,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False),
    }
