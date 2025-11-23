import React, { useEffect, useState } from 'react';
import { adminAPI } from '../api/api';
import Pagination from '../components/Pagination';

const AdminContactRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 25,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchRequests();
  }, [pagination.page, pagination.pageSize]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllContactRequests({
        page: pagination.page,
        pageSize: pagination.pageSize,
      });
      setRequests(response.data.data || []);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination,
      }));
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch contact requests.');
      console.error('Error fetching contact requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminAPI.updateContactRequestStatus(id, newStatus);
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: newStatus } : req
      ));
      // Update selected request if modal is open
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, status: newStatus });
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status.');
    }
  };

  const handleRequestClick = async (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
    
    // Automatically change status to "read" if it's "new"
    if (request.status === 'new') {
      try {
        await adminAPI.updateContactRequestStatus(request.id, 'read');
        setRequests(requests.map(req => 
          req.id === request.id ? { ...req, status: 'read' } : req
        ));
        setSelectedRequest({ ...request, status: 'read' });
      } catch (err) {
        console.error('Failed to update status:', err);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
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
          <h2 className="text-3xl font-bold" style={{ color: '#000000' }}>
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
                ? 'text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow hover:shadow-md'
            }`}
            style={filterStatus === 'all' ? { backgroundColor: '#000000' } : {}}
            onMouseEnter={(e) => filterStatus === 'all' && (e.currentTarget.style.backgroundColor = '#1a1a1a')}
            onMouseLeave={(e) => filterStatus === 'all' && (e.currentTarget.style.backgroundColor = '#000000')}
          >
            All ({pagination.total})
          </button>
          <button
            onClick={() => setFilterStatus('new')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
              filterStatus === 'new'
                ? 'text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow hover:shadow-md'
            }`}
            style={filterStatus === 'new' ? { backgroundColor: '#000000' } : {}}
            onMouseEnter={(e) => filterStatus === 'new' && (e.currentTarget.style.backgroundColor = '#1a1a1a')}
            onMouseLeave={(e) => filterStatus === 'new' && (e.currentTarget.style.backgroundColor = '#000000')}
          >
            New ({requests.filter(r => r.status === 'new').length})
          </button>
          <button
            onClick={() => setFilterStatus('read')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
              filterStatus === 'read'
                ? 'text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow hover:shadow-md'
            }`}
            style={filterStatus === 'read' ? { backgroundColor: '#000000' } : {}}
            onMouseEnter={(e) => filterStatus === 'read' && (e.currentTarget.style.backgroundColor = '#1a1a1a')}
            onMouseLeave={(e) => filterStatus === 'read' && (e.currentTarget.style.backgroundColor = '#000000')}
          >
            Read ({requests.filter(r => r.status === 'read').length})
          </button>
          <button
            onClick={() => setFilterStatus('responded')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
              filterStatus === 'responded'
                ? 'text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow hover:shadow-md'
            }`}
            style={filterStatus === 'responded' ? { backgroundColor: '#000000' } : {}}
            onMouseEnter={(e) => filterStatus === 'responded' && (e.currentTarget.style.backgroundColor = '#1a1a1a')}
            onMouseLeave={(e) => filterStatus === 'responded' && (e.currentTarget.style.backgroundColor = '#000000')}
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#000000' }}></div>
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
                onClick={() => handleRequestClick(request)}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-gray-100 animate-fade-in group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2 flex-wrap gap-2">
                      <h3 className="text-xl font-bold" style={{ color: '#000000' }}>
                        {request.name}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-600">
                      {request.email && (
                        <p className="text-sm"><span className="font-medium">Email:</span> {request.email}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Submitted: {formatDate(request.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 transition-colors" style={{ color: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000000'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && filteredRequests.length > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onPageSizeChange={handlePageSizeChange}
          />
        )}

        {/* Contact Request Detail Modal */}
        {isModalOpen && selectedRequest && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={handleCloseModal}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold" style={{ color: '#000000' }}>
                    Contact Request Details
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Status Badge and Responded Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </span>
                    </div>
                    {(selectedRequest.status === 'new' || selectedRequest.status === 'read') && (
                      <button
                        onClick={() => handleStatusChange(selectedRequest.id, 'responded')}
                        className="px-6 py-2 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                        style={{ backgroundColor: '#000000' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
                      >
                        Mark as Responded
                      </button>
                    )}
                  </div>

                  {/* User Details */}
                  <div className="rounded-xl p-6 space-y-4" style={{ backgroundColor: '#e8f0f8' }}>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                      <p className="text-lg font-medium text-gray-900">{selectedRequest.name}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                        <p className="text-gray-900">
                          <a href={`tel:${selectedRequest.phone}`} className="hover:text-indigo-600 transition-colors">
                            {selectedRequest.phone}
                          </a>
                        </p>
                      </div>

                      {selectedRequest.email && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                          <p className="text-gray-900">
                            <a href={`mailto:${selectedRequest.email}`} className="hover:text-indigo-600 transition-colors break-all">
                              {selectedRequest.email}
                            </a>
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedRequest.message && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                        <div className="bg-white rounded-lg p-4 border-2" style={{ borderColor: '#cbd5e1' }}>
                          <p className="text-gray-700 whitespace-pre-wrap">{selectedRequest.message}</p>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Submitted At</label>
                      <p className="text-gray-600">{formatDate(selectedRequest.created_at)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    style={{ backgroundColor: '#000000' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContactRequests;

