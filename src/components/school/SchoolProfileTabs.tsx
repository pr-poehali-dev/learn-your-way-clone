import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Subject, Achievement, availableInterests } from './schoolTypes';

interface AchievementsTabProps {
  achievements: Achievement[];
}

export const AchievementsTab = ({ achievements }: AchievementsTabProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
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
                className={`text-6xl mb-3 ${achievement.earned ? 'animate-scale-in' : 'grayscale'}`}
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
    </div>
  );
};

interface ProfileTabProps {
  userName: string;
  userGrade: string;
  userAge: number;
  userInterests: string[];
  points: number;
  streak: number;
  totalProgress: number;
  subjects: Subject[];
  isEditingInterests: boolean;
  setIsEditingInterests: (value: boolean) => void;
  isEditingProfile: boolean;
  editName: string;
  editGrade: string;
  editAge: number;
  setEditName: (value: string) => void;
  setEditGrade: (value: string) => void;
  setEditAge: (value: number) => void;
  startEditingProfile: () => void;
  saveProfileChanges: () => void;
  cancelEditingProfile: () => void;
  newInterest: string;
  setNewInterest: (value: string) => void;
  addInterest: (interest: string) => void;
  removeInterest: (interest: string) => void;
  addCustomInterest: () => void;
}

export const ProfileTab = ({
  userName,
  userGrade,
  userAge,
  userInterests,
  points,
  streak,
  totalProgress,
  subjects,
  isEditingInterests,
  setIsEditingInterests,
  isEditingProfile,
  editName,
  editGrade,
  editAge,
  setEditName,
  setEditGrade,
  setEditAge,
  startEditingProfile,
  saveProfileChanges,
  cancelEditingProfile,
  newInterest,
  setNewInterest,
  addInterest,
  removeInterest,
  addCustomInterest,
}: ProfileTabProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Мой профиль 👤</h2>
        <p className="text-gray-600">Управляй своими данными</p>
      </div>

      <Card className="border-4 border-orange-200 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-24 h-24 border-4 border-orange-300">
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-400 text-white text-3xl font-bold">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                {isEditingProfile ? (
                  <div className="space-y-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Имя"
                      className="text-xl font-bold"
                    />
                    <Input
                      value={editGrade}
                      onChange={(e) => setEditGrade(e.target.value)}
                      placeholder="Класс"
                      className="text-base"
                    />
                    <Input
                      type="number"
                      value={editAge}
                      onChange={(e) => setEditAge(Number(e.target.value))}
                      placeholder="Возраст"
                      className="text-base"
                      min={6}
                      max={18}
                    />
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-3xl">{userName}</CardTitle>
                    <CardDescription className="text-lg mt-1">
                      Ученик {userGrade} • {userAge} лет
                    </CardDescription>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-orange-500 text-white text-sm">Активный</Badge>
                      <Badge className="bg-green-500 text-white text-sm">Отличник</Badge>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {isEditingProfile ? (
                <>
                  <Button
                    onClick={saveProfileChanges}
                    className="gap-2"
                  >
                    <Icon name="Check" size={16} />
                    Сохранить
                  </Button>
                  <Button
                    onClick={cancelEditingProfile}
                    variant="outline"
                    className="gap-2"
                  >
                    <Icon name="X" size={16} />
                    Отмена
                  </Button>
                </>
              ) : (
                <Button
                  onClick={startEditingProfile}
                  variant="outline"
                  className="gap-2"
                >
                  <Icon name="Edit" size={16} />
                  Редактировать профиль
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 text-lg">Мои интересы</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingInterests(!isEditingInterests)}
                className="gap-2 font-semibold"
              >
                <Icon name={isEditingInterests ? 'X' : 'Edit'} size={16} />
                {isEditingInterests ? 'Готово' : 'Редактировать'}
              </Button>
            </div>

            {isEditingInterests ? (
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {userInterests.map(interest => (
                    <Badge
                      key={interest}
                      className="px-4 py-2 text-base bg-gradient-to-r from-purple-400 to-blue-400 text-white border-0 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => removeInterest(interest)}
                    >
                      {interest}
                      <Icon name="X" size={14} className="ml-2" />
                    </Badge>
                  ))}
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-600 font-semibold">
                    Выбери интересы (максимум 6):
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {availableInterests
                      .filter(interest => !userInterests.includes(interest))
                      .map(interest => (
                        <Badge
                          key={interest}
                          variant="outline"
                          className="px-4 py-2 text-base cursor-pointer hover:bg-purple-100 hover:border-purple-300 transition-colors"
                          onClick={() => addInterest(interest)}
                        >
                          <Icon name="Plus" size={14} className="mr-1" />
                          {interest}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Или добавь свой интерес..."
                    value={newInterest}
                    onChange={e => setNewInterest(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustomInterest()}
                    className="flex-1"
                  />
                  <Button onClick={addCustomInterest} className="gap-2">
                    <Icon name="Plus" size={16} />
                    Добавить
                  </Button>
                </div>

                {userInterests.length >= 6 && (
                  <p className="text-sm text-orange-600 font-semibold">
                    Достигнут максимум интересов (6). Удали один, чтобы добавить новый.
                  </p>
                )}
              </div>
            ) : (
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
            )}
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
                      <div
                        className={`w-8 h-8 rounded-lg ${subject.color} flex items-center justify-center`}
                      >
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
    </div>
  );
};