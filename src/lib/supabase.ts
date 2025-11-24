import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bwhjvxiuemwbtwqgzpfh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3aGp2eGl1ZW13YnR3cWd6cGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTUwNzgsImV4cCI6MjA3OTU3MTA3OH0.CGeEa2phIW2j9upjTwSLTLc87tNv1pzpGLR5AsDEYmU'

export const supabase = createClient(supabaseUrl, supabaseKey)
