import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Course, Lesson } from '@/components/types';
import { DashboardTab } from '@/components/DashboardTab';
import { CoursesTab } from '@/components/CoursesTab';
import {
  LessonsAndOtherTabs,
  TestsTab,
  ProfileTab,
} from '@/components/LessonsAndOtherTabs';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: 'Основы JavaScript',
      description: 'Изучите основы программирования на JavaScript с нуля',
      level: 'beginner',
      progress: 65,
      lessons: 12,
      completedLessons: 8,
      category: 'Программирование',
    },
    {
      id: 2,
      title: 'React для начинающих',
      description: 'Создавайте современные веб-приложения с React',
      level: 'intermediate',
      progress: 30,
      lessons: 15,
      completedLessons: 5,
      category: 'Веб-разработка',
    },
    {
      id: 3,
      title: 'Дизайн интерфейсов',
      description: 'Принципы UX/UI дизайна для создания красивых приложений',
      level: 'beginner',
      progress: 85,
      lessons: 10,
      completedLessons: 9,
      category: 'Дизайн',
    },
    {
      id: 4,
      title: 'Python и машинное обучение',
      description: 'Введение в ML и анализ данных с Python',
      level: 'advanced',
      progress: 15,
      lessons: 20,
      completedLessons: 3,
      category: 'Data Science',
    },
  ]);

  const [lessons, setLessons] = useState<Lesson[]>([
    { id: 1, title: 'Введение в JavaScript', duration: '15 мин', completed: true, courseId: 1 },
    { id: 2, title: 'Переменные и типы данных', duration: '20 мин', completed: true, courseId: 1 },
    {
      id: 3,
      title: 'Функции и область видимости',
      duration: '25 мин',
      completed: true,
      courseId: 1,
    },
    { id: 4, title: 'Массивы и объекты', duration: '30 мин', completed: false, courseId: 1 },
    { id: 5, title: 'Что такое React?', duration: '18 мин', completed: true, courseId: 2 },
    { id: 6, title: 'JSX и компоненты', duration: '22 мин', completed: false, courseId: 2 },
  ]);

  const [userName] = useState('Александр');
  const [userInterests] = useState(['Программирование', 'Дизайн', 'Data Science']);

  const totalProgress = Math.round(
    courses.reduce((acc, course) => acc + course.progress, 0) / courses.length
  );

  const markLessonComplete = (lessonId: number) => {
    setLessons(prev =>
      prev.map(lesson => (lesson.id === lessonId ? { ...lesson, completed: true } : lesson))
    );

    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      setCourses(prev =>
        prev.map(course => {
          if (course.id === lesson.courseId) {
            const newCompleted = course.completedLessons + 1;
            const newProgress = Math.round((newCompleted / course.lessons) * 100);
            return { ...course, completedLessons: newCompleted, progress: newProgress };
          }
          return course;
        })
      );
    }
  };

  const handleCourseClick = (courseId: number) => {
    setSelectedCourse(courseId);
    setActiveTab('lessons');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Icon name="GraduationCap" size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Learn Your Way</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setChatOpen(!chatOpen)}
                className="relative"
              >
                <Icon name="MessageCircle" size={20} />
                {chatOpen && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full" />
                )}
              </Button>
              <Avatar>
                <AvatarFallback className="bg-purple-500 text-white font-semibold">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="dashboard" className="gap-2">
              <Icon name="LayoutDashboard" size={16} />
              <span className="hidden sm:inline">Главная</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="gap-2">
              <Icon name="BookOpen" size={16} />
              <span className="hidden sm:inline">Курсы</span>
            </TabsTrigger>
            <TabsTrigger value="lessons" className="gap-2">
              <Icon name="Library" size={16} />
              <span className="hidden sm:inline">Уроки</span>
            </TabsTrigger>
            <TabsTrigger value="tests" className="gap-2">
              <Icon name="ClipboardCheck" size={16} />
              <span className="hidden sm:inline">Тесты</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <Icon name="User" size={16} />
              <span className="hidden sm:inline">Профиль</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardTab
              userName={userName}
              courses={courses}
              lessons={lessons}
              totalProgress={totalProgress}
              onCourseClick={handleCourseClick}
            />
          </TabsContent>

          <TabsContent value="courses">
            <CoursesTab courses={courses} onCourseClick={handleCourseClick} />
          </TabsContent>

          <TabsContent value="lessons">
            <LessonsAndOtherTabs
              selectedCourse={selectedCourse}
              selectedLesson={selectedLesson}
              setSelectedLesson={setSelectedLesson}
              courses={courses}
              lessons={lessons}
              markLessonComplete={markLessonComplete}
              userName={userName}
              userInterests={userInterests}
              totalProgress={totalProgress}
              chatOpen={chatOpen}
              setChatOpen={setChatOpen}
              chatMessage={chatMessage}
              setChatMessage={setChatMessage}
            />
          </TabsContent>

          <TabsContent value="tests">
            <TestsTab courses={courses} />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileTab
              userName={userName}
              userInterests={userInterests}
              courses={courses}
              lessons={lessons}
              totalProgress={totalProgress}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
