import { useState } from 'react';
import Header from '../../components/Header/Header';

const Issue = () => {
  const [formData, setFormData] = useState({
    recipient: '',
    course: '',
    date: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIssue = () => {
    if (formData.recipient && formData.course && formData.date) {
      setMessage('✅ Certificate Issued Successfully!');
    } else {
      setMessage('⚠️ Please fill out all fields.');
    }
  };

  return (
    <>
      <Header />
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-24">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Issue a Certificate
          </h2>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-2xl shadow-blue-500/10">
            <div className="space-y-6">
              <div className="group relative">
                <input
                  type="text"
                  name="recipient"
                  placeholder="Recipient Name"
                  className="w-full bg-gray-900/70 border border-gray-700 text-gray-100 placeholder-gray-400 px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  onChange={handleChange}
                />
              </div>

              <div className="group relative">
                <input
                  type="text"
                  name="course"
                  placeholder="Course Name"
                  className="w-full bg-gray-900/70 border border-gray-700 text-gray-100 placeholder-gray-400 px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  onChange={handleChange}
                />
              </div>

              <div className="group relative">
                <input
                  type="date"
                  name="date"
                  className="w-full bg-gray-900/70 border border-gray-700 text-gray-100 placeholder-gray-400 px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  onChange={handleChange}
                />
              </div>

              <button
                onClick={handleIssue}
                className="group relative w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium text-lg shadow-lg shadow-blue-500/30 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Issue Certificate
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

          {message && (
            <div
              className={`mt-6 p-4 text-center rounded-lg transition-all duration-500 ${
                message.includes('✅')
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              <p className="text-lg font-medium">{message}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Issue;
