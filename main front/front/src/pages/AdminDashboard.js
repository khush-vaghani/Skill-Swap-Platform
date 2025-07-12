import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, TrendingUp, AlertTriangle, Download, Ban, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSwaps: 0,
    pendingSwaps: 0,
    completedSwaps: 0
  });
  const [users, setUsers] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        status: 'active',
        joinDate: '2024-01-01',
        swapsCompleted: 5,
        rating: 4.8
      },
      {
        id: 2,
        name: 'Mike Chen',
        email: 'mike@example.com',
        status: 'active',
        joinDate: '2024-01-05',
        swapsCompleted: 3,
        rating: 4.5
      },
      {
        id: 3,
        name: 'Emily Davis',
        email: 'emily@example.com',
        status: 'banned',
        joinDate: '2024-01-10',
        swapsCompleted: 0,
        rating: 0
      },
      {
        id: 4,
        name: 'Alex Rodriguez',
        email: 'alex@example.com',
        status: 'active',
        joinDate: '2024-01-15',
        swapsCompleted: 2,
        rating: 4.2
      }
    ];

    const mockSwaps = [
      {
        id: 1,
        sender: 'Sarah Johnson',
        receiver: 'Mike Chen',
        offeredSkill: 'JavaScript',
        requestedSkill: 'Python',
        status: 'completed',
        date: '2024-01-12'
      },
      {
        id: 2,
        sender: 'Emily Davis',
        receiver: 'Alex Rodriguez',
        offeredSkill: 'Graphic Design',
        requestedSkill: 'Spanish',
        status: 'pending',
        date: '2024-01-14'
      },
      {
        id: 3,
        sender: 'Mike Chen',
        receiver: 'Sarah Johnson',
        offeredSkill: 'Python',
        requestedSkill: 'React',
        status: 'accepted',
        date: '2024-01-16'
      }
    ];

    setUsers(mockUsers);
    setSwaps(mockSwaps);
    setStats({
      totalUsers: mockUsers.length,
      totalSwaps: mockSwaps.length,
      pendingSwaps: mockSwaps.filter(s => s.status === 'pending').length,
      completedSwaps: mockSwaps.filter(s => s.status === 'completed').length
    });
    setLoading(false);
  }, []);

  const handleBanUser = (userId) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: 'banned' }
          : user
      )
    );
  };

  const handleUnbanUser = (userId) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: 'active' }
          : user
      )
    );
  };

  const handleRejectSwap = (swapId) => {
    setSwaps(prev => 
      prev.map(swap => 
        swap.id === swapId 
          ? { ...swap, status: 'rejected' }
          : swap
      )
    );
  };

  const exportData = (type) => {
    // Mock export functionality
    console.log(`Exporting ${type} data...`);
    alert(`${type} data exported successfully!`);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
        <p className="mt-1 text-sm text-gray-500">
          You don't have permission to access the admin dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, swaps, and platform settings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Swaps</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSwaps}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Swaps</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingSwaps}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Swaps</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedSwaps}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'users'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('swaps')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'swaps'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Swaps
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'reports'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Reports
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <div>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Swaps</h3>
                <div className="space-y-3">
                  {swaps.slice(0, 5).map((swap) => (
                    <div key={swap.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{swap.sender} → {swap.receiver}</p>
                        <p className="text-sm text-gray-600">{swap.offeredSkill} ↔ {swap.requestedSkill}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        swap.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : swap.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {swap.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <button
                  onClick={() => exportData('users')}
                  className="btn-outline flex items-center space-x-2"
                >
                  <Download size={16} />
                  <span>Export Users</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Swaps
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.swapsCompleted}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.rating}/5
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleBanUser(user.id)}
                              className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                            >
                              <Ban size={16} />
                              <span>Ban</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnbanUser(user.id)}
                              className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                            >
                              <CheckCircle size={16} />
                              <span>Unban</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'swaps' && (
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Swap Management</h3>
                <button
                  onClick={() => exportData('swaps')}
                  className="btn-outline flex items-center space-x-2"
                >
                  <Download size={16} />
                  <span>Export Swaps</span>
                </button>
              </div>
              <div className="space-y-4">
                {swaps.map((swap) => (
                  <div key={swap.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {swap.sender} → {swap.receiver}
                        </p>
                        <p className="text-sm text-gray-600">
                          {swap.offeredSkill} ↔ {swap.requestedSkill}
                        </p>
                        <p className="text-xs text-gray-500">{swap.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          swap.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : swap.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {swap.status}
                        </span>
                        {swap.status === 'pending' && (
                          <button
                            onClick={() => handleRejectSwap(swap.id)}
                            className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                          >
                            <XCircle size={16} />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => exportData('users')}
                    className="w-full btn-outline flex items-center justify-between"
                  >
                    <span>User Data</span>
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => exportData('swaps')}
                    className="w-full btn-outline flex items-center justify-between"
                  >
                    <span>Swap Data</span>
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => exportData('feedback')}
                    className="w-full btn-outline flex items-center justify-between"
                  >
                    <span>Feedback Logs</span>
                    <Download size={16} />
                  </button>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Announcements</h3>
                <div className="space-y-4">
                  <textarea
                    placeholder="Enter platform-wide announcement..."
                    className="input-field"
                    rows={4}
                  />
                  <button className="btn-primary w-full">
                    Send Announcement
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 