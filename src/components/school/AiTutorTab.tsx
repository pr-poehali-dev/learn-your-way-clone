import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AiTutorTabProps {
  userName: string;
  userAge: number;
  userInterests: string[];
  studentId: number | null;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const API_URL = 'https://functions.poehali.dev/2b82fc79-a1ff-459a-ad43-1b196dbe4c25';

export const AiTutorTab = ({ userName, userAge, userInterests, studentId }: AiTutorTabProps) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'explain' | 'task' | 'check'>('chat');
  
  const [explainSubject, setExplainSubject] = useState('');
  const [explainTopic, setExplainTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  
  const [taskSubject, setTaskSubject] = useState('');
  const [taskTopic, setTaskTopic] = useState('');
  const [taskDifficulty, setTaskDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [generatedTask, setGeneratedTask] = useState<any>(null);
  
  const { toast } = useToast();

  const exampleQuestions = [
    'Объясни, что такое скорость',
    'Как работает гравитация?',
    'Что такое фотосинтез?',
    'Объясни дроби простыми словами',
    'Как устроен двигатель?'
  ];

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) {
      toast({
        title: 'Введи сообщение',
        description: 'Напиши вопрос или попроси объяснить тему',
        variant: 'destructive'
      });
      return;
    }

    if (userInterests.length === 0) {
      toast({
        title: 'Добавь интересы',
        description: 'Сначала добавь свои интересы в профиле!',
        variant: 'destructive'
      });
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setLoading(true);

    try {
      const history = chatMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          message: currentMessage.trim(),
          history,
          student_info: {
            name: userName,
            age: userAge,
            grade: calculateGrade(userAge),
            interests: userInterests
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: data.reply,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, assistantMessage]);
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось получить ответ',
          variant: 'destructive'
        });
      }
    } catch (err) {
      toast({
        title: 'Ошибка сети',
        description: 'Проверь подключение к интернету',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExplainTopic = async () => {
    if (!explainSubject || !explainTopic) {
      toast({
        title: 'Заполни все поля',
        description: 'Укажи предмет и тему',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'explain',
          subject: explainSubject,
          topic: explainTopic,
          student_info: {
            name: userName,
            age: userAge,
            grade: calculateGrade(userAge),
            interests: userInterests
          }
        })
      });

      const data = await response.json();
      if (response.ok) {
        setExplanation(data.explanation);
        toast({ title: 'Готово! 📚', description: 'Читай объяснение ниже' });
      } else {
        toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Ошибка сети', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTask = async () => {
    if (!taskSubject || !taskTopic) {
      toast({
        title: 'Заполни все поля',
        description: 'Укажи предмет и тему',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_task',
          subject: taskSubject,
          topic: taskTopic,
          difficulty: taskDifficulty,
          student_info: {
            name: userName,
            age: userAge,
            grade: calculateGrade(userAge),
            interests: userInterests
          }
        })
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedTask(data.task);
        toast({ title: 'Задание готово! ✏️', description: 'Проверь его ниже' });
      } else {
        toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Ошибка сети', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

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
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle>Чат с ИИ-репетитором</CardTitle>
              <CardDescription>Задавай вопросы и получай объяснения через свои интересы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="min-h-[300px] max-h-[500px] overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <Icon name="MessageCircle" size={48} className="mx-auto mb-4 text-gray-400" />
                    <p>Начни общение! Задай вопрос по школьной программе</p>
                    <div className="mt-6 space-y-2">
                      <p className="text-sm font-semibold">Примеры:</p>
                      {exampleQuestions.slice(0, 3).map((q, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentMessage(q)}
                          className="block mx-auto"
                        >
                          {q}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-purple-500 text-white'
                            : 'bg-white border-2 border-purple-200'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <p className="text-xs mt-2 opacity-70">
                          {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border-2 border-purple-200 p-4 rounded-2xl">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleSendMessage();
                    }
                  }}
                  placeholder="Напиши свой вопрос..."
                  className="resize-none"
                  rows={2}
                  disabled={loading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={loading || !currentMessage.trim()}
                  size="lg"
                  className="self-end"
                >
                  <Icon name="Send" size={20} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="explain" className="space-y-4">
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle>Объяснить тему</CardTitle>
              <CardDescription>Получи подробное объяснение через свои увлечения</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Предмет</label>
                  <input
                    type="text"
                    value={explainSubject}
                    onChange={(e) => setExplainSubject(e.target.value)}
                    placeholder="Математика, Физика, Биология..."
                    className="w-full p-3 border-2 border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Тема</label>
                  <input
                    type="text"
                    value={explainTopic}
                    onChange={(e) => setExplainTopic(e.target.value)}
                    placeholder="Например: Дроби, Скорость, Фотосинтез"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <Button onClick={handleExplainTopic} disabled={loading} size="lg" className="w-full">
                {loading ? 'Объясняю...' : 'Объяснить тему'}
              </Button>

              {explanation && (
                <div className="mt-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Icon name="BookOpen" size={24} className="text-blue-600" />
                    Объяснение
                  </h3>
                  <div className="prose max-w-none whitespace-pre-wrap">{explanation}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="task" className="space-y-4">
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle>Создать персональное задание</CardTitle>
              <CardDescription>ИИ создаст задание, связанное с твоими интересами</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Предмет</label>
                  <input
                    type="text"
                    value={taskSubject}
                    onChange={(e) => setTaskSubject(e.target.value)}
                    placeholder="Математика..."
                    className="w-full p-3 border-2 border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Тема</label>
                  <input
                    type="text"
                    value={taskTopic}
                    onChange={(e) => setTaskTopic(e.target.value)}
                    placeholder="Например: Дроби"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Сложность</label>
                  <select
                    value={taskDifficulty}
                    onChange={(e) => setTaskDifficulty(e.target.value as any)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg"
                  >
                    <option value="easy">Лёгкий</option>
                    <option value="medium">Средний</option>
                    <option value="hard">Сложный</option>
                  </select>
                </div>
              </div>
              <Button onClick={handleGenerateTask} disabled={loading} size="lg" className="w-full">
                {loading ? 'Создаю задание...' : 'Создать задание'}
              </Button>

              {generatedTask && (
                <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                  <h3 className="text-2xl font-bold mb-2">{generatedTask.title}</h3>
                  <p className="text-gray-700 mb-4">{generatedTask.instruction}</p>
                  <div className="space-y-4">
                    {generatedTask.tasks?.map((task: any, idx: number) => (
                      <div key={idx} className="p-4 bg-white rounded-lg border-2 border-green-300">
                        <p className="font-semibold mb-2">{idx + 1}. {task.question}</p>
                        {task.options && (
                          <div className="space-y-1 ml-4">
                            {task.options.map((opt: string, i: number) => (
                              <p key={i} className="text-sm">• {opt}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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