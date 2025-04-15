import React from 'react';
import { useState, useEffect } from 'react';
import { AuthContext } from '../../AuthContext';
import API from '../../api';

const processedHash = (hash) => {
  if (hash.length > 10) {
    return `${hash.slice(0, 5)}...${hash.slice(-5)}`;
  }
  return hash;
};

const processedFileName = (name) => {
  // remove the user id at the beginning of the file name
  const parts = name.split('-');
  if (parts.length > 3) {
    return parts.slice(3).join('-');
  }
};

const getIssuer = (name) => {
  // get the [1] part of the name
  const parts = name.split('-');
  return parts[1];
};

const Certificates = () => {
  const { user } = React.useContext(AuthContext);
  console.log(user.snowflakeId);

  // get user certificates from the server
  const [userCertificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await API.get('/block/getAllDocumentsForUser', {
          params: {
            userId: user.snowflakeId,
          },
        });
        const data = response.data;
        console.log('Certificates:', data);
        setCertificates(data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };
    fetchCertificates();
  }, [user.snowflakeId]);

  const [showCopiedPopup, setShowCopiedPopup] = useState(false);

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShowCopiedPopup(true);
    setTimeout(() => {
      setShowCopiedPopup(false);
    }, 2000);
  };

  // get file from the server
  const getFile = async (userId, docId) => {
    console.log('userId:', userId);
    console.log('docId:', docId);
    try {
      const response = await API.get('/block/getDocument', {
        params: {
          userId: userId,
          docId: docId,
        },
      });
      console.log('url: ', response.data.tempUrl);
      // open in new tab
      const newTab = window.open(response.data.tempUrl, '_blank');
      if (newTab) {
        newTab.focus();
      } else {
        alert('Please allow popups for this website');
      }
    } catch (error) {
      console.error('Error fetching file:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-center"></div>
        <header className="sticky top-0 bg-opacity-90 backdrop-blur-md py-4 z-10">
          <h1 className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            My Certificates
          </h1>
          <p className="text-gray-400 text-center mt-2">
            These are the certificates issued to your account.
          </p>
          <h2
            className="text-center text-gray-300 mt-1 cursor-grab"
            onClick={() => handleCopyToClipboard(user.snowflakeId)}
            title="Click to copy"
          >
            Your ID:{' '}
            <span className="font-mono text-cyan-400">{user.snowflakeId}</span>
          </h2>
        </header>

        <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-lg">
          <table className="min-w-full bg-gray-900 text-sm text-left">
            <thead className="bg-gray-800 text-cyan-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Certificate Name</th>
                <th className="px-6 py-4">Hash</th>
                <th className="px-6 py-4">Issuer</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(userCertificates).map(([name, cert]) => (
                <tr
                  key={cert.hash}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td
                    className="px-6 py-4 font-medium text-cyan-300 cursor-pointer"
                    onClick={() => getFile(user.snowflakeId, name)}
                    title="Click to download"
                  >
                    {processedFileName(name)}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    <span
                      className="cursor-grab text-cyan-400"
                      title="Click to copy"
                      onClick={() => handleCopyToClipboard(cert.hash)}
                    >
                      {processedHash(cert.hash)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{getIssuer(name)}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(cert.timestamp * 1000).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      className="bg-cyan-700 hover:bg-cyan-800 text-white px-2 py-1 rounded text-xs"
                      title="Copy full name"
                      onClick={() => handleCopyToClipboard(name)}
                    >
                      Copy
                    </button>
                    <button
                      className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                      title="Share (coming soon)"
                      onClick={() => {}}
                    >
                      Share
                    </button>
                  </td>
                </tr>
              ))}
              {Object.keys(userCertificates).length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    You don't have any certificates yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCopiedPopup && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-cyan-400 px-4 py-2 rounded shadow-lg">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default Certificates;
