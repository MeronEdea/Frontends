import React, { useState, useRef } from 'react';
import './LoginForm.css'; // Import external CSS file for styling
import loginImage from './LoginImage.png'; // Import the login image
import { useHistory } from "react-router-dom";


const LoginForm = () => {
  const [loginMethod, setLoginMethod] = useState('');
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const history = useHistory();

  const videoRef = useRef(null);
  const handleforgotpassword = () => {
    history.push(`/forgotpwd`);  };

  const handleLoginMethodChange = (e) => {
    setLoginMethod(e.target.value);
  };
  const handleClickLogin = () => {
    history.push(`/admin`);
  };
  const handleLoginIdChange = (e) => {
    setLoginId(e.target.value);
  };

  const handleLoginPasswordChange = (e) => {
    setLoginPassword(e.target.value);
  };

  const handleFaceScan = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('getUserMedia is not supported in this browser.');
        return;
      }

      const constraints = { video: true };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = mediaStream;
    } catch (error) {
      console.error('Error accessing the camera:', error);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // Perform login logic here
    // You can validate the login credentials and handle face scan authentication

    // Clear login form fields after submission
    setLoginMethod('');
    setLoginId('');
    setLoginPassword('');
  };

  return (
    <div>
       <img
        className="moving-login-image"
        src={loginImage} // Use the imported image
        alt="Login Image"
      />
    <div className="login-container">
    
      <div className="login-box">
        <form onSubmit={handleLoginSubmit} className="login-form">
          <h1 className="login-title">Login</h1>
          <div className="login-method">
            <input
              type="radio"
              id="faceScan"
              name="loginMethod"
              value="faceScan"
              checked={loginMethod === 'faceScan'}
              onChange={handleLoginMethodChange}
            />
            <label htmlFor="faceScan">Login with Face Scanning</label>
          </div>
          {loginMethod === 'faceScan' && (
            <>
              <video ref={videoRef} className="face-scan-video" autoPlay />
              <button
                type="button"
                onClick={handleFaceScan}
                className="scan-face-button"
              >
                Scan Face
              </button>
            </>
          )}
          {loginMethod !== 'faceScan' && (
            <div className="login-method">
              <input
                type="radio"
                id="idPassword"
                name="loginMethod"
                value="idPassword"
                checked={loginMethod === 'idPassword'}
                onChange={handleLoginMethodChange}
              />
              <label htmlFor="idPassword">Login with ID & Password</label>
            </div>
          )}
          {loginMethod === 'idPassword' && (
            <>
              <label>
                ID:
                <input
                  type="text"
                  value={loginId}
                  onChange={handleLoginIdChange}
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  value={loginPassword}
                  onChange={handleLoginPasswordChange}
                />
              </label>
              <p className="registration-login-link">
            {' '}
            <span
              className="login-link"
              onClick={handleforgotpassword}
            >
             Forgot Password?
            </span>
          </p>
            </>
            
          )}
          <button
            type="submit"
            className="login-button"             onClick={handleClickLogin}
            >
            Login
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default LoginForm;