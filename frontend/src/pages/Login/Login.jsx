import React, { useState, useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import {
  bufferEncode,
  bufferDecode,
  preformatMakeCredReq,
  transformMakeCredRes,
  preformatGetAssertReq,
  transformGetAssertRes,
} from '../../components/WebAuthn/Helpers';
import API from '../../api';

const Login = () => {
  const { login, loginWithPasskey } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const [authMethod, setAuthMethod] = useState('password'); // 'password' or 'webauth'

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasskeyAuth = async (email) => {
    setMessage('');
    // Check if the browser supports WebAuthn
    if (!window.PublicKeyCredential) {
      alert('WebAuthn is not supported in this browser.');
      return;
    }
    // check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      // Step 1: Request authentication options from the backend.
      const { data: options } = await API.post(`/webauth/login`, {
        username: email,
      });
      // Preformat options for navigator.credentials.get
      const publicKey = preformatGetAssertReq(options);
      // Step 2: Get assertion from authenticator.
      const assertion = await navigator.credentials.get({ publicKey });
      if (!assertion) throw new Error('Assertion failed');
      // Transform the assertion response.
      const assertionResponse = transformGetAssertRes(assertion);
      // Step 3: Send assertion to backend for verification.
      const verifyResp = await loginWithPasskey(
        email,
        assertionResponse
      );
      console.log(verifyResp);  
      setMessage(
        verifyResp.success ? 'Login successful!' : 'Login failed.'
      );

      if (verifyResp.success && verifyResp.token) {
        // ✅ Redirect to homepage after successful login
        navigate('/');
      }
      else {
        setMessage('Login failed');
      }
    } catch (error) {
      console.error(error);
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login(formData.email, formData.password);
    if (response.token) {
      // ✅ Redirect to homepage after successful login
      navigate('/');
    } else {
      alert(response.msg || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-700 shadow-xl rounded-xl">
        <Link to="/" className="block text-center mb-6 group relative">
          <span className="text-2xl font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:text-white">
            VerCert
          </span>
          <span className="absolute left-0 right-0 mx-auto w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-[120px] transition-all duration-300"></span>
        </Link>

        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Login to VerCert
        </h2>
        <p className="mt-2 text-center text-gray-400">
          Access your blockchain-secured credentials
        </p>

        <div className="flex justify-center mt-4">
          <button
            onClick={() =>
              setAuthMethod(authMethod === 'password' ? 'webauth' : 'password')
            }
            className="flex items-center gap-2 px-4 py-2 font-medium text-cyan-400 border border-transparent rounded-lg hover:text-white hover:border-cyan-500 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8z" />
              <path d="M12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
            </svg>
            Switch to {authMethod === 'password' ? 'Passkey' : 'Password'}
          </button>
        </div>

        {authMethod === 'webauth' ? (
          <div className="mt-4 mb-6 text-center">
            <p className="pb-2 text-white">Authenticate with Passkey</p>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full px-4 py-2 my-3 text-white placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={() => handlePasskeyAuth(formData.email)}
              className="px-4 py-2 mt-2 font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:opacity-90 transition duration-300"
            >
              Authenticate
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label className="block mb-2 text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 text-white placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="relative mb-4">
              <label className="block mb-2 text-gray-300">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 text-white placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-[40px]"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:opacity-90 transition duration-300"
            >
              Login
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-cyan-400 hover:underline">
            Sign Up
          </Link>
        </p>
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
      </div>
    </div>
  );
};

export default Login;
