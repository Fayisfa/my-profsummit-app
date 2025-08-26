import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import type { UserRole } from './utils/types';

interface LoginPageProps {
  role: UserRole;
  // UPDATED: The onLogin function can now be async (return a Promise)
  onLogin: (username: string, password: string, role: UserRole) => Promise<boolean> | boolean;
}

// --- MOCK ICON ---
const ArrowLeftIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

export default function LoginPage({ role, onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // UPDATED: handleSubmit is now async to await the API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Pass the password to the login handler
    const success = await onLogin(username, password, role);
    
    setIsLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const placeholderUsername = role === 'State Admin' ? 'Super Admin' : 'MAVE1044';

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans">
      <div className="relative w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <a href="/" className="absolute top-4 left-4 text-slate-500 hover:text-slate-800">
           <ArrowLeftIcon className="w-6 h-6" />
        </a>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            {role} Login
          </h1>
          <p className="mt-2 text-slate-500">Enter your credentials to access the dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="p-3 text-sm font-medium text-center text-red-800 bg-red-100 rounded-lg">{error}</p>}
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700">
              Username
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={`e.g., "${placeholderUsername}"`}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={role === 'Campus Unit User' ? 'e.g., "SPHVMY"' : '••••••••'}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
