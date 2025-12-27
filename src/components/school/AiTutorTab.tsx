import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { ChatMode } from './ai-tutor/ChatMode';
import { ExplainMode } from './ai-tutor/ExplainMode';
import { TaskMode } from './ai-tutor/TaskMode';

interface AiTutorTabProps {
  userName: string;
  userAge: number;
  userInterests: string[];
  studentId: number | null;
}

const API_URL = 'https://functions.poehali.dev/2b82fc79-a1ff-459a-ad43-1b196dbe4c25';

export const AiTutorTab = ({ userName, userAge, userInterests, studentId }: AiTutorTabProps) => {
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'explain' | 'task' | 'check'>('chat');
  const { toast } = useToast();

  const calculateGrade = (age: number): string => {
    if (age <= 7) return '1-2';
    if (age <= 10) return '3-4';
    if (age <= 12) return '5-6';
    if (age <= 14) return '7-8';
    if (age <= 16) return '9-10';
    return '11';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon name="Sparkles" size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                ИИ-Репетитор 🤖
              </h2>
              <p className="text-xl md:text-2xl text-white/95 font-semibold mt-2">
                Объясню любую тему, создам задание, проверю работу!
              </p>
            </div>
          </div>
        </div>
      </div>

      {userInterests.length > 0 ? (
        <Card className="border-4 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Icon name="Heart" size={20} className="text-pink-500" />
              Буду объяснять через:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {userInterests.map(interest => (
                <Badge
                  key={interest}
                  className="px-4 py-2 text-base bg-gradient-to-r from-purple-400 to-pink-400 text-white border-0"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-4 border-orange-200 bg-orange-50">
          <CardContent className="pt-6 text-center">
            <Icon name="AlertCircle" size={48} className="text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-orange-700 mb-2">Добавь свои интересы!</h3>
            <p className="text-orange-600">Перейди в профиль и добавь интересы, чтобы я мог объяснять темы через них</p>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-2 bg-white border-2 border-purple-200">
          <TabsTrigger value="chat" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <Icon name="MessageCircle" size={18} />
            Чат
          </TabsTrigger>
          <TabsTrigger value="explain" className="gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Icon name="BookOpen" size={18} />
            Объяснить тему
          </TabsTrigger>
          <TabsTrigger value="task" className="gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white">
            <Icon name="FileText" size={18} />
            Создать задание
          </TabsTrigger>
          <TabsTrigger value="check" className="gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white" disabled>
            <Icon name="CheckCircle" size={18} />
            Проверить работу
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <ChatMode
            userName={userName}
            userAge={userAge}
            userInterests={userInterests}
            apiUrl={API_URL}
            calculateGrade={calculateGrade}
            loading={loading}
            setLoading={setLoading}
            toast={toast}
          />
        </TabsContent>

        <TabsContent value="explain" className="space-y-4">
          <ExplainMode
            userName={userName}
            userAge={userAge}
            userInterests={userInterests}
            apiUrl={API_URL}
            calculateGrade={calculateGrade}
            loading={loading}
            setLoading={setLoading}
            toast={toast}
          />
        </TabsContent>

        <TabsContent value="task" className="space-y-4">
          <TaskMode
            userName={userName}
            userAge={userAge}
            userInterests={userInterests}
            apiUrl={API_URL}
            calculateGrade={calculateGrade}
            loading={loading}
            setLoading={setLoading}
            toast={toast}
          />
        </TabsContent>

        <TabsContent value="check">
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Icon name="Construction" size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl font-bold mb-2">Скоро здесь появится проверка домашки! 🎯</h3>
              <p className="text-gray-600">Пока используй другие режимы</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiTutorTab;
