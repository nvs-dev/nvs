
import React, { useState } from 'react';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified auth for demonstration
    if (username === 'admin' && password === 'admin') {
      onLogin({ id: '1', username: 'Administrator', role: 'Admin' });
    } else if (username === 'agent' && password === 'agent') {
      onLogin({ id: '2', username: 'Agent 47', role: 'Agent' });
    } else {
      setError('Invalid credentials. Use admin/admin or agent/agent');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-600">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04m17.236 0a11.959 11.959 0 01-2.251 5.756m-5.86 5.86L12 21l-3.127-3.127m0 0L5.993 14.866m-3.61-3.61A11.959 11.959 0 013.382 5.484" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Crimson RMS</h2>
          <p className="mt-2 text-sm text-slate-600">Secure Law Enforcement Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700">Username</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <p className="text-center text-xs text-slate-500">
            Authorized Personnel Only. All activities are monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
