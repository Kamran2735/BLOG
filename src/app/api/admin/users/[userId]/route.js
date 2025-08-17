// src/app/api/admin/users/[userId]/route.js  

import { supabaseAdmin} from '@/lib/supabase';
import { NextResponse } from 'next/server';


export async function DELETE(request, { params }) {
  try {
    const currentUser = await verifyAdminAccess();
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Prevent self-deletion
    if (userId === currentUser.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Admin client not configured' },
        { status: 500 }
      );
    }

    // Delete user from auth (this will cascade to user_roles due to foreign key)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }

    return NextResponse.json({ 
      message: 'User deleted successfully' 
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: error.message === 'Not authenticated' ? 401 : 403 }
    );
  }
}