// src/app/api/admin/users/role/route.js

import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';


export async function PUT(request) {
  try {
    const currentUser = await verifyAdminAccess();
    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'User ID and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['admin', 'editor', 'viewer'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Admin client not configured' },
        { status: 500 }
      );
    }

    // Update user role
    const { data, error } = await supabaseAdmin
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: role,
        updated_at: new Date().toISOString(),
        created_by: currentUser.id
      }, {
        onConflict: 'user_id'
      })
      .select();

    if (error) {
      throw new Error(`Failed to update role: ${error.message}`);
    }

    return NextResponse.json({ 
      message: 'Role updated successfully',
      data 
    });

  } catch (error) {
    console.error('Update role error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message === 'Not authenticated' ? 401 : 403 }
    );
  }
}
