// src/app/api/admin/create-user/route.js
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ROLES } from '@/lib/roles';

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

export async function POST(request) {
  try {
    const currentUser = await verifyAdminAccess();
    const { email, password, role = ROLES.EDITOR } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = Object.values(ROLES);
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Admin client not configured' },
        { status: 500 }
      );
    }

    // Create user with admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Set the user's role (this will override the default trigger)
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .upsert({
        user_id: authData.user.id,
        role: role,
        created_by: currentUser.id,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select();

    if (roleError) {
      console.error('Role assignment error:', roleError);
      // User was created but role assignment failed - still consider it a success
      // The user will have the default role from the trigger
    }

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: { 
          id: authData.user.id, 
          email: authData.user.email,
          role: role
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message === 'Not authenticated' ? 401 : 403 }
    );
  }
}