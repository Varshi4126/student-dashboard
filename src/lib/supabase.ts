// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Student } from '@/types/student';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Student>(supabaseUrl, supabaseKey);