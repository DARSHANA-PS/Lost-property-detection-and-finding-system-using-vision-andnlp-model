import React, { useState } from 'react';
import { Camera, Search, Bell, MapPin, Upload, CheckCircle } from 'lucide-react';

const HomePage: React.FC<{ onPageChange?: (page: string) => void }> = ({ onPageChange }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
      setUploadedFile(files[0]);
      simulateProcessing();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setUploadedFile(files[0]);
      simulateProcessing();
    }
  };

  const simulateProcessing = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered Lost Item
              <span className="block text-blue-600">Recovery System</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Campus-exclusive smart matching system that uses AI image recognition and OCR 
              to instantly connect lost items with their owners through secure, private notifications.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={() => onPageChange ? onPageChange('report-lost') : (window.location.hash = 'report-lost')}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Camera className="inline-block mr-2 h-5 w-5" />
                Report Lost Item
              </button>
              <button 
                onClick={() => onPageChange ? onPageChange('report-found') : (window.location.hash = 'report-found')}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Search className="inline-block mr-2 h-5 w-5" />
                Report Found Item
              </button>
            </div>
          </div>

          {/* Process Steps */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Upload, title: 'Upload Photo', desc: 'Take a photo of the lost or found item' },
              { icon: Search, title: 'AI Analysis', desc: 'Our AI scans for text, IDs, and identifiable features' },
              { icon: Bell, title: 'Smart Match', desc: 'System matches with secure student database' },
              { icon: MapPin, title: 'Instant Alert', desc: 'Owner gets private notification with pickup location' },
            ].map((step, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Upload Demo */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Try It Out</h2>
            <p className="text-gray-600">Upload an item photo to see our AI recognition in action</p>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl">
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
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
                onChange={handleFileSelect}
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

            {uploadedFile && (
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Camera className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  {isProcessing ? (
                    <div className="flex items-center text-blue-600">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                      Processing...
                    </div>
                  ) : showSuccess ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Analysis Complete!
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">&lt;2min</div>
              <div className="text-gray-600">Average Match Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Automated Service</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;