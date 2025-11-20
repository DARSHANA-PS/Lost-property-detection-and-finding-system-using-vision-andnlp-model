import React, { useState, useEffect } from 'react';
import { Search, Menu, X, User, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const apiUrl = (import.meta && (import.meta as any).env && (import.meta as any).env.VITE_API_URL) || 'http://localhost:4000';

const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadMatches, setUnreadMatches] = useState(0);
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUnreadMatches();
      // Poll every 10 seconds for new matches
      const interval = setInterval(loadUnreadMatches, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const loadUnreadMatches = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/matches/user/${user!.id}`);
      const data = await res.json();
      if (data.matches && Array.isArray(data.matches)) {
        // Count matches that don't have messages yet (new matches)
        setUnreadMatches(data.matches.length);
      }
    } catch (err) {
      console.error('Failed to load match count', err);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore' },
    { id: 'report-lost', label: 'Report Lost' },
    { id: 'report-found', label: 'Report Found' },
    { id: 'my-items', label: 'My Items' },
    { id: 'messages', label: 'Messages' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLogout = () => {
    logout();
    onPageChange('home');
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onPageChange('home')}>
            <div className="bg-blue-600 p-2 rounded-lg">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">AI Lost & Found</h1>
              <p className="text-xs text-gray-500">Smart Recovery System</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    currentPage === item.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </button>
            ))}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Messages Notification */}
                <button
                  onClick={() => onPageChange('messages')}
                  className="relative text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  title="Messages"
                >
                  <Bell className="h-5 w-5" />
                  {unreadMatches > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {unreadMatches > 99 ? '99+' : unreadMatches}
                    </span>
                  )}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          onPageChange('profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="inline h-4 w-4 mr-2" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          onPageChange('messages');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Bell className="inline h-4 w-4 mr-2" />
                        Messages
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="inline h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onPageChange('login')}
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Login
                </button>
                <button
                  onClick={() => onPageChange('signup')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`text-left px-3 py-2 text-base font-medium transition-colors duration-200 ${
                      currentPage === item.id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
              ))}
              
              {!isAuthenticated && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <button
                    onClick={() => {
                      onPageChange('login');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      onPageChange('signup');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-base font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Sign Up
                  </button>
                </div>
              )}
              
              {isAuthenticated && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="inline h-4 w-4 mr-2" />
                    Logout
                  </button>
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