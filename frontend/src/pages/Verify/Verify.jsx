import { useState } from 'react';
import Header from '../../components/Header/Header';

const Verify = () => {
  const [certificateId, setCertificateId] = useState('');
  const [result, setResult] = useState('');

  const handleVerify = () => {
    if (certificateId) {
      // Dummy verification process; in a real app, call an API
      setResult('✅ Certificate is valid!');
    } else {
      setResult('⚠️ Please enter a certificate ID.');
    }
  };

  return (
    <>
      <Header />
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-24">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Verify Your Credential
          </h2>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-2xl shadow-blue-500/10">
            <div className="space-y-6">
              <div className="group relative">
                <input
                  type="text"
                  placeholder="Enter Certificate ID"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  className="w-full bg-gray-900/70 border border-gray-700 text-gray-100 placeholder-gray-400 px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-cyan-400 to-blue-500 group-focus-within:w-full transition-all duration-300"></div>
              </div>

              <button
                onClick={handleVerify}
                className="group relative w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium text-lg shadow-lg shadow-blue-500/30 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Verify Certificate
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {result && (
            <div
              className={`mt-6 p-4 text-center rounded-lg transition-all duration-500 ${
                result.includes('✅')
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              <p className="text-lg font-medium">{result}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Verify;
