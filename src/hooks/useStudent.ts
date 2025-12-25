import { useState, useEffect } from 'react';
import { Subject } from '@/components/school/schoolTypes';

interface StudentData {
  id: number;
  name: string;
  grade: string;
  points: number;
  streak: number;
  interests: string[];
  progress: Array<{
    subject_name: string;
    progress: number;
    completed_lessons: number;
    total_lessons: number;
  }>;
  achievements: Array<{
    achievement_name: string;
    earned: boolean;
  }>;
}

const API_URL = 'https://functions.poehali.dev/c2e6dce3-52e5-4905-84d1-d87e1d6d88c9';

export const useStudent = (studentId: number | null) => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudent = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}?student_id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch student data');
      }
      const data = await response.json();
      setStudentData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (name: string, grade: string, interests: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, grade, interests }),
      });
      if (!response.ok) {
        throw new Error('Failed to create student');
      }
      const data = await response.json();
      return data.student_id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (
    id: number,
    updates: {
      name?: string;
      grade?: string;
      points?: number;
      streak?: number;
      interests?: string[];
      progress?: Array<{
        subject_name: string;
        progress: number;
        completed_lessons: number;
      }>;
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: id, ...updates }),
      });
      if (!response.ok) {
        throw new Error('Failed to update student');
      }
      await fetchStudent(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchStudent(studentId);
    }
  }, [studentId]);

  return {
    studentData,
    loading,
    error,
    fetchStudent,
    createStudent,
    updateStudent,
  };
};
