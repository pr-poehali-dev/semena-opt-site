import json
import os
import re
import psycopg2

def handler(event: dict, context) -> dict:
    '''
    Business: Приём заявок из формы обратной связи и сохранение в БД
    Args: event - dict с httpMethod, body (JSON с полями name, phone, email, message)
          context - объект с атрибутами request_id, function_name
    Returns: HTTP-ответ со статусом 200 при успехе или 400/500 при ошибке
    '''
    method = event.get('httpMethod', 'GET')

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }

    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Invalid JSON'})
        }

    name = (body.get('name') or '').strip()
    phone = (body.get('phone') or '').strip()
    email = (body.get('email') or '').strip()
    message = (body.get('message') or '').strip()

    if not name or len(name) > 255:
        return {
            'statusCode': 400,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Укажите имя'})
        }

    if not phone or len(phone) > 50:
        return {
            'statusCode': 400,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Укажите телефон'})
        }

    if not email or not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email) or len(email) > 255:
        return {
            'statusCode': 400,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Укажите корректный email'})
        }

    if not message:
        return {
            'statusCode': 400,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Напишите сообщение'})
        }

    name_esc = name.replace("'", "''")
    phone_esc = phone.replace("'", "''")
    email_esc = email.replace("'", "''")
    message_esc = message.replace("'", "''")

    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    try:
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO contact_requests (name, phone, email, message) "
            f"VALUES ('{name_esc}', '{phone_esc}', '{email_esc}', '{message_esc}') "
            f"RETURNING id"
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
    finally:
        conn.close()

    return {
        'statusCode': 200,
        'headers': {**cors_headers, 'Content-Type': 'application/json'},
        'body': json.dumps({'success': True, 'id': new_id})
    }
