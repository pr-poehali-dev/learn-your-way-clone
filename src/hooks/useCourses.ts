import { useState, useEffect } from 'react';

const API_URL = 'https://functions.poehali.dev/cce50e72-0dc3-4ac5-aebe-830227e187d3';

interface Course {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  difficulty_level: string;
  total_lessons: number;
  completed_lessons?: number;
  progress?: number;
}

interface Topic {
  id: number;
  name: string;
  description: string;
  order_index: number;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  content_type: string;
  order_index: number;
  duration_minutes: number;
  difficulty_level: string;
  status?: string;
  progress_percent?: number;
}

interface LessonContent {
  type: string;
  data: string;
  url: string;
  order_index: number;
}

interface TestQuestion {
  id: number;
  text: string;
  type: string;
  points: number;
  explanation: string;
  answers: TestAnswer[];
}

interface TestAnswer {
  id: number;
  text: string;
  is_correct?: boolean;
}

interface LessonTest {
  id: number;
  title: string;
  description: string;
  passing_score: number;
  time_limit_minutes: number;
  questions: TestQuestion[];
}

interface LessonDetail extends Lesson {
  course_name: string;
  topic_name: string;
  content: LessonContent[];
  test?: LessonTest;
  progress?: {
    status: string;
    percent: number;
    time_spent: number;
    started_at: string;
    completed_at: string;
    last_activity: string;
  };
}

interface CourseDetail extends Course {
  topics: Topic[];
}

export const useCourses = (studentId: number | null) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    if (!studentId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        action: 'list_courses',
        student_id: studentId.toString()
      });
      
      const response = await fetch(`${API_URL}?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setCourses(data.courses || []);
      } else {
        setError(data.error || 'Failed to fetch courses');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [studentId]);

  return { courses, loading, error, refetch: fetchCourses };
};

export const useCourse = (courseId: number | null, studentId: number | null) => {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = async () => {
    if (!courseId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        action: 'get_course',
        course_id: courseId.toString(),
        ...(studentId && { student_id: studentId.toString() })
      });
      
      const response = await fetch(`${API_URL}?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setCourse(data);
      } else {
        setError(data.error || 'Failed to fetch course');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId, studentId]);

  return { course, loading, error, refetch: fetchCourse };
};

export const useLesson = (lessonId: number | null, studentId: number | null) => {
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLesson = async () => {
    if (!lessonId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        action: 'get_lesson',
        lesson_id: lessonId.toString(),
        ...(studentId && { student_id: studentId.toString() })
      });
      
      const response = await fetch(`${API_URL}?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setLesson(data);
      } else {
        setError(data.error || 'Failed to fetch lesson');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (status: string, progressPercent: number) => {
    if (!lessonId || !studentId) return;
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_progress',
          student_id: studentId,
          lesson_id: lessonId,
          status,
          progress_percent: progressPercent
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        await fetchLesson();
      } else {
        setError(data.error || 'Failed to update progress');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const submitTest = async (testId: number, answers: Array<{ question_id: number; answer_id: number }>) => {
    if (!studentId || !lessonId) return null;
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_test',
          student_id: studentId,
          test_id: testId,
          lesson_id: lessonId,
          answers
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        await fetchLesson();
        return data;
      } else {
        setError(data.error || 'Failed to submit test');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  };

  useEffect(() => {
    fetchLesson();
  }, [lessonId, studentId]);

  return { lesson, loading, error, updateProgress, submitTest, refetch: fetchLesson };
};
