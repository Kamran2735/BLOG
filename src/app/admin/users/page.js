// src/app/admin/users/page.js
'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, AlertCircle, CheckCircle, Crown, User, Eye } from 'lucide-react';
import CreateUserForm from '@/components/CreateUserForm';
import RoleGuard, { AdminOnly } from '@/components/RoleGuard';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES } from '@/lib/roles';

export default function UserManagement() {
  const { userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', text: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch('/api/admin/users/role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      setMessage({ type: 'success', text: 'User role updated successfully' });
      setEditingUser(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user role:', error);
      setMessage({ type: 'error', text: 'Failed to update user role' });
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!confirm(`Are you sure you want to delete user: ${userEmail}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setMessage({ type: 'success', text: 'User deleted successfully' });
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage({ type: 'error', text: 'Failed to delete user' });
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case ROLES.EDITOR:
        return <Edit2 className="w-4 h-4 text-blue-400" />;
      case ROLES.VIEWER:
        return <Eye className="w-4 h-4 text-gray-400" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case ROLES.EDITOR:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case ROLES.VIEWER:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#39FF14]"></div>
        </div>
      </div>
    );
  }

  return (
    <AdminOnly>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#39FF14] flex items-center gap-3">
              <Users className="w-8 h-8" />
              User Management
            </h1>
            <p className="text-gray-400 mt-2">Manage user accounts and permissions</p>
          </div>
          
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-[#39FF14] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#39FF14]/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {showCreateForm ? 'Cancel' : 'Add User'}
          </button>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'error' 
              ? 'bg-red-500/10 border border-red-500/20 text-red-300' 
              : 'bg-green-500/10 border border-green-500/20 text-green-300'
          }`}>
            {message.type === 'error' ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Create User Form */}
        {showCreateForm && (
          <div className="mb-8">
            <CreateUserForm onSuccess={() => {
              setShowCreateForm(false);
              fetchUsers();
              setMessage({ type: 'success', text: 'User created successfully' });
            }} />
          </div>
        )}

        {/* Users Table */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-600">
            <h2 className="text-xl font-semibold text-white">All Users ({users.length})</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Last Sign In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {users.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-[#39FF14]/20 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-[#39FF14]" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-white">{user.email}</div>
                          <div className="text-sm text-gray-400">ID: {user.user_id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === user.user_id ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                          className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        >
                          <option value={ROLES.ADMIN}>Admin</option>
                          <option value={ROLES.EDITOR}>Editor</option>
                          <option value={ROLES.VIEWER}>Viewer</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs border ${getRoleBadgeColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        {editingUser === user.user_id ? (
                          <button
                            onClick={() => setEditingUser(null)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingUser(user.user_id)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                              title="Edit role"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.user_id, user.email)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {users.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No users found</p>
            </div>
          )}
        </div>

        {/* Role Information */}
        <div className="mt-8 bg-gray-800/50 border border-gray-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Role Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <h4 className="font-medium text-yellow-400">Admin</h4>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Full system access</li>
                <li>• Create and delete users</li>
                <li>• Manage user roles</li>
                <li>• Access all settings</li>
                <li>• Manage all content</li>
              </ul>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Edit2 className="w-5 h-5 text-blue-400" />
                <h4 className="font-medium text-blue-400">Editor</h4>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Create and edit articles</li>
                <li>• Upload and manage images</li>
                <li>• Delete own content</li>
                <li>• Access blog management</li>
                <li>• No user management</li>
              </ul>
            </div>
            
            <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-gray-400" />
                <h4 className="font-medium text-gray-400">Viewer</h4>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Read-only access</li>
                <li>• View articles and content</li>
                <li>• No editing permissions</li>
                <li>• Limited admin access</li>
                <li>• Future role for reviewers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminOnly>
  );
}