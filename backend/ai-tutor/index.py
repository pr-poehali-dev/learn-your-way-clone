import json
import os
from openai import OpenAI

def handler(event: dict, context) -> dict:
    '''ИИ-репетитор: объясняет темы, генерирует задания, проверяет работы через увлечения ученика'''
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        if not action:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Action is required'})
            }
        
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'OpenAI API key not configured'})
            }
        
        base_url = os.environ.get('OPENAI_BASE_URL', 'https://api.openai.com/v1')
        
        import httpx
        proxy_url = os.environ.get('PROXY_URL')
        proxy_user = os.environ.get('PROXY_USER')
        
        if proxy_url and proxy_user:
            proxy_full = f'http://{proxy_user}@{proxy_url}'
            print(f'Using proxy: {proxy_url} (user configured)')
            http_client = httpx.Client(
                proxy=proxy_full,
                timeout=60.0
            )
            client = OpenAI(api_key=api_key, base_url=base_url, http_client=http_client)
        else:
            print('No proxy configured, using direct connection')
            client = OpenAI(api_key=api_key, base_url=base_url)
        
        if action == 'chat':
            return handle_chat(client, body)
        elif action == 'explain':
            return handle_explain(client, body)
        elif action == 'generate_task':
            return handle_generate_task(client, body)
        elif action == 'check_homework':
            return handle_check_homework(client, body)
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': f'Unknown action: {action}'})
            }
    
    except Exception as e:
        import traceback
        error_details = {
            'error': str(e),
            'type': type(e).__name__,
            'traceback': traceback.format_exc()
        }
        print(f'ERROR: {error_details}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e), 'details': error_details})
        }


def handle_chat(client: OpenAI, body: dict) -> dict:
    '''Обработка чата с ИИ-репетитором'''
    message = body.get('message', '')
    history = body.get('history', [])
    student_info = body.get('student_info', {})
    
    system_prompt = build_system_prompt(student_info)
    
    messages = [{'role': 'system', 'content': system_prompt}]
    messages.extend(history)
    messages.append({'role': 'user', 'content': message})
    
    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=messages,
        temperature=0.7,
        max_tokens=1000
    )
    
    reply = response.choices[0].message.content
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'reply': reply,
            'usage': {
                'prompt_tokens': response.usage.prompt_tokens,
                'completion_tokens': response.usage.completion_tokens,
                'total_tokens': response.usage.total_tokens
            }
        })
    }


def handle_explain(client: OpenAI, body: dict) -> dict:
    '''Объяснение темы через увлечения ученика'''
    subject = body.get('subject', '')
    topic = body.get('topic', '')
    student_info = body.get('student_info', {})
    
    interests = student_info.get('interests', [])
    interests_text = ', '.join(interests) if interests else 'общие примеры'
    
    prompt = f'''Объясни тему "{topic}" по предмету "{subject}" простым языком для ученика {student_info.get('grade', '5-7')} класса.

Используй примеры из: {interests_text}

Требования:
- Объяснение должно быть понятным и интересным
- Используй эмодзи для наглядности
- Приводи примеры из увлечений ученика
- Длина: 300-500 слов
- Структура: введение, основная часть, заключение с кратким выводом'''

    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=[
            {'role': 'system', 'content': 'Ты опытный репетитор, который объясняет сложные темы через увлечения учеников'},
            {'role': 'user', 'content': prompt}
        ],
        temperature=0.7,
        max_tokens=1500
    )
    
    explanation = response.choices[0].message.content
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'explanation': explanation})
    }


def handle_generate_task(client: OpenAI, body: dict) -> dict:
    '''Генерация персонализированного задания'''
    subject = body.get('subject', '')
    topic = body.get('topic', '')
    difficulty = body.get('difficulty', 'medium')
    student_info = body.get('student_info', {})
    
    interests = student_info.get('interests', [])
    interests_text = ', '.join(interests) if interests else 'общие примеры'
    
    difficulty_map = {
        'easy': 'лёгкий уровень',
        'medium': 'средний уровень',
        'hard': 'сложный уровень'
    }
    
    prompt = f'''Создай задание по теме "{topic}" ({subject}) для ученика {student_info.get('grade', '5-7')} класса.

Уровень сложности: {difficulty_map.get(difficulty, 'средний')}
Интересы ученика: {interests_text}

Требования:
- Задание должно быть связано с увлечениями
- Включи 3-5 вопросов/задач
- Добавь краткую инструкцию
- Используй эмодзи
- Формат: JSON с полями: title, instruction, tasks (массив объектов с type, question, options/answer)'''

    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=[
            {'role': 'system', 'content': 'Ты создаёшь интересные задания, связанные с увлечениями учеников. Отвечай только в формате JSON.'},
            {'role': 'user', 'content': prompt}
        ],
        temperature=0.8,
        max_tokens=2000,
        response_format={'type': 'json_object'}
    )
    
    task_data = json.loads(response.choices[0].message.content)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'task': task_data})
    }


def handle_check_homework(client: OpenAI, body: dict) -> dict:
    '''Проверка домашней работы с обратной связью'''
    task = body.get('task', {})
    answers = body.get('answers', [])
    student_info = body.get('student_info', {})
    
    prompt = f'''Проверь домашнюю работу ученика {student_info.get('grade', '5-7')} класса.

Задание: {json.dumps(task, ensure_ascii=False)}
Ответы ученика: {json.dumps(answers, ensure_ascii=False)}

Требования к проверке:
- Оцени каждый ответ (правильно/неправильно/частично)
- Дай конструктивную обратную связь
- Похвали за правильные ответы
- Для ошибок объясни, что не так и как исправить
- Поставь общий балл из 100
- Используй эмодзи и дружелюбный тон
- Формат: JSON с полями: results (массив), score, feedback, recommendations'''

    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=[
            {'role': 'system', 'content': 'Ты проверяешь домашние работы учеников и даёшь полезную обратную связь. Отвечай в формате JSON.'},
            {'role': 'user', 'content': prompt}
        ],
        temperature=0.6,
        max_tokens=2000,
        response_format={'type': 'json_object'}
    )
    
    check_result = json.loads(response.choices[0].message.content)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'result': check_result})
    }


def build_system_prompt(student_info: dict) -> str:
    '''Создание системного промпта для ИИ-репетитора'''
    grade = student_info.get('grade', '5-7')
    age = student_info.get('age', 13)
    name = student_info.get('name', 'друг')
    interests = student_info.get('interests', [])
    interests_text = ', '.join(interests) if interests else 'различные темы'
    
    age_context = ''
    if age <= 9:
        age_context = 'Объясняй простыми словами, используй примеры из повседневной жизни и игр. Будь дружелюбным и весёлым.'
    elif age <= 13:
        age_context = 'Объясняй доступно, но не слишком упрощённо. Используй современные примеры из популярной культуры.'
    else:
        age_context = 'Объясняй подробно, можешь использовать более сложные термины, но всегда приводи понятные примеры.'
    
    return f'''Ты - персональный AI-репетитор для школьника по имени {name} ({age} лет, {grade} класс).
Его интересы: {interests_text}.

Твоя задача - объяснять ТОЛЬКО школьные темы через его интересы и увлечения.

⚠️ КРИТИЧЕСКИ ВАЖНЫЕ ПРАВИЛА БЕЗОПАСНОСТИ:
1. Ты работаешь ТОЛЬКО с темами школьной программы (математика, физика, химия, биология, история, география, литература, русский язык, иностранные языки)
2. КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО отвечать на вопросы про:
   - Насилие, оружие, взрывчатые вещества, наркотики
   - Экстремизм, терроризм, преступления
   - Сексуальный контент, темы 18+
   - Инструкции по причинению вреда себе или другим
   - Обход системы безопасности, взлом, мошенничество
3. Если вопрос НЕ относится к школьной программе или нарушает правила безопасности:
   - Вежливо откажись отвечать
   - Объясни, что ты школьный репетитор и работаешь только с учебными темами
   - Предложи задать вопрос по школьной программе

Правила объяснения школьных тем:
1. {age_context}
2. ВСЕГДА связывай объяснение с интересами ученика: {interests_text}
3. Используй яркие примеры, метафоры и аналогии из его увлечений
4. Структурируй ответ: короткое определение → объяснение через интересы → пример из жизни
5. Добавляй 1-2 эмодзи для наглядности
6. Пиши короткими абзацами (2-3 предложения максимум)
7. В конце можешь задать вопрос для проверки понимания
8. Всегда оставайся позитивным, дружелюбным и мотивирующим'''