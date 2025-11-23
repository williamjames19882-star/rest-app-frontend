import React, { useState, useEffect } from 'react';
import { reservationsAPI } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { getOpeningHours, isWithinOpeningHours, getTimeConstraints, formatOpeningHours } from '../utils/openingHours';

const BookTable = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    number_of_guests: '',
    mobile_number: '',
    email: '',
    special_requests: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeConstraints, setTimeConstraints] = useState({ min: '12:00', max: '23:59' });
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const navigate = useNavigate();

  const generateTimeSlots = (selectedDate) => {
    const hours = getOpeningHours(selectedDate);
    const slots = [];
    const [openHour, openMin] = hours.openTime.split(':').map(Number);
    const [closeHour, closeMin] = hours.closeTime.split(':').map(Number);
    
    let currentHour = openHour;
    let currentMin = openMin;
    
    while (currentHour < closeHour || (currentHour === closeHour && currentMin < closeMin)) {
      const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      slots.push(timeString);
      
      currentMin += 30;
      if (currentMin >= 60) {
        currentMin = 0;
        currentHour += 1;
      }
    }
    
    setAvailableTimeSlots(slots);
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, date: today }));
    // Set initial time constraints
    const todayDate = new Date();
    setTimeConstraints(getTimeConstraints(todayDate));
    // Generate initial time slots
    generateTimeSlots(todayDate);
  }, []);

  useEffect(() => {
    // Update time constraints when date changes
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      setTimeConstraints(getTimeConstraints(selectedDate));
      // Reset time if it's outside new opening hours
      if (formData.time && !isWithinOpeningHours(selectedDate, formData.time)) {
        setFormData(prev => ({ ...prev, time: '' }));
      }
      // Generate available time slots
      generateTimeSlots(selectedDate);
    }
  }, [formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTimeSlotClick = (time) => {
    setFormData({
      ...formData,
      time: time
    });
  };

  const getDateDisplay = (dateString) => {
    if (!dateString) return 'Select Date';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.date || !formData.time || !formData.number_of_guests || !formData.mobile_number) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate time is within opening hours
    const selectedDate = new Date(formData.date);
    if (!isWithinOpeningHours(selectedDate, formData.time)) {
      const hours = getOpeningHours(selectedDate);
      const openTime12 = formatTime12Hour(hours.openTime);
      const closeTime12 = formatTime12Hour(hours.closeTime);
      setError(`Booking time must be within opening hours: ${openTime12} - ${closeTime12}`);
      return;
    }

    setLoading(true);

    try {
      await reservationsAPI.createReservation({
        date: formData.date,
        time: formData.time,
        number_of_guests: parseInt(formData.number_of_guests),
        mobile_number: formData.mobile_number,
        email: formData.email || null,
        special_requests: formData.special_requests
      });

      setSuccess('Reservation booked successfully!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      if (err.response?.status === 409) {
        setError('No tables available for the selected date and time. Please try a different time.');
      } else {
        setError(err.response?.data?.error || 'Failed to book reservation. Please try again.');
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
            <h2 className="text-3xl font-bold" style={{ color: '#000000' }}>
              Book a Table
            </h2>
            <p className="text-gray-600 mt-2">Reserve your dining experience</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 overflow-visible">
            {/* Party, Date, Time Dropdowns */}
            <div className="grid grid-cols-3 gap-4">
              {/* Party Dropdown */}
              <div className="relative">
                <label htmlFor="number_of_guests" className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                  Party
                </label>
                <div className="relative">
                  <select
                    id="number_of_guests"
                    name="number_of_guests"
                    required
                    value={formData.number_of_guests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 pr-10"
                    style={{ borderColor: '#9ca3af', fontFamily: "'Libre Baskerville', sans-serif" }}
                  >
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date Dropdown */}
              <div className="relative">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                  Date
                </label>
                <div className="relative">
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    max={(() => {
                      const maxDate = new Date();
                      maxDate.setMonth(maxDate.getMonth() + 1);
                      return maxDate.toISOString().split('T')[0];
                    })()}
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 pr-10"
                    style={{ borderColor: '#9ca3af', fontFamily: "'Libre Baskerville', sans-serif" }}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {formData.date && (
                  <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                    {getDateDisplay(formData.date)}
                  </p>
                )}
              </div>

              {/* Time Dropdown */}
              <div className="relative">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                  Time
                </label>
                <div className="relative">
                  <input
                    id="time"
                    name="time"
                    type="time"
                    required
                    min={timeConstraints.min}
                    max={timeConstraints.max}
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 pr-10"
                    style={{ borderColor: '#9ca3af', fontFamily: "'Libre Baskerville', sans-serif" }}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Horizontal Line Separator */}
            <div className="border-t border-gray-300 my-6"></div>

            {/* Time Slots Grid */}
            {formData.date && availableTimeSlots.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                  Available Times
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {availableTimeSlots.slice(0, 9).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => handleTimeSlotClick(slot)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        formData.time === slot
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-blue-600 hover:bg-gray-50'
                      }`}
                      style={{ 
                        fontFamily: "'Libre Baskerville', sans-serif",
                        borderColor: formData.time === slot ? '#3b82f6' : '#d1d5db'
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-1">
              <div className="min-w-0">
                <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
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
                  className="w-full max-w-full min-w-0 px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: '#9ca3af', fontFamily: "'Libre Baskerville', sans-serif" }}
                />
              </div>

              <div className="min-w-0">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                  Email (Optional)
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full max-w-full min-w-0 px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: '#9ca3af', fontFamily: "'Libre Baskerville', sans-serif" }}
                />
              </div>
            </div>

            <div className="min-w-0">
              <label htmlFor="special_requests" className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                Special Requests
              </label>
              <textarea
                id="special_requests"
                name="special_requests"
                rows="4"
                value={formData.special_requests}
                onChange={handleChange}
                className="w-full max-w-full min-w-0 px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 resize-none"
                style={{ borderColor: '#9ca3af', fontFamily: "'Libre Baskerville', sans-serif" }}
                placeholder="Any special requests or dietary requirements..."
              ></textarea>
            </div>

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
                disabled={loading}
                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: '#000000' }}
                onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#1a1a1a')}
                onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#000000')}
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

// Helper function to format time for display
const formatTime12Hour = (time24) => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'pm' : 'am';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')}${period}`;
};

export default BookTable;

