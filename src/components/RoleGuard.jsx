// src/components/RoleGuard.js
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { hasPermission, hasAnyPermission } from '@/lib/roles';
import { AlertTriangle, Lock } from 'lucide-react';

export default function RoleGuard({ 
  children, 
  permission, 
  permissions, 
  requireAll = false,
  fallback = null,
  showFallback = true 
}) {
  const { userRole, loading } = useAuth();

  // Show loading state
  if (loading) {
    return fallback || (showFallback ? (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#39FF14]"></div>
      </div>
    ) : null);
  }

  // Check permissions
  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(userRole, permission);
  } else if (permissions) {
    if (requireAll) {
      hasAccess = permissions.every(perm => hasPermission(userRole, perm));
    } else {
      hasAccess = hasAnyPermission(userRole, permissions);
    }
  } else {
    // If no permissions specified, allow access
    hasAccess = true;
  }

  // If user has access, render children
  if (hasAccess) {
    return children;
  }

  // If fallback is provided, use it
  if (fallback) {
    return fallback;
  }

  // Show default fallback if showFallback is true
  if (showFallback) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
        <Lock className="w-5 h-5 text-red-400" />
        <div>
          <p className="text-red-300 font-medium">Access Restricted</p>
          <p className="text-red-400/80 text-sm">
            You don't have permission to access this feature.
          </p>
        </div>
      </div>
    );
  }

  // Return nothing if showFallback is false
  return null;
}

// Convenience component for admin-only content
export function AdminOnly({ children, fallback, showFallback = true }) {
  return (
    <RoleGuard 
      permissions={['create_users', 'manage_roles']} 
      fallback={fallback} 
      showFallback={showFallback}
      requireAll={false}
    >
      {children}
    </RoleGuard>
  );
}

// Convenience component for editor+ content
export function EditorOnly({ children, fallback, showFallback = true }) {
  return (
    <RoleGuard 
      permissions={['create_articles', 'edit_articles']} 
      fallback={fallback} 
      showFallback={showFallback}
      requireAll={false}
    >
      {children}
    </RoleGuard>
  );
}

// Component to show content based on role
export function RoleBasedContent({ admin, editor, viewer, fallback }) {
  const { userRole } = useAuth();

  switch (userRole) {
    case 'admin':
      return admin || fallback || null;
    case 'editor':
      return editor || fallback || null;
    case 'viewer':
      return viewer || fallback || null;
    default:
      return fallback || null;
  }
}