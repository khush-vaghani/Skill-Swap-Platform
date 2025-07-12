import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, Filter, Star, MapPin, User, Sparkles } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockUsers = [
      {
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
      {
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
      {
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
      {
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
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = users.filter(user => user.publicProfile);
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.skillsOffered.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        user.skillsWanted.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    if (availabilityFilter) {
      filtered = filtered.filter(user => 
        user.availability === availabilityFilter
      );
    }
    
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, searchTerm, availabilityFilter]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleRequestClick = (userId) => {
    if (!user) {
      alert('Please log in to send a swap request');
      return;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-glow floating-animation">
            <Sparkles className="text-white" size={32} />
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Find Your Perfect Skill Swap
        </h1>
        <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
          Connect with people who have the skills you need and offer your expertise in return. 
          <span className="block mt-2 text-lg text-white/70">Start your learning journey today!</span>
        </p>
      </div>

      {/* Search and Filters */}
      <div className="glass-card mb-8 animate-slide-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="input-field pl-12"
            >
              <option value="">All Availability</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Weekends">Weekends</option>
              <option value="Evenings">Evenings</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
          <div className="text-white/80 flex items-center justify-center text-lg font-medium">
            <span className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
              {filteredUsers.length} users found
            </span>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white mx-auto"></div>
          <p className="text-white/80 mt-4 text-lg">Finding amazing people...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedUsers.map((userProfile, index) => (
              <div 
                key={userProfile.id} 
                className="card animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      {userProfile.photo ? (
                        <img src={userProfile.photo} alt={userProfile.name} className="w-14 h-14 rounded-2xl" />
                      ) : (
                        <User className="text-white" size={28} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{userProfile.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin size={16} />
                        <span className="ml-1">{userProfile.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-1 rounded-full">
                    <Star className="text-yellow-500" size={16} fill="currentColor" />
                    <span className="text-sm font-bold text-yellow-700">{userProfile.rating}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Offers:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.skillsOffered.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Wants:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.skillsWanted.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl">
                    <span className="font-bold">Available:</span> {userProfile.availability}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <div className="flex space-x-3">
                    <Link
                      to={`/profile/${userProfile.id}`}
                      className="btn-outline flex-1 text-center"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => handleRequestClick(userProfile.id)}
                      className="btn-primary flex-1"
                    >
                      Request Swap
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-3 mb-8">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border-2 border-white/30 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 text-white font-medium transition-all duration-300"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border-2 rounded-xl font-medium transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-glow'
                      : 'border-white/30 text-white hover:bg-white/20'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border-2 border-white/30 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 text-white font-medium transition-all duration-300"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home; 