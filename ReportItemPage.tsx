import React, { useState } from 'react';
import { Camera, Upload, MapPin, Calendar, Brain, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analyzeImage } from '../services/aiService';

interface ReportItemPageProps {
  type: 'lost' | 'found';
  onPageChange: (page: string) => void;
}

const ReportItemPage: React.FC<ReportItemPageProps> = ({ type, onPageChange }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    dateReported: new Date().toISOString().split('T')[0],
  });

  const categories = [
    'Electronics', 'Books & Stationery', 'Clothing & Accessories', 
    'ID Cards & Documents', 'Keys', 'Bags & Backpacks', 
    'Sports Equipment', 'Jewelry', 'Other'
  ];

  // Reporting is allowed for any user (public access). If user is logged in, reportedBy will be set.

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setAnalyzing(true);
    
    try {
      const analysis = await analyzeImage(file);
      setAiAnalysis(analysis);
      
      // Auto-fill form based on AI analysis
      setFormData(prev => ({
        ...prev,
        title: prev.title || analysis.itemType,
        description: prev.description || `${analysis.itemType} - ${analysis.detectedText.join(', ')}`,
        category: prev.category || getCategoryFromItemType(analysis.itemType)
      }));
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getCategoryFromItemType = (itemType: string): string => {
    const typeMap: { [key: string]: string } = {
      'ID Card': 'ID Cards & Documents',
      'Mobile Phone': 'Electronics',
      'Textbook': 'Books & Stationery',
      'Wallet': 'Clothing & Accessories',
      'Keys': 'Keys',
      'Backpack': 'Bags & Backpacks'
    };
    return typeMap[itemType] || 'Other';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send to backend API
      const apiUrl = (import.meta && (import.meta as any).env && (import.meta as any).env.VITE_API_URL) || 'http://localhost:4000';

      const payload = new FormData();
      payload.append('type', type);
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('category', formData.category);
      payload.append('location', formData.location);
      payload.append('dateReported', formData.dateReported);
      payload.append('status', 'active');
      if (user && user.id) payload.append('reportedBy', user.id);
      if (user && user.name) payload.append('reporterName', user.name);
      if (user && user.rollNo) payload.append('reporterRollNo', user.rollNo);
      if (user && user.institution) payload.append('reporterInstitution', user.institution);
      if (aiAnalysis) payload.append('aiAnalysis', JSON.stringify(aiAnalysis));
      if (selectedFile) payload.append('image', selectedFile);

      const res = await fetch(`${apiUrl}/api/items`, {
        method: 'POST',
        body: payload,
      });

      if (!res.ok) throw new Error('Failed to save item on server');

      setSuccess(true);
      setTimeout(() => {
        onPageChange('explore');
      }, 1500);
    } catch (error) {
      console.error('Failed to save item:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {type === 'lost' ? 'Lost Item Reported!' : 'Found Item Reported!'}
            </h2>
            <p className="text-gray-600 mb-6">
              Your item has been successfully reported. Our AI system is now searching for matches.
            </p>
            <div className="text-sm text-gray-500">
              Redirecting to your items...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Report {type === 'lost' ? 'Lost' : 'Found'} Item
          </h1>
          <p className="text-gray-600">
            {type === 'lost' 
              ? 'Help us find your lost item with AI-powered matching'
              : 'Help return a found item to its owner'
            }
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                <Camera className="inline h-5 w-5 mr-2" />
                Upload Photo
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragOver
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop your image here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">PNG, JPG, or GIF up to 10MB</p>
                </label>
              </div>

              {selectedFile && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Camera className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    {analyzing && (
                      <div className="flex items-center text-blue-600">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                        Analyzing...
                      </div>
                    )}
                  </div>

                  {aiAnalysis && (
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center mb-3">
                        <Brain className="h-5 w-5 text-purple-600 mr-2" />
                        <h4 className="font-semibold text-gray-900">AI Analysis Results</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Item Type:</span> {aiAnalysis.itemType}</p>
                        <p><span className="font-medium">Confidence:</span> {(aiAnalysis.confidence * 100).toFixed(1)}%</p>
                        {aiAnalysis.detectedText.length > 0 && (
                          <p><span className="font-medium">Detected Text:</span> {aiAnalysis.detectedText.join(', ')}</p>
                        )}
                        {aiAnalysis.extractedInfo.names && (
                          <p><span className="font-medium">Names Found:</span> {aiAnalysis.extractedInfo.names.join(', ')}</p>
                        )}
                        {aiAnalysis.extractedInfo.ids && (
                          <p><span className="font-medium">IDs Found:</span> {aiAnalysis.extractedInfo.ids.join(', ')}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Item Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., iPhone 13, Blue Backpack"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Provide detailed description including color, brand, distinctive features..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={type === 'lost' ? 'Where did you lose it?' : 'Where did you find it?'}
                />
              </div>

              <div>
                <label htmlFor="dateReported" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Date {type === 'lost' ? 'Lost' : 'Found'}
                </label>
                <input
                  type="date"
                  id="dateReported"
                  name="dateReported"
                  required
                  value={formData.dateReported}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => onPageChange('home')}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || analyzing}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : `Report ${type === 'lost' ? 'Lost' : 'Found'} Item`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportItemPage;