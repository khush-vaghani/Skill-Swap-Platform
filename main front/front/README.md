# Skill Swap Platform

A modern web application for users to offer and request skills via a swap-based interaction system. Built with React, JavaScript, and Tailwind CSS.

## Features

### User Features
- **Authentication**: Register/login with email & password
- **Profile Management**: Edit profile with skills offered/wanted, location, availability
- **User Discovery**: Browse and search users by skills and availability
- **Skill Swapping**: Request skill swaps with other users
- **Request Management**: Accept/reject/delete swap requests
- **Rating System**: Rate and provide feedback after successful swaps

### Admin Features
- **Dashboard**: Overview of users, swaps, and platform statistics
- **User Management**: Ban/unban users, view user details
- **Swap Monitoring**: Track all swap requests and their status
- **Data Export**: Export user data, swaps, and feedback logs
- **Announcements**: Send platform-wide announcements

## Tech Stack

- **Frontend**: React 18 with JavaScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd skill-swap-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Demo Accounts

For testing purposes, you can use these demo accounts:

### Admin Account
- **Email**: admin@example.com
- **Password**: admin123
- **Features**: Full admin access to dashboard, user management, and reports

### Regular User Account
- **Email**: user@example.com
- **Password**: user123
- **Features**: Standard user features, profile management, skill swapping

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navbar.js       # Navigation component
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication state management
├── pages/              # Page components
│   ├── Home.js         # Home page with user browsing
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   ├── Profile.js      # User profile management
│   ├── ProfileDetail.js # Other user's profile view
│   ├── SwapRequest.js  # Skill swap request form
│   ├── RequestManagement.js # Swap request management
│   └── AdminDashboard.js # Admin dashboard
├── App.js              # Main app component with routing
├── index.js            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Key Features Explained

### 1. User Authentication
- Secure login/register system
- Session persistence using localStorage
- Role-based access control (user/admin)

### 2. Skill Swapping System
- Users can offer skills they're proficient in
- Users can request skills they want to learn
- Swap requests must match offered/wanted skills
- Optional messaging system for requests

### 3. Profile Management
- Public/private profile toggle
- Skills offered and wanted management
- Location and availability settings
- Profile photo support (placeholder implementation)

### 4. Request Management
- View all sent and received requests
- Accept/reject pending requests
- Track request status (pending/accepted/rejected)
- Rating system for completed swaps

### 5. Admin Dashboard
- Overview statistics
- User management (ban/unban)
- Swap monitoring and moderation
- Data export functionality
- Platform announcements

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## Customization

### Styling
The application uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.js`
- Component styles in `src/index.css`
- Individual component styling

### Data
Currently uses mock data. To connect to a real backend:
1. Replace mock data in components with API calls
2. Update authentication to use real backend
3. Implement proper error handling
4. Add loading states for API calls

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (not recommended)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- Real-time messaging system
- Video call integration
- Skill verification system
- Advanced search filters
- Mobile app development
- Payment integration for premium features
- Skill certification system
- Community features (forums, groups) 