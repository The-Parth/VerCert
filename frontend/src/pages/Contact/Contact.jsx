
import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Contact Us
        </h1>

        <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-lg space-y-6">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="col-span-1 md:col-span-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="col-span-1 md:col-span-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              className="col-span-1 md:col-span-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500"
              required
            />
            <button
              type="submit"
              className="col-span-1 md:col-span-2 w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:opacity-90 transition duration-300"
            >
              Send Message
            </button>
          </form>

          <div className="text-center text-gray-400 text-sm">
            Or email us directly at{' '}
            <a href="mailto:support@vercert.io" className="text-cyan-400 underline">
              support@vercert.io
            </a>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">Our Office</h2>
          <iframe
            title="VerCert Office"
            src="https://maps.google.com/maps?q=Times%20Square%20New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-64 border border-gray-700 rounded-xl"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
