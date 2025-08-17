// middleware.js (in your project root)
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

// Route permissions mapping
const ROUTE_PERMISSIONS = {
  '/admin/users': ['create_users', 'manage_roles'],
  '/admin/settings': ['access_settings'],
  '/admin/blog': ['create_articles', 'edit_articles'],
  '/admin/images': ['upload_images']
};

// Role permissions mapping
const PERMISSIONS = {
  admin: [
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
  editor: [
    'create_articles',
    'edit_articles',
    'delete_articles',
    'upload_images',
    'delete_images'
  ],
  viewer: [
    'view_articles'
  ]
};

function hasPermission(userRole, permission) {
  if (!userRole || !permission) return false;
  return PERMISSIONS[userRole]?.includes(permission) || false;
}

function hasAnyPermission(userRole, permissions) {
  if (!userRole || !permissions) return false;
  return permissions.some(permission => hasPermission(userRole, permission));
}

async function getUserRole(supabase, userId) {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return 'editor'; // Default role
    }

    return data?.role || 'editor';
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return 'editor';
  }
}

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Check if the request is for admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (req.nextUrl.pathname === '/admin/login') {
      return res;
    }

    // Check authentication for other admin routes
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Redirect to login if not authenticated
    if (!session) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/admin/login';
      return NextResponse.redirect(redirectUrl);
    }

    // Get user role
    const userRole = await getUserRole(supabase, session.user.id);

    // Check route-specific permissions
    const currentPath = req.nextUrl.pathname;
    const requiredPermissions = ROUTE_PERMISSIONS[currentPath];

    if (requiredPermissions) {
      const hasAccess = hasAnyPermission(userRole, requiredPermissions);
      
      if (!hasAccess) {
        // Redirect to admin dashboard with error
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/admin';
        redirectUrl.searchParams.set('error', 'insufficient_permissions');
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Add user role to response headers for client-side access
    res.headers.set('x-user-role', userRole);
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*']
};