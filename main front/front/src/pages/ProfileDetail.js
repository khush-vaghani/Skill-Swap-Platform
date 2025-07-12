import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, MapPin, Star, ArrowLeft, MessageSquare } from 'lucide-react';

const ProfileDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockUsers = {
      1: {
        id: 1,
        name: 'Sarah Johnson',
        location: 'New York, NY',
        photo: null,
        skillsOffered: ['JavaScript', 'React', 'Node.js'],
        skillsWanted: ['Python', 'Machine Learning'],
        availability: 'Weekends',
        rating: 4.8,
        publicProfile: true
      },
      2: {
        id: 2,
        name: 'Mike Chen',
        location: 'San Francisco, CA',
        photo: null,
        skillsOffered: ['Python', 'Data Analysis', 'SQL'],
        skillsWanted: ['JavaScript', 'Web Development'],
        availability: 'Evenings',
        rating: 4.5,
        publicProfile: true
      },
      3: {
        id: 3,
        name: 'Emily Davis',
        location: 'Austin, TX',
        photo: null,
        skillsOffered: ['Graphic Design', 'Photoshop', 'Illustrator'],
        skillsWanted: ['JavaScript', 'React'],
        availability: 'Weekdays',
        rating: 4.9,
        publicProfile: true
      },
      4: {
        id: 4,
        name: 'Alex Rodriguez',
        location: 'Miami, FL',
        photo: null,
        skillsOffered: ['Spanish', 'Marketing', 'Content Writing'],
        skillsWanted: ['Python', 'Data Science'],
        availability: 'Weekends',
        rating: 4.2,
        publicProfile: true
      }
    };

    const user = mockUsers[id];
    if (user) {
      setProfileUser(user);
    }
    setLoading(false);
  }, [id]);

  const handleRequestSwap = () => {
    if (!user) {
      alert('Please log in to send a swap request');
      return;
    }
    navigate(`/swap-request/${id}`);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">User not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
              {profileUser.photo ? (
                <img src={profileUser.photo} alt={profileUser.name} className="w-24 h-24 rounded-full" />
              ) : (
                <User className="text-primary-600" size={48} />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profileUser.name}</h1>
              <div className="flex items-center space-x-4 text-gray-600 mt-2">
                <div className="flex items-center">
                  <MapPin size={16} />
                  <span className="ml-1">{profileUser.location}</span>
                </div>
                <div className="flex items-center">
                  <Star className="text-yellow-400" size={16} fill="currentColor" />
                  <span className="ml-1">{profileUser.rating}</span>
                </div>
              </div>
            </div>
          </div>
          
          {user && user.id !== profileUser.id && (
            <button
              onClick={handleRequestSwap}
              className="btn-primary flex items-center space-x-2"
            >
              <MessageSquare size={20} />
              <span>Request Swap</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills Offered</h3>
            <div className="flex flex-wrap gap-2">
              {profileUser.skillsOffered.map((skill, index) => (
                <span key={index} className="px-3 py-2 bg-green-100 text-green-800 text-sm rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills Wanted</h3>
            <div className="flex flex-wrap gap-2">
              {profileUser.skillsWanted.map((skill, index) => (
                <span key={index} className="px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Availability</h4>
              <p className="text-gray-900">{profileUser.availability}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Location</h4>
              <p className="text-gray-900">{profileUser.location}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Rating</h4>
              <div className="flex items-center">
                <Star className="text-yellow-400" size={16} fill="currentColor" />
                <span className="ml-1 text-gray-900">{profileUser.rating}/5</span>
              </div>
            </div>
          </div>
        </div>

        {user && user.id !== profileUser.id && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Ready to Swap?</h4>
              <p className="text-blue-800 mb-4">
                If you have skills that {profileUser.name} wants to learn, and they have skills you want to learn, 
                you can request a skill swap!
              </p>
              <button
                onClick={handleRequestSwap}
                className="btn-primary"
              >
                Request Skill Swap
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetail; 