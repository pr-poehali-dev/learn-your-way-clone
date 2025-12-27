import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ExplainModeProps {
  userName: string;
  userAge: number;
  userInterests: string[];
  apiUrl: string;
  calculateGrade: (age: number) => string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  toast: any;
}

export const ExplainMode = ({
  userName,
  userAge,
  userInterests,
  apiUrl,
  calculateGrade,
  loading,
  setLoading,
  toast
}: ExplainModeProps) => {
  const [explainSubject, setExplainSubject] = useState('');
  const [explainTopic, setExplainTopic] = useState('');
  const [explanation, setExplanation] = useState('');

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
      const response = await fetch(apiUrl, {
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

  return (
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
  );
};
