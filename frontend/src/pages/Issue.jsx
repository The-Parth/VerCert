import { useState } from "react";

const Issue = () => {
  const [formData, setFormData] = useState({
    recipient: "",
    course: "",
    date: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIssue = () => {
    if (formData.recipient && formData.course && formData.date) {
      setMessage("✅ Certificate Issued Successfully!");
    } else {
      setMessage("⚠️ Please fill out all fields.");
    }
  };

  return (
    <div className="container mx-auto text-center py-20">
      <h2 className="text-3xl font-bold">Issue a Certificate</h2>
      <div className="mt-6 max-w-lg mx-auto">
        <input
          type="text"
          name="recipient"
          placeholder="Recipient Name"
          className="block w-full p-2 border rounded-md mt-2"
          onChange={handleChange}
        />
        <input
          type="text"
          name="course"
          placeholder="Course Name"
          className="block w-full p-2 border rounded-md mt-2"
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          className="block w-full p-2 border rounded-md mt-2"
          onChange={handleChange}
        />
        <button onClick={handleIssue} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Issue Certificate
        </button>
      </div>
      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
};

export default Issue;
