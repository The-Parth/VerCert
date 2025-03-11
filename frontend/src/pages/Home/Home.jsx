import Hero from '../../components/Hero/Hero.jsx';
import "./Home.css"; // Import the new CSS file

const Home = () => {
  return (
    <div className="home">
      <Hero />
      <section className="welcome-section">
        <h2 className="welcome-title">Welcome to VerCert</h2>
        <p className="welcome-subtitle">
          Experience next-generation verifiable credentials secured by blockchain technology.
        </p>

        {/* Features Section */}
        <div className="features-grid">
          <div className="feature-box">
            <h3>🔐 Secure Credentials</h3>
            <p>Benefit from blockchain-backed security and authenticity.</p>
          </div>
          <div className="feature-box">
            <h3>✅ Easy Verification</h3>
            <p>Verify any certificate with a simple search.</p>
          </div>
          <div className="feature-box">
            <h3>🌎 Global Access</h3>
            <p>Access and manage your credentials from anywhere.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
