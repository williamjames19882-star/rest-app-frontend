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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Book a Table
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              {success}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  <div className="grid grid-cols-3 gap-3">
                    {availableTables.map((table) => (
                      <button
                        key={table.id}
                        type="button"
                        onClick={() => setSelectedTable(table.id)}
                        className={`p-4 border-2 rounded-lg transition ${
                          selectedTable === table.id
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-300 hover:border-indigo-300'
                        }`}
                      >
                        <div className="font-semibold">{table.table_number}</div>
                        <div className="text-sm text-gray-600">Capacity: {table.capacity}</div>
                        <div className="text-sm text-gray-600">{table.location}</div>
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
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Booking...' : 'Book Table'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookTable;

