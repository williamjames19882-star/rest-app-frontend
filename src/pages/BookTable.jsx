import React, { useState, useEffect } from 'react';
import { reservationsAPI } from '../api/api';
import { useNavigate } from 'react-router-dom';

const BookTable = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    number_of_guests: '',
    mobile_number: '',
    email: '',
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

    if (!formData.date || !formData.time || !formData.number_of_guests || !formData.mobile_number) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Final availability check before booking
      try {
        const latest = await reservationsAPI.getAvailableTables(formData.date, formData.time);
        const stillAvailable = (latest.data || []).some(t => t.id === selectedTable);
        if (!stillAvailable) {
          setError('Selected table is no longer available. Please choose another table.');
          setLoading(false);
          return;
        }
      } catch (_) {
        // If the availability check fails, continue to server which will enforce
      }

      await reservationsAPI.createReservation({
        table_id: selectedTable,
        date: formData.date,
        time: formData.time,
        number_of_guests: parseInt(formData.number_of_guests),
        mobile_number: formData.mobile_number,
        email: formData.email || null,
        special_requests: formData.special_requests
      });

      setSuccess('Table booked successfully!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      if (err.response?.status === 409) {
        setError('This table is already booked for the selected date and time.');
      } else {
        setError(err.response?.data?.error || 'Failed to book table. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/50 animate-fade-in">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold" style={{ color: '#122d4b' }}>
              Book a Table
            </h2>
            <p className="text-gray-600 mt-2">Reserve your dining experience</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 overflow-visible">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-1">
              <div className="min-w-0">
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
                  className="w-full max-w-full min-w-0 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                />
              </div>

              <div className="min-w-0">
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
                  className="w-full max-w-full min-w-0 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-1">
              <div className="min-w-0">
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
                  className="w-full max-w-full min-w-0 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                />
              </div>

              <div className="min-w-0">
                <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  id="mobile_number"
                  name="mobile_number"
                  type="tel"
                  required
                  value={formData.mobile_number}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  className="w-full max-w-full min-w-0 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                />
              </div>
            </div>

            <div className="min-w-0">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email (Optional)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full max-w-full min-w-0 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              />
            </div>

            <div className="min-w-0">
              <label htmlFor="special_requests" className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests
              </label>
              <textarea
                id="special_requests"
                name="special_requests"
                rows="4"
                value={formData.special_requests}
                onChange={handleChange}
                className="w-full max-w-full min-w-0 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 resize-none"
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
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#122d4b' }}></div>
                    <p className="mt-2 text-gray-600">Checking available tables...</p>
                  </div>
                ) : availableTables.length === 0 ? (
                  <p className="text-red-600">No tables available for this date and time.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-1">
                    {availableTables.map((table) => (
                      <button
                        key={table.id}
                        type="button"
                        onClick={() => setSelectedTable(table.id)}
                        className={`p-4 border-2 rounded-xl transition-all duration-300 transform sm:hover:scale-105 sm:hover:shadow-lg ${
                          selectedTable === table.id
                            ? 'sm:scale-105 shadow-lg'
                            : 'border-gray-300 bg-white'
                        }`}
                        style={selectedTable === table.id ? { borderColor: '#122d4b', backgroundColor: '#f0f4f8' } : {}}
                        onMouseEnter={(e) => selectedTable !== table.id && (e.currentTarget.style.borderColor = '#122d4b')}
                        onMouseLeave={(e) => selectedTable !== table.id && (e.currentTarget.style.borderColor = '#d1d5db')}
                      >
                        <div className="font-bold text-lg" style={{ color: selectedTable === table.id ? '#122d4b' : '#122d4b' }}>{table.table_number}</div>
                        <div className="text-sm text-gray-600 font-medium">Capacity: {table.capacity}</div>
                        <div className="text-sm text-gray-500">{table.location}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Error and Success Messages near button */}
            {error && (
              <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl animate-slide-down shadow-md flex items-center gap-2">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-2 border-green-300 text-green-700 px-4 py-3 rounded-xl animate-slide-down shadow-md flex items-center gap-2">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading || !selectedTable}
                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: '#122d4b' }}
                onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#1a3a5f')}
                onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#122d4b')}
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

