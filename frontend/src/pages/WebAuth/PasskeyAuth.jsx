import Header from '../../components/Header/Header';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import API from '../../api';
import { AuthContext } from '../../AuthContext';

import {
  bufferEncode,
  bufferDecode,
  preformatMakeCredReq,
  transformMakeCredRes,
  preformatGetAssertReq,
  transformGetAssertRes,
} from '../../components/WebAuthn/Helpers';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

/**
 * This Page is used for Registeration of Passkey
 */

const PasskeyAuth = () => {
  const [message, setMessage] = useState('');

  const { user } = React.useContext(AuthContext);
  const username = user?.email;

  const handleRegister = async () => {
    setMessage('');
    try {
      // Step 1: Request registration options from the backend.
      const { data: options } = await API.post(`/webauth/register`, {
        username,
      });
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

  // console.log('User:', user);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-24">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Passkey Registration
        </h2>

        <p className="text-center text-gray-300 mb-12">
          Register a passkey for{' '}
          <span className="font-medium text-blue-400">{username}</span>
        </p>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-2xl shadow-blue-500/10">
          <div className="space-y-6">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-500/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-gray-200">
                  Logged in as{' '}
                  <span className="font-medium text-blue-300">{username}</span>
                </span>
              </div>
            </div>

            <button
              onClick={handleRegister}
              className="w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium shadow-lg shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Register New Passkey</span>
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
              className="relative bg-gradient-to-b from-gray-800 to-gray-700 p-6 rounded-xl border border-gray-700 shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-full shadow-lg">
                <i className={`fas ${feature.icon} text-white text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold mt-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-400">
                {feature.title}
              </h3>
              <p className="text-gray-300 mt-4 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PasskeyAuthPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await API.get('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div>
      <Header />
      <PasskeyAuth />
    </div>
  );
};

export default PasskeyAuthPage;
