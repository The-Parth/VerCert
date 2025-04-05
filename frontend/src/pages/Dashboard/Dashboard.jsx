import React from 'react';
import Header from '../../components/Header/Header';

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
    <>
      <Header />
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Superadmin Dashboard
          </h2>
          <p className="text-center text-gray-400 mb-8">
            Overview of institutions and certificate activity across the
            platform.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutions.map((inst, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300"
              >
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                  {inst.name}
                </h2>
                <div className="space-y-3 text-gray-300">
                  <p className="flex justify-between">
                    <span>Total Issued:</span>
                    <span className="font-semibold text-white">
                      {inst.issued}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span>Active Certificates:</span>
                    <span className="font-semibold text-green-400">
                      {inst.active}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span>Revoked:</span>
                    <span className="font-semibold text-red-400">
                      {inst.revoked}
                    </span>
                  </p>
                </div>
                <button className="group relative w-full mt-6 py-4 px-6 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium text-lg shadow-lg shadow-blue-500/30 transition-all duration-300">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Manage Institution
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
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
