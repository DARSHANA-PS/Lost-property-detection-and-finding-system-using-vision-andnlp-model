import React, { useState, useEffect } from 'react';
import { User, Mail, CreditCard, Building2, Phone, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfilePageProps {
  onPageChange: (page: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onPageChange }) => {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userItems, setUserItems] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    rollNo: user?.rollNo || '',
    institution: user?.institution || ''
  });

  useEffect(() => {
    if (user) {
      loadUserItems();
    }
  }, [user]);

  const loadUserItems = async () => {
    try {
      const apiUrl = (import.meta && (import.meta as any).env && (import.meta as any).env.VITE_API_URL) || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/items/user/${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setUserItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load user items', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updated = await updateProfile(formData.name, formData.phone, formData.rollNo, formData.institution);
      if (updated) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    onPageChange('login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Not Authenticated</h2>
            <p className="text-gray-600 mb-6">Please sign in to view your profile.</p>
            <button
              onClick={() => onPageChange('login')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 text-center mb-1">{user.name}</h2>
              <p className="text-sm text-gray-500 text-center mb-6">{user.email}</p>
              
              <div className="space-y-3 mb-6 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Roll No</p>
                  <p className="text-sm text-gray-900">{user.rollNo}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Institution</p>
                  <p className="text-sm text-gray-900">{user.institution}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Phone</p>
                  <p className="text-sm text-gray-900">{user.phone || 'Not provided'}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Edit Profile Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Account Information</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors duration-200 flex items-center"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700 mb-2">
                      Roll Number
                    </label>
                    <input
                      id="rollNo"
                      name="rollNo"
                      type="text"
                      value={formData.rollNo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
                      Institution / Department
                    </label>
                    <input
                      id="institution"
                      name="institution"
                      type="text"
                      value={formData.institution}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Full Name</p>
                    <p className="text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Roll Number</p>
                    <p className="text-gray-900">{user.rollNo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Institution / Department</p>
                    <p className="text-gray-900">{user.institution}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Phone Number</p>
                    <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>
              )}
            </div>

            {/* My Items Section */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">My Reports ({userItems.length})</h3>
              {userItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">You haven't reported any items yet.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {userItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-24 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.type === 'lost' ? '🔴 Lost' : '🟢 Found'}</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        item.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        item.status === 'matched' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
