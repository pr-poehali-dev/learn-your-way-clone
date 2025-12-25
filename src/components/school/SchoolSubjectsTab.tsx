import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Subject } from './schoolTypes';

interface SchoolSubjectsTabProps {
  subjects: Subject[];
  userInterests: string[];
}

export const SchoolSubjectsTab = ({ subjects, userInterests }: SchoolSubjectsTabProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
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
                <div
                  className={`w-16 h-16 rounded-2xl ${subject.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                >
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
    </div>
  );
};
