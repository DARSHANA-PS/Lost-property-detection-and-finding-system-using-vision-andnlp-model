import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, Search, Eye, Trash2, User, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Item } from '../types';

const apiUrl = (import.meta && (import.meta as any).env && (import.meta as any).env.VITE_API_URL) || 'http://localhost:4000';

const ExplorePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadItems();
  }, [activeTab]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/items?type=${activeTab}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error('Failed to load items', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const res = await fetch(`${apiUrl}/api/items/${itemId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setItems(items.filter(i => i.id !== itemId));
      }
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  const filtered = items.filter(i =>
    (i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
    i.status !== 'deleted'
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Items</h1>
          <p className="text-gray-600">Browse recently reported lost and found items</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('lost')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
                  activeTab === 'lost' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Lost Items
              </button>
              <button
                onClick={() => setActiveTab('found')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
                  activeTab === 'found' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Found Items
              </button>
            </nav>
          </div>

          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
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

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-500">Try adjusting your search or check back later.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(item => (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                    {item.imageUrl && (
                      <div className="mb-4">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover rounded-lg" />
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <div className="flex flex-col gap-1 items-end">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {item.status}
                        </span>
                        {item.status === 'matched' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Matched!
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {item.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(item.dateReported).toLocaleDateString()}
                      </div>
                      {item.reporterRollNo && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          <span title="Roll Number">{item.reporterRollNo}</span>
                        </div>
                      )}
                      {item.reporterInstitution && (
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2" />
                          <span className="text-xs" title="Institution">{item.reporterInstitution}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                        <Eye className="h-4 w-4 inline mr-1" />
                        View
                      </button>
                      {user && user.id === item.reportedBy && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4 inline mr-1" />
                          Delete
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
  );
};

export default ExplorePage;
