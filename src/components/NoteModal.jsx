import React, { useState, useEffect } from 'react';

const NoteModal = ({ isOpen, onClose, onSave }) => {
  const [note, setNote] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxChars = 100;

  // Load note from localStorage on mount
  useEffect(() => {
    if (isOpen) {
      const savedNote = localStorage.getItem('orderNote') || '';
      setNote(savedNote);
      setCharCount(savedNote.length);
    }
  }, [isOpen]);

  const handleNoteChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setNote(value);
      setCharCount(value.length);
    }
  };

  const handleClear = () => {
    setNote('');
    setCharCount(0);
    localStorage.removeItem('orderNote');
  };

  const handleSave = () => {
    if (note.trim()) {
      localStorage.setItem('orderNote', note.trim());
    } else {
      localStorage.removeItem('orderNote');
    }
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('noteUpdated'));
    onSave(note.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-gray-100 rounded-lg shadow-xl max-w-md w-full relative" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded flex items-center justify-center hover:bg-red-700 transition-colors"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          {/* Allergy/Dietary Requirements Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                  Do you have an allergy or other dietary requirements?
                </h3>
                <p className="text-sm text-gray-700" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
                  If you have an allergy that could harm your health, we strongly advise you to contact the restaurant directly on{' '}
                  <a href="tel:01173048117" className="text-pink-600 hover:underline font-semibold">
                    0117 304 8117
                  </a>
                  {' '}before you place your order.
                </p>
              </div>
            </div>
          </div>

          {/* Note Input Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
              Please leave your note: (Max. {maxChars} characters)
            </label>
            <textarea
              value={note}
              onChange={handleNoteChange}
              placeholder="Enter your note here..."
              className="w-full px-4 py-3 border-2 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ 
                borderColor: '#60a5fa',
                fontFamily: "'Libre Baskerville', sans-serif",
                minHeight: '120px'
              }}
              rows={4}
            />
            <div className="text-right text-xs text-gray-500 mt-1" style={{ fontFamily: "'Libre Baskerville', sans-serif" }}>
              {charCount}/{maxChars}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
            >
              Clear
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              style={{ fontFamily: "'Libre Baskerville', sans-serif" }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;

