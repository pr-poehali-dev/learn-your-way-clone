import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Subject, Achievement } from '@/components/school/schoolTypes';
import { SchoolDashboardTab } from '@/components/school/SchoolDashboardTab';
import { SchoolSubjectsTab } from '@/components/school/SchoolSubjectsTab';
import { AchievementsTab, ProfileTab } from '@/components/school/SchoolProfileTabs';
import { CoursesListTab } from '@/components/school/CoursesListTab';
import { CourseDetailTab } from '@/components/school/CourseDetailTab';
import { LessonViewTab } from '@/components/school/LessonViewTab';
import { AiTutorTab } from '@/components/school/AiTutorTab';
import { useStudent } from '@/hooks/useStudent';
import { useToast } from '@/hooks/use-toast';

const SchoolApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studentId, setStudentId] = useState<number | null>(1);
  const [userName, setUserName] = useState('Миша');
  const [userGrade, setUserGrade] = useState('7 класс');
  const [userAge, setUserAge] = useState(13);
  const [userInterests, setUserInterests] = useState(['Футбол', 'Видеоигры', 'Космос']);
  const [points, setPoints] = useState(1250);
  const [streak, setStreak] = useState(7);
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [editName, setEditName] = useState('');
  const [editGrade, setEditGrade] = useState('');
  const [editAge, setEditAge] = useState(0);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  
  const { studentData, loading, updateStudent } = useStudent(studentId);
  const { toast } = useToast();

  const [subjects] = useState<Subject[]>([
    {
      id: 1,
      name: 'Математика',
      description: 'Геометрия через футбольное поле',
      icon: 'Calculator',
      progress: 75,
      lessons: 20,
      completedLessons: 15,
      interest: 'Футбол',
      color: 'bg-orange-500',
    },
    {
      id: 2,
      name: 'Физика',
      description: 'Законы физики в видеоиграх',
      icon: 'Atom',
      progress: 60,
      lessons: 18,
      completedLessons: 11,
      interest: 'Видеоигры',
      color: 'bg-blue-500',
    },
    {
      id: 3,
      name: 'История',
      description: 'Космическая гонка и холодная война',
      icon: 'BookOpen',
      progress: 85,
      lessons: 15,
      completedLessons: 13,
      interest: 'Космос',
      color: 'bg-purple-500',
    },
    {
      id: 4,
      name: 'Русский язык',
      description: 'Грамматика через любимые книги',
      icon: 'BookText',
      progress: 40,
      lessons: 25,
      completedLessons: 10,
      interest: 'Чтение',
      color: 'bg-green-500',
    },
  ]);

  const achievements: Achievement[] = [
    { id: 1, name: 'Неделя подряд', icon: '🔥', earned: true },
    { id: 2, name: 'Мастер математики', icon: '🎯', earned: true },
    { id: 3, name: '100 уроков', icon: '⭐', earned: false },
    { id: 4, name: 'Отличник', icon: '🏆', earned: false },
  ];

  const totalProgress = Math.round(
    subjects.reduce((acc, subject) => acc + subject.progress, 0) / subjects.length
  );

  useEffect(() => {
    if (studentData) {
      setUserName(studentData.name);
      setUserGrade(studentData.grade);
      setUserAge(studentData.age || 13);
      setPoints(studentData.points);
      setStreak(studentData.streak);
      setUserInterests(studentData.interests);
    }
  }, [studentData]);

  const saveProfileChanges = async () => {
    if (studentId && editName.trim() && editGrade.trim() && editAge > 0) {
      setUserName(editName);
      setUserGrade(editGrade);
      setUserAge(editAge);
      
      await updateStudent(studentId, { 
        name: editName, 
        grade: editGrade,
        age: editAge 
      });
      
      setIsEditingProfile(false);
      toast({
        title: 'Профиль обновлён! ✅',
        description: 'Твои данные успешно сохранены',
      });
    }
  };

  const startEditingProfile = () => {
    setEditName(userName);
    setEditGrade(userGrade);
    setEditAge(userAge);
    setIsEditingProfile(true);
  };

  const addInterest = async (interest: string) => {
    if (!userInterests.includes(interest) && userInterests.length < 6) {
      const newInterests = [...userInterests, interest];
      setUserInterests(newInterests);
      
      if (studentId) {
        await updateStudent(studentId, { interests: newInterests });
        toast({
          title: 'Интерес добавлен! 🎉',
          description: `Теперь ты будешь учиться через ${interest}`,
        });
      }
    }
  };

  const removeInterest = async (interest: string) => {
    const newInterests = userInterests.filter(i => i !== interest);
    setUserInterests(newInterests);
    
    if (studentId) {
      await updateStudent(studentId, { interests: newInterests });
      toast({
        title: 'Интерес удалён',
        description: `${interest} убран из твоих интересов`,
      });
    }
  };

  const addCustomInterest = async () => {
    if (
      newInterest.trim() &&
      !userInterests.includes(newInterest.trim()) &&
      userInterests.length < 6
    ) {
      const newInterests = [...userInterests, newInterest.trim()];
      setUserInterests(newInterests);
      setNewInterest('');
      
      if (studentId) {
        await updateStudent(studentId, { interests: newInterests });
        toast({
          title: 'Интерес добавлен! 🎉',
          description: `Теперь ты будешь учиться через ${newInterest.trim()}`,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <nav className="bg-white border-b-4 border-orange-300 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center transform rotate-6 shadow-lg">
                <Icon name="GraduationCap" size={28} className="text-white -rotate-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Learn Fun</h1>
                <p className="text-xs text-gray-600">Учись через увлечения</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
                  <Icon name="Flame" size={20} className="text-orange-500" />
                  <span className="font-bold text-orange-700">{streak} дней</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
                  <Icon name="Star" size={20} className="text-blue-500" />
                  <span className="font-bold text-blue-700">{points}</span>
                </div>
              </div>
              <Avatar className="border-4 border-orange-300">
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-400 text-white font-bold text-lg">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 lg:w-auto lg:inline-grid h-auto p-2 bg-white border-2 border-orange-200 gap-1">
            <TabsTrigger
              value="dashboard"
              className="gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-xl"
            >
              <Icon name="Home" size={18} />
              <span className="hidden sm:inline">Главная</span>
            </TabsTrigger>
            <TabsTrigger
              value="ai-tutor"
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl"
            >
              <Icon name="Sparkles" size={18} />
              <span className="hidden sm:inline">AI-Репетитор</span>
            </TabsTrigger>
            <TabsTrigger
              value="courses"
              className="gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl"
              onClick={() => {
                setSelectedCourseId(null);
                setSelectedLessonId(null);
              }}
            >
              <Icon name="BookOpen" size={18} />
              <span className="hidden sm:inline">Курсы</span>
            </TabsTrigger>
            <TabsTrigger
              value="subjects"
              className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-xl"
            >
              <Icon name="Library" size={18} />
              <span className="hidden sm:inline">Предметы</span>
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-xl"
            >
              <Icon name="Trophy" size={18} />
              <span className="hidden sm:inline">Награды</span>
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="gap-2 data-[state=active]:bg-pink-500 data-[state=active]:text-white rounded-xl"
            >
              <Icon name="User" size={18} />
              <span className="hidden sm:inline">Профиль</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <SchoolDashboardTab
              userName={userName}
              userGrade={userGrade}
              userAge={userAge}
              totalProgress={totalProgress}
              streak={streak}
              points={points}
              subjects={subjects}
            />
          </TabsContent>

          <TabsContent value="ai-tutor">
            <AiTutorTab
              userName={userName}
              userAge={userAge}
              userInterests={userInterests}
              studentId={studentId}
            />
          </TabsContent>

          <TabsContent value="courses">
            {selectedLessonId ? (
              <LessonViewTab
                lessonId={selectedLessonId}
                studentId={studentId}
                onBack={() => {
                  setSelectedLessonId(null);
                }}
              />
            ) : selectedCourseId ? (
              <CourseDetailTab
                courseId={selectedCourseId}
                studentId={studentId}
                onBack={() => setSelectedCourseId(null)}
                onLessonSelect={(lessonId) => setSelectedLessonId(lessonId)}
              />
            ) : (
              <CoursesListTab
                studentId={studentId}
                onCourseSelect={(courseId) => setSelectedCourseId(courseId)}
              />
            )}
          </TabsContent>

          <TabsContent value="subjects">
            <SchoolSubjectsTab subjects={subjects} userInterests={userInterests} />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsTab achievements={achievements} />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileTab
              userName={userName}
              userGrade={userGrade}
              userAge={userAge}
              userInterests={userInterests}
              points={points}
              streak={streak}
              totalProgress={totalProgress}
              subjects={subjects}
              isEditingInterests={isEditingInterests}
              setIsEditingInterests={setIsEditingInterests}
              isEditingProfile={isEditingProfile}
              editName={editName}
              editGrade={editGrade}
              editAge={editAge}
              setEditName={setEditName}
              setEditGrade={setEditGrade}
              setEditAge={setEditAge}
              startEditingProfile={startEditingProfile}
              saveProfileChanges={saveProfileChanges}
              cancelEditingProfile={() => setIsEditingProfile(false)}
              newInterest={newInterest}
              setNewInterest={setNewInterest}
              addInterest={addInterest}
              removeInterest={removeInterest}
              addCustomInterest={addCustomInterest}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          onClick={() => setActiveTab('ai-tutor')}
          className="w-16 h-16 rounded-full shadow-2xl bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-4 border-white"
        >
          <Icon name="Sparkles" size={28} />
        </Button>
      </div>
    </div>
  );
};

export default SchoolApp;