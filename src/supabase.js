import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://csqoemurjipdnfvmhcjb.supabase.co';  
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzcW9lbXVyamlwZG5mdm1oY2piIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzE1OTcwMiwiZXhwIjoyMDYyNzM1NzAyfQ.LHBab9eGOjCSGHH933mvyUo7h6EX0BF4EflNHhVOW8c';  // Tu clave de API (anon pública)

export const supabase = createClient(supabaseUrl, supabaseKey);
