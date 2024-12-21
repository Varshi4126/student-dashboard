import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';
import { Student, NewStudent } from '@/types/student';

interface StudentState {
  students: Student[];
  isLoading: boolean;
  error: string | null;
  selectedCohort: string;
  selectedGrade: string;
  fetchStudents: () => Promise<void>;
  addStudent: (student: NewStudent) => Promise<void>;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  setSelectedCohort: (cohort: string) => void;
  setSelectedGrade: (grade: string) => void;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const useStudentStore = create<StudentState>((set, get) => ({
  students: [],
  isLoading: false,
  error: null,
  selectedCohort: 'AY 2024-25',
  selectedGrade: 'CBSE 9',

  fetchStudents: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('cohort', get().selectedCohort)
        .eq('grade', get().selectedGrade);

      if (error) throw error;
      set({ students: data || [], error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },

  addStudent: async (student: NewStudent) => {
    set({ isLoading: true });
    try {
      // Transform the data to match database column names
      const studentData = {
        name: student.name,
        cohort: student.cohort,
        courses: student.courses,
        status: student.status,
        date_joined: student.dateJoined,  // Changed from dateJoined to date_joined
        last_login: student.lastLogin,     // Changed from lastLogin to last_login
        grade: "CBSE-9"
      };
  
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()
        .single();
  
      if (error) throw error;
      if (data) {
        set(state => ({ 
          students: [...state.students, data],
          error: null 
        }));
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateStudent: async (id: string, updates: Partial<Student>) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        students: state.students.map(student => 
          student.id === id ? { ...student, ...data } : student
        ),
        error: null
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteStudent: async (id: string) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        students: state.students.filter(student => student.id !== id),
        error: null
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedCohort: (cohort: string) => {
    set({ selectedCohort: cohort });
    get().fetchStudents();
  },

  setSelectedGrade: (grade: string) => {
    set({ selectedGrade: grade });
    get().fetchStudents();
  },
}));

export default useStudentStore;