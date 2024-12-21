export interface Student {
  id: string;
  name: string;
  cohort: string;
  courses: string[];
  dateJoined: string;
  lastLogin: string;
  status: 'active' | 'inactive';
  avatarUrl?: string;
}

export type NewStudent = Omit<Student, 'id'>;