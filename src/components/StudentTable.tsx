// src/components/StudentTable.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Student {
  id: string;
  name: string;
  cohort: string;
  courses: string[];
  date_joined: string;
  last_login: string;
  status: string;
  avatar_url?: string;
}

export default function StudentTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      if (data) {
        setStudents(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-4">Loading students...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  console.log(students);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cohort
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Courses
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date Joined
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Login
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-200 rounded-full">
                    {student.avatar_url && (
                      <img
                        src={student.avatar_url}
                        alt=""
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                  </div>
                  <div className="ml-4">{student.name}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{student.cohort}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  {student.courses.map((course, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
              {new Date().toLocaleDateString('en-US')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                {new Date().toLocaleString('en-US')}
                </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex rounded-full h-3 w-3 ${
                    student.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}