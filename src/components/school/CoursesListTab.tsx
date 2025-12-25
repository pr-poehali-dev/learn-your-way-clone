import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useCourses } from '@/hooks/useCourses';

interface CoursesListTabProps {
  studentId: number | null;
  onCourseSelect: (courseId: number) => void;
}

export const CoursesListTab = ({ studentId, onCourseSelect }: CoursesListTabProps) => {
  const { courses, loading, error } = useCourses(studentId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Загружаем курсы...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="border-4 border-red-200 bg-red-50 max-w-md">
          <CardContent className="pt-6 text-center">
            <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-700 mb-2">Ошибка загрузки</h3>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="border-4 border-blue-200 bg-blue-50 max-w-md">
          <CardContent className="pt-6 text-center">
            <Icon name="BookOpen" size={48} className="text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-blue-700 mb-2">Курсы скоро появятся!</h3>
            <p className="text-blue-600">Мы готовим для тебя крутые курсы по твоим интересам</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getDifficultyLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      beginner: 'Для начинающих',
      intermediate: 'Средний уровень',
      advanced: 'Продвинутый'
    };
    return labels[level] || level;
  };

  const getDifficultyColor = (level: string) => {
    const colors: { [key: string]: string } = {
      beginner: 'bg-green-500',
      intermediate: 'bg-yellow-500',
      advanced: 'bg-red-500'
    };
    return colors[level] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Все курсы 📚</h2>
        <p className="text-gray-600">Выбери курс и начни учиться через свои увлечения!</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="border-4 border-gray-200 hover:border-orange-300 transition-all cursor-pointer hover:shadow-xl transform hover:-translate-y-1"
            onClick={() => onCourseSelect(course.id)}
          >
            <CardHeader>
              <div className="flex items-start gap-4">
                <div
                  className={`w-20 h-20 rounded-2xl ${course.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                >
                  <Icon name={course.icon as any} size={40} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-2xl">{course.name}</CardTitle>
                    <Badge className={`${getDifficultyColor(course.difficulty_level)} text-white text-xs`}>
                      {getDifficultyLabel(course.difficulty_level)}
                    </Badge>
                  </div>
                  <CardDescription className="text-base mb-3">
                    {course.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-6 text-sm text-gray-600 font-semibold">
                  <div className="flex items-center gap-2">
                    <Icon name="BookOpen" size={18} className="text-blue-500" />
                    <span>{course.total_lessons} уроков</span>
                  </div>
                  {course.completed_lessons !== undefined && (
                    <div className="flex items-center gap-2">
                      <Icon name="CheckCircle2" size={18} className="text-green-500" />
                      <span>{course.completed_lessons} пройдено</span>
                    </div>
                  )}
                </div>

                {course.progress !== undefined && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="text-gray-600">Твой прогресс</span>
                      <span className="text-orange-600 text-lg">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-3" />
                  </div>
                )}

                <Button 
                  className="w-full text-base font-bold shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCourseSelect(course.id);
                  }}
                >
                  {course.progress && course.progress > 0 ? (
                    <>
                      <Icon name="Play" size={18} className="mr-2" />
                      Продолжить обучение
                    </>
                  ) : (
                    <>
                      <Icon name="Rocket" size={18} className="mr-2" />
                      Начать курс
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-4 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center">
              <Icon name="Sparkles" size={32} className="text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Хочешь больше курсов?</CardTitle>
              <CardDescription className="text-base mt-1">
                Скоро добавим новые курсы по твоим любимым темам! Следи за обновлениями 🎉
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
