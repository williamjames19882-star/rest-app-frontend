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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">My Reservations</h2>

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
        ) : reservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-600 text-lg mb-4">You have no reservations yet.</p>
            <a
              href="/book-table"
              className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Book a Table
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Table {reservation.table_number}
                      </h3>
                      <span
                        className={`ml-3 px-2 py-1 text-xs font-semibold rounded ${
                          reservation.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </div>
                    <div className="text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Date:</span> {formatDate(reservation.date)}
                      </p>
                      <p>
                        <span className="font-medium">Time:</span> {formatTime(reservation.time)}
                      </p>
                      <p>
                        <span className="font-medium">Guests:</span> {reservation.number_of_guests}
                      </p>
                      <p>
                        <span className="font-medium">Capacity:</span> {reservation.capacity} seats
                      </p>
                      {reservation.special_requests && (
                        <p>
                          <span className="font-medium">Requests:</span> {reservation.special_requests}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl mb-2">🍽️</div>
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

