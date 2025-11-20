import React from 'react';
import { Camera, Brain, Database, Bell, MapPin, CheckCircle, Upload, Search } from 'lucide-react';

const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      id: 1,
      icon: Camera,
      title: 'Capture & Upload',
      description: 'Take a clear photo of the lost or found item using your smartphone camera.',
      details: [
        'High-quality images work best',
        'Multiple angles improve accuracy',
        'Include any visible text or labels',
        'Works with partial items too'
      ],
      color: 'blue'
    },
    {
      id: 2,
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our advanced AI system analyzes the image using computer vision and OCR technology.',
      details: [
        'Object recognition identifies item type',
        'OCR extracts text from IDs and labels',
        'Color and pattern analysis',
        'Brand and model detection'
      ],
      color: 'purple'
    },
    {
      id: 3,
      icon: Database,
      title: 'Secure Database Search',
      description: 'The system searches our encrypted student database for potential matches.',
      details: [
        'Matches names from ID cards',
        'Cross-references student records',
        'Maintains complete privacy',
        'Encrypted data protection'
      ],
      color: 'green'
    },
    {
      id: 4,
      icon: Bell,
      title: 'Instant Notification',
      description: 'The owner receives a private notification with pickup instructions.',
      details: [
        'SMS or email notification',
        'Secure pickup location',
        'Verification process',
        'No public information displayed'
      ],
      color: 'orange'
    }
  ];

  const scenarios = [
    {
      title: 'Lost Student ID',
      description: 'Someone finds a student ID card on campus',
      process: 'AI reads the name and student number, instantly matches with the campus directory, and sends a secure notification to the owner.',
      icon: '🆔'
    },
    {
      title: 'Lost Textbook',
      description: 'A textbook with a name written inside is found',
      process: 'OCR technology detects handwritten names, matches against student records, and notifies the owner with pickup location.',
      icon: '📚'
    },
    {
      title: 'Lost Electronics',
      description: 'A phone or laptop is found in a classroom',
      process: 'AI identifies the device type and any visible identifying marks, cross-references with reported lost items, and facilitates secure return.',
      icon: '📱'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our intelligent system transforms lost and found from a manual process 
            into an automated, efficient, and privacy-focused experience.
          </p>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Process</h2>
            <p className="text-gray-600">Four simple steps from upload to reunion</p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={step.id} className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className={`bg-${step.color}-100 w-12 h-12 rounded-full flex items-center justify-center mr-4`}>
                      <step.icon className={`h-6 w-6 text-${step.color}-600`} />
                    </div>
                    <div>
                      <span className={`text-sm font-semibold text-${step.color}-600`}>Step {step.id}</span>
                      <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 text-lg">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-2xl p-8 h-64 flex items-center justify-center">
                    <step.icon className={`h-24 w-24 text-${step.color}-400`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-World Scenarios */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Real-World Examples</h2>
            <p className="text-gray-600">See how our system handles different types of lost items</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {scenarios.map((scenario, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-4xl mb-4 text-center">{scenario.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{scenario.title}</h3>
                <p className="text-gray-600 mb-4">{scenario.description}</p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
                  <p className="text-blue-700 text-sm">{scenario.process}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Behind the Scenes</h2>
            <p className="text-gray-600">The technology that makes it all possible</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Advanced AI Technology</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Search className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Computer Vision</h4>
                    <p className="text-gray-600 text-sm">Deep learning models trained on thousands of campus items for accurate identification.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Brain className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">OCR Technology</h4>
                    <p className="text-gray-600 text-sm">Advanced text recognition capable of reading handwriting, printed text, and even faded labels.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Database className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Secure Database</h4>
                    <p className="text-gray-600 text-sm">Encrypted student directory with privacy-first design and secure matching algorithms.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Processing Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Image Upload</span>
                  <span className="text-blue-600 font-medium">&lt;1 sec</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">AI Analysis</span>
                  <span className="text-purple-600 font-medium">15-30 sec</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Database Search</span>
                  <span className="text-green-600 font-medium">5-10 sec</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Notification Sent</span>
                  <span className="text-orange-600 font-medium">&lt;1 sec</span>
                </div>
                <hr className="my-2" />
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-900">Total Time</span>
                  <span className="text-blue-600">&lt;2 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience the Future?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of students already using our smart lost and found system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
              <Upload className="inline-block mr-2 h-5 w-5" />
              Report Found Item
            </button>
            <button className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors duration-200 border border-blue-400">
              <Camera className="inline-block mr-2 h-5 w-5" />
              Report Lost Item
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;