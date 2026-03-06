import {
    ArrowRight,
    CheckCircle,
    Globe,
    Lightbulb,
    Shield,
    Target,
    TrendingUp,
    Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              About Smart Governance
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transforming governance through technology, transparency, and citizen empowerment
            </p>
          </div>
        </div>
      </section>

      {/* ==================== MISSION & VISION ==================== */}
      <section className="relative py-24 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Mission */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-4 mb-4">
              <Target className="text-blue-600" size={32} />
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              To create a transparent, efficient, and accessible governance system that empowers every citizen and bridges the gap between government and the public.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe that good governance is the foundation of a prosperous society. By leveraging technology and promoting transparency, we aim to make government services more responsive to citizen needs and accountable to the public.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-4 mb-4">
              <Lightbulb className="text-green-600" size={32} />
              <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              A future where every citizen has seamless access to government services, can participate in governance, and has complete visibility into how their government operates.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We envision a digital-first, citizen-centric governance model where technology serves as an enabler of better public service delivery and enhanced democratic participation.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== CORE VALUES ==================== */}
      <section className="relative py-24 px-4 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Our Core Values</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Transparency',
                description: 'All government operations are open, honest, and subject to public scrutiny'
              },
              {
                icon: Users,
                title: 'Citizen-Centric',
                description: 'We put citizens at the heart of everything, ensuring their needs are met'
              },
              {
                icon: TrendingUp,
                title: 'Efficiency',
                description: 'We streamline processes to deliver services faster and better'
              },
              {
                icon: Globe,
                title: 'Inclusivity',
                description: 'Everyone deserves access to government services, regardless of background'
              }
            ].map((value, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <value.icon className="text-blue-600 mb-4" size={32} />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== OUR STORY ==================== */}
      <section className="relative py-24 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Story</h2>

        <div className="space-y-8">
          <div className="bg-white border-l-4 border-blue-600 rounded-lg p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">The Beginning</h3>
            <p className="text-gray-600 leading-relaxed">
              Smart Governance & Public Platform was born from a simple idea: government services should be as accessible and user-friendly as the best private sector services. We recognized that citizens were struggling with complex bureaucratic processes, lack of transparency, and limited access to information.
            </p>
          </div>

          <div className="bg-white border-l-4 border-green-600 rounded-lg p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Growth</h3>
            <p className="text-gray-600 leading-relaxed">
              Starting with a pilot program in a single city, we have grown to serve over 50,000 citizens across multiple municipalities. Our platform has processed thousands of applications and has achieved a 98% citizen satisfaction rate. We have become a trusted bridge between government and citizens.
            </p>
          </div>

          <div className="bg-white border-l-4 border-purple-600 rounded-lg p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Impact</h3>
            <p className="text-gray-600 leading-relaxed">
              We've reduced processing times from weeks to days, eliminated unnecessary paperwork, and created unprecedented transparency in government operations. Citizen feedback has consistently praised our commitment to making government more accessible and responsive to their needs.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== KEY ACHIEVEMENTS ==================== */}
      <section className="relative py-24 px-4 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Key Achievements</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                metric: '50,000+',
                label: 'Citizens Served',
                description: 'Active users on our platform'
              },
              {
                metric: '98%',
                label: 'Satisfaction Rate',
                description: 'Citizen satisfaction with services'
              },
              {
                metric: '500+',
                label: 'Services',
                description: 'Government services available'
              },
              {
                metric: '70%',
                label: 'Reduction',
                description: 'In average processing time'
              },
              {
                metric: '100%',
                label: 'Digital',
                description: 'Paperless governance'
              },
              {
                metric: '24/7',
                label: 'Availability',
                description: 'Round-the-clock support'
              }
            ].map((achievement, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-3">
                  {achievement.metric}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{achievement.label}</h3>
                <p className="text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="relative py-24 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Why Choose Smart Governance?</h2>

        <div className="space-y-4">
          {[
            'Single Platform for All Government Services',
            'Real-time Application Status Tracking',
            'Complete Transparency in Government Operations',
            'Secure and Encrypted Data Storage',
            'Mobile-Friendly and Easy to Use',
            '24/7 Customer Support in Multiple Languages',
            'No Hidden Fees or Charges',
            'Verified and Certified Government Services',
            'Digital Document Management',
            'Seamless Integration with All Departments'
          ].map((point, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition">
              <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
              <span className="text-lg text-gray-700">{point}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== TEAM SECTION ==================== */}
      <section className="relative py-24 px-4 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Our Team</h2>

          <p className="text-center text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
            We are a dedicated team of government officials, technology experts, designers, and citizen advocates united by a common vision: to transform governance through innovation and transparency.
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { emoji: '👨‍💼', name: 'Leadership Team', role: 'Government Officials & Policy Experts' },
              { emoji: '👨‍💻', name: 'Tech Team', role: 'Software Engineers & Architects' },
              { emoji: '🎨', name: 'Design Team', role: 'UX/UI Designers & Researchers' },
              { emoji: '📞', name: 'Support Team', role: 'Customer Service Specialists' }
            ].map((team, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm hover:shadow-md transition">
                <div className="text-5xl mb-4">{team.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{team.name}</h3>
                <p className="text-gray-600">{team.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="relative py-24 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">What People Say About Us</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote: 'This platform changed how I interact with government. Everything is so simple now!',
              author: 'Rajesh Kumar',
              role: 'Business Owner'
            },
            {
              quote: 'The transparency is amazing. I can see exactly where my application stands.',
              author: 'Priya Singh',
              role: 'Student'
            },
            {
              quote: 'Finally, a government service that actually works! Highly recommended.',
              author: 'Amit Patel',
              role: 'Farmer'
            }
          ].map((testimonial, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition">
              <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-bold text-gray-900">{testimonial.author}</p>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="relative py-24 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl text-blue-100 mb-8">
            Be part of a movement to transform governance and empower citizens
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Get Started
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-700 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}