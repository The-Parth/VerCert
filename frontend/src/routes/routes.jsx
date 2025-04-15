import { createBrowserRouter } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Unauthorised from '../components/Unauthorised/Unauthorised';

import Home from '../pages/Home/Home';
import Issue from '../pages/Issue/Issue';
import Verify from '../pages/Verify/Verify';
import Certificates from '../pages/Certificates/Certificates';
import AdminCertificates from '../pages/AdminCertificates/AdminCertificates';
import About from '../pages/About/About';
import WebAuth from '../pages/WebAuth/PasskeyAuth';
import Dashboard from '../pages/Dashboard/Dashboard';
import Signup from '../pages/Signup/Signup';
import Login from '../pages/Login/Login';
import Contact from '../pages/Contact/Contact';

// 🔒 Generic Protected Route
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Login />;
};

// 🔒 Role-Based Protected Route
const RoleRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    console.log('User not logged in, redirecting to login...');
    return <Login />; // Redirect to login if user is not logged in
  }
  if (!roles.includes(user.role)) {
    return <Unauthorised />;
  }
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
    element: <RoleRoute roles={['user']}>{withLayout(<Verify />)}</RoleRoute>,
  },
  {
    path: '/certificates',
    element: (
      <RoleRoute roles={['user', 'admin']}>{withLayout(<Certificates />)}</RoleRoute>
    ),
  },

  // 🔐 ADMIN ROUTES
  {
    path: '/issue',
    element: <RoleRoute roles={['admin']}>{withLayout(<Issue />)}</RoleRoute>,
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
      <RoleRoute roles={['superadmin']}>{withLayout(<Dashboard />)}</RoleRoute>
    ),
  },
]);

export default router;
