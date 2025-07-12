const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config({ path: './config.env' });

const { pool, testConnection, initializeDatabase } = require('./config/database');
const { authenticateToken, isAdmin, isOwnerOrAdmin } = require('./middleware/auth');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, location, availability, is_public) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, location, availability, isPublic]
    );

    const userId = result.insertId;

    // Add skills offered
    if (skillsOffered && skillsOffered.length > 0) {
      for (const skillName of skillsOffered) {
        // Get or create skill
        let [skills] = await pool.execute('SELECT id FROM skills WHERE name = ?', [skillName]);
        let skillId;
        
        if (skills.length === 0) {
          const [newSkill] = await pool.execute('INSERT INTO skills (name) VALUES (?)', [skillName]);
          skillId = newSkill.insertId;
        } else {
          skillId = skills[0].id;
        }

        // Add user skill offered
        await pool.execute(
          'INSERT INTO user_skills_offered (user_id, skill_id) VALUES (?, ?)',
          [userId, skillId]
        );
      }
    }

    // Add skills wanted
    if (skillsWanted && skillsWanted.length > 0) {
      for (const skillName of skillsWanted) {
        // Get or create skill
        let [skills] = await pool.execute('SELECT id FROM skills WHERE name = ?', [skillName]);
        let skillId;
        
        if (skills.length === 0) {
          const [newSkill] = await pool.execute('INSERT INTO skills (name) VALUES (?)', [skillName]);
          skillId = newSkill.insertId;
        } else {
          skillId = skills[0].id;
        }

        // Add user skill wanted
        await pool.execute(
          'INSERT INTO user_skills_wanted (user_id, skill_id) VALUES (?, ?)',
          [userId, skillId]
        );
      }
    }

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      userId: userId
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

    // Find user
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Get user skills
    const [skillsOffered] = await pool.execute(`
      SELECT s.name 
      FROM skills s 
      JOIN user_skills_offered uso ON s.id = uso.skill_id 
      WHERE uso.user_id = ?
    `, [user.id]);

    const [skillsWanted] = await pool.execute(`
      SELECT s.name 
      FROM skills s 
      JOIN user_skills_wanted usw ON s.id = usw.skill_id 
      WHERE usw.user_id = ?
    `, [user.id]);

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        location: user.location,
        availability: user.availability,
        isPublic: user.is_public,
        rating: user.rating,
        skillsOffered: skillsOffered.map(s => s.name),
        skillsWanted: skillsWanted.map(s => s.name)
      }
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
    const userId = req.params.id;

    const [users] = await pool.execute(
      'SELECT id, name, email, location, availability, is_public, rating FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const user = users[0];

    // Get skills offered
    const [skillsOffered] = await pool.execute(`
      SELECT s.name 
      FROM skills s 
      JOIN user_skills_offered uso ON s.id = uso.skill_id 
      WHERE uso.user_id = ?
    `, [userId]);

    // Get skills wanted
    const [skillsWanted] = await pool.execute(`
      SELECT s.name 
      FROM skills s 
      JOIN user_skills_wanted usw ON s.id = usw.skill_id 
      WHERE usw.user_id = ?
    `, [userId]);

    res.json({
      success: true,
      user: {
        ...user,
        skillsOffered: skillsOffered.map(s => s.name),
        skillsWanted: skillsWanted.map(s => s.name)
      }
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
app.put('/api/profile/:id', authenticateToken, isOwnerOrAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, location, availability, isPublic, skillsOffered, skillsWanted } = req.body;

    // Update user basic info
    await pool.execute(
      'UPDATE users SET name = ?, location = ?, availability = ?, is_public = ? WHERE id = ?',
      [name, location, availability, isPublic, userId]
    );

    // Clear existing skills
    await pool.execute('DELETE FROM user_skills_offered WHERE user_id = ?', [userId]);
    await pool.execute('DELETE FROM user_skills_wanted WHERE user_id = ?', [userId]);

    // Add skills offered
    if (skillsOffered && skillsOffered.length > 0) {
      for (const skillName of skillsOffered) {
        let [skills] = await pool.execute('SELECT id FROM skills WHERE name = ?', [skillName]);
        let skillId;
        
        if (skills.length === 0) {
          const [newSkill] = await pool.execute('INSERT INTO skills (name) VALUES (?)', [skillName]);
          skillId = newSkill.insertId;
        } else {
          skillId = skills[0].id;
        }

        await pool.execute(
          'INSERT INTO user_skills_offered (user_id, skill_id) VALUES (?, ?)',
          [userId, skillId]
        );
      }
    }

    // Add skills wanted
    if (skillsWanted && skillsWanted.length > 0) {
      for (const skillName of skillsWanted) {
        let [skills] = await pool.execute('SELECT id FROM skills WHERE name = ?', [skillName]);
        let skillId;
        
        if (skills.length === 0) {
          const [newSkill] = await pool.execute('INSERT INTO skills (name) VALUES (?)', [skillName]);
          skillId = newSkill.insertId;
        } else {
          skillId = skills[0].id;
        }

        await pool.execute(
          'INSERT INTO user_skills_wanted (user_id, skill_id) VALUES (?, ?)',
          [userId, skillId]
        );
      }
    }

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
    let query = `
      SELECT DISTINCT u.id, u.name, u.location, u.availability, u.rating, u.is_public
      FROM users u
      JOIN user_skills_offered uso ON u.id = uso.user_id
      JOIN skills s ON uso.skill_id = s.id
      WHERE u.is_public = 1
    `;
    
    const params = [];

    if (skill) {
      query += ' AND s.name LIKE ?';
      params.push(`%${skill}%`);
    }

    if (availability) {
      query += ' AND u.availability = ?';
      params.push(availability);
    }

    query += ' ORDER BY u.rating DESC';

    const [users] = await pool.execute(query, params);

    // Get skills for each user
    const usersWithSkills = await Promise.all(
      users.map(async (user) => {
        const [skillsOffered] = await pool.execute(`
          SELECT s.name 
          FROM skills s 
          JOIN user_skills_offered uso ON s.id = uso.skill_id 
          WHERE uso.user_id = ?
        `, [user.id]);

        const [skillsWanted] = await pool.execute(`
          SELECT s.name 
          FROM skills s 
          JOIN user_skills_wanted usw ON s.id = usw.skill_id 
          WHERE usw.user_id = ?
        `, [user.id]);

        return {
          ...user,
          skillsOffered: skillsOffered.map(s => s.name),
          skillsWanted: skillsWanted.map(s => s.name)
        };
      })
    );

    res.json({
      success: true,
      users: usersWithSkills
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
    const [skills] = await pool.execute('SELECT * FROM skills ORDER BY name');
    res.json({
      success: true,
      skills: skills
    });
  } catch (error) {
    console.error('Get skills error:', error);
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

// Initialize database and start server
async function startServer() {
  try {
    await testConnection();
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Database: MySQL (XAMPP)`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 