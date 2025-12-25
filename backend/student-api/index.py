import json
import os
import psycopg2
from datetime import datetime, timedelta
from psycopg2.extras import RealDictCursor

def handler(event, context):
    '''API для работы с данными учеников: профиль, интересы, прогресс, подписки и промокоды'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        
        path = event.get('path', '')
        
        if '/subscription/' in path:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
        else:
            cursor = conn.cursor()
        
        if method == 'GET':
            student_id = event.get('queryStringParameters', {}).get('student_id')
            
            if not student_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'student_id is required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('''
                SELECT id, name, grade, age, points, streak, created_at, updated_at
                FROM students WHERE id = %s
            ''', (student_id,))
            
            student_row = cursor.fetchone()
            
            if not student_row:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Student not found'}),
                    'isBase64Encoded': False
                }
            
            student = {
                'id': student_row[0],
                'name': student_row[1],
                'grade': student_row[2],
                'age': student_row[3],
                'points': student_row[4],
                'streak': student_row[5],
                'created_at': student_row[6].isoformat() if student_row[6] else None,
                'updated_at': student_row[7].isoformat() if student_row[7] else None
            }
            
            cursor.execute('''
                SELECT interest FROM student_interests WHERE student_id = %s
            ''', (student_id,))
            
            interests = [row[0] for row in cursor.fetchall()]
            student['interests'] = interests
            
            cursor.execute('''
                SELECT subject_name, progress, completed_lessons, total_lessons, last_activity
                FROM student_progress WHERE student_id = %s
            ''', (student_id,))
            
            progress_list = []
            for row in cursor.fetchall():
                progress_list.append({
                    'subject_name': row[0],
                    'progress': row[1],
                    'completed_lessons': row[2],
                    'total_lessons': row[3],
                    'last_activity': row[4].isoformat() if row[4] else None
                })
            
            student['progress'] = progress_list
            
            cursor.execute('''
                SELECT achievement_name, earned, earned_at
                FROM student_achievements WHERE student_id = %s
            ''', (student_id,))
            
            achievements_list = []
            for row in cursor.fetchall():
                achievements_list.append({
                    'achievement_name': row[0],
                    'earned': row[1],
                    'earned_at': row[2].isoformat() if row[2] else None
                })
            
            student['achievements'] = achievements_list
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(student),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            name = body.get('name')
            grade = body.get('grade')
            age = body.get('age', 13)
            interests = body.get('interests', [])
            
            if not name or not grade:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'name and grade are required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('''
                INSERT INTO students (name, grade, age, points, streak)
                VALUES (%s, %s, %s, 0, 0)
                RETURNING id
            ''', (name, grade, age))
            
            student_id = cursor.fetchone()[0]
            
            for interest in interests[:6]:
                cursor.execute('''
                    INSERT INTO student_interests (student_id, interest)
                    VALUES (%s, %s)
                    ON CONFLICT (student_id, interest) DO NOTHING
                ''', (student_id, interest))
            
            subjects = [
                ('Математика', 20),
                ('Физика', 18),
                ('История', 15),
                ('Русский язык', 25)
            ]
            
            for subject_name, total_lessons in subjects:
                cursor.execute('''
                    INSERT INTO student_progress (student_id, subject_name, progress, completed_lessons, total_lessons)
                    VALUES (%s, %s, 0, 0, %s)
                ''', (student_id, subject_name, total_lessons))
            
            achievements = ['Неделя подряд', 'Мастер математики', '100 уроков', 'Отличник']
            
            for achievement_name in achievements:
                cursor.execute('''
                    INSERT INTO student_achievements (student_id, achievement_name, earned)
                    VALUES (%s, %s, FALSE)
                ''', (student_id, achievement_name))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'student_id': student_id, 'message': 'Student created successfully'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            student_id = body.get('student_id')
            
            if not student_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'student_id is required'}),
                    'isBase64Encoded': False
                }
            
            update_fields = []
            update_values = []
            
            if 'name' in body:
                update_fields.append('name = %s')
                update_values.append(body['name'])
            
            if 'grade' in body:
                update_fields.append('grade = %s')
                update_values.append(body['grade'])
            
            if 'age' in body:
                update_fields.append('age = %s')
                update_values.append(body['age'])
            
            if 'points' in body:
                update_fields.append('points = %s')
                update_values.append(body['points'])
            
            if 'streak' in body:
                update_fields.append('streak = %s')
                update_values.append(body['streak'])
            
            if update_fields:
                update_fields.append('updated_at = CURRENT_TIMESTAMP')
                update_values.append(student_id)
                
                cursor.execute(f'''
                    UPDATE students
                    SET {', '.join(update_fields)}
                    WHERE id = %s
                ''', update_values)
            
            if 'interests' in body:
                cursor.execute('DELETE FROM student_interests WHERE student_id = %s', (student_id,))
                
                for interest in body['interests'][:6]:
                    cursor.execute('''
                        INSERT INTO student_interests (student_id, interest)
                        VALUES (%s, %s)
                    ''', (student_id, interest))
            
            if 'progress' in body:
                for progress_item in body['progress']:
                    cursor.execute('''
                        UPDATE student_progress
                        SET progress = %s, completed_lessons = %s, last_activity = CURRENT_TIMESTAMP
                        WHERE student_id = %s AND subject_name = %s
                    ''', (
                        progress_item.get('progress'),
                        progress_item.get('completed_lessons'),
                        student_id,
                        progress_item.get('subject_name')
                    ))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Student updated successfully'}),
                'isBase64Encoded': False
            }
        
        elif method == 'GET' and '/subscription/status' in path:
            student_id = event.get('queryStringParameters', {}).get('student_id')
            cursor.execute('''
                SELECT s.*, 
                       CASE 
                           WHEN s.status = 'trial' AND s.trial_ends_at > NOW() THEN 
                               EXTRACT(DAY FROM (s.trial_ends_at - NOW()))
                           ELSE 0
                       END as trial_days_left
                FROM t_p93368307_learn_your_way_clone.subscriptions s
                WHERE s.student_id = %s
            ''', (student_id,))
            
            subscription = cursor.fetchone()
            
            if not subscription:
                trial_ends = datetime.now() + timedelta(days=3)
                cursor.execute('''
                    INSERT INTO t_p93368307_learn_your_way_clone.subscriptions 
                    (student_id, status, trial_ends_at)
                    VALUES (%s, 'trial', %s)
                    RETURNING *
                ''', (student_id, trial_ends))
                subscription = cursor.fetchone()
                conn.commit()
            
            has_access = False
            if subscription['status'] == 'trial' and subscription['trial_ends_at'] > datetime.now():
                has_access = True
            elif subscription['status'] == 'active' and subscription['subscription_ends_at'] and subscription['subscription_ends_at'] > datetime.now():
                has_access = True
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'subscription': dict(subscription),
                    'has_access': has_access,
                    'trial_days_left': int(subscription['trial_days_left']) if subscription['trial_days_left'] else 0
                }, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST' and '/subscription/validate-promocode' in path:
            body = json.loads(event.get('body', '{}'))
            code = body.get('code', '').strip().upper()
            student_id = body.get('student_id')
            
            if not code or not student_id:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Code and student_id required'}),
                    'isBase64Encoded': False
                }
            cursor.execute('''
                SELECT * FROM t_p93368307_learn_your_way_clone.promocodes
                WHERE UPPER(code) = %s 
                AND (valid_until IS NULL OR valid_until > NOW())
                AND current_uses < max_uses
            ''', (code,))
            
            promocode = cursor.fetchone()
            
            if not promocode:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Промокод не найден или истёк'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('''
                SELECT * FROM t_p93368307_learn_your_way_clone.promocode_usage
                WHERE student_id = %s AND promocode_id = %s
            ''', (student_id, promocode['id']))
            
            if cursor.fetchone():
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Ты уже использовал этот промокод'}),
                    'isBase64Encoded': False
                }
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'valid': True,
                    'discount_percent': promocode['discount_percent'],
                    'gives_full_access': promocode['gives_full_access'],
                    'final_price': 199 * (100 - promocode['discount_percent']) // 100 if not promocode['gives_full_access'] else 0
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'POST' and '/subscription/apply-promocode' in path:
            body = json.loads(event.get('body', '{}'))
            code = body.get('code', '').strip().upper()
            student_id = body.get('student_id')
            
            cursor.execute('''
                SELECT * FROM t_p93368307_learn_your_way_clone.promocodes
                WHERE UPPER(code) = %s
            ''', (code,))
            
            promocode = cursor.fetchone()
            
            if promocode and promocode['gives_full_access']:
                subscription_ends = datetime.now() + timedelta(days=365)
                cursor.execute('''
                    UPDATE t_p93368307_learn_your_way_clone.subscriptions
                    SET status = 'active',
                        subscription_ends_at = %s,
                        promocode_used = %s,
                        updated_at = NOW()
                    WHERE student_id = %s
                ''', (subscription_ends, code, student_id))
                
                cursor.execute('''
                    INSERT INTO t_p93368307_learn_your_way_clone.promocode_usage
                    (student_id, promocode_id)
                    VALUES (%s, %s)
                    ON CONFLICT DO NOTHING
                ''', (student_id, promocode['id']))
                
                cursor.execute('''
                    UPDATE t_p93368307_learn_your_way_clone.promocodes
                    SET current_uses = current_uses + 1
                    WHERE id = %s
                ''', (promocode['id'],))
                
                conn.commit()
                cursor.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'message': 'Промокод активирован! Полный доступ открыт на год!'}),
                    'isBase64Encoded': False
                }
            
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid promocode'}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST' and '/subscription/create-payment' in path:
            body = json.loads(event.get('body', '{}'))
            student_id = body.get('student_id')
            amount = body.get('amount', 199)
            promocode = body.get('promocode', '')
            
            cursor.execute('''
                INSERT INTO t_p93368307_learn_your_way_clone.payments
                (student_id, amount, status, payment_system, promocode_used)
                VALUES (%s, %s, 'pending', 'demo', %s)
                RETURNING id
            ''', (student_id, amount, promocode))
            
            payment_id = cursor.fetchone()[0]
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'payment_id': payment_id,
                    'amount': float(amount),
                    'payment_url': f'https://demo-payment.poehali.dev/{payment_id}'
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'POST' and '/subscription/confirm-payment' in path:
            body = json.loads(event.get('body', '{}'))
            payment_id = body.get('payment_id')
            student_id = body.get('student_id')
            
            cursor.execute('''
                UPDATE t_p93368307_learn_your_way_clone.payments
                SET status = 'paid', paid_at = NOW()
                WHERE id = %s
            ''', (payment_id,))
            
            subscription_ends = datetime.now() + timedelta(days=30)
            cursor.execute('''
                UPDATE t_p93368307_learn_your_way_clone.subscriptions
                SET status = 'active',
                    subscription_ends_at = %s,
                    updated_at = NOW()
                WHERE student_id = %s
            ''', (subscription_ends, student_id))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Подписка активирована на 30 дней!'}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }