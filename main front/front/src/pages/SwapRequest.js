import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Send, User } from 'lucide-react';

const SwapRequest = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [targetUser, setTargetUser] = useState(null);
  const [formData, setFormData] = useState({
    offeredSkill: '',
    requestedSkill: '',
    message: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const mockUsers = {
      1: {
        id: 1,
        name: 'Sarah Johnson',
        skillsOffered: ['JavaScript', 'React', 'Node.js'],
        skillsWanted: ['Python', 'Machine Learning']
      },
      2: {
        id: 2,
        name: 'Mike Chen',
        skillsOffered: ['Python', 'Data Analysis', 'SQL'],
        skillsWanted: ['JavaScript', 'Web Development']
      },
      3: {
        id: 3,
        name: 'Emily Davis',
        skillsOffered: ['Graphic Design', 'Photoshop', 'Illustrator'],
        skillsWanted: ['JavaScript', 'React']
      },
      4: {
        id: 4,
        name: 'Alex Rodriguez',
        skillsOffered: ['Spanish', 'Marketing', 'Content Writing'],
        skillsWanted: ['Python', 'Data Science']
      }
    };

    const user = mockUsers[userId];
    if (user) {
      setTargetUser(user);
    }
    setLoading(false);
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!formData.offeredSkill || !formData.requestedSkill) {
      alert('Please select both skills for the swap');
      setSubmitting(false);
      return;
    }

    try {
      console.log('Sending swap request:', {
        from: user.id,
        to: targetUser.id,
        ...formData
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Swap request sent successfully!');
      navigate('/requests');
    } catch (error) {
      alert('Failed to send swap request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to send a swap request.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  if (!targetUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">User not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Skill Swap</h1>
          <p className="text-gray-600">
            Send a skill swap request to {targetUser.name}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="text-primary-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{targetUser.name}</h3>
              <p className="text-sm text-gray-600">Skills they want: {targetUser.skillsWanted.join(', ')}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Skill to Offer *
            </label>
            <select
              name="offeredSkill"
              value={formData.offeredSkill}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Select a skill you can offer</option>
              {user.skillsOffered?.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Choose from your offered skills: {user.skillsOffered?.join(', ')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill You Want to Learn *
            </label>
            <select
              name="requestedSkill"
              value={formData.requestedSkill}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Select a skill you want to learn</option>
              {targetUser.skillsOffered?.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Choose from {targetUser.name}'s offered skills: {targetUser.skillsOffered?.join(', ')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="input-field"
              placeholder="Add a personal message to your swap request..."
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• You'll offer to teach {targetUser.name} your selected skill</li>
              <li>• In return, they'll teach you the skill you want to learn</li>
              <li>• Once accepted, you can coordinate the details together</li>
              <li>• After the swap, you can rate each other's experience</li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex items-center space-x-2"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Send size={20} />
              )}
              <span>{submitting ? 'Sending...' : 'Send Request'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SwapRequest; 