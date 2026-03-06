import axios from 'axios';
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle,
  ChevronDown,
  Clock,
  FileText,
  Loader,
  Lock,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactError, setContactError] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactMessage('');
    setContactError('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/contact/submit`,
        contactForm
      );

      setContactMessage(response.data.message);
      setContactForm({ name: '', email: '', message: '' });
      
      setTimeout(() => setContactMessage(''), 5000);
    } catch (err) {
      setContactError(err.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen overflow-hidden">
      
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 bg-gradient-to-b from-white via-blue-50 to-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-20 left-10 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
          <div 
            className="absolute bottom-32 right-10 w-96 h-96 bg-green-100/40 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * -0.2}px)` }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-8 hover:border-blue-300 transition">
            <Sparkles size={16} className="text-blue-600" />
            <span className="text-sm text-gray-700">Transparent Governance for All Citizens</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Smart Governance
            </span>
            <br />
            <span className="text-gray-800">& Public Platform</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Empowering citizens with transparent, efficient, and accessible governance solutions for a better tomorrow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 text-gray-800 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Sign In
            </Link>
          </div>

          <div className="flex justify-center animate-bounce">
            <ChevronDown className="text-gray-400" size={24} />
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section className="relative py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Key Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transforming governance with technology and transparency
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Users, title: 'Citizen Portal', description: 'Direct access to government services and information' },
            { icon: TrendingUp, title: 'Real-time Analytics', description: 'Track development and progress with live data' },
            { icon: Lock, title: 'Secure & Private', description: 'Enterprise-grade security for citizen data' },
            { icon: Zap, title: 'Efficient Services', description: 'Fast-track application processing and approvals' },
            { icon: Building2, title: 'Infrastructure', description: 'Monitor public projects and development initiatives' },
            { icon: BarChart3, title: 'Transparency', description: 'Open data and accountability for all programs' },
            { icon: FileText, title: 'Digital Documents', description: 'Paperless governance with digital records' },
            { icon: Users, title: 'Community', description: 'Connect citizens and foster civic engagement' }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="group bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]"
            >
              <div className="mb-4 inline-block p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <feature.icon className="text-blue-600" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== ABOUT US SECTION ==================== */}
      <section className="relative py-24 px-4 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About Smart Governance</h2>
              <p className="text-gray-600 mb-4 leading-relaxed text-lg">
                Smart Governance & Public Platform is a revolutionary initiative designed to bridge the gap between government and citizens. Our mission is to make governance transparent, accessible, and efficient for everyone.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                We leverage cutting-edge technology to streamline government services, reduce bureaucracy, and empower citizens with real-time access to information and services. Our platform serves as a single window for all citizen interactions with government.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                Since our launch, we have served over 50,000 citizens, processed thousands of applications, and achieved a 98% satisfaction rate. We are committed to transforming how government operates and serves its citizens.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Transparent Operations</h4>
                    <p className="text-gray-600 text-sm">All government activities are open for public scrutiny</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Citizen Empowerment</h4>
                    <p className="text-gray-600 text-sm">Direct access to services and information</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Digital First</h4>
                    <p className="text-gray-600 text-sm">Paperless, secure, and efficient processes</p>
                  </div>
                </div>
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 mt-6 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Learn More →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
                <p className="text-gray-600">Citizens Registered</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                <p className="text-gray-600">Satisfaction Rate</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                <p className="text-gray-600">Services Available</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                <p className="text-gray-600">Support Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section className="relative py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Citizens Say</h2>
          <p className="text-xl text-gray-600">Real feedback from our platform users</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Rajesh Kumar', role: 'Small Business Owner', image: '👨‍💼', text: 'Smart Governance Platform made it incredibly easy to get my business license. The entire process took just 2 days!' },
            { name: 'Priya Singh', role: 'Student', image: '👩‍🎓', text: 'Getting my documents verified online saved me so much time. No more waiting in long queues!' },
            { name: 'Amit Patel', role: 'Farmer', image: '👨‍🌾', text: 'The transparency in subsidy allocation gives me confidence. I know exactly where my application stands.' }
          ].map((testimonial, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{testimonial.image}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                ))}
              </div>
              <p className="text-gray-600 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== CONTACT US SECTION ==================== */}
      <section id="contact" className="relative py-24 px-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
            <p className="text-xl text-gray-300">Get in touch with our support team</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              {[
                { icon: MapPin, title: 'Address', content: 'Government Building, New Delhi, India - 110001' },
                { icon: Phone, title: 'Phone', content: '+91 (011) 2340-5678' },
                { icon: Mail, title: 'Email', content: 'support@smartgovernance.gov.in' },
                { icon: Clock, title: 'Hours', content: 'Mon - Fri: 9 AM - 6 PM' }
              ].map((contact, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <contact.icon className="text-blue-400 mt-1 flex-shrink-0" size={28} />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{contact.title}</h3>
                    <p className="text-gray-300">{contact.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
              
              {contactMessage && (
                <div className="bg-green-500/20 border border-green-500 text-green-300 p-4 rounded-lg mb-6 text-sm">
                  {contactMessage}
                </div>
              )}

              {contactError && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6 text-sm">
                  {contactError}
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
                <textarea
                  name="message"
                  placeholder="Your Message (minimum 10 characters)"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  rows="4"
                  minLength="10"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                ></textarea>
                <button
                  type="submit"
                  disabled={contactLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {contactLoading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="relative py-24 px-4 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Join Smart Governance Today</h2>
          <p className="text-xl text-blue-100 mb-8">
            Be part of a transparent and efficient governance system that serves all citizens equally
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Create Your Account
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="relative border-t border-gray-200 bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🏛️</span>
                Smart Governance
              </h3>
              <p className="text-gray-600 text-sm">
                Building transparent and efficient governance for everyone
              </p>
            </div>
            {[
              { title: 'Services', links: ['Citizens', 'Officials', 'Resources', 'API Docs'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Resources', links: ['Help Center', 'Documentation', 'FAQs', 'Guides'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms & Conditions', 'Cookie Policy', 'Contact'] }
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="font-semibold text-gray-900 mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, i) => (
                    <li key={i}>
                      <button className="text-gray-600 hover:text-gray-900 transition text-sm">
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-300 pt-8">
            <div className="flex justify-between items-center">
              <p className="text-gray-600 text-sm">&copy; 2025 Smart Governance & Public Platform. All rights reserved.</p>
              <div className="flex gap-4">
                <button className="text-gray-600 hover:text-gray-900 text-sm">Facebook</button>
                <button className="text-gray-600 hover:text-gray-900 text-sm">Twitter</button>
                <button className="text-gray-600 hover:text-gray-900 text-sm">LinkedIn</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}