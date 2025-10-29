import React, { useState, useEffect } from 'react';
import { reservationsAPI } from '../api/api';
import { useNavigate } from 'react-router-dom';

const BookTable = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    number_of_guests: '',
    special_requests: ''
  });
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingTables, setCheckingTables] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, date: today }));
  }, []);

  useEffect(() => {
    if (formData.date && formData.time) {
      checkAvailableTables();
    }
  }, [formData.date, formData.time]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (name === 'date' || name === 'time') {
      setSelectedTable('');
      setAvailableTables([]);
    }
  };

  const checkAvailableTables = async () => {
    if (!formData.date || !formData.time) return;
    
    setCheckingTables(true);
    try {
      const response = await reservationsAPI.getAvailableTables(formData.date, formData.time);
      setAvailableTables(response.data);
    } catch (err) {
      console.error('Error checking available tables:', err);
    } finally {
      setCheckingTables(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedTable) {
      setError('Please select a table');
      return;
    }

    if (!formData.date || !formData.time || !formData.number_of_guests) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      await reservationsAPI.createReservation({
        table_id: selectedTable,
        date: formData.date,
        time: formData.time,
        number_of_guests: parseInt(formData.number_of_guests),
        special_requests: formData.special_requests
      });

      setSuccess('Table booked successfully!');
      setTimeout(() => {
        navigate('/my-reservations');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book table. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/50 animate-fade-in">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Book a Table
            </h2>
            <p className="text-gray-600 mt-2">Reserve your dining experience</p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6 animate-slide-down shadow-md">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-2 border-green-300 text-green-700 px-4 py-3 rounded-xl mb-6 animate-slide-down shadow-md flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                id="time"
                name="time"
                type="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="number_of_guests" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Guests *
              </label>
              <input
                id="number_of_guests"
                name="number_of_guests"
                type="number"
                min="1"
                required
                value={formData.number_of_guests}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="special_requests" className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests
              </label>
              <textarea
                id="special_requests"
                name="special_requests"
                rows="4"
                value={formData.special_requests}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
                placeholder="Any special requests or dietary requirements..."
              ></textarea>
            </div>

            {/* Available Tables */}
            {formData.date && formData.time && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select a Table *
                </label>
                {checkingTables ? (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-2 text-gray-600">Checking available tables...</p>
                  </div>
                ) : availableTables.length === 0 ? (
                  <p className="text-red-600">No tables available for this date and time.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableTables.map((table) => (
                      <button
                        key={table.id}
                        type="button"
                        onClick={() => setSelectedTable(table.id)}
                        className={`p-4 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                          selectedTable === table.id
                            ? 'border-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50 scale-105 shadow-lg'
                            : 'border-gray-300 hover:border-indigo-400 bg-white'
                        }`}
                      >
                        <div className="font-bold text-lg text-indigo-600">{table.table_number}</div>
                        <div className="text-sm text-gray-600 font-medium">Capacity: {table.capacity}</div>
                        <div className="text-sm text-gray-500">{table.location}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading || !selectedTable}
                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Booking...
                  </span>
                ) : 'Book Table'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookTable;

