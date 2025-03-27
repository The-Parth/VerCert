import { createBrowserRouter } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

import Home from '../pages/Home/Home';
import Issue from '../pages/Issue/Issue';
import Verify from '../pages/Verify/Verify';
import Certificates from '../pages/Certificates/Certificates';
import AdminCertificates from '../pages/AdminCertificates/AdminCertificates';
import About from '../pages/About/About';
import WebAuth from '../pages/WebAuth/WebAuth';
import Dashboard from '../pages/Dashboard/Dashboard';
import Signup from '../pages/Signup/Signup';
import Login from '../pages/Login/Login';
import Contact from '../pages/Contact/Contact'; // ✅ ADDED

// 🔒 Generic Protected Route
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Login />;
};

// 🔒 Role-Based Protected Route
const RoleRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Login />;
  if (!roles.includes(user.role)) return <Home />;
  return children;
};

// 🎨 Common Layout Wrapper
const withLayout = (component) => (
  <>
    <Header />
    {component}
    <Footer />
  </>
);

const router = createBrowserRouter([
  // 🌐 PUBLIC ROUTES
  {
    path: '/',
    element: withLayout(<Home />),
  },
  {
    path: '/about',
    element: withLayout(<About />),
  },
  {
    path: '/contact', // ✅ NEW PUBLIC PAGE
    element: withLayout(<Contact />),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/webauth',
    element: <WebAuth />,
  },

  // 🔐 USER ROUTES
  {
    path: '/verify',
    element: (
      <RoleRoute roles={['user']}>
        {withLayout(<Verify />)}
      </RoleRoute>
    ),
  },
  {
    path: '/certificates',
    element: (
      <RoleRoute roles={['user']}>
        {withLayout(<Certificates />)}
      </RoleRoute>
    ),
  },

  // 🔐 ADMIN ROUTES
  {
    path: '/issue',
    element: (
      <RoleRoute roles={['admin']}>
        {withLayout(<Issue />)}
      </RoleRoute>
    ),
  },
  {
    path: '/admin-certificates',
    element: (
      <RoleRoute roles={['admin']}>
        {withLayout(<AdminCertificates />)}
      </RoleRoute>
    ),
  },

  // 🔐 SUPERADMIN ROUTES
  {
    path: '/dashboard',
    element: (
      <RoleRoute roles={['superadmin']}>
        {withLayout(<Dashboard />)}
      </RoleRoute>
    ),
  },
]);

export default router;
