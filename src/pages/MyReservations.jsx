import React, { useState, useEffect } from 'react';
import { reservationsAPI } from '../api/api';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await reservationsAPI.getMyReservations();
      setReservations(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load reservations');
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-white py-4 sm:py-6" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>My Reservations</h2>
          <p className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>View your upcoming reservations</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-xs" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#ddb73c' }}></div>
            <p className="mt-3 text-xs text-gray-600" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>Loading reservations...</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="bg-gray-200 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="text-base font-bold mb-2" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>No Reservations Yet</h3>
            <p className="text-xs mb-4" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>You have no reservations yet.</p>
            <a
              href="/book-table"
              className="inline-block px-4 py-2 text-white text-xs font-semibold rounded-lg transition-all duration-300"
              style={{ backgroundColor: '#000000', fontFamily: "'Libre Baskerville', sans-serif" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
            >
              Book a Table
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-gray-200 rounded-lg overflow-hidden"
              >
                <div className="p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                          Reservation #{reservation.id}
                        </h3>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                            reservation.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : reservation.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                          style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
                        >
                          {reservation.status ? reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1) : 'Pending'}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                        {formatDate(reservation.date)} at {formatTime(reservation.time)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-200">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white rounded">
                      <span className="text-xs font-semibold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>Guests:</span>
                      <span className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>{reservation.number_of_guests}</span>
                    </div>
                    {reservation.mobile_number && (
                      <div className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-xs font-semibold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>Mobile:</span>
                        <a href={`tel:${reservation.mobile_number}`} className="text-xs" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>{reservation.mobile_number}</a>
                      </div>
                    )}
                    {reservation.email && (
                      <div className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-xs font-semibold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>Email:</span>
                        <a href={`mailto:${reservation.email}`} className="text-xs break-all" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>{reservation.email}</a>
                      </div>
                    )}
                    {reservation.special_requests && (
                      <div className="p-2 bg-white rounded">
                        <span className="text-xs font-semibold mb-1 block" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>Special Requests:</span>
                        <p className="text-xs whitespace-pre-wrap" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>{reservation.special_requests}</p>
                      </div>
                    )}
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

export default MyReservations;

