import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Course, Lesson, getLevelColor, getLevelText } from './types';

interface LessonsAndOtherTabsProps {
  selectedCourse: number | null;
  selectedLesson: number | null;
  setSelectedLesson: (id: number | null) => void;
  courses: Course[];
  lessons: Lesson[];
  markLessonComplete: (lessonId: number) => void;
  userName: string;
  userInterests: string[];
  totalProgress: number;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  chatMessage: string;
  setChatMessage: (message: string) => void;
}

export const LessonsAndOtherTabs = ({
  selectedCourse,
  selectedLesson,
  setSelectedLesson,
  courses,
  lessons,
  markLessonComplete,
  userName,
  userInterests,
  totalProgress,
  chatOpen,
  setChatOpen,
  chatMessage,
  setChatMessage,
}: LessonsAndOtherTabsProps) => {
  const currentCourse = courses.find(c => c.id === selectedCourse);
  const currentLessons = lessons.filter(l => l.courseId === selectedCourse);
  const currentLesson = lessons.find(l => l.id === selectedLesson);

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {!selectedCourse ? (
          <Card className="border-2 border-dashed">
            <CardHeader className="text-center py-12">
              <Icon name="BookOpen" size={48} className="mx-auto text-gray-400 mb-4" />
              <CardTitle>Выберите курс</CardTitle>
              <CardDescription>
                Перейдите на вкладку "Курсы" и выберите интересующий курс
              </CardDescription>
            </CardHeader>
          </Card>
        ) : selectedLesson ? (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setSelectedLesson(null)} className="gap-2">
              <Icon name="ArrowLeft" size={16} />
              Назад к урокам
            </Button>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">{currentLesson?.title}</CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={16} />
                        {currentLesson?.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="BookOpen" size={16} />
                        {currentCourse?.title}
                      </span>
                    </CardDescription>
                  </div>
                  {currentLesson?.completed && (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <Icon name="Check" size={14} className="mr-1" />
                      Пройдено
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <Icon name="Play" size={64} className="mx-auto mb-4 opacity-80" />
                    <p className="text-lg">Видео урок</p>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">О чём этот урок</h3>
                  <p className="text-gray-700 leading-relaxed">
                    В этом уроке мы подробно разберём ключевые концепции и научимся применять их на
                    практике. Вы получите пошаговые инструкции и примеры кода, которые помогут
                    закрепить материал.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Что вы узнаете:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <Icon name="CheckCircle2" size={20} className="text-purple-500 mt-0.5" />
                      <span>Основные понятия и терминологию</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="CheckCircle2" size={20} className="text-purple-500 mt-0.5" />
                      <span>Практические примеры использования</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="CheckCircle2" size={20} className="text-purple-500 mt-0.5" />
                      <span>Типичные ошибки и как их избежать</span>
                    </li>
                  </ul>
                </div>

                {!currentLesson?.completed && (
                  <Button
                    size="lg"
                    className="w-full gap-2"
                    onClick={() => markLessonComplete(currentLesson!.id)}
                  >
                    <Icon name="CheckCircle2" size={20} />
                    Отметить как пройденный
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">{currentCourse?.title}</CardTitle>
                    <CardDescription className="mt-2">{currentCourse?.description}</CardDescription>
                  </div>
                  <Badge className={getLevelColor(currentCourse?.level || '')} variant="outline">
                    {getLevelText(currentCourse?.level || '')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {currentCourse?.completedLessons} из {currentCourse?.lessons} уроков
                    </span>
                    <span className="font-semibold text-purple-600">{currentCourse?.progress}%</span>
                  </div>
                  <Progress value={currentCourse?.progress} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Список уроков</h3>
              <div className="space-y-3">
                {currentLessons.map(lesson => (
                  <Card
                    key={lesson.id}
                    className={`border-2 transition-all cursor-pointer hover:shadow-lg ${
                      lesson.completed ? 'border-green-200 bg-green-50/30' : 'hover:border-purple-300'
                    }`}
                    onClick={() => setSelectedLesson(lesson.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              lesson.completed ? 'bg-green-500' : 'bg-purple-100'
                            }`}
                          >
                            <Icon
                              name={lesson.completed ? 'Check' : 'Play'}
                              size={20}
                              className={lesson.completed ? 'text-white' : 'text-purple-600'}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <Icon name="Clock" size={14} />
                              {lesson.duration}
                            </p>
                          </div>
                        </div>
                        {lesson.completed && (
                          <Badge className="bg-green-500 hover:bg-green-600">Пройдено</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {chatOpen && (
        <Card className="fixed bottom-4 right-4 w-96 shadow-2xl border-2 border-purple-200 animate-slide-in-right z-50">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Bot" size={24} />
                <CardTitle>Помощник</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setChatOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <ScrollArea className="h-64 mb-4">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                    <Icon name="Bot" size={16} className="text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 flex-1">
                    <p className="text-sm">
                      Привет! Я твой персональный помощник. Могу подсказать по урокам,
                      порекомендовать курсы или ответить на вопросы. Чем помочь?
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Напиши сообщение..."
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button size="icon" className="flex-shrink-0">
                <Icon name="Send" size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export const TestsTab = ({ courses }: { courses: Course[] }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Тесты и проверка знаний</h2>
        <p className="text-gray-600">Проверьте свои знания по пройденным курсам</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {courses.map(course => (
          <Card key={course.id} className="border-2 hover:border-purple-300 transition-all">
            <CardHeader>
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <CardDescription>Итоговый тест по курсу</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Вопросов:</span>
                <span className="font-semibold">10</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Время:</span>
                <span className="font-semibold">15 минут</span>
              </div>
              <Button className="w-full gap-2" disabled={course.progress < 100}>
                <Icon name="ClipboardCheck" size={16} />
                {course.progress < 100 ? 'Завершите курс' : 'Начать тест'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const ProfileTab = ({
  userName,
  userInterests,
  courses,
  lessons,
  totalProgress,
}: {
  userName: string;
  userInterests: string[];
  courses: Course[];
  lessons: Lesson[];
  totalProgress: number;
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Мой профиль</h2>
        <p className="text-gray-600">Управляйте своими данными и предпочтениями</p>
      </div>

      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-purple-500 text-white text-2xl font-bold">
                {userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{userName}</CardTitle>
              <CardDescription>Студент платформы Learn Your Way</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Мои интересы</h3>
            <div className="flex gap-2 flex-wrap">
              {userInterests.map(interest => (
                <Badge key={interest} variant="secondary" className="px-3 py-1.5">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Статистика</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {courses.filter(c => c.progress === 100).length}
                </div>
                <p className="text-sm text-gray-600 mt-1">Завершено курсов</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {lessons.filter(l => l.completed).length}
                </div>
                <p className="text-sm text-gray-600 mt-1">Пройдено уроков</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{totalProgress}%</div>
                <p className="text-sm text-gray-600 mt-1">Общий прогресс</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Уровень знаний</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Программирование</span>
                  <span className="font-semibold">Средний</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Дизайн</span>
                  <span className="font-semibold">Продвинутый</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Data Science</span>
                  <span className="font-semibold">Начальный</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
