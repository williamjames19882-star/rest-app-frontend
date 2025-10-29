import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HolidayPromoProvider } from './context/HolidayPromoContext';
import Navbar from './components/Navbar';
import HolidayPromoPopup from './components/HolidayPromoPopup';
import { routes } from './config/routes';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { token, isAdmin } = useAuth();
  if (!token) return <Navigate to="/login" />;
  return isAdmin ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <HolidayPromoProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <HolidayPromoPopup />
            <Navbar />
          <Routes>
            {/* Public routes */}
            {routes.public.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
                exact={route.exact}
              />
            ))}
            
            {/* Protected routes */}
            {routes.protected.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<PrivateRoute>{route.element}</PrivateRoute>}
              />
            ))}
            
            {/* Admin routes */}
            {routes.admin.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<AdminRoute>{route.element}</AdminRoute>}
              />
            ))}
          </Routes>
        </div>
      </Router>
      </HolidayPromoProvider>
    </AuthProvider>
  );
}

export default App;

