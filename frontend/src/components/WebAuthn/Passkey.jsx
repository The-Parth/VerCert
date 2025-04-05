import React, { useState } from 'react';
import axios from 'axios';

import {
  bufferEncode,
  bufferDecode,
  preformatMakeCredReq,
  transformMakeCredRes,
  preformatGetAssertReq,
  transformGetAssertRes,
} from './Helpers';

const frontendUrl =
  import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5000';
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const Passkey = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    setMessage('');
    try {
      // Step 1: Request registration options from the backend.
      const { data: options } = await axios.post(
        `${backendUrl}/webauth/register`,
        { username }
      );
      // Preformat options for navigator.credentials.create
      const publicKey = preformatMakeCredReq(options);
      // Step 2: Create credentials with authenticator.
      const credential = await navigator.credentials.create({
        publicKey,
      });
      if (!credential) throw new Error('Creation of credentials failed');
      // Transform the response to JSON-friendly data.
      const credResponse = transformMakeCredRes(credential);
      // Step 3: Send credential to backend for verification.
      const verifyResp = await axios.post(
        `${backendUrl}/webauth/verify-registration`,
        {
          username,
          credential: credResponse,
        }
      );
      setMessage(
        verifyResp.data.success
          ? 'Registration successful!'
          : 'Registration failed.'
      );
    } catch (error) {
      console.error(error);
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleLogin = async () => {
    setMessage('');
    try {
      // Step 1: Request authentication options from the backend.
      const { data: options } = await axios.post(
        `${backendUrl}/webauth/login`,
        { username }
      );
      // Preformat options for navigator.credentials.get
      const publicKey = preformatGetAssertReq(options);
      // Step 2: Get assertion from authenticator.
      const assertion = await navigator.credentials.get({ publicKey });
      if (!assertion) throw new Error('Assertion failed');
      // Transform the assertion response.
      const assertionResponse = transformGetAssertRes(assertion);
      // Step 3: Send assertion to backend for verification.
      const verifyResp = await axios.post(
        `${backendUrl}/webauth/verify-login`,
        {
          username,
          assertion: assertionResponse,
        }
      );
      setMessage(
        verifyResp.data.success ? 'Login successful!' : 'Login failed.'
      );
    } catch (error) {
      console.error(error);
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  // Feats

  // Passkey feature data
  const passkeyFeatures = [
    {
      icon: 'fa-fingerprint',
      title: 'Passwordless',
      description:
        'No more passwords to remember or reset. Just use your device biometrics.',
    },
    {
      icon: 'fa-shield-alt',
      title: 'Phishing-Resistant',
      description:
        'Immune to phishing attacks as authentication is bound to legitimate sites.',
    },
    {
      icon: 'fa-lock',
      title: 'Enhanced Security',
      description:
        'Public-key cryptography provides stronger security than traditional passwords.',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-24">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Passkey Authentication
        </h2>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-2xl shadow-blue-500/10">
          <div className="space-y-6">
            <div className="group relative">
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-900/70 border border-gray-700 text-gray-100 placeholder-gray-400 px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
              <button
                onClick={handleRegister}
                className="flex-1 py-4 px-6 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium shadow-lg shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Register</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              <button
                onClick={handleLogin}
                className="flex-1 py-4 px-6 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white font-medium shadow-lg shadow-cyan-500/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Sign In</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`mt-6 p-4 text-center rounded-lg transition-all duration-500 ${
              message.includes('successful')
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            <p className="text-lg font-medium">{message}</p>
          </div>
        )}

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {passkeyFeatures.map((feature, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-b from-gray-800 to-gray-700 p-8 rounded-xl border border-gray-700 shadow-xl transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full">
                <i className={`fas ${feature.icon} text-white text-xl`}></i>
              </div>
              <h3 className="text-2xl font-bold mt-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-400">
                {feature.title}
              </h3>
              <p className="text-gray-300 mt-4">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Passkey;
