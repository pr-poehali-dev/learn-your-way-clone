import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useCourse } from '@/hooks/useCourses';

interface CourseDetailTabProps {
  courseId: number;
  studentId: number | null;
  onBack: () => void;
  onLessonSelect: (lessonId: number) => void;
}

export const CourseDetailTab = ({ courseId, studentId, onBack, onLessonSelect }: CourseDetailTabProps) => {
  const { course, loading, error } = useCourse(courseId, studentId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Загружаем курс...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="space-y-4">
        <Button onClick={onBack} variant="outline" className="gap-2">
          <Icon name="ArrowLeft" size={18} />
          Назад к курсам
        </Button>
        <Card className="border-4 border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center">
            <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-700 mb-2">Ошибка загрузки</h3>
            <p className="text-red-600">{error || 'Курс не найден'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status?: string) => {
    if (!status || status === 'not_started') return 'Circle';
    if (status === 'in_progress') return 'PlayCircle';
    if (status === 'completed') return 'CheckCircle2';
    return 'Circle';
  };

  const getStatusColor = (status?: string) => {
    if (!status || status === 'not_started') return 'text-gray-400';
    if (status === 'in_progress') return 'text-blue-500';
    if (status === 'completed') return 'text-green-500';
    return 'text-gray-400';
  };

  const getStatusText = (status?: string) => {
    if (!status || status === 'not_started') return 'Не начат';
    if (status === 'in_progress') return 'В процессе';
    if (status === 'completed') return 'Завершён';
    return 'Не начат';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="outline" className="gap-2">
          <Icon name="ArrowLeft" size={18} />
          Назад
        </Button>
      </div>

      <Card className="border-4 border-orange-200 bg-gradient-to-br from-orange-50 to-pink-50 shadow-xl">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div
              className={`w-24 h-24 rounded-3xl ${course.color} flex items-center justify-center shadow-lg flex-shrink-0`}
            >
              <Icon name={course.icon as any} size={48} className="text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-4xl mb-3">{course.name}</CardTitle>
              <CardDescription className="text-lg mb-4">{course.description}</CardDescription>
              <div className="flex gap-3 flex-wrap">
                <Badge className="bg-blue-500 text-white text-sm px-3 py-1">
                  <Icon name="BookOpen" size={14} className="mr-1" />
                  {course.total_lessons} уроков
                </Badge>
                {course.completed_lessons !== undefined && (
                  <Badge className="bg-green-500 text-white text-sm px-3 py-1">
                    <Icon name="CheckCircle2" size={14} className="mr-1" />
                    {course.completed_lessons} пройдено
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        {course.progress !== undefined && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700">Общий прогресс курса</span>
                <span className="text-2xl font-bold text-orange-600">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-4" />
            </div>
          </CardContent>
        )}
      </Card>

      {course.topics && course.topics.length > 0 ? (
        <div className="space-y-6">
          {course.topics.map((topic) => (
            <Card key={topic.id} className="border-4 border-purple-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
                    <Icon name="FolderOpen" size={24} className="text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{topic.name}</CardTitle>
                    <CardDescription className="text-base">{topic.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topic.lessons && topic.lessons.length > 0 ? (
                    topic.lessons.map((lesson) => (
                      <Card
                        key={lesson.id}
                        className="border-2 border-gray-200 hover:border-orange-300 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => onLessonSelect(lesson.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Icon
                              name={getStatusIcon(lesson.status) as any}
                              size={32}
                              className={getStatusColor(lesson.status)}
                            />
                            <div className="flex-1">
                              <h4 className="font-bold text-lg text-gray-900 mb-1">{lesson.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Icon name="Clock" size={14} />
                                  {lesson.duration_minutes} мин
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {getStatusText(lesson.status)}
                                </Badge>
                                {lesson.progress_percent !== undefined && lesson.progress_percent > 0 && (
                                  <span className="font-semibold text-orange-600">
                                    {lesson.progress_percent}% завершено
                                  </span>
                                )}
                              </div>
                            </div>
                            <Icon name="ChevronRight" size={24} className="text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">Уроков пока нет</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-4 border-blue-200 bg-blue-50">
          <CardContent className="pt-6 text-center">
            <Icon name="BookOpen" size={48} className="text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-blue-700 mb-2">Темы скоро появятся!</h3>
            <p className="text-blue-600">Мы готовим для тебя интересные уроки</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
