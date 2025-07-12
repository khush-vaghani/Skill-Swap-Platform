import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, MapPin, Star, Edit, Save, X, Plus } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
    availability: user?.availability || 'Weekends',
    publicProfile: user?.publicProfile || true
  });
  const [newSkill, setNewSkill] = useState('');
  const [skillType, setSkillType] = useState('offered');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData[skillType === 'offered' ? 'skillsOffered' : 'skillsWanted'].includes(newSkill.trim())) {
      setFormData({
        ...formData,
        [skillType === 'offered' ? 'skillsOffered' : 'skillsWanted']: [
          ...formData[skillType === 'offered' ? 'skillsOffered' : 'skillsWanted'],
          newSkill.trim()
        ]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill, type) => {
    setFormData({
      ...formData,
      [type === 'offered' ? 'skillsOffered' : 'skillsWanted']: 
        formData[type === 'offered' ? 'skillsOffered' : 'skillsWanted'].filter(s => s !== skill)
    });
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...formData
    };
    updateUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      location: user?.location || '',
      skillsOffered: user?.skillsOffered || [],
      skillsWanted: user?.skillsWanted || [],
      availability: user?.availability || 'Weekends',
      publicProfile: user?.publicProfile || true
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              {user.photo ? (
                <img src={user.photo} alt={user.name} className="w-20 h-20 rounded-full" />
              ) : (
                <User className="text-primary-600" size={40} />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin size={16} />
                  <span className="ml-1">{user.location || 'No location set'}</span>
                </div>
                <div className="flex items-center">
                  <Star className="text-yellow-400" size={16} fill="currentColor" />
                  <span className="ml-1">{user.rating || 0}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-outline flex items-center space-x-2"
          >
            {isEditing ? <X size={20} /> : <Edit size={20} />}
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="City, State"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="input-field"
              >
                <option value="Weekends">Weekends</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Evenings">Evenings</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills You Can Offer
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="input-field flex-1"
                    placeholder="Add a skill"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="btn-primary px-4"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skillsOffered.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center space-x-1">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill, 'offered')}
                        className="ml-1 hover:text-green-600"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills You Want to Learn
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="input-field flex-1"
                    placeholder="Add a skill"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="btn-primary px-4"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skillsWanted.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center space-x-1">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill, 'wanted')}
                        className="ml-1 hover:text-blue-600"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="publicProfile"
                name="publicProfile"
                type="checkbox"
                checked={formData.publicProfile}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="publicProfile" className="ml-2 block text-sm text-gray-900">
                Make my profile public
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="btn-primary flex items-center space-x-2"
              >
                <Save size={20} />
                <span>Save Changes</span>
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills You Can Offer</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skillsOffered?.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills You Want to Learn</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skillsWanted?.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Availability</h4>
                  <p className="text-gray-900">{user.availability}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Profile Status</h4>
                  <p className="text-gray-900">{user.publicProfile ? 'Public' : 'Private'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Member Since</h4>
                  <p className="text-gray-900">2024</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 