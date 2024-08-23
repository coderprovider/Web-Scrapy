import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://lifmnnpxuwywihnxncye.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZm1ubnB4dXd5d2lobnhuY3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNDM0NDUsImV4cCI6MjAzOTgxOTQ0NX0.CtCkaonE3WkLhJoEWXG9nOA2FmvPNh0s93IMFqlFN-8"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)