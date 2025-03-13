import React, { useState, useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await register(formData.fullName, formData.email, formData.password);
    if (response.msg) {
      alert("Registered successfully! Please log in.");
      navigate("/login");
    } else {
      alert(response.msg || "Registration failed");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="bg-gray-900 shadow-xl border border-gray-700 rounded-xl p-8 w-full max-w-md">
        <Link to="/" className="group relative block text-center mb-6">
          <span className="text-2xl font-bold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:text-white">
            VerCert
          </span>
          <span className="absolute -bottom-1 left-0 right-0 mx-auto w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-[120px] transition-all duration-300"></span>
        </Link>

        <h2 className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Create Your Account
        </h2>
        <p className="text-gray-400 text-center mt-2">
          Join VerCert and secure your credentials with blockchain technology.
        </p>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:opacity-90 transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-cyan-400 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
