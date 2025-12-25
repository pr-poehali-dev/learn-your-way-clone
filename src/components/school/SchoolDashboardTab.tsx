import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Subject } from './schoolTypes';

interface SchoolDashboardTabProps {
  userName: string;
  userGrade: string;
  totalProgress: number;
  streak: number;
  points: number;
  subjects: Subject[];
}

export const SchoolDashboardTab = ({
  userName,
  userGrade,
  totalProgress,
  streak,
  points,
  subjects,
}: SchoolDashboardTabProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-bold text-gray-900">Привет, {userName}! 👋</h2>
        <p className="text-lg text-gray-600">
          Ты учишься в <span className="font-bold text-orange-600">{userGrade}</span>. Продолжай в том
          же духе!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-4 border-orange-200 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-orange-700">Твой прогресс</CardTitle>
              <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                <Icon name="TrendingUp" size={24} className="text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-orange-600 mb-3">{totalProgress}%</div>
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
                      <div
                        className={`w-14 h-14 rounded-2xl ${subject.color} flex items-center justify-center shadow-lg`}
                      >
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
    </div>
  );
};
