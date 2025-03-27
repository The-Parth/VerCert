import React from 'react';

const AdminCertificates = () => {
  const dummyCerts = [
    {
      id: 'VC-001',
      name: 'John Doe',
      course: 'Blockchain Fundamentals',
      issuedDate: '2024-12-15',
      status: 'Valid',
    },
    {
      id: 'VC-002',
      name: 'Jane Smith',
      course: 'Web3 Development',
      issuedDate: '2024-11-22',
      status: 'Revoked',
    },
    {
      id: 'VC-003',
      name: 'Michael Scott',
      course: 'Decentralized Identity',
      issuedDate: '2025-01-04',
      status: 'Valid',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Issued Certificates
        </h1>
        <p className="text-gray-400 mb-8">
          Here are all certificates issued by your institution. You can review or revoke them if necessary.
        </p>

        <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-md">
          <table className="min-w-full bg-gray-900 text-sm text-left">
            <thead className="bg-gray-800 text-cyan-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Certificate ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Issued Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {dummyCerts.map((cert) => (
                <tr key={cert.id} className="border-b border-gray-700 hover:bg-gray-800 transition">
                  <td className="px-6 py-4">{cert.id}</td>
                  <td className="px-6 py-4">{cert.name}</td>
                  <td className="px-6 py-4">{cert.course}</td>
                  <td className="px-6 py-4">{cert.issuedDate}</td>
                  <td className={`px-6 py-4 font-semibold ${cert.status === 'Valid' ? 'text-green-400' : 'text-red-400'}`}>
                    {cert.status}
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs transition">
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
              {dummyCerts.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No certificates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCertificates;
