CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    grade VARCHAR(20) NOT NULL,
    points INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_interests (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    interest VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, interest)
);

CREATE TABLE IF NOT EXISTS student_progress (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    subject_name VARCHAR(100) NOT NULL,
    progress INTEGER DEFAULT 0,
    completed_lessons INTEGER DEFAULT 0,
    total_lessons INTEGER NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, subject_name)
);

CREATE TABLE IF NOT EXISTS student_achievements (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    achievement_name VARCHAR(100) NOT NULL,
    earned BOOLEAN DEFAULT FALSE,
    earned_at TIMESTAMP,
    UNIQUE(student_id, achievement_name)
);

CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);
CREATE INDEX IF NOT EXISTS idx_student_interests_student_id ON student_interests(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_achievements_student_id ON student_achievements(student_id);