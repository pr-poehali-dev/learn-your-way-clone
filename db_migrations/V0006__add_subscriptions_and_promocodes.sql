-- Создание таблицы промокодов
CREATE TABLE IF NOT EXISTS t_p93368307_learn_your_way_clone.promocodes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INTEGER DEFAULT 0,
    gives_full_access BOOLEAN DEFAULT FALSE,
    max_uses INTEGER DEFAULT 1,
    current_uses INTEGER DEFAULT 0,
    valid_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы подписок
CREATE TABLE IF NOT EXISTS t_p93368307_learn_your_way_clone.subscriptions (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES t_p93368307_learn_your_way_clone.students(id),
    status VARCHAR(20) DEFAULT 'trial',
    trial_ends_at TIMESTAMP,
    subscription_ends_at TIMESTAMP,
    promocode_used VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы использованных промокодов
CREATE TABLE IF NOT EXISTS t_p93368307_learn_your_way_clone.promocode_usage (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES t_p93368307_learn_your_way_clone.students(id),
    promocode_id INTEGER REFERENCES t_p93368307_learn_your_way_clone.promocodes(id),
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, promocode_id)
);

-- Создание таблицы платежей
CREATE TABLE IF NOT EXISTS t_p93368307_learn_your_way_clone.payments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES t_p93368307_learn_your_way_clone.students(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'RUB',
    status VARCHAR(20) DEFAULT 'pending',
    payment_system VARCHAR(50),
    payment_id VARCHAR(255),
    promocode_used VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP
);

-- Добавляем тестовые промокоды
INSERT INTO t_p93368307_learn_your_way_clone.promocodes (code, discount_percent, gives_full_access, max_uses, valid_until)
VALUES 
    ('WELCOME50', 50, FALSE, 100, '2025-12-31 23:59:59'),
    ('FULLACCESS', 0, TRUE, 50, '2025-12-31 23:59:59'),
    ('STUDENT30', 30, FALSE, 200, '2025-12-31 23:59:59');
