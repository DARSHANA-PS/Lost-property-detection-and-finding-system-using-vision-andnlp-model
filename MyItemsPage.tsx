import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, MessageCircle, CheckCircle, Clock, MapPin, Calendar, Inbox, CheckCheck, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Item } from '../types';

interface MyItemsPageProps {
  onPageChange: (page: string) => void;
}

const MyItemsPage: React.FC<MyItemsPageProps> = ({ onPageChange }) => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarView, setSidebarView] = useState<'pending' | 'matched' | 'history'>('pending');

  useEffect(() => {
    if (isAuthenticated && user) {
      loadItems();
    }
  }, [activeTab, isAuthenticated, user]);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, sidebarView]);

  const loadItems = () => {
    const lostItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
    const foundItems = JSON.parse(localStorage.getItem('foundItems') || '[]');
    
    const userItems = activeTab === 'lost' 
      ? lostItems.filter((item: Item) => item.reportedBy === user?.id)
      : foundItems.filter((item: Item) => item.reportedBy === user?.id);
    
    setItems(userItems);
  };

  const filterItems = () => {
    let filtered = items;

    // Filter by sidebar view
    if (sidebarView === 'pending') {
      filtered = filtered.filter(item => item.status === 'active');
    } else if (sidebarView === 'matched') {
      filtered = filtered.filter(item => item.status === 'matched');
    } else if (sidebarView === 'history') {
      filtered = filtered.filter(item => item.status === 'returned' || item.status === 'deleted');
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'matched': return 'bg-yellow-100 text-yellow-800';
      case 'returned': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4" />;
      case 'matched': return <Eye className="h-4 w-4" />;
      case 'returned': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const pendingCount = items.filter(item => item.status === 'active').length;
  const matchedCount = items.filter(item => item.status === 'matched').length;
  const historyCount = items.filter(item => item.status === 'returned' || item.status === 'deleted').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to view your items.</p>
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
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Items</h1>
          <p className="text-gray-600">Track your reported lost and found items</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-20">
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Filters</h2>
                
                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                  <nav className="flex space-x-1 -mb-px">
                    <button
                      onClick={() => setActiveTab('lost')}
                      className={`px-3 py-2 text-sm font-medium rounded-t-lg ${
                        activeTab === 'lost'
                          ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Lost
                    </button>
                    <button
                      onClick={() => setActiveTab('found')}
                      className={`px-3 py-2 text-sm font-medium rounded-t-lg ${
                        activeTab === 'found'
                          ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Found
                    </button>
                  </nav>
                </div>

                {/* Sidebar Views */}
                <div className="space-y-3">
                  <button
                    onClick={() => setSidebarView('pending')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors duration-200 ${
                      sidebarView === 'pending'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Inbox className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="font-medium">Pending Items</div>
                      <div className="text-xs opacity-75">{pendingCount} items</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSidebarView('matched')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors duration-200 ${
                      sidebarView === 'matched'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <CheckCheck className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="font-medium">Matched Items</div>
                      <div className="text-xs opacity-75">{matchedCount} items</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSidebarView('history')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors duration-200 ${
                      sidebarView === 'history'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <History className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="font-medium">History</div>
                      <div className="text-xs opacity-75">{historyCount} items</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Search and Filter */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="p-6">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Search className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No items in {sidebarView}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm 
                        ? 'Try adjusting your search'
                        : `You don't have any ${sidebarView} items yet`
                      }
                    </p>
                    {sidebarView === 'pending' && (
                      <button
                        onClick={() => onPageChange(`report-${activeTab}`)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                      >
                        Report {activeTab === 'lost' ? 'Lost' : 'Found'} Item
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredItems.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200">
                        {item.imageUrl && (
                          <div className="mb-4">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 flex-1">{item.title}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                            <span className="ml-1 capitalize">{item.status}</span>
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                        <div className="space-y-2 text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                            {item.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                            {new Date(item.dateReported).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                            <Eye className="h-4 w-4 inline mr-1" />
                            View
                          </button>
                          {item.status === 'matched' && (
                            <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200">
                              <MessageCircle className="h-4 w-4 inline mr-1" />
                              Message
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyItemsPage;