"use client";
import React, { useState, useEffect } from 'react';

const CTASection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationStage(1), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const benefits = [
    { icon: '🚀', text: 'Weekly tutorials & deep-dives' },
    { icon: '💡', text: 'Industry insights & trends' },
    { icon: '⚡', text: 'Code examples & walkthroughs' }
  ];

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white py-12 overflow-hidden">

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div 
            className={`text-center mb-12 transition-all duration-1000 ${
              animationStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">Join 5,000+ Developers</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
              <span className="block text-white mb-2">Stay Ahead in</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] to-[#1e90ff]">
                Web Development
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              Get exclusive access to in-depth tutorials, cutting-edge techniques, and the latest industry insights delivered to your inbox every week.
            </p>

            {/* Email Subscription */}
            <div className="max-w-lg mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg sm:rounded-l-lg sm:rounded-r-none text-white placeholder-gray-400 focus:outline-none focus:border-[#39FF14] transition-all duration-300"
                />
                <button
                  onClick={handleSubmit}
                  disabled={isSubscribed || !email}
                  className={`px-8 py-4 rounded-lg sm:rounded-l-none sm:rounded-r-lg text-lg font-semibold transition-all duration-300 ${
                    isSubscribed
                      ? 'bg-green-600 text-white'
                      : 'bg-[#39FF14] text-gray-900 hover:bg-[#2ecc71] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {isSubscribed ? '✓ Subscribed!' : 'Get Started'}
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-12">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </div>

          {/* Benefits Grid */}
          <div 
            className={`grid md:grid-cols-3 gap-6 mb-12 transition-all duration-1000 ${
              animationStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="text-center group"
                style={{ transitionDelay: `${(index + 3) * 100}ms` }}
              >
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transition-all duration-300 hover:border-[#39FF14]/50 hover:bg-gray-800/50 hover:scale-105">
                  <div className="text-3xl mb-3">{benefit.icon}</div>
                  <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    {benefit.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Secondary CTA */}
          <div 
            className={`text-center transition-all duration-1000 ${
              animationStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            <a
              href="#posts"
              className="inline-flex items-center border-2 border-gray-600 text-gray-300 px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 hover:border-[#39FF14] hover:text-[#39FF14] hover:bg-[#39FF14]/5 group"
            >
              Browse Latest Articles
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 inline-block">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;