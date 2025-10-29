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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Reservations
          </h2>
          <p className="text-gray-600 mt-2">View your upcoming reservations</p>
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
        ) : reservations.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce">📅</div>
            <p className="text-gray-600 text-lg mb-4">You have no reservations yet.</p>
            <a
              href="/book-table"
              className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold"
            >
              Book a Table
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {reservations.map((reservation, index) => (
              <div
                key={reservation.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-gray-100 animate-fade-in group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Table {reservation.table_number}
                    </h3>
                    <span
                      className={`ml-3 px-3 py-1 text-xs font-semibold rounded-full ${
                        reservation.status === 'confirmed'
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
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
                    <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300">🍽️</div>
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

