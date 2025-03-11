import { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

// Importing local images
import accessibleImg from "../../assets/accessible.png";
import secureImg from "../../assets/secure.png";
import ecoImg from "../../assets/eco.png";
import verificationImg from "../../assets/verification.png";
import fastImg from "../../assets/fast.png";
import trustImg from "../../assets/trust.png";

const About = () => {
  return (
    <>
      <Header />
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            About VerCert
          </h2>

          <div className="space-y-24 md:space-y-32">
            {/* Section 1: Secure & Tamper-Proof - Image Left, Text Right */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="w-full md:w-2/5 order-2 md:order-1">
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-2 border border-blue-500/20 shadow-xl shadow-blue-500/10 transition-all duration-300 hover:shadow-blue-500/20 transform hover:-translate-y-2">
                  <img src={secureImg} alt="Secure & Tamper-Proof" className="w-full h-auto rounded-xl" />
                </div>
              </div>
              <div className="w-full md:w-3/5 order-1 md:order-2 transition-all duration-300 transform hover:-translate-y-2">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 flex items-center">
                  <i className="fas fa-lock mr-2"></i>
                  Secure & Tamper-Proof
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  VerCert uses blockchain technology to ensure certificates cannot be altered, forged, or lost. Your credentials
                  are permanently stored and verifiable worldwide.
                </p>
              </div>
            </div>

            {/* Section 2: Globally Accessible - Text Left, Image Right */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="w-full md:w-2/5 order-2">
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-2 border border-blue-500/20 shadow-xl shadow-blue-500/10 transition-all duration-300 hover:shadow-blue-500/20 transform hover:-translate-y-2">
                  <img src={accessibleImg} alt="Global Access" className="w-full h-auto rounded-xl" />
                </div>
              </div>
              <div className="w-full md:w-3/5 order-1 transition-all duration-300 transform hover:-translate-y-2">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 flex items-center">
                  <i className="fas fa-globe mr-2"></i>
                  Globally Accessible
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  No more carrying paper certificates! VerCert allows you to access, share, and verify credentials instantly from
                  anywhere in the world.
                </p>
              </div>
            </div>

            {/* Section 3: Instant Verification - Image Left, Text Right */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="w-full md:w-2/5 order-2 md:order-1">
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-2 border border-blue-500/20 shadow-xl shadow-blue-500/10 transition-all duration-300 hover:shadow-blue-500/20 transform hover:-translate-y-2">
                  <img src={verificationImg} alt="Instant Verification" className="w-full h-auto rounded-xl" />
                </div>
              </div>
              <div className="w-full md:w-3/5 order-1 md:order-2 transition-all duration-300 transform hover:-translate-y-2">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 flex items-center">
                  <i className="fas fa-check-circle mr-2"></i>
                  Instant Verification
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Employers, universities, and institutions can verify credentials in seconds, reducing fraud and increasing
                  trust.
                </p>
              </div>
            </div>

            {/* Section 4: Digital & Eco-Friendly - Text Left, Image Right */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="w-full md:w-2/5 order-2">
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-2 border border-blue-500/20 shadow-xl shadow-blue-500/10 transition-all duration-300 hover:shadow-blue-500/20 transform hover:-translate-y-2">
                  <img src={ecoImg} alt="Eco-Friendly" className="w-full h-auto rounded-xl" />
                </div>
              </div>
              <div className="w-full md:w-3/5 order-1 transition-all duration-300 transform hover:-translate-y-2">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 flex items-center">
                  <i className="fas fa-leaf mr-2"></i>
                  Digital & Eco-Friendly
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Moving away from paper certificates helps reduce waste and contributes to a greener planet. VerCert promotes
                  sustainability with a fully digital credentialing system.
                </p>
              </div>
            </div>

            {/* Section 5: Fast & Reliable - Image Left, Text Right */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="w-full md:w-2/5 order-2 md:order-1">
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-2 border border-blue-500/20 shadow-xl shadow-blue-500/10 transition-all duration-300 hover:shadow-blue-500/20 transform hover:-translate-y-2">
                  <img src={fastImg} alt="Fast Processing" className="w-full h-auto rounded-xl" />
                </div>
              </div>
              <div className="w-full md:w-3/5 order-1 md:order-2 transition-all duration-300 transform hover:-translate-y-2">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 flex items-center">
                  <i className="fas fa-bolt mr-2"></i>
                  Fast & Reliable
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Our system is optimized for fast issuance and instant verification, providing a seamless experience for both
                  issuers and recipients.
                </p>
              </div>
            </div>

            {/* Section 6: Trusted by Many - Text Left, Image Right */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="w-full md:w-2/5 order-2">
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-2 border border-blue-500/20 shadow-xl shadow-blue-500/10 transition-all duration-300 hover:shadow-blue-500/20 transform hover:-translate-y-2">
                  <img src={trustImg} alt="Trust & Transparency" className="w-full h-auto rounded-xl" />
                </div>
              </div>
              <div className="w-full md:w-3/5 order-1 transition-all duration-300 transform hover:-translate-y-2">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 flex items-center">
                  <i className="fas fa-handshake mr-2"></i>
                  Trusted by Many
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Organizations, educational institutions, and businesses trust VerCert for secure and verifiable digital
                  credentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
