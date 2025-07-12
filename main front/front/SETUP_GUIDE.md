# 🚀 Skill Swap Platform - Complete Setup Guide

## 📋 Prerequisites

- Windows 10/11
- Node.js (v14 or higher)
- Internet connection

## 🎯 Quick Installation (3 Steps)

### Step 1: Install XAMPP
1. **Download XAMPP:**
   - Go to: https://www.apachefriends.org/download.html
   - Click "Download" for Windows
   - File size: ~150MB

2. **Install XAMPP:**
   - Run the downloaded installer
   - Choose default settings
   - Complete installation

3. **Start MySQL:**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL
   - Wait for green status

### Step 2: Setup Database
1. **Open phpMyAdmin:**
   - Go to: http://localhost/phpmyadmin

2. **Create Database:**
   - Click "New" on left sidebar
   - Enter: `skill_swap_db`
   - Click "Create"

3. **Import Schema:**
   - Select `skill_swap_db` database
   - Click "Import" tab
   - Choose file: `backend/database/schema.sql`
   - Click "Go"

### Step 3: Start the Application

#### Option A: Use Installation Script
```bash
# Double-click this file in Windows Explorer
install.bat
```

#### Option B: Manual Installation
```bash
# Install backend dependencies
cd backend
npm install

# Start backend server
npm start

# In another terminal, start frontend
npm start
```

## 🌐 Access URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **phpMyAdmin:** http://localhost/phpmyadmin

## 🧪 Test the Platform

1. **Register a new user**
2. **Login with credentials**
3. **Search for users by skills**
4. **Update your profile**

## 🔧 Troubleshooting

### Database Connection Issues
- Make sure XAMPP MySQL is running
- Check if database `skill_swap_db` exists
- Verify MySQL is on port 3306

### Port Issues
- Frontend: Change port in package.json if 3000 is busy
- Backend: Change PORT in config.env if 5000 is busy

### CORS Issues
- Check `CORS_ORIGIN` in `backend/config.env`
- Make sure it matches your frontend URL

## 📊 API Endpoints

- `POST /api/register` - Register user
- `POST /api/login` - Login user
- `GET /api/search` - Search users
- `GET /api/profile/:id` - Get profile
- `PUT /api/profile/:id` - Update profile

## 🎉 Success!

Once everything is running:
- Frontend: Beautiful React app with animations
- Backend: Secure API with MySQL database
- Database: Persistent user and skill data

Your Skill Swap Platform is now fully functional! 🚀 