import { createBrowserRouter } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext"; // ✅ Import AuthContext only
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Home from "../pages/Home/Home";
import Issue from "../pages/Issue/Issue";
import Verify from "../pages/Verify/Verify";
import About from "../pages/About/About";
import WebAuth from "../pages/WebAuth/WebAuth";
import Dashboard from "../pages/Dashboard/Dashboard";
import Signin from "../pages/Signup/Signup";
import Login from "../pages/Login/Login";

const ProtectedRoute = ({ children }) => {
  const auth = useContext(AuthContext); // ✅ Fix: Ensure `useContext` gets a valid value

  if (!auth || !auth.user) {
    return <Login />; // Redirect to login if user is not authenticated
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <Home />
        <Footer />
      </>
    ),
  },
  {
    path: "/issue",
    element: <Issue />,
  },
  {
    path: "/verify",
    element: <Verify />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/webauth",
    element: <WebAuth />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Header />
        <Dashboard />
        <Footer />
      </ProtectedRoute>
    ),
  },
]);

export default router;
