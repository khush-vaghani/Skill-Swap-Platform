import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Check, X, Clock, MessageSquare, Star } from 'lucide-react';

const RequestManagement = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(true);

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockRequests = [
      {
        id: 1,
        type: 'received',
        sender: {
          id: 2,
          name: 'Mike Chen',
          photo: null
        },
        offeredSkill: 'Python',
        requestedSkill: 'JavaScript',
        message: 'I can help you with Python programming and would love to learn JavaScript from you!',
        status: 'pending',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        type: 'sent',
        receiver: {
          id: 3,
          name: 'Emily Davis',
          photo: null
        },
        offeredSkill: 'React',
        requestedSkill: 'Graphic Design',
        message: 'I can teach you React development and would like to learn graphic design.',
        status: 'accepted',
        createdAt: '2024-01-10T14:20:00Z'
      },
      {
        id: 3,
        type: 'received',
        sender: {
          id: 4,
          name: 'Alex Rodriguez',
          photo: null
        },
        offeredSkill: 'Spanish',
        requestedSkill: 'Data Analysis',
        message: 'I can teach you Spanish and would like to learn data analysis.',
        status: 'rejected',
        createdAt: '2024-01-08T09:15:00Z'
      }
    ];

    setRequests(mockRequests);
    setLoading(false);
  }, []);

  const handleAction = (requestId, action) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: action }
          : req
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'accepted':
        return <Check size={16} />;
      case 'rejected':
        return <X size={16} />;
      default:
        return null;
    }
  };

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'received') {
      return req.type === 'received';
    } else if (activeTab === 'sent') {
      return req.type === 'sent';
    }
    return req.status === activeTab;
  });

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to view your requests.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Swap Requests</h1>
        <p className="text-gray-600">Manage your skill swap requests</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'received'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Received ({requests.filter(r => r.type === 'received').length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'sent'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sent ({requests.filter(r => r.type === 'sent').length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'pending'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending ({requests.filter(r => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('accepted')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'accepted'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Accepted ({requests.filter(r => r.status === 'accepted').length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No requests</h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === 'received' 
              ? "You haven't received any swap requests yet."
              : activeTab === 'sent'
              ? "You haven't sent any swap requests yet."
              : `No ${activeTab} requests found.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    {request.sender?.photo || request.receiver?.photo ? (
                      <img 
                        src={request.sender?.photo || request.receiver?.photo} 
                        alt={request.sender?.name || request.receiver?.name} 
                        className="w-12 h-12 rounded-full" 
                      />
                    ) : (
                      <User className="text-primary-600" size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {request.sender?.name || request.receiver?.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="capitalize">{request.status}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Offers:</span> {request.offeredSkill}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Wants:</span> {request.requestedSkill}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {request.message && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700">{request.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                {request.type === 'received' && request.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAction(request.id, 'accepted')}
                      className="btn-primary px-4 py-2 text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(request.id, 'rejected')}
                      className="btn-secondary px-4 py-2 text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {request.status === 'accepted' && (
                  <div className="flex items-center space-x-2">
                    <button className="btn-outline px-4 py-2 text-sm flex items-center space-x-1">
                      <Star size={16} />
                      <span>Rate</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestManagement; 