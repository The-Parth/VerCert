import React, { useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h2>Welcome, {user.fullName}</h2>
      <p>Email: {user.email}</p>
      <button
        onClick={() => {
          logout();
          navigate('/login');
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
