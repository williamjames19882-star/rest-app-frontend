import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HolidayPromoProvider } from './context/HolidayPromoContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HolidayPromoPopup from './components/HolidayPromoPopup';
import ScrollToTop from './components/ScrollToTop';
import FloatingCartButton from './components/FloatingCartButton';
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
      <CartProvider>
        <HolidayPromoProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-white">
              <HolidayPromoPopup />
              <Navbar />
              {/* <FloatingCartButton /> */}
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
          <Footer />
        </div>
      </Router>
      </HolidayPromoProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

