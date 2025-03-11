import { useState } from "react";
import "./Issue.css"; // Import custom styling

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
    <div className="issue-container">
      <h2 className="issue-title">Issue a Certificate</h2>
      <div className="issue-form">
        <input
          type="text"
          name="recipient"
          placeholder="Recipient Name"
          className="issue-input"
          onChange={handleChange}
        />
        <input
          type="text"
          name="course"
          placeholder="Course Name"
          className="issue-input"
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          className="issue-input"
          onChange={handleChange}
        />
        <button onClick={handleIssue} className="issue-button">
          Issue Certificate
        </button>
      </div>
      {message && <p className="issue-message">{message}</p>}
    </div>
  );
};

export default Issue;
