import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when navigating
  const handleNavigation = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 backdrop-blur-md ${
        scrolled 
          ? "bg-black/80 py-3 shadow-lg shadow-blue-500/10" 
          : "md:bg-transparent py-5 backdrop-blur-md bg-gradient-to-br from-gray-800 via-gray-900/90 to-gray-950"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group relative">
            <span className="text-2xl font-bold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:text-white">
              VerCert
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* Desktop Navigation - hidden on medium screens and below */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {["Home", "Issue Certificate", "Verify", "About"].map((item, index) => (
                <li key={index}>
                  <Link
                    to={index === 0 ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                    className="group relative py-2"
                  >
                    <span className="relative z-10 text-lg font-medium text-gray-200 transition-colors duration-300 group-hover:text-white">
                      {item}
                    </span>
                    {/* Animated underline effect */}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300 ease-in-out"></span>
                    {/* Hover glow effect */}
                    <span className="absolute inset-0 -z-10 rounded-md opacity-0 group-hover:opacity-20 bg-cyan-500 blur-md transition-opacity duration-300"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Hamburger button - visible on medium screens and below */}
          <button 
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span 
              className={`block h-0.5 w-6 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ease-in-out 
                ${isMenuOpen ? "transform rotate-45 translate-y-2" : ""}`}
            ></span>
            <span 
              className={`block h-0.5 w-6 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ease-in-out 
                ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
            ></span>
            <span 
              className={`block h-0.5 w-6 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ease-in-out 
                ${isMenuOpen ? "transform -rotate-45 -translate-y-2" : ""}`}
            ></span>
          </button>
        </div>
        
        {/* Mobile Navigation Dropdown */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? "max-h-96" : "max-h-0"} ${scrolled ? "bg-black/80" : "bg-transparent"}`}
        >
          <nav>
            <ul className="flex flex-col items-center py-4 space-y-4">
              {["Home", "Issue Certificate", "Verify", "About"].map((item, index) => (
                <li key={index} className="w-full text-center">
                  <Link
                    to={index === 0 ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                    className="group relative py-3 px-6 text-xl font-medium block"
                    onClick={handleNavigation}
                  >
                    <span className="relative z-10 text-gray-200 transition-colors duration-300 group-hover:text-white">
                      {item}
                    </span>
                    {/* Animated underline effect */}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300 ease-in-out"></span>
                    {/* Hover glow effect */}
                    <span className="absolute inset-0 -z-10 rounded-md opacity-0 group-hover:opacity-20 bg-cyan-500 blur-md transition-opacity duration-300"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      
      {/* A spacer to ensure the dropdown doesn't overlay content */}
      <div className="h-16 md:h-0"></div>
    </>
  );
}

export default Header;