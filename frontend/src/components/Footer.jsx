function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center">
      <div className="container mx-auto">
        &copy; { new Date().getFullYear() } VerCert. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
