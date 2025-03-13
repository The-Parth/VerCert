import React, { useState } from 'react';
import axios from 'axios';

// Helper functions to base64url encode/decode ArrayBuffers
const bufferEncode = (buffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const bufferDecode = (base64urlString) => {
  // Pad base64 string to a multiple of 4
  const padding = '='.repeat((4 - (base64urlString.length % 4)) % 4);
  const base64 = (base64urlString + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const str = atob(base64);
  const buffer = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    buffer[i] = str.charCodeAt(i);
  }
  return buffer;
};

// Pre-format registration options before calling navigator.credentials.create
const preformatMakeCredReq = (makeCredRequest) => {
  makeCredRequest.challenge = bufferDecode(makeCredRequest.challenge);
  makeCredRequest.user.id = bufferDecode(makeCredRequest.user.id);
  if (makeCredRequest.excludeCredentials) {
    makeCredRequest.excludeCredentials = makeCredRequest.excludeCredentials.map(
      (exCred) => {
        exCred.id = bufferDecode(exCred.id);
        return exCred;
      }
    );
  }
  return makeCredRequest;
};

// Transform the credential response into JSON-friendly format
const transformMakeCredRes = (makeCredRes) => {
  return {
    id: makeCredRes.id,
    rawId: bufferEncode(makeCredRes.rawId),
    response: {
      attestationObject: bufferEncode(makeCredRes.response.attestationObject),
      clientDataJSON: bufferEncode(makeCredRes.response.clientDataJSON),
    },
    type: makeCredRes.type,
    clientExtensionResults: makeCredRes.getClientExtensionResults(),
  };
};

// Pre-format authentication options before calling navigator.credentials.get
const preformatGetAssertReq = (getAssert) => {
  getAssert.challenge = bufferDecode(getAssert.challenge);
  if (getAssert.allowCredentials) {
    getAssert.allowCredentials = getAssert.allowCredentials.map((cred) => {
      cred.id = bufferDecode(cred.id);
      return cred;
    });
  }
  return getAssert;
};

const transformGetAssertRes = (assertRes) => {
  return {
    id: assertRes.id,
    rawId: bufferEncode(assertRes.rawId),
    response: {
      authenticatorData: bufferEncode(assertRes.response.authenticatorData),
      clientDataJSON: bufferEncode(assertRes.response.clientDataJSON),
      signature: bufferEncode(assertRes.response.signature),
      userHandle: assertRes.response.userHandle
        ? bufferEncode(assertRes.response.userHandle)
        : null,
    },
    type: assertRes.type,
    clientExtensionResults: assertRes.getClientExtensionResults(),
  };
};

const Passkey = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    setMessage('');
    try {
      // Step 1: Request registration options from the backend.
      const { data: options } = await axios.post(
        'http://localhost:3000/webauth/register',
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
        'http://localhost:3000/webauth/verify-registration',
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
        'http://localhost:3000/webauth/login',
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
        'http://localhost:3000/webauth/verify-login',
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4 text-center">
          WebAuthn Passkey Demo
        </h1>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleRegister}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Register
          </button>
          <button
            onClick={handleLogin}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign In
          </button>
        </div>
        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Passkey;
