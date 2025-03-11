  import "./Footer.css"; // Import the CSS file

  function Footer() {
    return (
      <footer className="footer">
        <div className="footer-content">
          &copy; {new Date().getFullYear()} VerCert. All rights reserved.
        </div>
      </footer>
    );
  }

  export default Footer;
