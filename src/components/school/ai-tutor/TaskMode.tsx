import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface TaskModeProps {
  userName: string;
  userAge: number;
  userInterests: string[];
  apiUrl: string;
  calculateGrade: (age: number) => string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  toast: any;
}

export const TaskMode = ({
  userName,
  userAge,
  userInterests,
  apiUrl,
  calculateGrade,
  loading,
  setLoading,
  toast
}: TaskModeProps) => {
  const [taskSubject, setTaskSubject] = useState('');
  const [taskTopic, setTaskTopic] = useState('');
  const [taskDifficulty, setTaskDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [generatedTask, setGeneratedTask] = useState<any>(null);

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
      const response = await fetch(apiUrl, {
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

  return (
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
  );
};
