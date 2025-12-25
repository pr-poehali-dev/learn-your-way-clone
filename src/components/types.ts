export interface Course {
  id: number;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  lessons: number;
  completedLessons: number;
  category: string;
}

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  courseId: number;
}

export const getLevelColor = (level: string) => {
  switch (level) {
    case 'beginner':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'intermediate':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'advanced':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export const getLevelText = (level: string) => {
  switch (level) {
    case 'beginner':
      return 'Начальный';
    case 'intermediate':
      return 'Средний';
    case 'advanced':
      return 'Продвинутый';
    default:
      return level;
  }
};
