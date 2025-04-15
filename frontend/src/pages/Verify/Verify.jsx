import { useState } from 'react';
import Header from '../../components/Header/Header';
import API from '../../api';

const Verify = () => {
  const [certificateId, setCertificateId] = useState('');
  const [result, setResult] = useState('');

  const [certificateDetails, setCertificateDetails] = useState(null);

  const handleVerify = async () => {
    if (!certificateId) {
      setResult('⚠️ Please enter a certificate ID.');
      return;
    }
    try {
      const response = await API.get('/block/verifyDocumentByDocId', {
        params: { docId: certificateId },
      });
      const result = response.data.result;
      console.log('Verification result:', result);
      // convert 0x string to number
      // if not 0, then it is valid
      const asInt = parseInt(result, 16);
      const isValid = asInt !== 0;
      console.log('isValid:', isValid);
      if (isValid) {
        setResult('✅ Certificate is valid!');
      } else {
        setResult('❌ Certificate is invalid!');
      }
    } catch (error) {
      setResult('❌ Error verifying certificate.');
    }
  };

  const openCertificate = async (id) => {
    if (!id) {
      setResult('⚠️ Please enter a certificate ID.');
      return;
    }
    try {
      const userId = id.split('-')[0];
      const issuer = id.split('-')[1];
      const docId = id;
      if (!userId || !docId) {
        setResult('❌ Invalid certificate ID format.');
        return;
      }
      const response = await API.get('/block/getDocument', {
        params: { userId, docId },
      });
      const { sha256Hash, docId: storedDocId, tempUrl } = response.data;
      setResult('📄 Certificate found!');
      // Store certificate details in state for display
      setCertificateDetails({
        sha256Hash,
        docId: storedDocId,
        issuer,
        tempUrl,
      });
    } catch (error) {
      setResult('❌ Certificate not found.');
      setCertificateDetails(null);
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

              <div className="flex flex-col md:flex-row gap-4">
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
                <button
                  onClick={() => {
                    openCertificate(certificateId);
                  }}
                  className="group relative w-full py-4 px-6 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white font-medium text-lg shadow-lg shadow-cyan-500/30 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Fetch Certificate
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {certificateDetails && (
            <div className="mt-8 bg-gray-900/80 border border-cyan-500/30 rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 text-cyan-400 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
                Certificate Details
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-300">
                    Document ID:
                  </span>
                  <span className="ml-2 text-cyan-200 break-all">
                    {certificateDetails.docId}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">
                    SHA256 Hash:
                  </span>
                  <span className="ml-2 text-cyan-200 break-all">
                    {certificateDetails.sha256Hash}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">
                    Document Link: (1 Hour Validity)
                  </span>
                  <a
                    href={certificateDetails.tempUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-400 underline break-all hover:text-blue-300 transition"
                  >
                    View Document
                  </a>
                </div>
                <div>
                  <span className="font-medium text-gray-300">Issuer:</span>
                  <span className="ml-2 text-cyan-200 break-all">
                    {certificateDetails.issuer}
                  </span>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div
              className={`mt-6 p-4 text-center rounded-lg transition-all duration-500 ${
                result.includes('✅')
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : result.includes('📄')
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
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
