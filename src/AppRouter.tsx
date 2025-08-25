import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import LoginPage from './LoginPage';
import { USERS } from './database';
import type { User, UserRole } from './types';
import { createCampus } from './api';

// --- A component to protect routes that require authentication ---
interface ProtectedRouteProps {
  user: User | null;
  children: React.ReactNode;
}
const ProtectedRoute = ({ user, children }: ProtectedRouteProps) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// --- A simple component to let the user select their role ---
const RoleSelection = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-100">
    <div className="p-10 bg-white rounded-2xl shadow-xl text-center">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome</h1>
      <p className="text-slate-500 mb-8">Please select your login type to continue.</p>
      <div className="flex flex-col gap-4">
        <a href="/admin-login" className="block w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors text-center">
          State Admin Login
        </a>
        <a href="/campus-login" className="block w-full px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors text-center">
          Campus User Login
        </a>
      </div>
    </div>
  </div>
);

export default function AppRouter() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = async (username: string, password: string, role: UserRole) => {
    // 1. Keep the original mock login for Admins
    if (role === 'State Admin') {
      const user = USERS.find(u => u.name === username && u.role === role);
      if (user) {
        // --- CHANGE #1: SAVE ADMIN TO SESSION STORAGE ---
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        return true;
      }
      return false;
    }

    // 2. Implement API login for Campus Unit Users
    if (role === 'Campus Unit User') {
      try {
        const response = await fetch('https://portal.ssfkerala.org/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          console.error('API Error:', response.status, response.statusText);
          return false;
        }

        const result = await response.json();
        console.log(result)

        if (result.success && result.data) {
          const loggedInUser: User = {
            id: result.data.campus_id,
            name: result.data.orgname,
            role: 'Campus Unit User',
            campusId: result.data.campus_id,
          };

          await createCampus({
            campus_id: result.data.campus_id,
            campus_name: result.data.orgname,
            district: result.data.district,
          });
          // --- CHANGE #2: SAVE CAMPUS USER TO SESSION STORAGE ---
          sessionStorage.setItem('currentUser', JSON.stringify(loggedInUser));
          setCurrentUser(loggedInUser);
          console.log("Authentication Token:", result.data.token);
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
        return false;
      }
    }
    
    return false;
  };

  const handleLogout = () => {
    // --- CHANGE #3: REMOVE USER FROM SESSION STORAGE ---
    sessionStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  // return (
  //   <BrowserRouter>
  //     <Routes>
  //       <Route path="/" element={!currentUser ? <RoleSelection /> : <Navigate to="/dashboard" />} />
        
  //       <Route 
  //         path="/admin-login" 
  //         element={<LoginPage role="State Admin" onLogin={handleLogin} />} 
  //       />
  //       <Route 
  //         path="/campus-login" 
  //         element={<LoginPage role="Campus Unit User" onLogin={handleLogin} />} 
  //       />
        
  //       <Route 
  //         path="/dashboard" 
  //         element={
  //           <ProtectedRoute user={currentUser}>
  //             <App user={currentUser!} onLogout={handleLogout} />
  //           </ProtectedRoute>
  //         } 
  //       />
  //     </Routes>
  //   </BrowserRouter>
  // );
  return (
  <BrowserRouter>
    <Routes>
      {/* Redirect root path to the campus login page */}
      <Route path="/" element={<Navigate to="/campus-login" replace />} />
      
      {/* Separate, explicit route for admin login */}
      <Route 
        path="/admin-login" 
        element={<LoginPage role="State Admin" onLogin={handleLogin} />} 
      />
      
      {/* Separate, explicit route for campus login */}
      <Route 
        path="/campus-login" 
        element={<LoginPage role="Campus Unit User" onLogin={handleLogin} />} 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute user={currentUser}>
            <App user={currentUser!} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
    </Routes>
  </BrowserRouter>
);
}
