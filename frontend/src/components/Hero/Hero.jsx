import "./Hero.css"; // Import the CSS file
import certImage from "../../assets/Cert.jpg";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        {/* Left Side - Image */}
        <div className="hero-image">
          <img src={certImage} alt="Certificate" />
        </div>

        {/* Right Side - Text */}
        <div className="hero-text">
          <h1>Get Certified in Minutes</h1>
          <p>Secure, verifiable, and blockchain-backed certificates at your fingertips.</p>
          <button className="hero-btn">Get Started</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
