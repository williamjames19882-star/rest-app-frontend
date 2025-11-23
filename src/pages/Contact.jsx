import React, { useState } from 'react';
import { contactAPI } from '../api/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await contactAPI.submitRequest(formData);
      setSuccess('Your request has been submitted successfully! We will get back to you soon.');
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Find Us Section with Border */}
          <div className="border-2 rounded-2xl p-6 sm:p-8" style={{ borderColor: '#d4af37' }}>
            {/* Find Us Heading */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                Find Us
              </h1>
            </div>

            {/* Google Maps Embed */}
            <div className="mb-6 sm:mb-8">
              <a
                href="https://www.google.com/maps/search/?api=1&query=195-197+Newfoundland+Road+BS2+9NY+Bristol+UK"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl overflow-hidden border-2 hover:opacity-90 transition-opacity cursor-pointer relative"
                style={{ borderColor: '#d4af37' }}
                aria-label="Open location in Google Maps"
              >
                <div className="absolute inset-0 z-10" aria-hidden="true"></div>
                <iframe
                  src="https://www.google.com/maps?q=195-197+Newfoundland+Road+BS2+9NY+Bristol+UK&output=embed"
                  width="100%"
                  height="300"
                  style={{ border: 0, pointerEvents: 'none' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Restaurant Location"
                ></iframe>
              </a>
            </div>

            {/* Address and Contact Info Sections */}
            <div className="space-y-4 sm:space-y-6">
              {/* Address Section */}
              <div className="bg-white p-5 sm:p-6 border-2 rounded-2xl" style={{ borderColor: '#d4af37' }}>
                <h3 className="text-lg sm:text-xl font-bold mb-3" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                  Address
                </h3>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#555', fontFamily: "'Libre Baskerville', sans-serif" }}>
                  195-197 Newfoundland Road<br />
                  Bristol<br />
                  BS2 9NY
                </p>
              </div>

              {/* Call Now and Email Us Section */}
              <div className="bg-white p-5 sm:p-6 border-2 rounded-2xl" style={{ borderColor: '#d4af37' }}>
                <h3 className="text-lg sm:text-xl font-bold mb-3" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                  Call Now
                </h3>
                <a
                  href="tel:01173048117"
                  className="flex items-center gap-2 text-base sm:text-lg hover:opacity-80 transition-opacity mb-5"
                  style={{ color: '#2563eb', fontFamily: "'Libre Baskerville', sans-serif" }}
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="underline">0117 304 8117</span>
                </a>
                
                <h3 className="text-lg sm:text-xl font-bold mb-3" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
                  Email Us
                </h3>
                <a
                  href="mailto:kashmir.rjb@gmail.com"
                  className="flex items-center gap-2 text-base sm:text-lg hover:opacity-80 transition-opacity break-all"
                  style={{ color: '#2563eb', fontFamily: "'Libre Baskerville', sans-serif" }}
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="underline">kashmir.rjb@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 animate-fade-in border-2" style={{ borderColor: '#d4af37' }}>
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: '#2C3E50', fontFamily: "'Libre Baskerville', sans-serif" }}>
              Contact Us
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up-delay" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#555' }}>
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                style={{ borderColor: '#d1d5db', fontFamily: "'Libre Baskerville', sans-serif" }}
                placeholder="Your Name"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: '#555' }}>
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                style={{ borderColor: '#d1d5db', fontFamily: "'Libre Baskerville', sans-serif" }}
                placeholder="Your Phone"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#555' }}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                style={{ borderColor: '#d1d5db', fontFamily: "'Libre Baskerville', sans-serif" }}
                placeholder="Your Email"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: '#555' }}>
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                style={{ borderColor: '#d1d5db', fontFamily: "'Libre Baskerville', sans-serif" }}
                placeholder="Subject"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: '#555' }}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="6"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 resize-y"
                style={{ borderColor: '#d1d5db', fontFamily: "'Libre Baskerville', sans-serif" }}
                placeholder="Your Message"
              ></textarea>
            </div>

            {/* Error and Success Messages near button */}
            {error && (
              <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg animate-slide-down shadow-md flex items-center gap-2">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-2 border-green-300 text-green-700 px-4 py-3 rounded-lg animate-slide-down shadow-md flex items-center gap-2">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="py-3 px-8 rounded-lg text-base font-semibold text-white focus:outline-none disabled:opacity-50 transition-all duration-300 hover:opacity-90"
                style={{ backgroundColor: '#d4af37' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : 'Submit'}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

