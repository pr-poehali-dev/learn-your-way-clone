import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AiTutorTabProps {
  userName: string;
  userAge: number;
  userInterests: string[];
  studentId: number | null;
}

interface Answer {
  question: string;
  answer: string;
  interests_used: string[];
  timestamp: Date;
}

const API_URL = 'https://functions.poehali.dev/2b82fc79-a1ff-459a-ad43-1b196dbe4c25';

export const AiTutorTab = ({ userName, userAge, userInterests, studentId }: AiTutorTabProps) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const { toast } = useToast();

  const exampleQuestions = [
    'Объясни, что такое скорость через удар Месси',
    'Как работает гравитация? Объясни через космос',
    'Что такое фотосинтез простыми словами',
    'Объясни дроби через видеоигры',
    'Как устроен двигатель? Объясни через футбол'
  ];

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: 'Введи вопрос',
        description: 'Напиши, что ты хочешь узнать!',
        variant: 'destructive'
      });
      return;
    }

    if (userInterests.length === 0) {
      toast({
        title: 'Добавь интересы',
        description: 'Сначала добавь свои интересы в профиле, чтобы я мог объяснять через них!',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: question.trim(),
          interests: userInterests,
          age: userAge,
          name: userName
        })
      });

      const data = await response.json();

      if (response.ok) {
        const newAnswer: Answer = {
          question: data.question,
          answer: data.answer,
          interests_used: data.interests_used,
          timestamp: new Date()
        };
        
        setAnswers(prev => [newAnswer, ...prev]);
        setQuestion('');
        
        toast({
          title: 'Ответ готов! 🎓',
          description: 'Читай объяснение ниже'
        });
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

  const handleExampleClick = (example: string) => {
    setQuestion(example);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleAskQuestion();
    }
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
                ИИшка 🤖
              </h2>
              <p className="text-xl md:text-2xl text-white/95 font-semibold mt-2">
                Объясню любую тему через твои увлечения!
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

      <Card className="border-4 border-blue-200 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Задай свой вопрос</CardTitle>
          <CardDescription className="text-base">
            Спроси про любую школьную тему, и я объясню её через твои интересы
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напиши свой вопрос или попроси объяснить тему через твои интересы... 
            
Например: 'Объясни, что такое скорость через удар Месси' или 'Как работает гравитация через космос?'"
            className="min-h-[120px] text-lg resize-none border-2 border-gray-300 focus:border-purple-400"
            disabled={loading}
          />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              <Icon name="Info" size={14} className="inline mr-1" />
              Нажми <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl/Cmd + Enter</kbd> для быстрой отправки
            </p>
            <Button
              size="lg"
              onClick={handleAskQuestion}
              disabled={loading || !question.trim() || userInterests.length === 0}
              className="gap-2 text-lg font-bold w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Думаю...
                </>
              ) : (
                <>
                  <Icon name="Sparkles" size={20} />
                  Объяснить
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {exampleQuestions.length > 0 && answers.length === 0 && (
        <Card className="border-4 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Icon name="Lightbulb" size={20} className="text-green-600" />
              Примеры вопросов
            </CardTitle>
            <CardDescription>Нажми на любой вопрос, чтобы попробовать</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exampleQuestions.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleExampleClick(example)}
                  className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-green-100 hover:border-green-400"
                  disabled={loading}
                >
                  <Icon name="MessageSquare" size={16} className="mr-2 flex-shrink-0" />
                  <span className="text-base">{example}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {answers.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">История вопросов</h3>
            <Badge className="bg-purple-500 text-white px-3 py-1">
              {answers.length} {answers.length === 1 ? 'ответ' : 'ответов'}
            </Badge>
          </div>

          {answers.map((ans, index) => (
            <Card key={index} className="border-4 border-purple-200 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center flex-shrink-0">
                    <Icon name="MessageCircleQuestion" size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl text-purple-900">{ans.question}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {ans.timestamp.toLocaleString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ans.interests_used.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-sm text-gray-600 font-semibold">Объяснено через:</span>
                      {ans.interests_used.map(interest => (
                        <Badge
                          key={interest}
                          variant="outline"
                          className="text-xs border-purple-300 text-purple-700"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="prose max-w-none">
                    <div className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap bg-gradient-to-br from-white to-purple-50 p-6 rounded-xl border-2 border-purple-100">
                      {ans.answer}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};