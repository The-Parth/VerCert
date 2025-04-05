import React from 'react';

const Certificates = () => {
  const userCertificates = [
    {
      id: 'VC-101',
      course: 'Intro to Blockchain',
      issuedBy: 'Tech University',
      date: '2024-12-01',
      status: 'Valid',
    },
    {
      id: 'VC-102',
      course: 'Smart Contracts',
      issuedBy: 'Chain Academy',
      date: '2025-01-20',
      status: 'Revoked',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          My Certificates
        </h1>
        <p className="text-gray-400 mb-8">
          These are the certificates issued to your account.
        </p>

        <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-md">
          <table className="min-w-full bg-gray-900 text-sm text-left">
            <thead className="bg-gray-800 text-cyan-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Certificate ID</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Issued By</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {userCertificates.map((cert) => (
                <tr
                  key={cert.id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4">{cert.id}</td>
                  <td className="px-6 py-4">{cert.course}</td>
                  <td className="px-6 py-4">{cert.issuedBy}</td>
                  <td className="px-6 py-4">{cert.date}</td>
                  <td
                    className={`px-6 py-4 font-semibold ${cert.status === 'Valid' ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {cert.status}
                  </td>
                </tr>
              ))}
              {userCertificates.length === 0 && (
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
    </div>
  );
};

export default Certificates;
