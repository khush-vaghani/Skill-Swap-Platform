# Skill Swap Platform - Backend

A Node.js backend API for the Skill Swap Platform with MySQL database.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- XAMPP (for MySQL)
- npm or yarn

### 1. Install XAMPP
1. Download XAMPP from: https://www.apachefriends.org/
2. Install with default settings
3. Start XAMPP Control Panel
4. Click "Start" next to MySQL

### 2. Setup Database
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Create new database: `skill_swap_db`
3. Import the schema from `database/schema.sql`

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Configure Environment
Update `config.env` with your MySQL settings:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=skill_swap_db
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### 5. Start Server
```bash
npm start
# or for development
npm run dev
```

The server will run on: **http://localhost:5000**

## 📊 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### User Management
- `GET /api/profile/:id` - Get user profile
- `PUT /api/profile/:id` - Update user profile

### Search
- `GET /api/search` - Search users by skill
- `GET /api/skills` - Get all available skills

## 🔧 Database Schema

### Tables
- `users` - User accounts
- `skills` - Available skills
- `user_skills_offered` - Skills users can teach
- `user_skills_wanted` - Skills users want to learn
- `swap_requests` - Skill swap requests

## 🛠️ Development

### Test Database Connection
```bash
node test-db.js
```

### API Testing
Test the API endpoints using tools like Postman or curl:

```bash
# Test server
curl http://localhost:5000

# Register user
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Rate limiting
- Input validation
- SQL injection prevention

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | localhost |
| `DB_USER` | MySQL username | root |
| `DB_PASSWORD` | MySQL password | (empty) |
| `DB_NAME` | Database name | skill_swap_db |
| `DB_PORT` | MySQL port | 3306 |
| `JWT_SECRET` | JWT signing secret | (required) |
| `PORT` | Server port | 5000 |
| `CORS_ORIGIN` | Allowed origin | http://localhost:3000 |

## 🐛 Troubleshooting

### Database Connection Issues
1. Make sure XAMPP MySQL is running
2. Check if database exists: `skill_swap_db`
3. Verify MySQL credentials in `config.env`
4. Test connection: `node test-db.js`

### CORS Issues
1. Check `CORS_ORIGIN` in `config.env`
2. Make sure frontend URL matches
3. Restart server after config changes

### Port Issues
1. Check if port 5000 is available
2. Change `PORT` in `config.env` if needed
3. Make sure no other service is using the port

## 📚 API Documentation

### Register User
```javascript
POST /api/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "location": "New York",
  "availability": "Weekends",
  "skillsOffered": ["JavaScript", "React"],
  "skillsWanted": ["Python", "Machine Learning"],
  "isPublic": true
}
```

### Login User
```javascript
POST /api/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Search Users
```javascript
GET /api/search?skill=JavaScript&availability=Weekends
```

### Update Profile
```javascript
PUT /api/profile/:id
Authorization: Bearer <token>
{
  "name": "John Doe",
  "location": "New York",
  "availability": "Weekends",
  "skillsOffered": ["JavaScript", "React"],
  "skillsWanted": ["Python"],
  "isPublic": true
}
```

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure proper CORS origins
4. Use environment variables for all secrets
5. Set up proper MySQL credentials
6. Use HTTPS in production

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all prerequisites are installed
3. Test database connection
4. Check server logs for errors 