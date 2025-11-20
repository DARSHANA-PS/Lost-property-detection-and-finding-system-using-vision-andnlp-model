import React from 'react';
import { Shield, Zap, Users, Brain, Lock, Clock } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Revolutionizing Campus
            <span className="block text-blue-600">Lost & Found</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our AI-powered system eliminates the frustration of traditional lost and found processes, 
            connecting students with their belongings through intelligent matching and secure notifications.
          </p>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Problem */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3"></div>
                  <p className="text-gray-700">Traditional lost & found systems rely on manual sorting and hope that owners will check physical bulletin boards</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3"></div>
                  <p className="text-gray-700">Items sit unclaimed for weeks or months, eventually being discarded</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3"></div>
                  <p className="text-gray-700">No privacy protection - personal information displayed publicly</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3"></div>
                  <p className="text-gray-700">Time-consuming process for both students and staff</p>
                </div>
              </div>
            </div>

            {/* Solution */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Solution</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-3"></div>
                  <p className="text-gray-700">AI-powered image recognition instantly identifies items and extracts relevant information</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-3"></div>
                  <p className="text-gray-700">Secure database matching connects items with owners automatically</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-3"></div>
                  <p className="text-gray-700">Private notifications protect student privacy while ensuring quick recovery</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-3"></div>
                  <p className="text-gray-700">24/7 automated system requires no manual intervention</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How AI Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Image Recognition Technology</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our advanced AI system combines computer vision and optical character recognition 
              to identify and match lost items with incredible accuracy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Image Analysis</h3>
              <p className="text-gray-600">
                Deep learning algorithms analyze item characteristics including color, shape, brand, 
                and distinctive features to create a unique digital fingerprint.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">OCR Text Extraction</h3>
              <p className="text-gray-600">
                Optical Character Recognition reads text from ID cards, name tags, 
                and labels with 99%+ accuracy, even from partial or angled images.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure Matching</h3>
              <p className="text-gray-600">
                Encrypted database queries match extracted information with student records 
                while maintaining complete privacy and data protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our System?</h2>
            <p className="text-gray-600">Built specifically for campus environments with student privacy and efficiency in mind.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Average matching time under 2 minutes from upload to notification.</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-600">No public displays. All notifications are private and secure.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Available</h3>
              <p className="text-gray-600">Works around the clock without requiring staff intervention.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Campus?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join the future of lost and found. Help create a more connected, helpful campus community.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;