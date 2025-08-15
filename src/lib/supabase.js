// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Add some debugging
console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing')
console.log('Anon Key:', supabaseAnonKey ? 'Set' : 'Missing')
console.log('Service Key:', supabaseServiceKey ? 'Set' : 'Missing')

// Client for public operations (uses RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for bypassing RLS (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Test function to verify admin access
export async function testAdminAccess() {
  try {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('count(*)')
      .single()
    
    console.log('Admin access test:', { data, error })
    return { success: !error, error }
  } catch (err) {
    console.error('Admin access error:', err)
    return { success: false, error: err.message }
  }
}