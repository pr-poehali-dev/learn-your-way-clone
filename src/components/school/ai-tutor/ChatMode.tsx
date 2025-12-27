import { useState } from 'react';
import * as React from 'react';
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
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);

  const exampleQuestions = [
    'Объясни, что такое скорость',
    'Как работает гравитация?',
    'Что такое фотосинтез?',
    'Объясни дроби простыми словами',
    'Как устроен двигатель?'
  ];

  // Initialize speech recognition
  React.useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'ru-RU';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentMessage(transcript);
        setIsRecording(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast({
          title: 'Ошибка распознавания',
          description: 'Не удалось распознать речь. Проверь микрофон.',
          variant: 'destructive'
        });
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startRecording = () => {
    if (!recognition) {
      toast({
        title: 'Не поддерживается',
        description: 'Голосовой ввод не поддерживается в твоём браузере',
        variant: 'destructive'
      });
      return;
    }

    setIsRecording(true);
    recognition.start();
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeech = (messageIndex: number, text: string) => {
    if (isSpeaking && speakingMessageId === messageIndex) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    } else {
      setSpeakingMessageId(messageIndex);
      speakText(text);
    }
  };

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
        
        // Auto-speak assistant response
        speakText(data.reply);
      } else {
        console.error('Backend error:', data);
        const errorMsg = data.error || 'Не удалось получить ответ от ИИ';
        toast({
          title: `Ошибка ${response.status}`,
          description: errorMsg.includes('API key') ? 'Не настроен OPENAI_API_KEY' : errorMsg,
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
                  <div className="flex items-start justify-between gap-3">
                    <p className="whitespace-pre-wrap flex-1">{msg.content}</p>
                    {msg.role === 'assistant' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSpeech(idx, msg.content)}
                        className="flex-shrink-0 h-8 w-8 p-0"
                      >
                        <Icon 
                          name={isSpeaking && speakingMessageId === idx ? 'VolumeX' : 'Volume2'} 
                          size={16} 
                          className={isSpeaking && speakingMessageId === idx ? 'text-purple-600 animate-pulse' : 'text-gray-400'}
                        />
                      </Button>
                    )}
                  </div>
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
            placeholder="Напиши свой вопрос или нажми 🎤"
            className="resize-none"
            rows={2}
            disabled={loading || isRecording}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={loading}
              size="lg"
              variant={isRecording ? 'destructive' : 'outline'}
              className={isRecording ? 'animate-pulse' : ''}
            >
              <Icon name={isRecording ? 'MicOff' : 'Mic'} size={20} />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={loading || !currentMessage.trim() || isRecording}
              size="lg"
            >
              <Icon name="Send" size={20} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};