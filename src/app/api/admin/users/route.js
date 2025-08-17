// src/app/api/admin/users/route.js
import { supabaseAdmin, supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

async function verifyAdminAccess() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  // Check if user has admin role
  const { data: roleData, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .single();

  if (error || roleData?.role !== 'admin') {
    throw new Error('Insufficient permissions');
  }

  return session.user;
}

export async function GET() {
  try {
    await verifyAdminAccess();

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Admin client not configured' },
        { status: 500 }
      );
    }

    // Get all user roles
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (roleError) {
      throw new Error(`Failed to fetch user roles: ${roleError.message}`);
    }

    // Get user details from auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      throw new Error(`Failed to fetch auth users: ${authError.message}`);
    }

    // Combine role data with auth data
    const users = roleData.map(role => {
      const authUser = authData.users.find(user => user.id === role.user_id);
      return {
        user_id: role.user_id,
        role: role.role,
        created_at: authUser?.created_at || role.created_at,
        updated_at: role.updated_at,
        email: authUser?.email,
        last_sign_in_at: authUser?.last_sign_in_at,
        email_confirmed_at: authUser?.email_confirmed_at
      };
    });

    return NextResponse.json(users);

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message === 'Not authenticated' ? 401 : 403 }
    );
  }
}


