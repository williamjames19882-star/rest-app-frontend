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
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#dc2626', fontFamily: "'Libre Baskerville', sans-serif" }}>Access Denied</h2>
          <p className="text-sm" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>You need admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-4 sm:py-6" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>Admin Dashboard</h2>
          <p className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>Manage your restaurant operations</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-xs" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#ddb73c' }}></div>
            <p className="mt-3 text-xs text-gray-600" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>Loading statistics...</p>
          </div>
        ) : stats && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-200 rounded-lg p-4 border-2" style={{ borderColor: '#ddb73c' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-medium mb-1" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>Total Users</h3>
                    <p className="text-2xl font-bold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>{stats.users}</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#000000' }}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0-16h3v1a6 6 0 00-9 5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gray-200 rounded-lg p-6 border-2" style={{ borderColor: '#ddb73c' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-medium mb-1" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>Reservations</h3>
                    <p className="text-2xl font-bold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>{stats.reservations}</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#000000' }}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gray-200 rounded-lg p-4 border-2" style={{ borderColor: '#ddb73c' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-medium mb-1" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>Menu Items</h3>
                    <p className="text-2xl font-bold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>{stats.menuItems}</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#000000' }}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gray-200 rounded-lg p-4 border-2" style={{ borderColor: '#ddb73c' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-medium mb-1" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>Contact Requests</h3>
                    <p className="text-2xl font-bold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>{stats.newContactRequests || 0}</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#000000' }}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-200 rounded-lg p-4">
              <h3 className="text-base font-bold mb-3" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link 
                  to={ROUTE_PATHS.ADMIN_RESERVATIONS}
                  className="p-4 border-2 rounded-lg transition-all duration-300 text-center bg-white"
                  style={{ borderColor: '#ddb73c', fontFamily: "'Libre Baskerville', sans-serif" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d4af37'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddb73c'}
                >
                  <div className="text-3xl mb-2">📅</div>
                  <h4 className="text-sm font-bold mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>Reservations</h4>
                  <p className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>Manage bookings</p>
                </Link>
                <Link 
                  to={ROUTE_PATHS.ADMIN_MENU}
                  className="p-4 border-2 rounded-lg transition-all duration-300 text-center bg-white"
                  style={{ borderColor: '#ddb73c', fontFamily: "'Libre Baskerville', sans-serif" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d4af37'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddb73c'}
                >
                  <div className="text-3xl mb-2">🍽️</div>
                  <h4 className="text-sm font-bold mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>Manage Menu</h4>
                  <p className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>Add/edit items</p>
                </Link>
                <Link 
                  to={ROUTE_PATHS.ADMIN_TRANSACTIONS}
                  className="p-4 border-2 rounded-lg transition-all duration-300 text-center bg-white"
                  style={{ borderColor: '#ddb73c', fontFamily: "'Libre Baskerville', sans-serif" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d4af37'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddb73c'}
                >
                  <div className="text-3xl mb-2">💰</div>
                  <h4 className="text-sm font-bold mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>Transactions</h4>
                  <p className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>View orders</p>
                </Link>
                <Link 
                  to={ROUTE_PATHS.ADMIN_CONTACT_REQUESTS}
                  className="p-4 border-2 rounded-lg transition-all duration-300 text-center bg-white"
                  style={{ borderColor: '#ddb73c', fontFamily: "'Libre Baskerville', sans-serif" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d4af37'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddb73c'}
                >
                  <div className="text-3xl mb-2">📧</div>
                  <h4 className="text-sm font-bold mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>Contact</h4>
                  <p className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>View requests</p>
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

