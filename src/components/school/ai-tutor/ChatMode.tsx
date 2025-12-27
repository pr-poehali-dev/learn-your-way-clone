import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatModeProps {
  userName: string;
  userAge: number;
  userInterests: string[];
  apiUrl: string;
  calculateGrade: (age: number) => string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  toast: any;
}

export const ChatMode = ({
  userName,
  userAge,
  userInterests,
  apiUrl,
  calculateGrade,
  loading,
  setLoading,
  toast
}: ChatModeProps) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');

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

      const response = await fetch(apiUrl, {
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

  return (
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
  );
};
