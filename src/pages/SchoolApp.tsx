import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Subject {
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

const SchoolApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userName] = useState('Миша');
  const [userGrade] = useState('7 класс');
  const [userInterests] = useState(['Футбол', 'Видеоигры', 'Космос']);
  const [points] = useState(1250);
  const [streak] = useState(7);

  const [subjects] = useState<Subject[]>([
    {
      id: 1,
      name: 'Математика',
      description: 'Геометрия через футбольное поле',
      icon: 'Calculator',
      progress: 75,
      lessons: 20,
      completedLessons: 15,
      interest: 'Футбол',
      color: 'bg-orange-500',
    },
    {
      id: 2,
      name: 'Физика',
      description: 'Законы физики в видеоиграх',
      icon: 'Atom',
      progress: 60,
      lessons: 18,
      completedLessons: 11,
      interest: 'Видеоигры',
      color: 'bg-blue-500',
    },
    {
      id: 3,
      name: 'История',
      description: 'Космическая гонка и холодная война',
      icon: 'BookOpen',
      progress: 85,
      lessons: 15,
      completedLessons: 13,
      interest: 'Космос',
      color: 'bg-purple-500',
    },
    {
      id: 4,
      name: 'Русский язык',
      description: 'Грамматика через любимые книги',
      icon: 'BookText',
      progress: 40,
      lessons: 25,
      completedLessons: 10,
      interest: 'Чтение',
      color: 'bg-green-500',
    },
  ]);

  const achievements = [
    { id: 1, name: 'Неделя подряд', icon: '🔥', earned: true },
    { id: 2, name: 'Мастер математики', icon: '🎯', earned: true },
    { id: 3, name: '100 уроков', icon: '⭐', earned: false },
    { id: 4, name: 'Отличник', icon: '🏆', earned: false },
  ];

  const totalProgress = Math.round(
    subjects.reduce((acc, subject) => acc + subject.progress, 0) / subjects.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <nav className="bg-white border-b-4 border-orange-300 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center transform rotate-6 shadow-lg">
                <Icon name="GraduationCap" size={28} className="text-white -rotate-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Learn Fun</h1>
                <p className="text-xs text-gray-600">Учись через увлечения</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
                  <Icon name="Flame" size={20} className="text-orange-500" />
                  <span className="font-bold text-orange-700">{streak} дней</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
                  <Icon name="Star" size={20} className="text-blue-500" />
                  <span className="font-bold text-blue-700">{points}</span>
                </div>
              </div>
              <Avatar className="border-4 border-orange-300">
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-400 text-white font-bold text-lg">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid h-auto p-2 bg-white border-2 border-orange-200">
            <TabsTrigger
              value="dashboard"
              className="gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-xl"
            >
              <Icon name="Home" size={18} />
              <span className="hidden sm:inline">Главная</span>
            </TabsTrigger>
            <TabsTrigger
              value="subjects"
              className="gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl"
            >
              <Icon name="BookOpen" size={18} />
              <span className="hidden sm:inline">Предметы</span>
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-xl"
            >
              <Icon name="Trophy" size={18} />
              <span className="hidden sm:inline">Награды</span>
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-xl"
            >
              <Icon name="User" size={18} />
              <span className="hidden sm:inline">Профиль</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-bold text-gray-900">
                Привет, {userName}! 👋
              </h2>
              <p className="text-lg text-gray-600">
                Ты учишься в <span className="font-bold text-orange-600">{userGrade}</span>. Продолжай
                в том же духе!
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-4 border-orange-200 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-orange-50 to-orange-100">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-orange-700">
                      Твой прогресс
                    </CardTitle>
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                      <Icon name="TrendingUp" size={24} className="text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold text-orange-600 mb-3">
                    {totalProgress}%
                  </div>
                  <Progress value={totalProgress} className="h-4 bg-orange-200" />
                </CardContent>
              </Card>

              <Card className="border-4 border-blue-200 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-blue-700">Серия дней</CardTitle>
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                      <Icon name="Flame" size={24} className="text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold text-blue-600 mb-3">{streak}</div>
                  <p className="text-sm text-blue-600 font-semibold">
                    Продолжай каждый день! 🔥
                  </p>
                </CardContent>
              </Card>

              <Card className="border-4 border-green-200 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-green-700">Баллы</CardTitle>
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                      <Icon name="Star" size={24} className="text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold text-green-600 mb-3">{points}</div>
                  <p className="text-sm text-green-600 font-semibold">Собери 2000! ⭐</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Продолжай учиться 📚</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {subjects.slice(0, 2).map(subject => (
                  <Card
                    key={subject.id}
                    className="border-4 border-gray-200 hover:border-orange-300 transition-all cursor-pointer hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-14 h-14 rounded-2xl ${subject.color} flex items-center justify-center shadow-lg`}>
                              <Icon name={subject.icon as any} size={28} className="text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{subject.name}</CardTitle>
                              <Badge className="mt-1 bg-purple-100 text-purple-700 border-purple-200">
                                {subject.interest}
                              </Badge>
                            </div>
                          </div>
                          <CardDescription className="text-base mt-2">
                            {subject.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm font-semibold">
                          <span className="text-gray-600">
                            {subject.completedLessons} из {subject.lessons} уроков
                          </span>
                          <span className="text-orange-600 text-lg">{subject.progress}%</span>
                        </div>
                        <Progress value={subject.progress} className="h-3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="border-4 border-yellow-200 bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center transform rotate-6 shadow-lg">
                    <Icon name="Sparkles" size={32} className="text-white -rotate-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Ты супер! 🎉</CardTitle>
                    <CardDescription className="text-base mt-1">
                      Продолжай учиться каждый день — скоро получишь новую награду!
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Твои предметы 📖</h2>
              <p className="text-gray-600">Учись через то, что тебе нравится!</p>
            </div>

            <div className="flex gap-2 flex-wrap">
              {userInterests.map(interest => (
                <Badge
                  key={interest}
                  className="px-4 py-2 text-base bg-gradient-to-r from-orange-400 to-pink-400 text-white border-0 shadow-md"
                >
                  {interest}
                </Badge>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {subjects.map(subject => (
                <Card
                  key={subject.id}
                  className="border-4 border-gray-200 hover:border-orange-300 transition-all cursor-pointer hover:shadow-xl transform hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-2xl ${subject.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <Icon name={subject.icon as any} size={32} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{subject.name}</CardTitle>
                        <CardDescription className="text-base">{subject.description}</CardDescription>
                        <Badge className="mt-2 bg-purple-100 text-purple-700 border-purple-200">
                          {subject.interest}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-gray-600 font-semibold">
                        <div className="flex items-center gap-1">
                          <Icon name="BookOpen" size={18} />
                          <span>{subject.lessons} уроков</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="CheckCircle2" size={18} />
                          <span>{subject.completedLessons} пройдено</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm font-semibold">
                          <span className="text-gray-600">Прогресс</span>
                          <span className="text-orange-600 text-lg">{subject.progress}%</span>
                        </div>
                        <Progress value={subject.progress} className="h-3" />
                      </div>
                      <Button className="w-full text-base font-bold shadow-md">
                        Продолжить учиться
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Твои награды 🏆</h2>
              <p className="text-gray-600">Получай награды за успехи в учёбе!</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {achievements.map(achievement => (
                <Card
                  key={achievement.id}
                  className={`border-4 ${
                    achievement.earned
                      ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  } text-center`}
                >
                  <CardContent className="pt-6">
                    <div
                      className={`text-6xl mb-3 ${
                        achievement.earned ? 'animate-scale-in' : 'grayscale'
                      }`}
                    >
                      {achievement.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-1">{achievement.name}</h3>
                    {achievement.earned ? (
                      <Badge className="bg-green-500 text-white">Получено!</Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        Не получено
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-4 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center">
                    <Icon name="Target" size={28} className="text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Следующая награда</CardTitle>
                    <CardDescription className="text-base">
                      Пройди ещё 5 уроков, чтобы получить награду "100 уроков"!
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Мой профиль 👤</h2>
              <p className="text-gray-600">Управляй своими данными</p>
            </div>

            <Card className="border-4 border-orange-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="w-24 h-24 border-4 border-orange-300">
                    <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-400 text-white text-3xl font-bold">
                      {userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-3xl">{userName}</CardTitle>
                    <CardDescription className="text-lg mt-1">
                      Ученик {userGrade}
                    </CardDescription>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-orange-500 text-white text-sm">Активный</Badge>
                      <Badge className="bg-green-500 text-white text-sm">Отличник</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Мои интересы</h3>
                  <div className="flex gap-3 flex-wrap">
                    {userInterests.map(interest => (
                      <Badge
                        key={interest}
                        className="px-4 py-2 text-base bg-gradient-to-r from-purple-400 to-blue-400 text-white border-0"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Статистика</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border-2 border-orange-200">
                      <div className="text-4xl font-bold text-orange-600">{points}</div>
                      <p className="text-sm text-orange-700 mt-1 font-semibold">Баллов</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200">
                      <div className="text-4xl font-bold text-blue-600">{streak}</div>
                      <p className="text-sm text-blue-700 mt-1 font-semibold">Дней подряд</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200">
                      <div className="text-4xl font-bold text-green-600">{totalProgress}%</div>
                      <p className="text-sm text-green-700 mt-1 font-semibold">Прогресс</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Уровень по предметам</h3>
                  <div className="space-y-4">
                    {subjects.map(subject => (
                      <div key={subject.id}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg ${subject.color} flex items-center justify-center`}>
                              <Icon name={subject.icon as any} size={16} className="text-white" />
                            </div>
                            <span className="font-semibold text-gray-700">{subject.name}</span>
                          </div>
                          <span className="font-bold text-orange-600">{subject.progress}%</span>
                        </div>
                        <Progress value={subject.progress} className="h-3" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="w-16 h-16 rounded-full shadow-2xl bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-4 border-white"
        >
          <Icon name="MessageCircle" size={28} />
        </Button>
      </div>
    </div>
  );
};

export default SchoolApp;
