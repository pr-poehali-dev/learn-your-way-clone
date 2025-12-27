-- Создание таблицы для конспектов (заметок) учеников
CREATE TABLE t_p93368307_learn_your_way_clone.notes (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    note_type VARCHAR(50) DEFAULT 'explanation',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX idx_notes_student_id ON t_p93368307_learn_your_way_clone.notes(student_id);
CREATE INDEX idx_notes_subject ON t_p93368307_learn_your_way_clone.notes(subject);
CREATE INDEX idx_notes_created_at ON t_p93368307_learn_your_way_clone.notes(created_at DESC);

-- Комментарии
COMMENT ON TABLE t_p93368307_learn_your_way_clone.notes IS 'Конспекты и заметки учеников из ИИ-репетитора';
COMMENT ON COLUMN t_p93368307_learn_your_way_clone.notes.note_type IS 'Тип заметки: explanation, task, homework_check';