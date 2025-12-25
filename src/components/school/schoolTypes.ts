export interface Subject {
  id: number;
  name: string;
  description: string;
  icon: string;
  progress: number;
  lessons: number;
  completedLessons: number;
  interest: string;
  color: string;
}

export interface Achievement {
  id: number;
  name: string;
  icon: string;
  earned: boolean;
}

export const availableInterests = [
  'Футбол',
  'Видеоигры',
  'Космос',
  'Музыка',
  'Искусство',
  'Спорт',
  'Кино',
  'Чтение',
  'Танцы',
  'Программирование',
  'Наука',
  'Путешествия',
];
