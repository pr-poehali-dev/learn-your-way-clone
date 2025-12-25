import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useLesson } from '@/hooks/useCourses';
import { useToast } from '@/hooks/use-toast';

interface LessonViewTabProps {
  lessonId: number;
  studentId: number | null;
  onBack: () => void;
}

export const LessonViewTab = ({ lessonId, studentId, onBack }: LessonViewTabProps) => {
  const { lesson, loading, error, updateProgress, submitTest } = useLesson(lessonId, studentId);
  const { toast } = useToast();
  
  const [showTest, setShowTest] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    if (lesson && lesson.progress?.status === 'not_started') {
      updateProgress('in_progress', 0);
    }
  }, [lesson?.id]);

  const handleAnswerChange = (questionId: number, answerId: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmitTest = async () => {
    if (!lesson?.test || !studentId) return;

    const answerArray = Object.entries(answers).map(([questionId, answerId]) => ({
      question_id: Number(questionId),
      answer_id: answerId
    }));

    if (answerArray.length !== lesson.test.questions.length) {
      toast({
        title: 'Не все вопросы отвечены',
        description: 'Ответь на все вопросы перед отправкой!',
        variant: 'destructive'
      });
      return;
    }

    const result = await submitTest(lesson.test.id, answerArray);
    
    if (result) {
      setTestResult(result);
      setTestSubmitted(true);
      
      if (result.passed) {
        toast({
          title: 'Тест пройден! 🎉',
          description: `Ты набрал ${result.score} из ${result.max_score} баллов`,
        });
      } else {
        toast({
          title: 'Попробуй ещё раз',
          description: `Набрано ${result.score} из ${result.max_score}. Нужно ${result.passing_score}+ для прохождения`,
          variant: 'destructive'
        });
      }
    }
  };

  const handleCompleteLesson = async () => {
    if (!lesson?.test) {
      await updateProgress('completed', 100);
      toast({
        title: 'Урок завершён! ✅',
        description: 'Отличная работа! Продолжай учиться!',
      });
    } else {
      setShowTest(true);
    }
  };

  const renderContent = (contentItem: any) => {
    switch (contentItem.type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
              {contentItem.data}
            </p>
          </div>
        );
      
      case 'heading':
        return (
          <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-6">
            {contentItem.data}
          </h3>
        );
      
      case 'image':
        return (
          <div className="my-6">
            <img 
              src={contentItem.url} 
              alt={contentItem.data || 'Изображение урока'} 
              className="rounded-xl shadow-lg w-full max-w-2xl mx-auto"
            />
            {contentItem.data && (
              <p className="text-center text-sm text-gray-600 mt-2">{contentItem.data}</p>
            )}
          </div>
        );
      
      case 'video':
        return (
          <div className="my-6">
            <video 
              controls 
              className="rounded-xl shadow-lg w-full max-w-2xl mx-auto"
              src={contentItem.url}
            >
              Твой браузер не поддерживает видео.
            </video>
            {contentItem.data && (
              <p className="text-center text-sm text-gray-600 mt-2">{contentItem.data}</p>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Загружаем урок...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="space-y-4">
        <Button onClick={onBack} variant="outline" className="gap-2">
          <Icon name="ArrowLeft" size={18} />
          Назад
        </Button>
        <Card className="border-4 border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center">
            <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-700 mb-2">Ошибка загрузки</h3>
            <p className="text-red-600">{error || 'Урок не найден'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showTest && lesson.test && !testSubmitted) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <Button onClick={() => setShowTest(false)} variant="outline" className="gap-2">
            <Icon name="ArrowLeft" size={18} />
            Вернуться к уроку
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Icon name="Clock" size={16} />
            <span>Время: {lesson.test.time_limit_minutes} мин</span>
          </div>
        </div>

        <Card className="border-4 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-500 flex items-center justify-center">
                <Icon name="ClipboardCheck" size={32} className="text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl">{lesson.test.title}</CardTitle>
                <CardDescription className="text-lg mt-1">
                  {lesson.test.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
              <Icon name="Info" size={24} className="text-blue-600" />
              <p className="text-blue-700 font-semibold">
                Минимальный балл для прохождения: {lesson.test.passing_score} из {lesson.test.questions.reduce((acc, q) => acc + q.points, 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {lesson.test.questions.map((question, index) => (
            <Card key={question.id} className="border-4 border-gray-200 shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{question.text}</CardTitle>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      {question.points} {question.points === 1 ? 'балл' : 'балла'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[question.id]?.toString()}
                  onValueChange={(value) => handleAnswerChange(question.id, Number(value))}
                >
                  <div className="space-y-3">
                    {question.answers.map((answer) => (
                      <div
                        key={answer.id}
                        className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-200 hover:border-orange-300 transition-colors cursor-pointer"
                      >
                        <RadioGroupItem value={answer.id.toString()} id={`q${question.id}_a${answer.id}`} />
                        <Label
                          htmlFor={`q${question.id}_a${answer.id}`}
                          className="flex-1 text-base cursor-pointer"
                        >
                          {answer.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-4 border-green-200 bg-green-50 sticky bottom-4 shadow-2xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Icon name="CheckCircle2" size={32} className="text-green-600" />
                <div>
                  <p className="font-bold text-gray-900">
                    Отвечено: {Object.keys(answers).length} из {lesson.test.questions.length}
                  </p>
                  <p className="text-sm text-gray-600">
                    {Object.keys(answers).length === lesson.test.questions.length
                      ? 'Все вопросы отвечены!'
                      : 'Ответь на все вопросы'}
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                onClick={handleSubmitTest}
                className="gap-2 text-lg font-bold"
                disabled={Object.keys(answers).length !== lesson.test.questions.length}
              >
                <Icon name="Send" size={20} />
                Отправить тест
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (testSubmitted && testResult) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button onClick={onBack} variant="outline" className="gap-2">
          <Icon name="ArrowLeft" size={18} />
          Вернуться к курсу
        </Button>

        <Card className={`border-4 ${testResult.passed ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' : 'border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-50'} shadow-xl`}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 rounded-3xl ${testResult.passed ? 'bg-green-500' : 'bg-orange-500'} flex items-center justify-center`}>
                <Icon name={testResult.passed ? 'Trophy' : 'RotateCcw'} size={40} className="text-white" />
              </div>
              <div>
                <CardTitle className="text-4xl">
                  {testResult.passed ? 'Отлично! 🎉' : 'Попробуй снова! 💪'}
                </CardTitle>
                <CardDescription className="text-xl mt-2">
                  {testResult.passed
                    ? 'Ты успешно прошёл тест!'
                    : `Нужно набрать ${testResult.passing_score}+ баллов`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-6 bg-white rounded-2xl border-2 border-gray-200">
                <div>
                  <p className="text-gray-600 font-semibold mb-1">Твой результат</p>
                  <p className="text-5xl font-bold text-orange-600">
                    {testResult.score} <span className="text-2xl text-gray-500">из {testResult.max_score}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 font-semibold mb-1">Процент</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {Math.round((testResult.score / testResult.max_score) * 100)}%
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                {testResult.passed ? (
                  <Button
                    size="lg"
                    onClick={onBack}
                    className="flex-1 gap-2 text-lg font-bold"
                  >
                    <Icon name="CheckCircle2" size={20} />
                    Продолжить обучение
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      onClick={() => {
                        setTestSubmitted(false);
                        setTestResult(null);
                        setAnswers({});
                        setShowTest(true);
                      }}
                      className="flex-1 gap-2 text-lg font-bold"
                    >
                      <Icon name="RotateCcw" size={20} />
                      Пройти заново
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={onBack}
                      className="flex-1 gap-2 text-lg font-bold"
                    >
                      <Icon name="ArrowLeft" size={20} />
                      Вернуться к курсу
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" className="gap-2">
          <Icon name="ArrowLeft" size={18} />
          Назад к курсу
        </Button>
        {lesson.progress?.status === 'completed' && (
          <Badge className="bg-green-500 text-white text-base px-4 py-2">
            <Icon name="CheckCircle2" size={16} className="mr-2" />
            Урок завершён
          </Badge>
        )}
      </div>

      <Card className="border-4 border-orange-200 bg-gradient-to-br from-orange-50 to-pink-50 shadow-xl">
        <CardHeader>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{lesson.course_name}</span>
              <Icon name="ChevronRight" size={14} />
              <span>{lesson.topic_name}</span>
            </div>
            <CardTitle className="text-4xl">{lesson.title}</CardTitle>
            <CardDescription className="text-lg">{lesson.description}</CardDescription>
            <div className="flex gap-3 flex-wrap pt-2">
              <Badge className="bg-blue-500 text-white text-sm px-3 py-1">
                <Icon name="Clock" size={14} className="mr-1" />
                {lesson.duration_minutes} минут
              </Badge>
              {lesson.test && (
                <Badge className="bg-purple-500 text-white text-sm px-3 py-1">
                  <Icon name="ClipboardCheck" size={14} className="mr-1" />
                  Тест в конце
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        {lesson.progress && lesson.progress.status !== 'completed' && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700">Прогресс урока</span>
                <span className="text-xl font-bold text-orange-600">{lesson.progress.percent}%</span>
              </div>
              <Progress value={lesson.progress.percent} className="h-3" />
            </div>
          </CardContent>
        )}
      </Card>

      <Card className="border-4 border-gray-200 shadow-lg">
        <CardContent className="pt-8 pb-8 space-y-6">
          {lesson.content && lesson.content.length > 0 ? (
            lesson.content.map((contentItem, index) => (
              <div key={index}>{renderContent(contentItem)}</div>
            ))
          ) : (
            <div className="text-center py-12">
              <Icon name="BookOpen" size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Контент урока загружается...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {lesson.progress?.status !== 'completed' && (
        <Card className="border-4 border-green-200 bg-green-50 sticky bottom-4 shadow-2xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Icon name="CheckCircle2" size={32} className="text-green-600" />
                <div>
                  <p className="font-bold text-gray-900 text-lg">Готов завершить урок?</p>
                  <p className="text-sm text-gray-600">
                    {lesson.test ? 'Тебя ждёт небольшой тест!' : 'Отметь урок как завершённый'}
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                onClick={handleCompleteLesson}
                className="gap-2 text-lg font-bold"
              >
                {lesson.test ? (
                  <>
                    <Icon name="ClipboardCheck" size={20} />
                    Пройти тест
                  </>
                ) : (
                  <>
                    <Icon name="CheckCircle2" size={20} />
                    Завершить урок
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
