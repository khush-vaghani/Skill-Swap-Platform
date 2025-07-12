import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, Settings, Users } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-xl border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Skill Swap</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              Home
            </Link>
            {user && (
              <>
                <Link to="/requests" className="nav-link">
                  Requests
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="nav-link">
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 nav-link">
                  <User size={20} className="group-hover:scale-110 transition-transform duration-300" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 nav-link"
                >
                  <LogOut size={20} className="group-hover:scale-110 transition-transform duration-300" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-all duration-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-white/20 bg-white/80 backdrop-blur-md rounded-b-2xl shadow-xl animate-slide-up">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="nav-link px-4 py-2 rounded-xl hover:bg-white/50">
                Home
              </Link>
              {user && (
                <>
                  <Link to="/requests" className="nav-link px-4 py-2 rounded-xl hover:bg-white/50">
                    Requests
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="nav-link px-4 py-2 rounded-xl hover:bg-white/50">
                      Admin
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center space-x-2 nav-link px-4 py-2 rounded-xl hover:bg-white/50">
                    <User size={20} />
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 nav-link px-4 py-2 rounded-xl hover:bg-white/50"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              )}
              {!user && (
                <div className="flex flex-col space-y-3 px-4">
                  <Link to="/login" className="nav-link text-center py-2 rounded-xl hover:bg-white/50">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-center">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 