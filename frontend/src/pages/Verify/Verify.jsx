import { useState } from "react";
import "./Verify.css"; // Import custom styling

const Verify = () => {
  const [certificateId, setCertificateId] = useState("");
  const [result, setResult] = useState("");

  const handleVerify = () => {
    if (certificateId) {
      // Dummy verification process; in a real app, call an API
      setResult("✅ Certificate is valid!");
    } else {
      setResult("⚠️ Please enter a certificate ID.");
    }
  };

  return (
    <div className="verify-container">
      <h2 className="verify-title">Verify Your Credential</h2>
      <div className="verify-box">
        <input
          type="text"
          placeholder="Enter Certificate ID"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
          className="verify-input"
        />
        <button onClick={handleVerify} className="verify-button">
          Verify
        </button>
      </div>
      {result && <p className="verify-message">{result}</p>}
    </div>
  );
};

export default Verify;
