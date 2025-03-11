import Hero from '../../components/Hero/Hero.jsx';

const Home = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-16 fit-content">
      <Hero />
      <section className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-5xl md:text-6xl font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
            Welcome to VerCert
          </h2>
          <p className="text-lg md:text-xl text-gray-200">
            Experience next-generation verifiable credentials secured by blockchain technology.
          </p>
        </div>
        {/* Gap */}
        <div className="h-3"></div>
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-b from-gray-800 to-gray-700 p-8 rounded-xl border border-gray-700 shadow-xl transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full">
                <i className={`fas ${feature.icon} text-white text-xl`}></i>
              </div>
              <h3 className="text-2xl font-bold mt-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-400">
                {feature.title}
              </h3>
              <p className="text-gray-300 mt-4">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Feature data
const features = [
  {
    icon: "fa-lock",
    title: "Secure Credentials",
    description: "Benefit from blockchain-backed security and authenticity."
  },
  {
    icon: "fa-check",
    title: "Easy Verification",
    description: "Verify any certificate with a simple search."
  },
  {
    icon: "fa-globe",
    title: "Global Access",
    description: "Access and manage your credentials from anywhere."
  }
];

export default Home;