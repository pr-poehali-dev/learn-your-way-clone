-- Расширение тем для 5 класса
INSERT INTO t_p93368307_learn_your_way_clone.course_topics (course_id, name, description, order_index) VALUES
-- Математика 5 класс (добавляем к существующим 4)
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '5 класс: Математика'), 'Уравнения', 'Решение простейших уравнений', 5),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '5 класс: Математика'), 'Проценты', 'Нахождение процентов от числа', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '5 класс: Математика'), 'Площадь и объем', 'Формулы площади и объема', 7),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '5 класс: Математика'), 'Координатная прямая', 'Положительные и отрицательные числа', 8),

-- Русский язык 5 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '5 класс: Русский язык'), 'Главные члены предложения', 'Подлежащее и сказуемое', 5),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '5 класс: Русский язык'), 'Второстепенные члены', 'Дополнение, определение, обстоятельство', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '5 класс: Русский язык'), 'Однородные члены', 'Знаки препинания', 7),

-- Литература 5 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '5 класс: Литература'), 'Сказки Пушкина', 'Анализ произведений', 5),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '5 класс: Литература'), 'Басни Крылова', 'Мораль и образы', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '5 класс: Литература'), 'Приключенческая литература', 'Дефо, Твен, Стивенсон', 7),

-- История 5 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '5 класс: История'), 'Спарта и Афины', 'Сравнение полисов', 5),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '5 класс: История'), 'Александр Македонский', 'Походы и империя', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '5 класс: История'), 'Культура Древней Греции', 'Театр, философия, олимпиады', 7),

-- Английский язык 5 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '5 класс: Английский язык'), 'Present Continuous', 'Настоящее длительное время', 5),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '5 класс: Английский язык'), 'Past Simple', 'Прошедшее простое время', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '5 класс: Английский язык'), 'Модальные глаголы', 'Can, must, should', 7),

-- География 5 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '5 класс: География'), 'Атмосфера', 'Строение и значение', 5),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '5 класс: География'), 'Гидросфера', 'Мировой океан и воды суши', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '5 класс: География'), 'Биосфера', 'Живая оболочка Земли', 7);

-- Расширение тем для 6 класса
INSERT INTO t_p93368307_learn_your_way_clone.course_topics (course_id, name, description, order_index) VALUES
-- Математика 6 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '6 класс: Математика'), 'Координатная плоскость', 'Построение точек', 5),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '6 класс: Математика'), 'Модуль числа', 'Абсолютная величина', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '6 класс: Математика'), 'Подобные слагаемые', 'Приведение подобных', 7),

-- Биология 6 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '6 класс: Биология'), 'Фотосинтез', 'Процесс и значение', 5),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '6 класс: Биология'), 'Размножение растений', 'Половое и вегетативное', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '6 класс: Биология'), 'Систематика растений', 'Классификация', 7),

-- История 6 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '6 класс: История'), 'Феодальная раздробленность', 'Причины и последствия', 5),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '6 класс: История'), 'Монгольское нашествие', 'Батыево нашествие', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '6 класс: История'), 'Александр Невский', 'Невская битва и Ледовое побоище', 7);

-- Расширение тем для 7 класса (Алгебра нуждается больше всего)
INSERT INTO t_p93368307_learn_your_way_clone.course_topics (course_id, name, description, order_index) VALUES
-- Алгебра 7 класс (добавляем к 5 существующим)
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '7 класс: Алгебра'), 'Формулы сокращенного умножения', 'Квадрат суммы и разности', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '7 класс: Алгебра'), 'Разложение на множители', 'Вынесение общего множителя', 7),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '7 класс: Алгебра'), 'Системы линейных уравнений', 'Способы решения', 8),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '7 класс: Алгебра'), 'Статистика', 'Среднее арифметическое, мода, медиана', 9),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '7 класс: Алгебра'), 'Графики функций', 'Чтение и построение графиков', 10),

-- Геометрия 7 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '7 класс: Геометрия'), 'Признаки равенства треугольников', 'Три признака', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '7 класс: Геометрия'), 'Параллельные прямые', 'Свойства и признаки', 7),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '7 класс: Геометрия'), 'Сумма углов треугольника', 'Теорема и следствия', 8),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '7 класс: Геометрия'), 'Прямоугольный треугольник', 'Свойства и признаки', 9),

-- Физика 7 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '7 класс: Физика'), 'Архимедова сила', 'Закон Архимеда и плавание тел', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '7 класс: Физика'), 'Работа и мощность', 'Механическая работа', 7),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '7 класс: Физика'), 'Простые механизмы', 'Рычаг, блок, наклонная плоскость', 8),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '7 класс: Физика'), 'Энергия', 'Кинетическая и потенциальная энергия', 9);

-- Расширение тем для 8 класса
INSERT INTO t_p93368307_learn_your_way_clone.course_topics (course_id, name, description, order_index) VALUES
-- Алгебра 8 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '8 класс: Алгебра'), 'Степень с целым показателем', 'Свойства степеней', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '8 класс: Алгебра'), 'Арифметический квадратный корень', 'Свойства корней', 7),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '8 класс: Алгебра'), 'Квадратные уравнения', 'Формулы корней, дискриминант', 8),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '8 класс: Алгебра'), 'Теорема Виета', 'Применение теоремы', 9),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '8 класс: Алгебра'), 'Неравенства', 'Числовые неравенства и их свойства', 10),

-- Геометрия 8 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '8 класс: Геометрия'), 'Теорема Пифагора', 'Применение теоремы', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '8 класс: Геометрия'), 'Подобные треугольники', 'Признаки подобия', 7),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '8 класс: Геометрия'), 'Окружность', 'Касательная, хорда, дуга', 8),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '8 класс: Геометрия'), 'Площади фигур', 'Формулы площадей', 9),

-- Физика 8 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '8 класс: Физика'), 'Электрическое сопротивление', 'Закон Ома', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '8 класс: Физика'), 'Последовательное и параллельное соединение', 'Расчет цепей', 7),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '8 класс: Физика'), 'Работа электрического тока', 'Мощность, закон Джоуля-Ленца', 8),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '8 класс: Физика'), 'Магнитное поле', 'Магниты, электромагниты', 9),

-- Химия 8 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '8 класс: Химия'), 'Химические реакции', 'Типы реакций', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '8 класс: Химия'), 'Кислоты', 'Свойства и классификация', 7),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '8 класс: Химия'), 'Основания', 'Щелочи и их свойства', 8),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '8 класс: Химия'), 'Соли', 'Получение и свойства', 9);

-- Расширение тем для 9 класса
INSERT INTO t_p93368307_learn_your_way_clone.course_topics (course_id, name, description, order_index) VALUES
-- Алгебра 9 класс (подготовка к ОГЭ)
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '9 класс: Алгебра'), 'Системы уравнений второй степени', 'Способы решения', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '9 класс: Алгебра'), 'Арифметическая прогрессия', 'Формулы n-го члена и суммы', 7),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '9 класс: Алгебра'), 'Геометрическая прогрессия', 'Формулы и свойства', 8),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '9 класс: Алгебра'), 'Степенная функция', 'Графики и свойства', 9),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '9 класс: Алгебра'), 'Уравнения высших степеней', 'Методы решения', 10),

-- Геометрия 9 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '9 класс: Геометрия'), 'Скалярное произведение векторов', 'Применение', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '9 класс: Геометрия'), 'Правильные многоугольники', 'Свойства', 7),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '9 класс: Геометрия'), 'Длина окружности и площадь круга', 'Формулы', 8),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '9 класс: Геометрия'), 'Движения', 'Параллельный перенос, поворот', 9),

-- Физика 9 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '9 класс: Физика'), 'Законы Ньютона', 'Три закона динамики', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '9 класс: Физика'), 'Импульс', 'Закон сохранения импульса', 7),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '9 класс: Физика'), 'Механическая энергия', 'Закон сохранения энергии', 8),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '9 класс: Физика'), 'Колебания и волны', 'Механические колебания', 9),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '9 класс: Физика'), 'Звук', 'Характеристики звука', 10),

-- Химия 9 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '9 класс: Химия'), 'Электролитическая диссоциация', 'Ионные уравнения', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '9 класс: Химия'), 'Окислительно-восстановительные реакции', 'Метод электронного баланса', 7),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '9 класс: Химия'), 'Металлы', 'Свойства и получение', 8),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '9 класс: Химия'), 'Неметаллы', 'Галогены, сера, азот', 9),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '9 класс: Химия'), 'Органическая химия', 'Углеводороды, спирты', 10);

-- Расширение тем для 10 класса
INSERT INTO t_p93368307_learn_your_way_clone.course_topics (course_id, name, description, order_index) VALUES
-- Алгебра 10 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '10 класс: Алгебра'), 'Показательная функция', 'Графики и свойства', 7),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '10 класс: Алгебра'), 'Логарифмическая функция', 'Свойства логарифмов', 8),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '10 класс: Алгебра'), 'Показательные уравнения', 'Методы решения', 9),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '10 класс: Алгебра'), 'Логарифмические уравнения', 'Методы решения', 10),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '10 класс: Алгебра'), 'Иррациональные уравнения', 'ОДЗ и методы решения', 11),

-- Геометрия 10 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '10 класс: Геометрия'), 'Параллельность прямых в пространстве', 'Признаки и свойства', 7),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '10 класс: Геометрия'), 'Перпендикулярность прямых и плоскостей', 'Теоремы', 8),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '10 класс: Геометрия'), 'Многогранники', 'Призма, пирамида', 9),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '10 класс: Геометрия'), 'Векторы в пространстве', 'Операции с векторами', 10),

-- Физика 10 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '10 класс: Физика'), 'Молекулярно-кинетическая теория', 'Основные положения', 5),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '10 класс: Физика'), 'Термодинамика', 'Первый закон термодинамики', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '10 класс: Физика'), 'Электростатика', 'Закон Кулона, напряженность поля', 7),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '10 класс: Физика'), 'Законы постоянного тока', 'Закон Ома для полной цепи', 8),

-- Химия 10 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '10 класс: Химия'), 'Углеводороды', 'Алканы, алкены, алкины, арены', 5),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '10 класс: Химия'), 'Спирты и фенолы', 'Свойства и применение', 6),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '10 класс: Химия'), 'Альдегиды и кетоны', 'Номенклатура и свойства', 7),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '10 класс: Химия'), 'Карбоновые кислоты', 'Жиры, мыла', 8);

-- Расширение тем для 11 класса (подготовка к ЕГЭ)
INSERT INTO t_p93368307_learn_your_way_clone.course_topics (course_id, name, description, order_index) VALUES
-- Алгебра 11 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '11 класс: Алгебра'), 'Производная функции', 'Геометрический и физический смысл', 7),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '11 класс: Алгебра'), 'Применение производной', 'Исследование функций', 8),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '11 класс: Алгебра'), 'Первообразная и интеграл', 'Площадь криволинейной трапеции', 9),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '11 класс: Алгебра'), 'Комбинаторика', 'Перестановки, размещения, сочетания', 10),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '11 класс: Алгебра'), 'Теория вероятностей', 'События, вероятность', 11),

-- Физика 11 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '11 класс: Физика'), 'Магнитное поле', 'Сила Ампера, сила Лоренца', 7),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '11 класс: Физика'), 'Электромагнитная индукция', 'Закон Фарадея', 8),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '11 класс: Физика'), 'Колебания и волны', 'Переменный ток', 9),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '11 класс: Физика'), 'Оптика', 'Законы отражения и преломления', 10),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '11 класс: Физика'), 'Квантовая физика', 'Фотоэффект, атом', 11),

-- Химия 11 класс
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '11 класс: Химия'), 'Химическое равновесие', 'Принцип Ле Шателье', 7),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '11 класс: Химия'), 'Электролиз', 'Процессы на электродах', 8),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '11 класс: Химия'), 'Металлы', 'Коррозия и защита', 9),
((SELECT id FROM t_p93368307_learn_your_way_clone.courses WHERE name = '11 класс: Химия'), 'Полимеры', 'Синтетические материалы', 10);
