const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret (in production, use environment variable)
const JWT_SECRET = 'your-super-secret-jwt-key-here';

// Data file path
const DATA_FILE = path.join(__dirname, 'data.json');

// Helper function to read data
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return default data
    return {
      users: [],
      skills: [],
      swapRequests: []
    };
  }
}

// Helper function to write data
async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
};

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Skill Swap Platform API', 
    version: '1.0.0',
    status: 'running'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Register user
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, location, availability, skillsOffered, skillsWanted, isPublic } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and password are required' 
      });
    }

    const data = await readData();

    // Check if user already exists
    const existingUser = data.users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      id: data.users.length + 1,
      name,
      email,
      password: hashedPassword,
      location: location || '',
      availability: availability || 'Weekends',
      isPublic: isPublic !== undefined ? isPublic : true,
      rating: 0,
      skillsOffered: skillsOffered || [],
      skillsWanted: skillsWanted || []
    };

    // Add user to data
    data.users.push(newUser);

    // Add new skills to skills list
    const allSkills = [...new Set([...data.skills, ...(skillsOffered || []), ...(skillsWanted || [])])];
    data.skills = allSkills;

    // Save data
    await writeData(data);

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      userId: newUser.id
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const data = await readData();

    // Find user
    const user = data.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get user profile
app.get('/api/profile/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const data = await readData();

    const user = data.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Update user profile
app.put('/api/profile/:id', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, location, availability, isPublic, skillsOffered, skillsWanted } = req.body;

    const data = await readData();

    // Find user
    const userIndex = data.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update user
    data.users[userIndex] = {
      ...data.users[userIndex],
      name: name || data.users[userIndex].name,
      location: location || data.users[userIndex].location,
      availability: availability || data.users[userIndex].availability,
      isPublic: isPublic !== undefined ? isPublic : data.users[userIndex].isPublic,
      skillsOffered: skillsOffered || data.users[userIndex].skillsOffered,
      skillsWanted: skillsWanted || data.users[userIndex].skillsWanted
    };

    // Add new skills to skills list
    const allSkills = [...new Set([...data.skills, ...(skillsOffered || []), ...(skillsWanted || [])])];
    data.skills = allSkills;

    // Save data
    await writeData(data);

    res.json({ 
      success: true, 
      message: 'Profile updated successfully' 
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Search users by skill
app.get('/api/search', async (req, res) => {
  try {
    const { skill, availability } = req.query;
    const data = await readData();

    let users = data.users.filter(user => user.isPublic);

    // Filter by skill
    if (skill) {
      users = users.filter(user => 
        user.skillsOffered.some(s => s.toLowerCase().includes(skill.toLowerCase())) ||
        user.skillsWanted.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      );
    }

    // Filter by availability
    if (availability) {
      users = users.filter(user => user.availability === availability);
    }

    // Sort by rating
    users.sort((a, b) => b.rating - a.rating);

    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json({
      success: true,
      users: usersWithoutPasswords
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get all skills
app.get('/api/skills', async (req, res) => {
  try {
    const data = await readData();
    res.json({
      success: true,
      skills: data.skills
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Create swap request
app.post('/api/swap-requests', authenticateToken, async (req, res) => {
  try {
    const { receiverId, offeredSkill, requestedSkill, message } = req.body;
    const senderId = req.user.id;

    // Validate input
    if (!receiverId || !offeredSkill || !requestedSkill) {
      return res.status(400).json({ 
        success: false, 
        message: 'Receiver ID, offered skill, and requested skill are required' 
      });
    }

    const data = await readData();

    // Check if receiver exists
    const receiver = data.users.find(u => u.id === parseInt(receiverId));
    if (!receiver) {
      return res.status(404).json({ 
        success: false, 
        message: 'Receiver not found' 
      });
    }

    // Check if sender has the offered skill
    const sender = data.users.find(u => u.id === senderId);
    if (!sender.skillsOffered.includes(offeredSkill)) {
      return res.status(400).json({ 
        success: false, 
        message: 'You must have the offered skill in your skills list' 
      });
    }

    // Check if receiver has the requested skill
    if (!receiver.skillsOffered.includes(requestedSkill)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Receiver does not have the requested skill' 
      });
    }

    // Create swap request
    const newRequest = {
      id: data.swapRequests.length + 1,
      senderId,
      receiverId: parseInt(receiverId),
      offeredSkill,
      requestedSkill,
      message: message || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    data.swapRequests.push(newRequest);
    await writeData(data);

    res.status(201).json({
      success: true,
      message: 'Swap request sent successfully',
      request: newRequest
    });

  } catch (error) {
    console.error('Create swap request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get swap requests for a user
app.get('/api/swap-requests', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.query; // 'sent' or 'received'
    const data = await readData();

    let requests = [];

    if (type === 'sent') {
      requests = data.swapRequests.filter(req => req.senderId === userId);
    } else if (type === 'received') {
      requests = data.swapRequests.filter(req => req.receiverId === userId);
    } else {
      requests = data.swapRequests.filter(req => req.senderId === userId || req.receiverId === userId);
    }

    // Add user details to requests
    const requestsWithUsers = requests.map(request => {
      const sender = data.users.find(u => u.id === request.senderId);
      const receiver = data.users.find(u => u.id === request.receiverId);
      
      return {
        ...request,
        sender: { id: sender.id, name: sender.name, email: sender.email },
        receiver: { id: receiver.id, name: receiver.name, email: receiver.email }
      };
    });

    res.json({
      success: true,
      requests: requestsWithUsers
    });

  } catch (error) {
    console.error('Get swap requests error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Update swap request status
app.put('/api/swap-requests/:id', authenticateToken, async (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const { status } = req.body; // 'accepted', 'rejected', 'completed'
    const userId = req.user.id;

    const data = await readData();

    // Find request
    const requestIndex = data.swapRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Swap request not found' 
      });
    }

    const request = data.swapRequests[requestIndex];

    // Check if user is the receiver
    if (request.receiverId !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Only the receiver can update the request status' 
      });
    }

    // Update status
    data.swapRequests[requestIndex].status = status;
    data.swapRequests[requestIndex].updatedAt = new Date().toISOString();

    await writeData(data);

    res.json({
      success: true,
      message: `Swap request ${status} successfully`,
      request: data.swapRequests[requestIndex]
    });

  } catch (error) {
    console.error('Update swap request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Simple backend running on http://localhost:${PORT}`);
  console.log(`📊 Using JSON file storage (no database required!)`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📁 Data file: ${DATA_FILE}`);
}); 