import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import type { UserRole } from './utils/types';
import profSummitP from '/assets/profsummitP.png';


interface LoginPageProps {
  role: UserRole;
  // UPDATED: The onLogin function can now be async (return a Promise)
  onLogin: (username: string, password: string, role: UserRole) => Promise<boolean> | boolean;
}

const UserIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const LockIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
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


  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="flex flex-col items-center space-y-2">
            <div className="bg-indigo-100 p-3 rounded-full">
                {/* <LogoIcon className="w-10 h-10 text-indigo-600" /> */}
                <img src={profSummitP} className="w-10 h-10 text-indigo-600" alt="Logo" />
                  <img src="" alt="" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                {role} Login
            </h1>
            <p className="text-slate-500 text-center">Enter your credentials to access the dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="p-3 text-sm font-medium text-center text-red-800 bg-red-100 rounded-lg">{error}</p>}
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 sr-only">
              Username
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="w-5 h-5 text-slate-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 sr-only">
              Password
            </label>
            <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="w-5 h-5 text-slate-400" />
                </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
