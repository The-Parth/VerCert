import React, { useState } from 'react';
import Header from '../../components/Header/Header';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [notification, setNotification] = useState({
    show: false,
    type: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const webhookUrl =
    'https://discord.com/api/webhooks/1361663799945466068/SmaMPRJTfwfRBFE8bZhKyn4JvGBliI4tCXu_KW5SoGNjcOC6UZYWISAyuFnT8ns9FIy8';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const embed = {
      embeds: [
        {
          title: 'New Contact Form Submission',
          color: 3447003, // Blue color
          fields: [
            { name: 'Name', value: formData.name, inline: true },
            { name: 'Email', value: formData.email, inline: true },
            { name: 'Message', value: formData.message },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(embed),
      });
      setNotification({
        show: true,
        type: 'success',
        message: "Message sent successfully! We'll get back to you soon.",
      });
      setFormData({ name: '', email: '', message: '' });

      // Auto hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setNotification({
        show: true,
        type: 'error',
        message: 'Failed to send message. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Contact Us
          </h2>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Fill out the
            form below and our team will get back to you as soon as possible.
          </p>

          {notification.show && (
            <div
              className={`mb-8 p-4 rounded-lg flex items-center justify-between
              ${
                notification.type === 'success'
                  ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                  : 'bg-red-500/20 text-red-200 border border-red-500/30'
              }`}
            >
              <div className="flex items-center space-x-3">
                {notification.type === 'success' ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                )}
                <span>{notification.message}</span>
              </div>
              <button
                onClick={() =>
                  setNotification({ show: false, type: '', message: '' })
                }
                className="text-gray-300 hover:text-white"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          )}

          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3 bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-2xl shadow-blue-500/10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="group relative">
                  <label
                    htmlFor="name"
                    className="text-sm text-gray-300 mb-1 block"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-900/70 border border-gray-700 text-gray-100 placeholder-gray-500 px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div className="group relative">
                  <label
                    htmlFor="email"
                    className="text-sm text-gray-300 mb-1 block"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-900/70 border border-gray-700 text-gray-100 placeholder-gray-500 px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div className="group relative">
                  <label
                    htmlFor="message"
                    className="text-sm text-gray-300 mb-1 block"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="What would you like to tell us?"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-gray-900/70 border border-gray-700 text-gray-100 placeholder-gray-500 px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative w-full py-4 px-6 ${
                    loading ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                  } rounded-lg text-white font-medium text-lg shadow-lg shadow-blue-500/30 transition-all duration-300 flex items-center justify-center`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
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
                  )}
                </button>
              </form>
            </div>

            <div className="md:col-span-2 space-y-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-cyan-400">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-blue-500 mt-1 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <div>
                      <p className="text-gray-300 font-medium">Email</p>
                      <a
                        href="mailto:vercert@parthb.xyz"
                        className="text-cyan-400 hover:underline"
                      >
                        vercert@parthb.xyz
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-blue-500 mt-1 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                    <div>
                      <p className="text-gray-300 font-medium">
                        Office Location
                      </p>
                      <p className="text-gray-400">
                        Palace of Earth Spirits, Gensokyo
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4200.878908436727!2d106.75756691080842!3d-6.586749893379371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c5f57b608871%3A0x71e6b86c1e697217!2sGensokyo%20Store!5e1!3m2!1sen!2sin!4v1744716829848!5m2!1sen!2sin"
                  className='w-full h-64 md:h-80 border-0'
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
