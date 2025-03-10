import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">VerCert</Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link to="/issue" className="hover:text-gray-300">Issue Certificate</Link></li>
            <li><Link to="/verify" className="hover:text-gray-300">Verify</Link></li>
            <li><Link to="/about" className="hover:text-gray-300">About</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
