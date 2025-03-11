import "./About.css"; // Import CSS

// Importing local images
import accessibleImg from "../../assets/accessible.png";
import secureImg from "../../assets/secure.png";
import ecoImg from "../../assets/eco.png";
import verificationImg from "../../assets/verification.png";
import fastImg from "../../assets/fast.png";
import trustImg from "../../assets/trust.png";

const About = () => {
  return (
    <section className="about">
      <h2 className="about-title">About VerCert</h2>

      <div className="about-content">
        {/* ✅ Image Left - Text Right */}
        <div className="about-section">
          <img src={secureImg} alt="Secure & Tamper-Proof" className="about-image" />
          <div className="about-text">
            <h3>🔒 Secure & Tamper-Proof</h3>
            <p>
              VerCert uses blockchain technology to ensure certificates cannot be altered, forged, or lost. Your credentials
              are permanently stored and verifiable worldwide.
            </p>
          </div>
        </div>

        {/* ✅ Text Left - Image Right */}
        <div className="about-section">
          <div className="about-text">
            <h3>🌍 Globally Accessible</h3>
            <p>
              No more carrying paper certificates! VerCert allows you to access, share, and verify credentials instantly from
              anywhere in the world.
            </p>
          </div>
          <img src={accessibleImg} alt="Global Access" className="about-image" />
        </div>

        {/* ✅ Image Left - Text Right */}
        <div className="about-section">
          <img src={verificationImg} alt="Instant Verification" className="about-image" />
          <div className="about-text">
            <h3>✅ Instant Verification</h3>
            <p>
              Employers, universities, and institutions can verify credentials in seconds, reducing fraud and increasing
              trust.
            </p>
          </div>
        </div>

        {/* ✅ Text Left - Image Right */}
        <div className="about-section">
          <div className="about-text">
            <h3>📜 Digital & Eco-Friendly</h3>
            <p>
              Moving away from paper certificates helps reduce waste and contributes to a greener planet. VerCert promotes
              sustainability with a fully digital credentialing system.
            </p>
          </div>
          <img src={ecoImg} alt="Eco-Friendly" className="about-image" />
        </div>

        {/* ✅ Image Left - Text Right */}
        <div className="about-section">
          <img src={fastImg} alt="Fast Processing" className="about-image" />
          <div className="about-text">
            <h3>⚡ Fast & Reliable</h3>
            <p>
              Our system is optimized for fast issuance and instant verification, providing a seamless experience for both
              issuers and recipients.
            </p>
          </div>
        </div>

        {/* ✅ Text Left - Image Right */}
        <div className="about-section">
          <div className="about-text">
            <h3>🤝 Trusted by Many</h3>
            <p>
              Organizations, educational institutions, and businesses trust VerCert for secure and verifiable digital
              credentials.
            </p>
          </div>
          <img src={trustImg} alt="Trust & Transparency" className="about-image" />
        </div>
      </div>
    </section>
  );
};

export default About;
