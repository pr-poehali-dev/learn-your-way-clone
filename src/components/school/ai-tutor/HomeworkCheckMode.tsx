import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface HomeworkCheckModeProps {
  userName: string;
  userAge: number;
  userInterests: string[];
  apiUrl: string;
  calculateGrade: (age: number) => string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  toast: any;
}

export const HomeworkCheckMode = ({
  userName,
  userAge,
  userInterests,
  apiUrl,
  calculateGrade,
  loading,
  setLoading,
  toast
}: HomeworkCheckModeProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [checkResult, setCheckResult] = useState<any>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Неверный формат',
        description: 'Загрузи изображение (JPG, PNG, HEIC)',
        variant: 'destructive'
      });
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleCheck = async () => {
    if (!selectedFile || !subject || !topic) {
      toast({
        title: 'Заполни все поля',
        description: 'Загрузи фото, укажи предмет и тему',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      
      reader.onload = async () => {
        const base64Image = reader.result as string;
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'check_homework',
            task: {
              subject,
              topic,
              image: base64Image
            },
            answers: [], // Image-based checking
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
          setCheckResult(data.result);
          toast({ 
            title: 'Проверка завершена! ✅', 
            description: `Твой результат: ${data.result.score}/100 баллов`
          });
        } else {
          toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
        }
      };

      reader.onerror = () => {
        toast({ title: 'Ошибка чтения файла', variant: 'destructive' });
      };
    } catch (err) {
      toast({ title: 'Ошибка сети', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setSubject('');
    setTopic('');
    setCheckResult(null);
  };

  return (
    <Card className="border-2 border-orange-200">
      <CardHeader>
        <CardTitle>Проверить домашку по фото</CardTitle>
        <CardDescription>Сфотографируй решение — проверю и объясню ошибки</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!checkResult ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Предмет</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Математика, Физика..."
                  className="w-full p-3 border-2 border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Тема</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Например: Уравнения, Задачи на скорость"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="border-4 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                {previewUrl ? (
                  <div className="space-y-4">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="max-h-64 mx-auto rounded-lg shadow-lg"
                    />
                    <Button variant="outline" type="button">
                      <Icon name="Upload" size={20} className="mr-2" />
                      Изменить фото
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Icon name="Camera" size={64} className="text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-semibold text-gray-700">
                        Нажми, чтобы сфотографировать или загрузить
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        JPG, PNG, HEIC до 10MB
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleCheck} 
                disabled={loading || !selectedFile || !subject || !topic} 
                size="lg" 
                className="flex-1"
              >
                {loading ? 'Проверяю...' : 'Проверить работу'}
              </Button>
              {selectedFile && (
                <Button onClick={resetForm} variant="outline" size="lg">
                  Сбросить
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-orange-700">Результат проверки</h3>
                <div className="flex items-center gap-2">
                  <Badge 
                    className={`text-lg px-4 py-2 ${
                      checkResult.score >= 80 
                        ? 'bg-green-100 text-green-700 border-green-300' 
                        : checkResult.score >= 60
                        ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                        : 'bg-red-100 text-red-700 border-red-300'
                    }`}
                  >
                    {checkResult.score}/100
                  </Badge>
                </div>
              </div>

              {previewUrl && (
                <img 
                  src={previewUrl} 
                  alt="Homework" 
                  className="max-h-48 mx-auto rounded-lg shadow-lg mb-4"
                />
              )}

              {checkResult.results && checkResult.results.length > 0 && (
                <div className="space-y-3 mb-4">
                  <h4 className="font-semibold text-lg text-gray-800">Разбор заданий:</h4>
                  {checkResult.results.map((result: any, idx: number) => (
                    <div 
                      key={idx}
                      className="p-4 bg-white rounded-lg border-2 border-orange-100"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Задание {idx + 1}</Badge>
                        <Badge className={
                          result.status === 'правильно' 
                            ? 'bg-green-100 text-green-700' 
                            : result.status === 'частично'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }>
                          {result.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{result.feedback}</p>
                    </div>
                  ))}
                </div>
              )}

              {checkResult.feedback && (
                <div className="p-4 bg-white rounded-lg border-2 border-orange-100 mb-4">
                  <h4 className="font-semibold text-lg text-gray-800 mb-2">Общий комментарий:</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{checkResult.feedback}</p>
                </div>
              )}

              {checkResult.recommendations && (
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-100">
                  <h4 className="font-semibold text-lg text-blue-800 mb-2 flex items-center gap-2">
                    <Icon name="Lightbulb" size={20} />
                    Рекомендации:
                  </h4>
                  <p className="text-blue-700 whitespace-pre-wrap">{checkResult.recommendations}</p>
                </div>
              )}
            </div>

            <Button onClick={resetForm} size="lg" className="w-full">
              <Icon name="RefreshCw" size={20} className="mr-2" />
              Проверить ещё одну работу
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
