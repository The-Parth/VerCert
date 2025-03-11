import { Link } from "react-router-dom";
import "./Header.css"; // Import the new CSS file

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">VerCert</Link>
        <nav>
          <ul className="nav-links">
            <li><Link to="/" className="nav-item">Home</Link></li>
            <li><Link to="/issue" className="nav-item">Issue Certificate</Link></li>
            <li><Link to="/verify" className="nav-item">Verify</Link></li>
            <li><Link to="/about" className="nav-item">About</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
