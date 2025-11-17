import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { ROUTE_PATHS } from '../config/routes';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      setError('You do not have admin access');
      return;
    }

    fetchStats();
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStats();
      setStats(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load statistics');
      console.error('Stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold" style={{ color: '#122d4b' }}>
            Admin Dashboard
          </h2>
          <p className="text-gray-600 mt-2">Manage your restaurant operations</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#122d4b' }}></div>
            <p className="mt-4 text-gray-600">Loading statistics...</p>
          </div>
        ) : stats && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group border-2 border-blue-100">
                <div className="flex items-center">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl transform group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0-16h3v1a6 6 0 00-9 5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{stats.users}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group border-2 border-green-100">
                <div className="flex items-center">
                  <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl transform group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-600">Reservations</h3>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.reservations}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group border-2 border-yellow-100">
                <div className="flex items-center">
                  <div className="p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl transform group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-600">Menu Items</h3>
                    <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{stats.menuItems}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group border-2 border-purple-100">
                <div className="flex items-center">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl transform group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-600">Contact Requests</h3>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.newContactRequests || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/50 animate-fade-in">
              <h3 className="text-xl font-bold mb-6" style={{ color: '#122d4b' }}>Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Link 
                  to={ROUTE_PATHS.ADMIN_RESERVATIONS}
                  className="p-6 border-2 border-gray-300 rounded-2xl transition-all duration-300 text-center transform hover:scale-105 hover:shadow-lg group bg-gradient-to-br from-gray-50 to-white"
                  style={{ borderColor: 'inherit' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#122d4b'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                >
                  <div className="text-5xl mb-3 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">📅</div>
                  <h4 className="font-bold text-gray-900">Reservations</h4>
                  <p className="text-sm text-gray-600">Manage bookings</p>
                </Link>
                <Link 
                  to={ROUTE_PATHS.ADMIN_MENU}
                  className="p-6 border-2 border-gray-300 rounded-2xl transition-all duration-300 text-center transform hover:scale-105 hover:shadow-lg group bg-gradient-to-br from-gray-50 to-white"
                  style={{ borderColor: 'inherit' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#122d4b'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                >
                  <div className="text-5xl mb-3 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">🍽️</div>
                  <h4 className="font-bold text-gray-900">Manage Menu</h4>
                  <p className="text-sm text-gray-600">Add/edit items</p>
                </Link>
                <Link 
                  to={ROUTE_PATHS.ADMIN_CONTACT_REQUESTS}
                  className="p-6 border-2 border-gray-300 rounded-2xl transition-all duration-300 text-center transform hover:scale-105 hover:shadow-lg group bg-gradient-to-br from-gray-50 to-white"
                  style={{ borderColor: 'inherit' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#122d4b'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                >
                  <div className="text-5xl mb-3 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">📧</div>
                  <h4 className="font-bold text-gray-900">Contact</h4>
                  <p className="text-sm text-gray-600">View requests</p>
                </Link>
                <Link 
                  to={ROUTE_PATHS.ADMIN_USERS}
                  className="p-6 border-2 border-gray-300 rounded-2xl transition-all duration-300 text-center transform hover:scale-105 hover:shadow-lg group bg-gradient-to-br from-gray-50 to-white"
                  style={{ borderColor: 'inherit' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#122d4b'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                >
                  <div className="text-5xl mb-3 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">👥</div>
                  <h4 className="font-bold text-gray-900">Users</h4>
                  <p className="text-sm text-gray-600">User management</p>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

