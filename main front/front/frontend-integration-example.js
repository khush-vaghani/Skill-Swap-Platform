// Frontend Integration Example for Skill Swap Platform
// This shows how to connect your React frontend to the backend API

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
function getAuthToken() {
  return localStorage.getItem('token');
}

// Helper function to set auth headers
function getAuthHeaders() {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

// Example: Register a new user
async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        location: userData.location,
        availability: userData.availability,
        skillsOffered: userData.skillsOffered,
        skillsWanted: userData.skillsWanted,
        isPublic: userData.isPublic
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('User registered successfully:', data);
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

// Example: Login user
async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (data.success) {
      // Store token and user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Login successful:', data);
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

// Example: Logout user
function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('User logged out');
}

// Example: Get current user
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Example: Check if user is logged in
function isLoggedIn() {
  return !!getAuthToken();
}

// Example: Search users by skill
async function searchUsers(skill, availability = null) {
  try {
    let url = `${API_BASE_URL}/search?skill=${encodeURIComponent(skill)}`;
    if (availability) {
      url += `&availability=${encodeURIComponent(availability)}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    
    if (data.success) {
      console.log('Search results:', data.users);
      return data.users;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
}

// Example: Update user profile
async function updateProfile(userId, profileData) {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: profileData.name,
        location: profileData.location,
        availability: profileData.availability,
        skillsOffered: profileData.skillsOffered,
        skillsWanted: profileData.skillsWanted,
        isPublic: profileData.isPublic
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Profile updated successfully');
      // Update stored user data
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        const updatedUser = { ...currentUser, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Profile update failed:', error);
    throw error;
  }
}

// Example: Get user profile
async function getUserProfile(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
    const data = await response.json();
    
    if (data.success) {
      console.log('User profile:', data.user);
      return data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Get profile failed:', error);
    throw error;
  }
}

// Example: Get all available skills
async function getAllSkills() {
  try {
    const response = await fetch(`${API_BASE_URL}/skills`);
    const data = await response.json();
    
    if (data.success) {
      console.log('Available skills:', data.skills);
      return data.skills;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Get skills failed:', error);
    throw error;
  }
}

// Example: Send swap request
async function sendSwapRequest(receiverId, offeredSkill, requestedSkill, message = '') {
  try {
    const response = await fetch(`${API_BASE_URL}/swap-requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        receiverId,
        offeredSkill,
        requestedSkill,
        message
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Swap request sent successfully:', data.request);
      return data.request;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Send swap request failed:', error);
    throw error;
  }
}

// Example: Get swap requests
async function getSwapRequests(type = null) {
  try {
    let url = `${API_BASE_URL}/swap-requests`;
    if (type) {
      url += `?type=${type}`;
    }

    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    
    if (data.success) {
      console.log('Swap requests:', data.requests);
      return data.requests;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Get swap requests failed:', error);
    throw error;
  }
}

// Example: Update swap request status
async function updateSwapRequest(requestId, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/swap-requests/${requestId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Swap request updated successfully:', data.request);
      return data.request;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Update swap request failed:', error);
    throw error;
  }
}

// Example usage in React component
/*
import React, { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(getCurrentUser());
  const [users, setUsers] = useState([]);
  const [swapRequests, setSwapRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Auto-login check
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // Register example
  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      await registerUser(userData);
      alert('Registration successful! Please login.');
    } catch (error) {
      alert('Registration failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Login example
  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const result = await loginUser(email, password);
      setUser(result.user);
      alert('Login successful! Welcome ' + result.user.name);
    } catch (error) {
      alert('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Logout example
  const handleLogout = () => {
    logoutUser();
    setUser(null);
    alert('Logged out successfully');
  };

  // Search example
  const handleSearch = async (skill) => {
    try {
      setLoading(true);
      const results = await searchUsers(skill);
      setUsers(results);
    } catch (error) {
      alert('Search failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Send swap request example
  const handleSendSwapRequest = async (receiverId, offeredSkill, requestedSkill) => {
    try {
      setLoading(true);
      await sendSwapRequest(receiverId, offeredSkill, requestedSkill);
      alert('Swap request sent successfully!');
    } catch (error) {
      alert('Failed to send swap request: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get swap requests example
  const handleGetSwapRequests = async () => {
    try {
      setLoading(true);
      const requests = await getSwapRequests();
      setSwapRequests(requests);
    } catch (error) {
      alert('Failed to get swap requests: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Skill Swap Platform</h1>
      
      {!user ? (
        <div>
          <h2>Login/Register</h2>
          {/* Your login/register forms here */}
        </div>
      ) : (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <button onClick={handleLogout}>Logout</button>
          
          <div>
            <h3>Search Users</h3>
            <input 
              type="text" 
              placeholder="Search by skill..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          <div>
            <h3>Users Found</h3>
            {users.map(user => (
              <div key={user.id}>
                <h4>{user.name}</h4>
                <p>Skills Offered: {user.skillsOffered.join(', ')}</p>
                <p>Skills Wanted: {user.skillsWanted.join(', ')}</p>
                <button onClick={() => handleSendSwapRequest(user.id, 'JavaScript', 'Python')}>
                  Request Swap
                </button>
              </div>
            ))}
          </div>
          
          <div>
            <h3>Swap Requests</h3>
            <button onClick={handleGetSwapRequests}>Load Requests</button>
            {swapRequests.map(request => (
              <div key={request.id}>
                <p>From: {request.sender.name}</p>
                <p>To: {request.receiver.name}</p>
                <p>Offering: {request.offeredSkill}</p>
                <p>Requesting: {request.requestedSkill}</p>
                <p>Status: {request.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default App;
*/

// Test the API endpoints
async function testAPI() {
  console.log('Testing Skill Swap Platform API...');
  
  try {
    // Test server health
    const healthResponse = await fetch('http://localhost:5000/health');
    const healthData = await healthResponse.json();
    console.log('Server health:', healthData);
    
    // Test get skills
    const skills = await getAllSkills();
    console.log('Available skills:', skills);
    
    // Test search
    const users = await searchUsers('JavaScript');
    console.log('Users with JavaScript:', users);
    
  } catch (error) {
    console.error('API test failed:', error);
  }
}

// Run test if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.testAPI = testAPI;
  window.registerUser = registerUser;
  window.loginUser = loginUser;
  window.logoutUser = logoutUser;
  window.getCurrentUser = getCurrentUser;
  window.isLoggedIn = isLoggedIn;
  window.searchUsers = searchUsers;
  window.updateProfile = updateProfile;
  window.getUserProfile = getUserProfile;
  window.getAllSkills = getAllSkills;
  window.sendSwapRequest = sendSwapRequest;
  window.getSwapRequests = getSwapRequests;
  window.updateSwapRequest = updateSwapRequest;
} else {
  // Node.js environment
  testAPI();
} 