import React, { useEffect, useState } from 'react';
import { adminAPI } from '../api/api';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllReservations();
      setReservations(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch reservations.');
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminAPI.updateReservationStatus(id, newStatus);
      setReservations(reservations.map(res => 
        res.id === id ? { ...res, status: newStatus } : res
      ));
    } catch (err) {
      const msg = err.response?.status === 409
        ? 'Cannot confirm: table is already booked for that slot.'
        : (err.response?.data?.error || 'Failed to update reservation status.');
      alert(msg);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  const filteredReservations = filterStatus === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filterStatus);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            All Reservations
          </h2>
          <p className="text-gray-600 mt-2">Manage all restaurant reservations</p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex flex-wrap gap-2 animate-slide-up">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
              filterStatus === 'all'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow hover:shadow-md'
            }`}
          >
            All ({reservations.length})
          </button>
          <button
            onClick={() => setFilterStatus('confirmed')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
              filterStatus === 'confirmed'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow hover:shadow-md'
            }`}
          >
            Confirmed ({reservations.filter(r => r.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
              filterStatus === 'pending'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow hover:shadow-md'
            }`}
          >
            Pending ({reservations.filter(r => r.status === 'pending').length})
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading reservations...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce">📅</div>
            <p className="text-gray-600 text-lg">No reservations found.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredReservations.map((reservation, index) => (
              <div
                key={reservation.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-gray-100 animate-fade-in group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-3 flex-wrap gap-2">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Table {reservation.table_number}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        reservation.status === 'confirmed'
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {reservation.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        Guest: {reservation.user_name}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-gray-600">
                      <p><span className="font-medium">Date:</span> {formatDate(reservation.date)}</p>
                      <p><span className="font-medium">Time:</span> {formatTime(reservation.time)}</p>
                      <p><span className="font-medium">Guests:</span> {reservation.number_of_guests}</p>
                      {reservation.special_requests && (
                        <p className="text-sm italic col-span-full">
                          <span className="font-medium">Requests:</span> {reservation.special_requests}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={reservation.status}
                      onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReservations;

