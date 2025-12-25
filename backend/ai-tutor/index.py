import json
import os
from openai import OpenAI

def handler(event: dict, context) -> dict:
    '''ИИ-репетитор для персонализированных объяснений через интересы школьника'''
    
    method = event.get('httpMethod', 'GET')
    
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
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        question = body.get('question', '').strip()
        interests = body.get('interests', [])
        age = body.get('age', 13)
        name = body.get('name', 'друг')
        
        if not question:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Question is required'})
            }
        
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'OpenAI API key not configured'})
            }
        
        client = OpenAI(api_key=api_key)
        
        interests_text = ', '.join(interests) if interests else 'общие темы'
        
        age_context = ''
        if age <= 9:
            age_context = 'Объясняй простыми словами, используй примеры из повседневной жизни и игр. Будь дружелюбным и весёлым.'
        elif age <= 13:
            age_context = 'Объясняй доступно, но не слишком упрощённо. Используй современные примеры из популярной культуры.'
        else:
            age_context = 'Объясняй подробно, можешь использовать более сложные термины, но всегда приводи понятные примеры.'
        
        system_prompt = f'''Ты - персональный AI-репетитор для школьника по имени {name} ({age} лет).
Его интересы: {interests_text}.

Твоя задача - объяснять школьные темы ЧЕРЕЗ его интересы и увлечения.

Правила:
1. {age_context}
2. ВСЕГДА связывай объяснение с интересами ученика из списка: {interests_text}
3. Используй яркие примеры, метафоры и аналогии из его увлечений
4. Структурируй ответ: короткое определение → объяснение через интересы → пример из жизни
5. Добавляй 1-2 эмодзи для наглядности, но не переборщи
6. Пиши короткими абзацами (2-3 предложения максимум)
7. В конце задай вопрос для проверки понимания

Пример запроса: "Объясни, что такое скорость"
Пример ответа (если интерес - футбол):
"⚽ Скорость - это насколько быстро что-то движется.

Представь, что Месси бежит с мячом. Если он пробегает 10 метров за 1 секунду - это его скорость! Чем больше метров за секунду, тем быстрее игрок.

В физике скорость = расстояние ÷ время. Если Месси пробежал 100 метров за 10 секунд, его скорость = 100м ÷ 10с = 10 м/с.

Понял? Попробуй сам: если игрок пробежал 50 метров за 5 секунд, какая у него скорость?"'''
        
        response = client.chat.completions.create(
            model='gpt-4o-mini',
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': question}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        answer = response.choices[0].message.content.strip()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'question': question,
                'answer': answer,
                'interests_used': interests
            })
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid JSON in request body'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Internal server error: {str(e)}'})
        }
