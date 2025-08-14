"use client";
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationStage(1), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.message) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 4000);
    }
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      value: 'hello@yoursite.com',
      description: 'Drop me a line anytime'
    },
    {
      icon: '💬',
      title: 'Response Time',
      value: '24 Hours',
      description: 'Usually much faster'
    },
    {
      icon: '🌍',
      title: 'Location',
      value: 'Remote',
      description: 'Available worldwide'
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white py-24 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${
              animationStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">Let's Connect</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
              <span className="block text-white mb-2">Ready to Start a</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-[#1e90ff]">
                Conversation?
              </span>
            </h2>

            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Have a project in mind or just want to chat about web development? I'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info Cards */}
            <div 
              className={`space-y-6 transition-all duration-1000 ${
                animationStage >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              <h3 className="text-2xl font-bold text-white mb-8">Get in Touch</h3>
              
              {contactInfo.map((info, index) => (
                <div 
                  key={index}
                  className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transition-all duration-300 hover:border-[#39FF14]/50 hover:bg-gray-800/50 hover:scale-105 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{info.icon}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-white group-hover:text-[#39FF14] transition-colors duration-300">
                        {info.title}
                      </h4>
                      <p className="text-[#39FF14] font-medium">{info.value}</p>
                      <p className="text-sm text-gray-400">{info.description}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Social Links */}
<div className="pt-6">
            <h4 className="text-lg font-semibold text-white mb-4">Follow Along</h4>
            <div className="flex space-x-4">
              <a
                key="twitter"
                href="https://twitter.com"
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 transition-all duration-300 hover:border-[#39FF14] hover:bg-[#39FF14]/10 hover:scale-110 group"
              >
                <FaTwitter className="text-gray-300 group-hover:text-[#39FF14] transition-colors duration-300 text-xl" />
              </a>
              <a
                key="linkedin"
                href="https://www.linkedin.com"
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 transition-all duration-300 hover:border-[#39FF14] hover:bg-[#39FF14]/10 hover:scale-110 group"
              >
                <FaLinkedin className="text-gray-300 group-hover:text-[#39FF14] transition-colors duration-300 text-xl" />
              </a>
              <a
                key="github"
                href="https://github.com"
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 transition-all duration-300 hover:border-[#39FF14] hover:bg-[#39FF14]/10 hover:scale-110 group"
              >
                <FaGithub className="text-gray-300 group-hover:text-[#39FF14] transition-colors duration-300 text-xl" />
              </a>
            </div>
          </div>
            </div>

            {/* Contact Form */}
            <div 
              className={`transition-all duration-1000 ${
                animationStage >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
            >
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
                
                <div className="space-y-6">
                  {/* Name & Email Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#39FF14] transition-all duration-300"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#39FF14] transition-all duration-300"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#39FF14] transition-all duration-300"
                      placeholder="What's this about?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#39FF14] transition-all duration-300 resize-none"
                      placeholder="Tell me about your project or question..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitted || !formData.name || !formData.email || !formData.message}
                    className={`w-full py-4 rounded-lg text-lg font-semibold transition-all duration-300 ${
                      isSubmitted
                        ? 'bg-green-600 text-white'
                        : 'bg-[#39FF14] text-gray-900 hover:bg-[#2ecc71] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {isSubmitted ? '✓ Message Sent!' : 'Send Message'}
                  </button>

                  <p className="text-sm text-gray-500 text-center">
                    I'll get back to you within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;