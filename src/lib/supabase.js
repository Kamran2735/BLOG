// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validation and error handling
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Client for public operations (uses RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Admin client for bypassing RLS (server-side only)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Test function to verify admin access
export async function testAdminAccess() {
  if (!supabaseAdmin) {
    console.warn('Admin client not available - missing SUPABASE_SERVICE_ROLE_KEY')
    return { success: false, error: 'Admin client not configured' }
  }
  
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