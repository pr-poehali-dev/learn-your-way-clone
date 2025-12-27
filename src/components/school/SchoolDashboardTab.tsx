import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Subject } from './schoolTypes';

interface SchoolDashboardTabProps {
  userName: string;
  userGrade: string;
  userAge: number;
  totalProgress: number;
  streak: number;
  points: number;
  subjects: Subject[];
  onAiTutorClick: () => void;
}

export const SchoolDashboardTab = ({
  userName,
  userGrade,
  userAge,
  totalProgress,
  streak,
  points,
  subjects,
  onAiTutorClick,
}: SchoolDashboardTabProps) => {
  const getGreetingsByAge = (age: number) => {
    if (age <= 9) {
      return [
        { title: `Привет, ${userName}! 🌈`, subtitle: 'Сегодня нас ждут крутые уроки!' },
        { title: `Здорово, ${userName}! 🌟`, subtitle: 'Давай учиться и играть одновременно!' },
        { title: `Привет-привет, ${userName}! 🎉`, subtitle: 'Ты готов стать супер умным?' },
        { title: `Яуху, ${userName}! 🚀`, subtitle: 'Поехали изучать новое!' },
      ];
    } else if (age <= 13) {
      return [
        { title: `Привет, ${userName}! 🚀`, subtitle: 'Готов к новым урокам по твоим любимым темам?' },
        { title: `Добро пожаловать, ${userName}! 🌟`, subtitle: 'Сегодня узнаем что-то интересное!' },
        { title: `Привет, ${userName}! 🏀`, subtitle: 'Давай прокачаем твои знания!' },
        { title: `С возвращением, ${userName}! 🎮`, subtitle: 'Продолжай прохождение — следующий уровень ждёт!' },
      ];
    } else {
      return [
        { title: `Привет, ${userName}! 💪`, subtitle: 'Готов покорять новые высоты в учёбе?' },
        { title: `Добро пожаловать, ${userName}! 🎯`, subtitle: 'Продолжай развиваться через свои интересы!' },
        { title: `Привет, ${userName}! 🚀`, subtitle: 'Твой путь к успеху продолжается!' },
        { title: `Здравствуй, ${userName}! 🎓`, subtitle: 'Сегодня усиль свои навыки и знания!' },
      ];
    }
  };

  const greetings = getGreetingsByAge(userAge);
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10 flex flex-col gap-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
            {randomGreeting.title}
          </h2>
          <p className="text-xl md:text-2xl text-white/95 font-semibold max-w-3xl">
            {randomGreeting.subtitle}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-white/90 text-lg font-medium">Ты учишься в</span>
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-bold text-lg border-2 border-white/30">
              {userGrade.replace(/(\d+)\s*класс$/i, '$1 классе')}
            </span>
          </div>
        </div>
      </div>

      <Card 
        className="border-4 border-purple-300 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 shadow-2xl cursor-pointer hover:shadow-3xl hover:scale-[1.02] transition-all"
        onClick={onAiTutorClick}
      >
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Icon name="Sparkles" size={40} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-2">
                  ИИшка 🤖
                </h3>
                <p className="text-base md:text-lg text-white/95 font-semibold">
                  Задай вопрос и получи объяснение через свои увлечения!
                </p>
              </div>
            </div>
            <Button 
              size="lg"
              className="bg-white text-purple-600 hover:bg-white/90 font-bold text-lg px-6 py-6 rounded-2xl shadow-xl hidden sm:flex"
            >
              <Icon name="MessageCircle" size={24} className="mr-2" />
              Спросить
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
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
            <p className="text-sm text-blue-600 font-semibold">Продолжай каждый день! 🔥</p>
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
    </div>
  );
};