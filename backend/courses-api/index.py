import json
import os
import psycopg2
from datetime import datetime

def handler(event, context):
    '''API для работы с курсами, уроками, темами и тестами образовательной платформы'''
    
    method = event.get('httpMethod', 'GET')
    path = event.get('path', '')
    
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
        cursor = conn.cursor()
        
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            action = params.get('action', 'list_courses')
            
            if action == 'list_courses':
                student_id = params.get('student_id')
                
                cursor.execute('''
                    SELECT id, name, description, icon, color, difficulty_level, 
                           total_lessons, created_at, updated_at
                    FROM courses
                    ORDER BY id
                ''')
                
                courses = []
                for row in cursor.fetchall():
                    course = {
                        'id': row[0],
                        'name': row[1],
                        'description': row[2],
                        'icon': row[3],
                        'color': row[4],
                        'difficulty_level': row[5],
                        'total_lessons': row[6],
                        'created_at': row[7].isoformat() if row[7] else None,
                        'updated_at': row[8].isoformat() if row[8] else None
                    }
                    
                    if student_id:
                        cursor.execute('''
                            SELECT COUNT(*) as completed
                            FROM student_lesson_progress slp
                            JOIN lessons l ON l.id = slp.lesson_id
                            WHERE slp.student_id = %s AND l.course_id = %s AND slp.status = 'completed'
                        ''', (student_id, course['id']))
                        completed = cursor.fetchone()[0]
                        course['completed_lessons'] = completed
                        course['progress'] = round((completed / course['total_lessons'] * 100) if course['total_lessons'] > 0 else 0)
                    
                    courses.append(course)
                
                cursor.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'courses': courses}),
                    'isBase64Encoded': False
                }
            
            elif action == 'get_course':
                course_id = params.get('course_id')
                student_id = params.get('student_id')
                
                if not course_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'course_id is required'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute('''
                    SELECT id, name, description, icon, color, difficulty_level, 
                           total_lessons, created_at, updated_at
                    FROM courses WHERE id = %s
                ''', (course_id,))
                
                course_row = cursor.fetchone()
                
                if not course_row:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Course not found'}),
                        'isBase64Encoded': False
                    }
                
                course = {
                    'id': course_row[0],
                    'name': course_row[1],
                    'description': course_row[2],
                    'icon': course_row[3],
                    'color': course_row[4],
                    'difficulty_level': course_row[5],
                    'total_lessons': course_row[6],
                    'created_at': course_row[7].isoformat() if course_row[7] else None,
                    'updated_at': course_row[8].isoformat() if course_row[8] else None
                }
                
                cursor.execute('''
                    SELECT id, name, description, order_index
                    FROM course_topics
                    WHERE course_id = %s
                    ORDER BY order_index
                ''', (course_id,))
                
                topics = []
                for row in cursor.fetchall():
                    topic = {
                        'id': row[0],
                        'name': row[1],
                        'description': row[2],
                        'order_index': row[3]
                    }
                    
                    cursor.execute('''
                        SELECT id, title, description, content_type, order_index, 
                               duration_minutes, difficulty_level
                        FROM lessons
                        WHERE topic_id = %s
                        ORDER BY order_index
                    ''', (topic['id'],))
                    
                    lessons = []
                    for lesson_row in cursor.fetchall():
                        lesson = {
                            'id': lesson_row[0],
                            'title': lesson_row[1],
                            'description': lesson_row[2],
                            'content_type': lesson_row[3],
                            'order_index': lesson_row[4],
                            'duration_minutes': lesson_row[5],
                            'difficulty_level': lesson_row[6]
                        }
                        
                        if student_id:
                            cursor.execute('''
                                SELECT status, progress_percent, completed_at
                                FROM student_lesson_progress
                                WHERE student_id = %s AND lesson_id = %s
                            ''', (student_id, lesson['id']))
                            progress_row = cursor.fetchone()
                            if progress_row:
                                lesson['status'] = progress_row[0]
                                lesson['progress_percent'] = progress_row[1]
                                lesson['completed_at'] = progress_row[2].isoformat() if progress_row[2] else None
                            else:
                                lesson['status'] = 'not_started'
                                lesson['progress_percent'] = 0
                        
                        lessons.append(lesson)
                    
                    topic['lessons'] = lessons
                    topics.append(topic)
                
                course['topics'] = topics
                
                cursor.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(course),
                    'isBase64Encoded': False
                }
            
            elif action == 'get_lesson':
                lesson_id = params.get('lesson_id')
                student_id = params.get('student_id')
                
                if not lesson_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'lesson_id is required'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute('''
                    SELECT l.id, l.title, l.description, l.content_type, l.duration_minutes,
                           l.difficulty_level, l.order_index, c.name as course_name, ct.name as topic_name
                    FROM lessons l
                    JOIN courses c ON c.id = l.course_id
                    JOIN course_topics ct ON ct.id = l.topic_id
                    WHERE l.id = %s
                ''', (lesson_id,))
                
                lesson_row = cursor.fetchone()
                
                if not lesson_row:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Lesson not found'}),
                        'isBase64Encoded': False
                    }
                
                lesson = {
                    'id': lesson_row[0],
                    'title': lesson_row[1],
                    'description': lesson_row[2],
                    'content_type': lesson_row[3],
                    'duration_minutes': lesson_row[4],
                    'difficulty_level': lesson_row[5],
                    'order_index': lesson_row[6],
                    'course_name': lesson_row[7],
                    'topic_name': lesson_row[8]
                }
                
                cursor.execute('''
                    SELECT content_type, content_data, content_url, order_index
                    FROM lesson_content
                    WHERE lesson_id = %s
                    ORDER BY order_index
                ''', (lesson_id,))
                
                content = []
                for row in cursor.fetchall():
                    content.append({
                        'type': row[0],
                        'data': row[1],
                        'url': row[2],
                        'order_index': row[3]
                    })
                
                lesson['content'] = content
                
                cursor.execute('''
                    SELECT id, title, description, passing_score, time_limit_minutes
                    FROM tests
                    WHERE lesson_id = %s
                ''', (lesson_id,))
                
                test_row = cursor.fetchone()
                if test_row:
                    test = {
                        'id': test_row[0],
                        'title': test_row[1],
                        'description': test_row[2],
                        'passing_score': test_row[3],
                        'time_limit_minutes': test_row[4]
                    }
                    
                    cursor.execute('''
                        SELECT id, question_text, question_type, points, explanation
                        FROM test_questions
                        WHERE test_id = %s
                        ORDER BY order_index
                    ''', (test['id'],))
                    
                    questions = []
                    for q_row in cursor.fetchall():
                        question = {
                            'id': q_row[0],
                            'text': q_row[1],
                            'type': q_row[2],
                            'points': q_row[3],
                            'explanation': q_row[4]
                        }
                        
                        cursor.execute('''
                            SELECT id, answer_text, is_correct
                            FROM question_answers
                            WHERE question_id = %s
                            ORDER BY order_index
                        ''', (question['id'],))
                        
                        answers = []
                        for a_row in cursor.fetchall():
                            answers.append({
                                'id': a_row[0],
                                'text': a_row[1],
                                'is_correct': a_row[2] if student_id else None
                            })
                        
                        question['answers'] = answers
                        questions.append(question)
                    
                    test['questions'] = questions
                    lesson['test'] = test
                
                if student_id:
                    cursor.execute('''
                        SELECT status, progress_percent, time_spent_minutes, 
                               started_at, completed_at, last_activity
                        FROM student_lesson_progress
                        WHERE student_id = %s AND lesson_id = %s
                    ''', (student_id, lesson_id))
                    progress_row = cursor.fetchone()
                    
                    if progress_row:
                        lesson['progress'] = {
                            'status': progress_row[0],
                            'percent': progress_row[1],
                            'time_spent': progress_row[2],
                            'started_at': progress_row[3].isoformat() if progress_row[3] else None,
                            'completed_at': progress_row[4].isoformat() if progress_row[4] else None,
                            'last_activity': progress_row[5].isoformat() if progress_row[5] else None
                        }
                
                cursor.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(lesson),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'update_progress':
                student_id = body.get('student_id')
                lesson_id = body.get('lesson_id')
                status = body.get('status', 'in_progress')
                progress_percent = body.get('progress_percent', 0)
                
                if not student_id or not lesson_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'student_id and lesson_id are required'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute('''
                    INSERT INTO student_lesson_progress 
                    (student_id, lesson_id, status, progress_percent, started_at, last_activity)
                    VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                    ON CONFLICT (student_id, lesson_id) 
                    DO UPDATE SET 
                        status = EXCLUDED.status,
                        progress_percent = EXCLUDED.progress_percent,
                        last_activity = CURRENT_TIMESTAMP,
                        completed_at = CASE WHEN EXCLUDED.status = 'completed' THEN CURRENT_TIMESTAMP ELSE student_lesson_progress.completed_at END
                ''', (student_id, lesson_id, status, progress_percent))
                
                conn.commit()
                cursor.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'message': 'Progress updated successfully'}),
                    'isBase64Encoded': False
                }
            
            elif action == 'submit_test':
                student_id = body.get('student_id')
                test_id = body.get('test_id')
                lesson_id = body.get('lesson_id')
                answers = body.get('answers', [])
                
                if not student_id or not test_id or not lesson_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'student_id, test_id, and lesson_id are required'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute('SELECT passing_score FROM tests WHERE id = %s', (test_id,))
                test_row = cursor.fetchone()
                if not test_row:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Test not found'}),
                        'isBase64Encoded': False
                    }
                
                passing_score = test_row[0]
                total_score = 0
                max_score = 0
                
                for answer in answers:
                    question_id = answer.get('question_id')
                    answer_id = answer.get('answer_id')
                    
                    cursor.execute('SELECT points FROM test_questions WHERE id = %s', (question_id,))
                    points = cursor.fetchone()[0]
                    max_score += points
                    
                    cursor.execute('SELECT is_correct FROM question_answers WHERE id = %s', (answer_id,))
                    is_correct = cursor.fetchone()[0]
                    
                    if is_correct:
                        total_score += points
                
                passed = (total_score / max_score * 100) >= passing_score if max_score > 0 else False
                
                cursor.execute('''
                    SELECT COALESCE(MAX(attempt_number), 0) + 1
                    FROM student_test_results
                    WHERE student_id = %s AND test_id = %s
                ''', (student_id, test_id))
                attempt_number = cursor.fetchone()[0]
                
                cursor.execute('''
                    INSERT INTO student_test_results 
                    (student_id, test_id, lesson_id, score, max_score, passed, attempt_number)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                ''', (student_id, test_id, lesson_id, total_score, max_score, passed, attempt_number))
                
                result_id = cursor.fetchone()[0]
                
                for answer in answers:
                    cursor.execute('''
                        INSERT INTO student_test_answers 
                        (test_result_id, question_id, answer_id, is_correct, points_earned)
                        VALUES (%s, %s, %s, 
                                (SELECT is_correct FROM question_answers WHERE id = %s),
                                CASE WHEN (SELECT is_correct FROM question_answers WHERE id = %s) 
                                THEN (SELECT points FROM test_questions WHERE id = %s) ELSE 0 END)
                    ''', (result_id, answer['question_id'], answer['answer_id'], 
                          answer['answer_id'], answer['answer_id'], answer['question_id']))
                
                if passed:
                    cursor.execute('''
                        UPDATE student_lesson_progress
                        SET status = 'completed', progress_percent = 100, completed_at = CURRENT_TIMESTAMP
                        WHERE student_id = %s AND lesson_id = %s
                    ''', (student_id, lesson_id))
                
                conn.commit()
                cursor.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'result_id': result_id,
                        'score': total_score,
                        'max_score': max_score,
                        'passed': passed,
                        'percentage': round(total_score / max_score * 100) if max_score > 0 else 0
                    }),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid request'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
