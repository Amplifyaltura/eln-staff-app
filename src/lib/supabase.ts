import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gyijzqablwbkaryxdmvbs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5aWp6cWFibHdia2FyeGRtdmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MzY4MDIsImV4cCI6MjA5MTUxMjgwMn0.ThjI05W-koR0b6aQwh-iMFrjL2YD-1Wn-d8g4dWmpk8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Changed back to boolean to fix build error
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
