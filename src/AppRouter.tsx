import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import LoginPage from './LoginPage';
import { USERS } from './data/database';
import type { User, UserRole } from './utils/types';
import { createCampus } from './api';
import DistrictDashboard from './pages/DistrictDashboard';

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
    // Admin login remains the same
    if (role === 'State Admin') {
        const user = USERS.find(u => u.name === username && u.role === role);
        if (user) {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            setCurrentUser(user);
            return true;
        }
        return false;
    }

    // API login for Campus and District users
    if (role === 'Campus Unit User') { // This handler now serves both roles
      try {

        const response = await fetch('https://portal.ssfkerala.org/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });


        if (!response.ok) return false;

        const result = await response.json();

        if (result.success && result.data) {
          let loggedInUser: User;

          // Check the role from the API response
          if (result.data.role === 'Campus') {
            loggedInUser = {
              id: result.data.campus_id,
              name: result.data.orgname,
              role: 'Campus Unit User',
              campusId: result.data.campus_id,
              district: result.data.district,
            };
          } else if (result.data.role === 'District') {
            loggedInUser = {
              id: result.data.org_id,
              name: result.data.orgname,
              role: 'District',
            };
          } else {
            return false; // Unknown role
          }
          
          sessionStorage.setItem('currentUser', JSON.stringify(loggedInUser));
          setCurrentUser(loggedInUser);
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

  const getDashboardPath = () => {
      if (!currentUser) return '/';
      switch (currentUser.role) {
          case 'Campus Unit User':
              return '/dashboard';
          case 'District':
              return '/district-dashboard';
          case 'State Admin':
              return '/dashboard'; // Or a separate admin dashboard
          default:
              return '/';
      }
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
        <Route path="/" element={!currentUser ? <LoginPage role="Campus Unit User" onLogin={handleLogin} /> : <Navigate to={getDashboardPath()} />} />
        
        <Route 
          path="/admin-login" 
          element={<LoginPage role="State Admin" onLogin={handleLogin} />} 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute user={currentUser}>
              {currentUser?.role === 'Campus Unit User' && <App user={currentUser} onLogout={handleLogout} />}
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/district-dashboard" 
          element={
            <ProtectedRoute user={currentUser}>
              {currentUser?.role === 'District' && <DistrictDashboard user={currentUser} onLogout={handleLogout} />}
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
);
}
