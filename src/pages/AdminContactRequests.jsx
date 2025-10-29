import React, { useEffect, useState } from 'react';
import { adminAPI } from '../api/api';

const AdminContactRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllContactRequests();
      setRequests(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch contact requests.');
      console.error('Error fetching contact requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminAPI.updateContactRequestStatus(id, newStatus);
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: newStatus } : req
      ));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRequests = filterStatus === 'all' 
    ? requests 
    : requests.filter(r => r.status === filterStatus);

  const getStatusColor = (status) => {
    switch(status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Contact Requests
          </h2>
          <p className="text-gray-600 mt-2">View and manage customer inquiries</p>
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
            All ({requests.length})
          </button>
          <button
            onClick={() => setFilterStatus('new')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
              filterStatus === 'new'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow hover:shadow-md'
            }`}
          >
            New ({requests.filter(r => r.status === 'new').length})
          </button>
          <button
            onClick={() => setFilterStatus('read')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
              filterStatus === 'read'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow hover:shadow-md'
            }`}
          >
            Read ({requests.filter(r => r.status === 'read').length})
          </button>
          <button
            onClick={() => setFilterStatus('responded')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
              filterStatus === 'responded'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow hover:shadow-md'
            }`}
          >
            Responded ({requests.filter(r => r.status === 'responded').length})
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
            <p className="mt-4 text-gray-600">Loading requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce">📭</div>
            <p className="text-gray-600 text-lg">No contact requests found.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredRequests.map((request, index) => (
              <div
                key={request.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-gray-100 animate-fade-in group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-3 flex-wrap gap-2">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {request.name}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-600">
                      <p><span className="font-medium">Phone:</span> {request.phone}</p>
                      {request.email && (
                        <p><span className="font-medium">Email:</span> {request.email}</p>
                      )}
                      {request.message && (
                        <p className="col-span-full text-sm italic border-l-2 border-indigo-500 pl-3 mt-2">
                          <span className="font-medium">Message:</span> {request.message}
                        </p>
                      )}
                      <p className="col-span-full text-xs text-gray-500">
                        Submitted: {formatDate(request.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={request.status}
                      onChange={(e) => handleStatusChange(request.id, e.target.value)}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="responded">Responded</option>
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

export default AdminContactRequests;

