// src/lib/roles.js
import { supabase } from './supabase';

// Role definitions
export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
};

// Permissions for each role
export const PERMISSIONS = {
  [ROLES.ADMIN]: [
    'create_users',
    'delete_users',
    'manage_roles',
    'create_articles',
    'edit_articles',
    'delete_articles',
    'upload_images',
    'delete_images',
    'access_settings',
    'view_analytics'
  ],
  [ROLES.EDITOR]: [
    'create_articles',
    'edit_articles',
    'delete_articles',
    'upload_images',
    'delete_images'
  ],
  [ROLES.VIEWER]: [
    'view_articles'
  ]
};

// Check if user has specific permission
export function hasPermission(userRole, permission) {
  if (!userRole || !permission) return false;
  return PERMISSIONS[userRole]?.includes(permission) || false;
}

// Check if user has any of the specified permissions
export function hasAnyPermission(userRole, permissions) {
  if (!userRole || !permissions) return false;
  return permissions.some(permission => hasPermission(userRole, permission));
}

// Check if user has all specified permissions
export function hasAllPermissions(userRole, permissions) {
  if (!userRole || !permissions) return false;
  return permissions.every(permission => hasPermission(userRole, permission));
}

// Get user role from database with better error handling
export async function getUserRole(userId) {
  try {
    console.log('Fetching role for user:', userId);
    
    if (!userId) {
      console.log('No user ID provided, returning default role');
      return ROLES.EDITOR;
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      
      // If user doesn't exist in user_roles, try to create them
      if (error.code === 'PGRST116') { // No rows returned
        console.log('User role not found, creating default role');
        
        const { data: insertData, error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: ROLES.EDITOR
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user role:', insertError);
          return ROLES.EDITOR;
        }

        console.log('Created user role:', insertData);
        return insertData.role || ROLES.EDITOR;
      }
      
      return ROLES.EDITOR; // Default role on any error
    }

    console.log('Fetched user role:', data?.role);
    return data?.role || ROLES.EDITOR;
  } catch (error) {
    console.error('Exception in getUserRole:', error);
    return ROLES.EDITOR;
  }
}

// Set user role (admin only)
export async function setUserRole(userId, role, currentUserRole) {
  if (!hasPermission(currentUserRole, 'manage_roles')) {
    throw new Error('Insufficient permissions to manage roles');
  }

  try {
    const { data, error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: role,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select();

    if (error) {
      throw new Error(`Failed to update user role: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in setUserRole:', error);
    throw error;
  }
}

// Get all users with their roles (admin only)
export async function getAllUsersWithRoles() {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        role,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllUsersWithRoles:', error);
    throw error;
  }
}

// Role-based route access
export const ROUTE_PERMISSIONS = {
  '/admin': [], // Base admin access (any authenticated user)
  '/admin/blog': ['create_articles', 'edit_articles'],
  '/admin/images': ['upload_images'],
  '/admin/users': ['create_users', 'manage_roles'],
  '/admin/settings': ['access_settings']
};

// Check if user can access route
export function canAccessRoute(userRole, route) {
  const requiredPermissions = ROUTE_PERMISSIONS[route];
  
  // If no specific permissions required, allow access
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }
  
  // Check if user has any of the required permissions
  return hasAnyPermission(userRole, requiredPermissions);
}