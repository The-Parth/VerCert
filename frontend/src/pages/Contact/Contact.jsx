import React from 'react';
import Header from '../../components/Header/Header';

const Contact = () => {
  return (
    <>
      <Header />
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-24">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Contact Us
          </h2>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-2xl shadow-blue-500/10">
            <form className="space-y-6">
              <div className="group relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full bg-gray-900/70 border border-gray-700 text-gray-100 placeholder-gray-400 px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div className="group relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="w-full bg-gray-900/70 border border-gray-700 text-gray-100 placeholder-gray-400 px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div className="group relative">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="5"
                  className="w-full bg-gray-900/70 border border-gray-700 text-gray-100 placeholder-gray-400 px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <button
                type="submit"
                className="group relative w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium text-lg shadow-lg shadow-blue-500/30 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Send Message
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
            </form>
          </div>

          <div className="mt-12 text-center text-gray-400 text-sm">
            Or email us directly at{' '}
            <a
              href="mailto:support@vercert.io"
              className="text-cyan-400 underline"
            >
              vercert@parthb.xyz
            </a>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">
              Our Office
            </h2>
            <iframe
              title="VerCert Office"
              src="https://maps.google.com/maps?q=Times%20Square%20New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-64 border border-gray-700 rounded-xl"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
