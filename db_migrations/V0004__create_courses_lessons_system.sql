-- Курсы (Математика, Физика и т.д.)
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(50),
    difficulty_level VARCHAR(20),
    total_lessons INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Темы внутри курсов (Геометрия, Алгебра и т.д.)
CREATE TABLE IF NOT EXISTS course_topics (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Связь курсов с интересами для персонализации
CREATE TABLE IF NOT EXISTS course_interests (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id),
    interest_name VARCHAR(100) NOT NULL,
    adaptation_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, interest_name)
);

-- Уроки внутри тем
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER REFERENCES course_topics(id),
    course_id INTEGER REFERENCES courses(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content_type VARCHAR(50),
    order_index INTEGER DEFAULT 0,
    duration_minutes INTEGER,
    difficulty_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Контент урока (текст, видео, изображения)
CREATE TABLE IF NOT EXISTS lesson_content (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id),
    content_type VARCHAR(50) NOT NULL,
    content_data TEXT,
    content_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Тесты для уроков
CREATE TABLE IF NOT EXISTS tests (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    passing_score INTEGER DEFAULT 70,
    time_limit_minutes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вопросы в тестах
CREATE TABLE IF NOT EXISTS test_questions (
    id SERIAL PRIMARY KEY,
    test_id INTEGER REFERENCES tests(id),
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    points INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Варианты ответов на вопросы
CREATE TABLE IF NOT EXISTS question_answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES test_questions(id),
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Прогресс ученика по урокам
CREATE TABLE IF NOT EXISTS student_lesson_progress (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    lesson_id INTEGER REFERENCES lessons(id),
    status VARCHAR(50) DEFAULT 'not_started',
    progress_percent INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, lesson_id)
);

-- Результаты тестов ученика
CREATE TABLE IF NOT EXISTS student_test_results (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    test_id INTEGER REFERENCES tests(id),
    lesson_id INTEGER REFERENCES lessons(id),
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    passed BOOLEAN DEFAULT FALSE,
    time_spent_minutes INTEGER,
    attempt_number INTEGER DEFAULT 1,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ответы ученика на вопросы теста
CREATE TABLE IF NOT EXISTS student_test_answers (
    id SERIAL PRIMARY KEY,
    test_result_id INTEGER REFERENCES student_test_results(id),
    question_id INTEGER REFERENCES test_questions(id),
    answer_id INTEGER REFERENCES question_answers(id),
    answer_text TEXT,
    is_correct BOOLEAN,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Рекомендации курсов для учеников на основе интересов
CREATE TABLE IF NOT EXISTS student_course_recommendations (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    course_id INTEGER REFERENCES courses(id),
    interest_name VARCHAR(100),
    relevance_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id)
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_course_topics_course_id ON course_topics(course_id);
CREATE INDEX IF NOT EXISTS idx_course_interests_course_id ON course_interests(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_topic_id ON lessons(topic_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_content_lesson_id ON lesson_content(lesson_id);
CREATE INDEX IF NOT EXISTS idx_tests_lesson_id ON tests(lesson_id);
CREATE INDEX IF NOT EXISTS idx_test_questions_test_id ON test_questions(test_id);
CREATE INDEX IF NOT EXISTS idx_question_answers_question_id ON question_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_student_lesson_progress_student_id ON student_lesson_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_lesson_progress_lesson_id ON student_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_student_test_results_student_id ON student_test_results(student_id);
CREATE INDEX IF NOT EXISTS idx_student_test_results_test_id ON student_test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_student_test_answers_test_result_id ON student_test_answers(test_result_id);
CREATE INDEX IF NOT EXISTS idx_student_course_recommendations_student_id ON student_course_recommendations(student_id);