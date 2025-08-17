// src/components/CreateUserForm.js
'use client';

import { useState } from 'react';
import { UserPlus, Mail, Lock, AlertCircle, CheckCircle, Crown, Edit2, Eye } from 'lucide-react';
import { ROLES } from '@/lib/roles';

export default function CreateUserForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES.EDITOR);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const createUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      setMessage({ type: 'success', text: `User ${email} created successfully with ${role} role!` });
      setEmail('');
      setPassword('');
      setRole(ROLES.EDITOR);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (roleValue) => {
    switch (roleValue) {
      case ROLES.ADMIN:
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case ROLES.EDITOR:
        return <Edit2 className="w-4 h-4 text-blue-400" />;
      case ROLES.VIEWER:
        return <Eye className="w-4 h-4 text-gray-400" />;
      default:
        return <Edit2 className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="w-6 h-6 text-[#39FF14]" />
        <h2 className="text-xl font-semibold text-white">Create New User</h2>
      </div>

      {message.text && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          message.type === 'error' 
            ? 'bg-red-500/10 border border-red-500/20 text-red-300' 
            : 'bg-green-500/10 border border-green-500/20 text-green-300'
        }`}>
          {message.type === 'error' ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      <form onSubmit={createUser} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14]/50 focus:border-[#39FF14]/50"
              placeholder="user@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14]/50 focus:border-[#39FF14]/50"
              placeholder="Strong password"
              minLength={6}
              required
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">Minimum 6 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Role
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {getRoleIcon(role)}
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]/50 focus:border-[#39FF14]/50 appearance-none"
            >
              <option value={ROLES.EDITOR}>Editor - Content Management</option>
              <option value={ROLES.ADMIN}>Admin - Full Access</option>
              <option value={ROLES.VIEWER}>Viewer - Read Only</option>
            </select>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            {role === ROLES.ADMIN && "Full system access including user management"}
            {role === ROLES.EDITOR && "Can create and manage articles and images"}
            {role === ROLES.VIEWER && "Read-only access to content"}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#39FF14] text-black py-2 px-4 rounded-lg font-medium hover:bg-[#39FF14]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              Creating User...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Create User
            </>
          )}
        </button>
      </form>

      {/* Role Information */}
      <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Role Permissions</h3>
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Crown className="w-3 h-3 text-yellow-400" />
            <span className="text-yellow-400">Admin:</span>
            <span>Full access, user management</span>
          </div>
          <div className="flex items-center gap-2">
            <Edit2 className="w-3 h-3 text-blue-400" />
            <span className="text-blue-400">Editor:</span>
            <span>Content creation and editing</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400">Viewer:</span>
            <span>Read-only access</span>
          </div>
        </div>
      </div>
    </div>
  );
}