import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import { FaUserCircle } from 'react-icons/fa';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = () => setIsMenuOpen(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const navItems = ['Home', 'About', 'Contact']; // ✅ Contact added
  if (user?.role === 'user') navItems.push('Verify', 'Certificates');
  if (user?.role === 'admin') navItems.push('Issue', 'Admin-Certificates');
  if (user?.role === 'superadmin') navItems.push('Dashboard');

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 backdrop-blur-md ${
        scrolled
          ? 'bg-black/80 py-3 shadow-lg shadow-blue-500/10'
          : 'md:bg-transparent py-5 backdrop-blur-md bg-gradient-to-br from-gray-800 via-gray-900/90 to-gray-950'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="group relative">
            <span className="text-2xl font-bold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:text-white">
              VerCert
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 ml-auto">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                className="group relative py-2"
              >
                <span className="text-lg font-medium text-gray-200 group-hover:text-white transition">
                  {item}
                </span>
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300 ease-in-out"></span>
              </Link>
            ))}

            <div className="relative ml-6">
              <button onClick={toggleDropdown} className="text-cyan-400 hover:text-white transition">
                <FaUserCircle size={28} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-gray-900 border border-gray-700 shadow-lg rounded-lg py-2 w-44 z-50 text-sm">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-cyan-400 font-semibold">Hi, {user.fullName.split(' ')[0]}</div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 transition"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block px-4 py-2 text-cyan-400 hover:bg-gray-800 transition" onClick={() => setIsDropdownOpen(false)}>Login</Link>
                      <Link to="/signup" className="block px-4 py-2 text-cyan-400 hover:bg-gray-800 transition" onClick={() => setIsDropdownOpen(false)}>Signup</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>

          <button className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none z-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className={`block h-0.5 w-6 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ${isMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block h-0.5 w-6 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ${isMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96' : 'max-h-0'} ${scrolled ? 'bg-black/80' : 'bg-transparent'}`}>
          <nav>
            <ul className="flex flex-col items-center py-4 space-y-4">
              {navItems.map((item, index) => (
                <li key={index} className="w-full text-center">
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="group relative py-3 px-6 text-xl font-medium block"
                    onClick={handleNavigation}
                  >
                    <span className="text-gray-200 group-hover:text-white transition">{item}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-4">
                <div className="flex flex-col items-center">
                  <FaUserCircle size={28} className="text-cyan-400 mb-2" />
                  {user ? (
                    <>
                      <span className="text-cyan-400 font-semibold mb-1">Hi, {user.fullName.split(' ')[0]}</span>
                      <button onClick={handleLogout} className="text-red-400 hover:underline text-sm">Logout</button>
                    </>
                  ) : (
                    <div className="flex space-x-4">
                      <Link to="/login" className="text-cyan-400 hover:underline">Login</Link>
                      <Link to="/signup" className="text-cyan-400 hover:underline">Signup</Link>
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div className="h-16 md:h-0"></div>
    </>
  );
}

export default Header;
