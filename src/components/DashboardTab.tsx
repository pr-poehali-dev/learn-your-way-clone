import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Course, Lesson, getLevelColor, getLevelText } from './types';

interface DashboardTabProps {
  userName: string;
  courses: Course[];
  lessons: Lesson[];
  totalProgress: number;
  onCourseClick: (courseId: number) => void;
}

export const DashboardTab = ({
  userName,
  courses,
  lessons,
  totalProgress,
  onCourseClick,
}: DashboardTabProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-gray-900">Привет, {userName}! 👋</h2>
        <p className="text-gray-600">Продолжай учиться — ты на верном пути!</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Общий прогресс</CardTitle>
              <Icon name="TrendingUp" size={20} className="text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-600 mb-2">{totalProgress}%</div>
            <Progress value={totalProgress} className="h-3" />
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Активных курсов</CardTitle>
              <Icon name="BookMarked" size={20} className="text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">
              {courses.filter(c => c.progress > 0 && c.progress < 100).length}
            </div>
            <p className="text-sm text-gray-500 mt-2">из {courses.length} доступных</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Пройдено уроков</CardTitle>
              <Icon name="CheckCircle2" size={20} className="text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">
              {lessons.filter(l => l.completed).length}
            </div>
            <p className="text-sm text-gray-500 mt-2">из {lessons.length} уроков</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Продолжить обучение</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {courses
            .filter(c => c.progress > 0 && c.progress < 100)
            .slice(0, 2)
            .map(course => (
              <Card
                key={course.id}
                className="border-2 hover:border-purple-300 transition-all cursor-pointer hover:shadow-lg"
                onClick={() => onCourseClick(course.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription className="mt-1">{course.description}</CardDescription>
                    </div>
                    <Badge className={getLevelColor(course.level)} variant="outline">
                      {getLevelText(course.level)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {course.completedLessons} из {course.lessons} уроков
                      </span>
                      <span className="font-semibold text-purple-600">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
              <Icon name="Trophy" size={24} className="text-white" />
            </div>
            <div>
              <CardTitle>Ты молодец!</CardTitle>
              <CardDescription>
                Продолжай в том же духе — каждый урок приближает к цели
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
