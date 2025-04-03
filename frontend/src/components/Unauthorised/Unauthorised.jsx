import React from 'react';
import { useLocation } from 'react-router-dom';

const Unauthorised = () => {
    const location = useLocation();

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-red-500 mb-4">
                    403 - Unauthorised
                </h1>
                <p className="text-lg text-gray-400">
                    You do not have permission to access this route:
                </p>
                <p className="text-xl font-semibold text-red-400 mt-2">
                    {location.pathname}
                </p>
            </div>
        </div>
    );
};

export default Unauthorised;