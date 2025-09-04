import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import LoginPage from './LoginPage';
import { USERS } from './data/database';
import type { User, UserRole } from './utils/types';
import { createCampus, getCampuses } from './api';
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



export default function AppRouter() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = async (username: string, password: string, role: UserRole) => {
    // Admin login remains the same
    if (role === 'State Admin') {
      try {
        const response = await fetch('https://mediumaquamarine-eel-107102.hostingersite.com/app/admin_login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (result.success && result.data) {
          const loggedInUser: User = {
            id: result.data.id,
            name: result.data.name,
            role: result.data.role,
          };
          sessionStorage.setItem('currentUser', JSON.stringify(loggedInUser));
          setCurrentUser(loggedInUser);
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error("Admin login error:", error);
        return false;
      }
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
             const existingCampuses = await getCampuses();

              const campusExists = existingCampuses.some(
              (campus: any) => campus.campus_id === result.data.campus_id
            );

             if (!campusExists) {
              console.log(`Campus '${result.data.orgname}' not found in DB. Creating it now.`);
              const createResponse = await createCampus({
                campus_id: result.data.campus_id,
                campus_name: result.data.orgname,
                district: result.data.district,
              });

              if (!createResponse.success) {
                 // Handle error if campus creation fails, maybe show an alert
                 console.error("Failed to auto-create campus:", createResponse.error);
                 return false; // Stop the login process if creation fails
              }
            }
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
              {/* --- THIS IS THE FIX --- */}
              {/* Allow rendering if the role is EITHER 'Campus Unit User' OR 'State Admin' */}
              {(currentUser?.role === 'Campus Unit User' || currentUser?.role === 'State Admin') && (
                <App user={currentUser} onLogout={handleLogout} />
              )}
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
