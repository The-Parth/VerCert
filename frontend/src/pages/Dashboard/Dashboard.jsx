import React from 'react';

const Dashboard = () => {
  const institutions = [
    {
      name: 'Tech University',
      issued: 128,
      active: 120,
      revoked: 8,
    },
    {
      name: 'Chain Academy',
      issued: 76,
      active: 72,
      revoked: 4,
    },
    {
      name: 'Ledger Labs',
      issued: 45,
      active: 45,
      revoked: 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Superadmin Dashboard
        </h1>
        <p className="text-gray-400 mb-8">
          Overview of institutions and certificate activity across the platform.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutions.map((inst, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-blue-500/20 transition"
            >
              <h2 className="text-xl font-bold text-cyan-400 mb-2">
                {inst.name}
              </h2>
              <div className="space-y-1 text-sm text-gray-300">
                <p>Total Issued: <span className="font-semibold text-white">{inst.issued}</span></p>
                <p>Active Certificates: <span className="font-semibold text-green-400">{inst.active}</span></p>
                <p>Revoked: <span className="font-semibold text-red-400">{inst.revoked}</span></p>
              </div>
              <button className="mt-4 w-full py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-md hover:opacity-90 text-sm transition">
                Manage Institution
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
