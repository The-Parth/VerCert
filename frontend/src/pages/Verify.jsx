import { useState } from "react";

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
    <div className="container mx-auto text-center py-20">
      <h2 className="text-3xl font-bold">Verify Your Credential</h2>
      <div className="mt-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Enter Certificate ID"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
          className="block w-full p-2 border rounded-md mt-2"
        />
        <button onClick={handleVerify} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Verify
        </button>
      </div>
      {result && <p className="mt-4 text-lg">{result}</p>}
    </div>
  )
}

export default Verify
