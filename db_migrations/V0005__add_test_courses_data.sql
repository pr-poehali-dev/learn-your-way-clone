-- Добавляем тестовые курсы
INSERT INTO courses (name, description, icon, color, difficulty_level, total_lessons) VALUES
('Математика', 'Изучай математику через любимые увлечения', 'Calculator', 'bg-orange-500', 'beginner', 20),
('Физика', 'Открой законы физики в играх и спорте', 'Atom', 'bg-blue-500', 'intermediate', 18),
('История', 'Путешествуй во времени и узнавай историю', 'BookOpen', 'bg-purple-500', 'beginner', 15),
('Русский язык', 'Изучай язык через любимые книги и фильмы', 'BookText', 'bg-green-500', 'beginner', 25);

-- Добавляем темы для Математики
INSERT INTO course_topics (course_id, name, description, order_index) VALUES
(1, 'Геометрия', 'Фигуры, углы и площади', 1),
(1, 'Алгебра', 'Уравнения и функции', 2),
(1, 'Арифметика', 'Числа и операции', 3);

-- Добавляем темы для Физики
INSERT INTO course_topics (course_id, name, description, order_index) VALUES
(2, 'Механика', 'Движение и силы', 1),
(2, 'Электричество', 'Ток и напряжение', 2);

-- Добавляем темы для Истории
INSERT INTO course_topics (course_id, name, description, order_index) VALUES
(3, 'Древний мир', 'От динозавров до римлян', 1),
(3, 'Средневековье', 'Рыцари и замки', 2);

-- Добавляем темы для Русского языка
INSERT INTO course_topics (course_id, name, description, order_index) VALUES
(4, 'Грамматика', 'Правила языка', 1),
(4, 'Орфография', 'Правописание слов', 2);

-- Добавляем связь курсов с интересами
INSERT INTO course_interests (course_id, interest_name, adaptation_description) VALUES
(1, 'Футбол', 'Геометрия футбольного поля, расчёт траекторий мяча'),
(1, 'Видеоигры', 'Математика в игровой механике и координатах'),
(2, 'Видеоигры', 'Физика движения персонажей и объектов'),
(2, 'Спорт', 'Физика в спорте: скорость, сила, энергия'),
(3, 'Космос', 'История освоения космоса и космическая гонка'),
(4, 'Чтение', 'Грамматика через любимые книги');

-- Добавляем уроки по геометрии (математика)
INSERT INTO lessons (topic_id, course_id, title, description, content_type, order_index, duration_minutes, difficulty_level) VALUES
(1, 1, 'Что такое геометрия?', 'Знакомство с геометрическими фигурами', 'video', 1, 15, 'beginner'),
(1, 1, 'Треугольники', 'Виды треугольников и их свойства', 'interactive', 2, 20, 'beginner'),
(1, 1, 'Площади фигур', 'Как считать площадь прямоугольника и квадрата', 'text', 3, 25, 'intermediate');

-- Добавляем уроки по механике (физика)
INSERT INTO lessons (topic_id, course_id, title, description, content_type, order_index, duration_minutes, difficulty_level) VALUES
(4, 2, 'Что такое движение?', 'Основы кинематики простыми словами', 'video', 1, 15, 'beginner'),
(4, 2, 'Скорость и ускорение', 'Как быстро движутся объекты', 'interactive', 2, 20, 'intermediate');

-- Добавляем контент для первого урока геометрии
INSERT INTO lesson_content (lesson_id, content_type, content_data, order_index) VALUES
(1, 'text', 'Геометрия — это раздел математики, который изучает фигуры, их размеры и свойства. Представь футбольное поле: оно имеет форму прямоугольника!', 1),
(1, 'text', 'Основные фигуры: круг, квадрат, треугольник, прямоугольник. Каждая из них особенная!', 2);

-- Добавляем тест для первого урока
INSERT INTO tests (lesson_id, title, description, passing_score, time_limit_minutes) VALUES
(1, 'Проверь себя: Геометрические фигуры', 'Ответь на вопросы о фигурах', 70, 10);

-- Добавляем вопросы в тест
INSERT INTO test_questions (test_id, question_text, question_type, points, order_index, explanation) VALUES
(1, 'Какая фигура имеет 4 равные стороны?', 'single_choice', 1, 1, 'Квадрат имеет 4 равные стороны и 4 прямых угла'),
(1, 'Сколько углов у треугольника?', 'single_choice', 1, 2, 'Треугольник всегда имеет ровно 3 угла');

-- Добавляем варианты ответов
INSERT INTO question_answers (question_id, answer_text, is_correct, order_index) VALUES
(1, 'Квадрат', true, 1),
(1, 'Треугольник', false, 2),
(1, 'Круг', false, 3),
(1, 'Прямоугольник', false, 4);

INSERT INTO question_answers (question_id, answer_text, is_correct, order_index) VALUES
(2, '3 угла', true, 1),
(2, '4 угла', false, 2),
(2, '5 углов', false, 3),
(2, '2 угла', false, 4);
