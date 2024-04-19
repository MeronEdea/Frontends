import React, { useState, useRef } from "react";
import "./LoginForm.css"; // Import external CSS file for styling
// import loginImage from "./LoginImage.png"; // Import the login image
import loginImage from "./../../../assets/img/auth/login1.jpg"
import { useHistory } from "react-router-dom";

const LoginForm = () => {
  const [loginMethod, setLoginMethod] = useState("");
  const [loginId, setLoginId] = useState("");
  const [loginIdError, setLoginIdError] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginPasswordError, setLoginPasswordError] = useState("");
  const history = useHistory();
  const [loginIdClicked, setLoginIdClicked] = useState(false);
  const [loginLabelClicked, setLoginLabelClicked] = useState(false);
  const videoRef = useRef(null);
  const handleforgotpassword = () => {
    history.push(`/forgotpwd`);
  };

  const handleLoginMethodChange = (e) => {
    setLoginMethod(e.target.value);
    setLoginLabelClicked(true);
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
        console.error("getUserMedia is not supported in this browser.");
        return;
      }

      const constraints = { video: true };
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      videoRef.current.srcObject = mediaStream;
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  const validateLoginForm = () => {
    let isValid = true;

    // Validate ID
    if (loginMethod === "idPassword") {
      if (loginId.trim() === "") {
        setLoginIdError("ID is required");
        isValid = false;
      } else {
        setLoginIdError("");
      }
    }

    // Validate Password
    if (loginMethod === "idPassword") {
      if (loginPassword.trim() === "") {
        setLoginPasswordError("Password is required");
        isValid = false;
      } else {
        setLoginPasswordError("");
      }
    }

    return isValid;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // Perform form validation
    if (!validateLoginForm()) {
      return;
    }

    // Check if all fields are filled
    if (
      loginMethod === "idPassword" &&
      loginId.trim() !== "" &&
      loginPassword.trim() !== ""
    ) {
      // Perform login logic here
      // You can validate the login credentials and handle face scan authentication

      // Clear login form fields after successful login
      setLoginMethod("");
      setLoginId("");
      setLoginPassword("");

      // Redirect user to admin page after successful login
      history.push(`/admin`);
    }
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
            {!loginLabelClicked && (
              <div className="login-method">
                <input
                  type="radio"
                  id="faceScan"
                  name="loginMethod"
                  value="faceScan"
                  checked={loginMethod === "faceScan"}
                  onChange={handleLoginMethodChange}
                />

                <label htmlFor="faceScan" className="hover:text-blue-500">Login with Face Scanning</label>
              </div>
            )}

            {loginMethod !== "faceScan" && !loginLabelClicked && (
              <div className="login-method">
                <input
                  type="radio"
                  id="idPassword"
                  name="loginMethod"
                  value="idPassword"
                  checked={loginMethod === "idPassword"}
                  onChange={handleLoginMethodChange}
                />
                <label htmlFor="idPassword" className="hover:text-blue-500">
                  Login with ID & Password
                </label>
              </div>
            )}
            {loginMethod === "faceScan" && (
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
            {loginMethod === "idPassword" && (
              <>
                <label className="text-blue-500">
                  ID:
                  <input
                    type="text"
                    value={loginId}
                    onChange={handleLoginIdChange}
                    onFocus={() => setLoginIdClicked(true)}
                    onBlur={() => setLoginIdClicked(false)}
                    className={`border ${
                      loginIdClicked ? "border-blue-500" : "border-gray-300"
                    } focus:outline-none focus:border-blue-500 px-3 py-2 rounded-md text-blue-500`}
                  />
                  {loginIdError && (
                    <p className="text-red-500 text-xs">{loginIdError}</p>
                  )}
                </label>

                <label className={"text-blue-500"}>
                  Password:
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={handleLoginPasswordChange}
                  />
                  {loginPasswordError && (
                    <p className="error-message">{loginPasswordError}</p>
                  )}
                </label>
                <p className="registration-login-link">
                  {" "}
                  <span className="login-link" onClick={handleforgotpassword}>
                    Forgot Password?
                  </span>
                </p>
              </>
            )}
            <button
              type="submit"
              className="login-button"
              onClick={handleLoginSubmit}
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
