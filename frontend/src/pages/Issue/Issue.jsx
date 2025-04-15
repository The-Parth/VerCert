import { useState, useCallback, useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import Header from '../../components/Header/Header';
import API from '../../api';

const Issue = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    userId: '',
    file: null,
    customFileName: '',
  });
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [issuedDoc, setIssuedDoc] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (file) => {
    if (file) {
      setFormData({ ...formData, file });
      setFileName(file.name);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  }, []);

  const handleIssue = async () => {
    if (!formData.userId || !formData.file) {
      setMessage('⚠️ Please provide a User ID and select a file.');
      return;
    }

    setLoading(true);
    setMessage('');

    const formDataToSend = new FormData();
    formDataToSend.append('userId', formData.userId);
    formDataToSend.append('issuer', user.fullName);
    formDataToSend.append('file', formData.file);
    if (formData.customFileName && formData.customFileName.trim() && formData.customFileName.trim() !== '') {
      formDataToSend.append('customName', formData.customFileName);
    }

    try {
      const response = await API.post('/block/uploadAndStore', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response.data);
      setIssuedDoc({
        docId: response.data.docId,
        fileHash: response.data.fileHash,
        sha256Hash: response.data.sha256Hash,
        tempUrl: response.data.tempUrl,
      });

      setMessage(`✅ ${response.data.message}`);
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Issue a Certificate
          </h2>
          <p className="text-gray-300 text-center mb-12 max-w-xl mx-auto">
            Upload and issue certified documents securely on the blockchain
          </p>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-2xl shadow-blue-500/10">
            <div className="space-y-6">
              <div className="group relative">
                <label className="text-sm text-gray-400 mb-1 block">Recipient User ID</label>
                <input
                  type="text"
                  name="userId"
                  placeholder="Enter the user ID of the recipient"
                  className="w-full bg-gray-900/70 border border-gray-700 text-gray-100 placeholder-gray-500 px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  onChange={handleInputChange}
                  value={formData.userId}
                />
              </div>

              <div className="group relative">
                <label className="text-sm text-gray-400 mb-1 block">Custom File Name (optional)</label>
                <input
                  type="text"
                  name="customFileName"
                  placeholder="Enter a custom file name (without extension)"
                  className="w-full bg-gray-900/70 border border-gray-700 text-gray-100 placeholder-gray-500 px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  onChange={handleInputChange}
                  value={formData.customFileName}
                />
              </div>
              <div className="group relative">
                <label className="text-sm text-gray-400 mb-1 block">Certificate File</label>
                <div
                  className={`w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                    isDragging 
                      ? 'border-blue-400 bg-blue-900/20' 
                      : fileName 
                        ? 'border-green-500 bg-green-900/10' 
                        : 'border-gray-600 bg-gray-900/50 hover:border-gray-500'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <input
                    type="file"
                    id="fileInput"
                    name="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                  />
                  
                  {fileName ? (
                    <>
                      <div className="text-green-400 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-300">{fileName}</p>
                      <p className="text-xs text-gray-500 mt-1">Click or drag to replace</p>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-300">Drag and drop your file here</p>
                      <p className="text-xs text-gray-500 mt-1">or click to browse files</p>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={handleIssue}
                disabled={loading}
                className={`group relative w-full py-4 px-6 rounded-lg font-medium text-lg shadow-lg transition-all duration-300 ${
                  loading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-blue-500/30'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Issue Certificate'
                )}
              </button>
            </div>
          </div>

          {message && (
            <div
              className={`mt-6 p-4 text-center rounded-lg transition-all duration-500 animate-fade-in ${
                message.includes('✅')
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
            >
              <p className="text-lg font-medium">{message}</p>
            </div>
          )}

          {issuedDoc && (
            <div className="mt-6 p-4 text-center rounded-lg bg-green-500/20 text-green-300 border border-green-500/30 transition-all duration-500 animate-fade-in">
              <p className="text-lg font-medium">Certificate Issued Successfully!</p>
              {issuedDoc.docId && (
                <p className="text-sm mt-2">Document ID: {issuedDoc.docId}</p>
              )}
              {issuedDoc.fileHash && (
                <p className="text-sm">File Hash: {issuedDoc.fileHash}</p>
              )}
              {issuedDoc.sha256Hash && (
                <p className="text-sm">SHA256 Hash: {issuedDoc.sha256Hash}</p>
              )}
              {issuedDoc.tempUrl && (
                <a
                  href={issuedDoc.tempUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-sm text-blue-300 mt-2 inline-block"
                >
                  View Certificate
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Issue;