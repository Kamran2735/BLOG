// src/components/CreateUserForm.js
'use client';

import { useState } from 'react';
import { supabaseAdmin } from '@/lib/supabase';
import { UserPlus, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function CreateUserForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const createUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (!supabaseAdmin) {
        throw new Error('Admin client not configured. Need SUPABASE_SERVICE_ROLE_KEY');
      }

      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Skip email confirmation
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'success', text: `User ${email} created successfully!` });
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="w-6 h-6 text-[#39FF14]" />
        <h2 className="text-xl font-semibold text-white">Create Admin User</h2>
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
              placeholder="admin@example.com"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#39FF14] text-black py-2 px-4 rounded-lg font-medium hover:bg-[#39FF14]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating User...' : 'Create User'}
        </button>
      </form>
    </div>
  );
}