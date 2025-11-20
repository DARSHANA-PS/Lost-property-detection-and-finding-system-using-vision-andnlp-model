import React from 'react';
import { 
  Zap, Shield, Clock, Brain, Camera, Bell, 
  MapPin, Users, Lock, Smartphone, CheckCircle, Star 
} from 'lucide-react';

const FeaturesPage: React.FC = () => {
  const mainFeatures = [
    {
      icon: Brain,
      title: 'AI Image Recognition',
      description: 'Advanced computer vision technology that can identify objects, read text, and detect patterns with 98% accuracy.',
      benefits: ['Instant item identification', 'Works with partial images', 'Recognizes handwritten text', 'Brand and model detection'],
      color: 'blue'
    },
    {
      icon: Shield,
      title: 'Privacy-First Design',
      description: 'Complete privacy protection with encrypted data storage and secure matching algorithms.',
      benefits: ['No public displays', 'Encrypted notifications', 'Secure database queries', 'GDPR compliant'],
      color: 'green'
    },
    {
      icon: Zap,
      title: 'Lightning Fast Matching',
      description: 'Average processing time under 2 minutes from upload to owner notification.',
      benefits: ['Real-time processing', 'Instant notifications', 'Automated workflow', '24/7 availability'],
      color: 'purple'
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Experience',
      description: 'Optimized for smartphones with intuitive touch interfaces and camera integration.',
      benefits: ['One-tap photo upload', 'Responsive design', 'Offline capability', 'Push notifications'],
      color: 'orange'
    }
  ];

  const additionalFeatures = [
    { icon: Camera, title: 'Smart Photo Analysis', desc: 'Automatic image enhancement and focus detection' },
    { icon: Bell, title: 'Instant Alerts', desc: 'Real-time notifications via SMS and email' },
    { icon: MapPin, title: 'Location Services', desc: 'Secure pickup location coordination' },
    { icon: Users, title: 'Campus Integration', desc: 'Seamless connection with student databases' },
    { icon: Lock, title: 'Data Security', desc: 'End-to-end encryption and secure storage' },
    { icon: Clock, title: '24/7 Operation', desc: 'Automated system works around the clock' }
  ];

  const stats = [
    { number: '98%', label: 'Recognition Accuracy', color: 'blue' },
    { number: '<2min', label: 'Average Match Time', color: 'green' },
    { number: '24/7', label: 'System Availability', color: 'purple' },
    { number: '99.9%', label: 'Privacy Protection', color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="block text-blue-600">Smart Recovery</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Discover the advanced capabilities that make our AI-powered system 
            the most effective lost and found solution for campus environments.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {mainFeatures.map((feature, index) => (
              <div key={index} className="group">
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`bg-${feature.color}-100 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-lg">{feature.description}</p>
                  </div>
                </div>
                <div className="ml-16">
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <CheckCircle className={`h-4 w-4 text-${feature.color}-500 mr-3 flex-shrink-0`} />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Performance Metrics</h2>
            <p className="text-gray-600">Numbers that speak for themselves</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl md:text-5xl font-bold text-${stat.color}-600 mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Feature Set</h2>
            <p className="text-gray-600">Everything you need for efficient lost and found management</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our System?</h2>
            <p className="text-gray-600">See how we compare to traditional lost and found methods</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {/* Traditional Method */}
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Traditional Method</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                    Manual sorting required
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                    Public bulletin boards
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                    No privacy protection
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                    Weeks to find owners
                  </li>
                  <li className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                    Staff intensive
                  </li>
                </ul>
              </div>

              {/* Our System */}
              <div className="p-8 bg-blue-50">
                <h3 className="text-xl font-semibold text-blue-900 mb-6 text-center">Our AI System</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-blue-800">
                    <Star className="w-4 h-4 text-blue-600 mr-3" />
                    Automated AI matching
                  </li>
                  <li className="flex items-center text-blue-800">
                    <Star className="w-4 h-4 text-blue-600 mr-3" />
                    Private notifications
                  </li>
                  <li className="flex items-center text-blue-800">
                    <Star className="w-4 h-4 text-blue-600 mr-3" />
                    Complete privacy protection
                  </li>
                  <li className="flex items-center text-blue-800">
                    <Star className="w-4 h-4 text-blue-600 mr-3" />
                    Under 2 minutes matching
                  </li>
                  <li className="flex items-center text-blue-800">
                    <Star className="w-4 h-4 text-blue-600 mr-3" />
                    Fully automated
                  </li>
                </ul>
              </div>

              {/* Benefits */}
              <div className="p-8">
                <h3 className="text-xl font-semibold text-green-900 mb-6 text-center">Your Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-green-800">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    98% success rate
                  </li>
                  <li className="flex items-center text-green-800">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    Zero staff time required
                  </li>
                  <li className="flex items-center text-green-800">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    Enhanced campus security
                  </li>
                  <li className="flex items-center text-green-800">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    Improved student satisfaction
                  </li>
                  <li className="flex items-center text-green-800">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    Cost-effective solution
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Experience These Features Today</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join the revolution in campus lost and found management. 
            See the difference AI-powered matching can make.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
              Try Demo Upload
            </button>
            <button className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors duration-200 border border-blue-400">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;