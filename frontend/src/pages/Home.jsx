import Hero from '../components/Hero.jsx'

const Home = () => {
  return (
    <div>
      <Hero />
      <section className="container mx-auto py-10">
        <h2 className="text-3xl font-bold mb-4">Welcome to VerCert</h2>
        <p className="text-lg mb-8">
          Experience next generation verifiable credentials secured by blockchain technology.
        </p>
        {/* Features section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-bold mb-2">Secure Credentials</h3>
            <p>Benefit from blockchain backed security and authenticity.</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-bold mb-2">Easy Verification</h3>
            <p>Verify any certificate with a simple search.</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-bold mb-2">Global Access</h3>
            <p>Access and manage your credentials from anywhere.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
