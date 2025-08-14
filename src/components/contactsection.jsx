"use client";
import React, { useState, useEffect, useRef } from 'react';

const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    projectType: '',
    budget: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({
        name: '', email: '', subject: '', message: '',
        projectType: '', budget: '', timeline: ''
      });
      setTimeout(() => setSubmitStatus(''), 5000);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email',
      value: 'hello@yourname.com',
      description: 'Drop me a line anytime',
      color: 'from-blue-500 to-cyan-400',
      action: 'mailto:hello@yourname.com'
    },
    {
      icon: '📱',
      title: 'Phone',
      value: '+1 (555) 123-4567',
      description: 'Call for urgent projects',
      color: 'from-green-500 to-emerald-400',
      action: 'tel:+15551234567'
    },
    // {
    //   icon: '💬',
    //   title: 'Discord',
    //   value: 'yourname#1234',
    //   description: 'Chat about your ideas',
    //   color: 'from-purple-500 to-pink-400',
    //   action: '#'
    // },
    {
      icon: '📍',
      title: 'Location',
      value: 'Remote Worldwide',
      description: 'Available in all timezones',
      color: 'from-orange-500 to-yellow-400',
      action: '#'
    }
  ];

  const projectTypes = [
    { value: 'web-app', label: 'Web Application', icon: '🌐' },
    { value: 'mobile-app', label: 'Mobile App', icon: '📱' },
    { value: 'e-commerce', label: 'E-commerce', icon: '🛒' },
    { value: 'landing-page', label: 'Landing Page', icon: '🎯' },
    { value: 'api', label: 'API Development', icon: '🔌' },
    { value: 'other', label: 'Other', icon: '💭' }
  ];

  const budgetRanges = [
    { value: 'under-5k', label: 'Under $5,000' },
    { value: '5k-15k', label: '$5,000 - $15,000' },
    { value: '15k-50k', label: '$15,000 - $50,000' },
    { value: 'over-50k', label: '$50,000+' },
    { value: 'discuss', label: "Let's Discuss" }
  ];

  const timelines = [
    { value: 'asap', label: 'ASAP' },
    { value: '1-month', label: '1 Month' },
    { value: '2-3-months', label: '2-3 Months' },
    { value: '3-6-months', label: '3-6 Months' },
    { value: 'flexible', label: 'Flexible' }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white py-24 overflow-hidden min-h-screen"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#39FF14] rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">Get In Touch</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">Let's Build Something</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-[#1e90ff]">
              Amazing Together
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Have a project in mind? I'd love to hear about it. Let's discuss how we can bring your ideas to life.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          {/* Left - Contact Form */}
          <div className={`lg:col-span-2 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[#39FF14] to-[#1e90ff] rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl">✉️</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Send Me a Message</h2>
              </div>

              <div className="space-y-6">
                {/* Basic Info Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 transition-all duration-300 ${
                        focusedField === 'name' ? 'border-[#39FF14] bg-gray-700/70' : 'border-gray-600/50'
                      } focus:outline-none focus:border-[#39FF14] focus:bg-gray-700/70`}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 transition-all duration-300 ${
                        focusedField === 'email' ? 'border-[#39FF14] bg-gray-700/70' : 'border-gray-600/50'
                      } focus:outline-none focus:border-[#39FF14] focus:bg-gray-700/70`}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Project Details Row */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Project Type
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('projectType')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white transition-all duration-300 ${
                        focusedField === 'projectType' ? 'border-[#39FF14] bg-gray-700/70' : 'border-gray-600/50'
                      } focus:outline-none focus:border-[#39FF14] focus:bg-gray-700/70`}
                    >
                      <option value="">Select type</option>
                      {projectTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Budget Range
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('budget')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white transition-all duration-300 ${
                        focusedField === 'budget' ? 'border-[#39FF14] bg-gray-700/70' : 'border-gray-600/50'
                      } focus:outline-none focus:border-[#39FF14] focus:bg-gray-700/70`}
                    >
                      <option value="">Select budget</option>
                      {budgetRanges.map(budget => (
                        <option key={budget.value} value={budget.value}>
                          {budget.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Timeline
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('timeline')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white transition-all duration-300 ${
                        focusedField === 'timeline' ? 'border-[#39FF14] bg-gray-700/70' : 'border-gray-600/50'
                      } focus:outline-none focus:border-[#39FF14] focus:bg-gray-700/70`}
                    >
                      <option value="">Select timeline</option>
                      {timelines.map(timeline => (
                        <option key={timeline.value} value={timeline.value}>
                          {timeline.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 transition-all duration-300 ${
                      focusedField === 'subject' ? 'border-[#39FF14] bg-gray-700/70' : 'border-gray-600/50'
                    } focus:outline-none focus:border-[#39FF14] focus:bg-gray-700/70`}
                    placeholder="What's your project about?"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 resize-none transition-all duration-300 ${
                      focusedField === 'message' ? 'border-[#39FF14] bg-gray-700/70' : 'border-gray-600/50'
                    } focus:outline-none focus:border-[#39FF14] focus:bg-gray-700/70`}
                    placeholder="Tell me more about your project, goals, and any specific requirements..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`flex-1 md:flex-none inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
                      isSubmitting
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'bg-[#39FF14] text-gray-900 hover:bg-[#2ecc71] hover:scale-105 hover:shadow-lg hover:shadow-[#39FF14]/20'
                    } group`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">🚀</span>
                      </>
                    )}
                  </button>
                  
                  {submitStatus === 'success' && (
                    <div className="flex items-center space-x-2 text-[#39FF14]">
                      <div className="w-6 h-6 bg-[#39FF14] rounded-full flex items-center justify-center">
                        <span className="text-gray-900 text-sm font-bold">✓</span>
                      </div>
                      <span className="text-sm font-medium">Message sent successfully!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Contact Info & Quick Actions */}
          <div className={`space-y-8 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            {/* Contact Methods */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="w-3 h-3 bg-[#39FF14] rounded-full mr-3 animate-pulse" />
                Get In Touch
              </h3>
              
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <a
                    key={method.title}
                    href={method.action}
                    className={`group block p-4 rounded-lg bg-gray-700/30 border border-gray-600/30 hover:border-[#39FF14]/50 hover:bg-gray-700/50 transition-all duration-300 hover:scale-[1.02] ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${800 + index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-2xl">{method.icon}</span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-white font-semibold mb-1 group-hover:text-[#39FF14] transition-colors duration-300">
                          {method.title}
                        </h4>
                        <p className="text-[#39FF14] font-medium text-sm mb-1">
                          {method.value}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Response Time */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#39FF14] to-[#1e90ff] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Quick Response</h3>
              <p className="text-gray-300 text-sm mb-4">
                I typically respond within 2-4 hours during business days
              </p>
              <div className="flex items-center justify-center space-x-2 text-[#39FF14]">
                <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
                <span className="text-xs font-medium">Usually online 9AM-6PM EST</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-white mb-6 text-center">
                Connect With Me
              </h3>
              
              <div className="grid grid-cols-4 gap-1">
                {[
                  { name: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-400', url: '#' },
                  { name: 'GitHub', icon: '💻', color: 'from-gray-600 to-gray-400', url: '#' },
                  { name: 'Twitter', icon: '🐦', color: 'from-blue-400 to-cyan-400', url: '#' },
                  { name: 'Instagram', icon: '📸', color: 'from-purple-500 to-pink-500', url: '#' }
                ].map((social, index) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className={`group p-1 pt-2 rounded-lg bg-gray-700/30 border border-gray-600/30 hover:border-[#39FF14]/50 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 text-center ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${1200 + index * 100}ms` }}
                  >
                    <div className={`w-7 h-7 bg-gradient-to-br ${social.color} rounded-lg flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-sm">{social.icon}</span>
                    </div>
                    <span className="text-xs text-gray-300 group-hover:text-[#39FF14] transition-colors duration-300">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className={`transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Frequently Asked Questions
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  question: "How long does a typical project take?",
                  answer: "Project timelines vary based on complexity, but most web applications take 4-12 weeks from start to finish."
                },
                {
                  question: "Do you work with international clients?",
                  answer: "Absolutely! I work with clients worldwide and am comfortable with different timezones and communication styles."
                },
                {
                  question: "What's included in your development service?",
                  answer: "Full-stack development, UI/UX design consultation, testing, deployment, and 30 days of post-launch support."
                },
                {
                  question: "Do you provide ongoing maintenance?",
                  answer: "Yes! I offer maintenance packages for bug fixes, updates, and feature additions after project completion."
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg bg-gray-700/30 border border-gray-600/30 hover:border-[#39FF14]/30 transition-all duration-300 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${1000 + index * 150}ms` }}
                >
                  <h4 className="text-white font-semibold mb-3 flex items-start">
                    <span className="text-[#39FF14] mr-2 flex-shrink-0">Q:</span>
                    {faq.question}
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;