import React, { useEffect, useState } from 'react';
import certImage from '../../assets/Cert.jpg';

function Hero() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className=" text-white min-h-100vh relative overflow-hidden -translate-y-1/12">
      {/* Subtle background effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYyYzcuNzMyIDAgMTQgNi4yNjggMTQgMTRoMnoiIGZpbGw9IiMyNTI1MjUiIG9wYWNpdHk9Ii4yIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left side content */}
          <div className="w-full lg:w-1/2 space-y-8 order-2 lg:order-1 animate-fade-in-up">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
                <span className="block text-gray-300">Secure. Verifiable.</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-500">
                  Blockchain Certified.
                </span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                Professional credentials with unmatched security and
                verification at your fingertips. Ready in minutes.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  window.location.href = '/register';
                }}
                className="group relative px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-full text-lg font-medium transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Right side image */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div
              className={`transform transition-all duration-700 ${
                scrolled ? 'scale-95 translate-y-4' : 'scale-100'
              }`}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none z-10"></div>
                <img
                  className="w-full object-cover"
                  src={certImage}
                  alt="Digital Certificate"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
