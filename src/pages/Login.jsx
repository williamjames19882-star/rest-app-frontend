import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { ROUTE_PATHS } from '../config/routes';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      login(response.data.token, response.data.userId, response.data.role);
      // Redirect to the page they came from (e.g., cart) or home
      const from = location.state?.from || ROUTE_PATHS.HOME;
      navigate(from);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-lg shadow-lg border-4" style={{ borderColor: '#ddb73c' }}>
        <div>
          <h2 className="text-center text-3xl font-bold mb-2" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
            Or{' '}
            <Link to="/signup" className="font-medium transition-colors duration-300" style={{ color: '#ddb73c' }} onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'} onMouseLeave={(e) => e.currentTarget.style.color = '#ddb73c'}>
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded relative" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border-2 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:z-10 sm:text-sm transition-all duration-300"
                style={{ 
                  borderColor: '#ddd',
                  fontFamily: "'Libre Baskerville', sans-serif",
                  '--tw-ring-color': '#ddb73c'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#ddb73c';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(221, 183, 60, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#ddd';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border-2 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:z-10 sm:text-sm transition-all duration-300"
                style={{ 
                  borderColor: '#ddd',
                  fontFamily: "'Libre Baskerville', sans-serif"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#ddb73c';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(221, 183, 60, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#ddd';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white focus:outline-none disabled:opacity-50 transition-all duration-300"
              style={{ 
                backgroundColor: '#000000',
                fontFamily: "'Libre Baskerville', sans-serif"
              }}
              onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#1a1a1a')}
              onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#000000')}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

