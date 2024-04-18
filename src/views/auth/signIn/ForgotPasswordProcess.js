// ForgotPasswordProcess.js

import React, { useState } from 'react';
import './ForgotPasswordProcess.css'; // Import CSS file for styling

const ForgotPasswordProcess = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  

  const handleSubmitEmail = (e) => {
    e.preventDefault();
    // Add code here to send email for verification code
    setStep(2);
  };

  const handleSubmitVerificationCode = (e) => {
    e.preventDefault();
    // Add code here to verify the entered code
    setStep(3);
  };

  const handleSubmitNewPassword = (e) => {
    e.preventDefault();
    // Add code here to update the password
    setStep(4);
  };

  const renderStepForm = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSubmitEmail}>
            <label htmlFor="email">Enter your email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Next</button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleSubmitVerificationCode}>
            <label htmlFor="verificationCode">Enter verification code:</label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              pattern="[0-9]{6}"
              title="Please enter a 6-digit verification code"
              required
            />
            <button type="submit">Next</button>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handleSubmitNewPassword}>
            <label htmlFor="newPassword">Enter new password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit">Reset Password</button>
          </form>
        );
      case 4:
        return <p>Password successfully reset!</p>;
      default:
        return null;
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {renderStepForm()}
    </div>
  );
};

export default ForgotPasswordProcess;