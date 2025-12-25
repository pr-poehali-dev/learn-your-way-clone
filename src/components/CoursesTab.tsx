import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Course, getLevelColor, getLevelText } from './types';

interface CoursesTabProps {
  courses: Course[];
  onCourseClick: (courseId: number) => void;
}

export const CoursesTab = ({ courses, onCourseClick }: CoursesTabProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Все курсы</h2>
        <p className="text-gray-600">Выбери курс и начни обучение</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['Все', 'Программирование', 'Дизайн', 'Data Science'].map(category => (
          <Badge
            key={category}
            variant="outline"
            className="cursor-pointer hover:bg-purple-100 hover:border-purple-300 px-4 py-2"
          >
            {category}
          </Badge>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {courses.map(course => (
          <Card
            key={course.id}
            className="border-2 hover:border-purple-300 transition-all cursor-pointer hover:shadow-lg"
            onClick={() => onCourseClick(course.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {course.category}
                    </Badge>
                    <Badge className={getLevelColor(course.level)} variant="outline">
                      {getLevelText(course.level)}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription className="mt-2">{course.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Icon name="BookOpen" size={16} />
                    <span>{course.lessons} уроков</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Clock" size={16} />
                    <span>{course.lessons * 20} мин</span>
                  </div>
                </div>
                {course.progress > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Прогресс</span>
                      <span className="font-semibold text-purple-600">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
