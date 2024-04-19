import React, { useState, useRef, useEffect } from "react";
import "./RegistrationForm.css"; // Import CSS file for additional styling
import movingImage from "./movingImage.webp"; // Import the image
import { useHistory } from "react-router-dom";

const RegistrationForm = () => {
  const handleLoginNavigation = () => {
    history.push(`/signin`);
  };
  const history = useHistory();
  const [picture, setPicture] = useState(null);

  const [fullname, setFullname] = useState("");
  const [fullnameError, setFullnameError] = useState("");
  const [id, setId] = useState("");
  const [idError, setIdError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showCamera, setShowCamera] = useState(false); // State to track whether to show camera
  const [videoStream, setVideoStream] = useState(null); // State to store the video stream
  const videoRef = useRef(null);

  useEffect(() => {
    if (showCamera) {
      startVideo();
    } else {
      stopVideo();
    }
    return () => {
      stopVideo();
    };
  }, [showCamera]);

  const startVideo = async () => {
    try {
      const constraints = { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopVideo = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => {
        track.stop();
      });
      setVideoStream(null);
    }
  };

  const validateFullname = () => {
    if (fullname.trim() === "") {
      setFullnameError("Full Name is required");
      return false;
    }
    setFullnameError("");
    return true;
  };

  const validateId = () => {
    if (id.trim() === "") {
      setIdError("ID is required");
      return false;
    }
    const idRegex = /^Ets\d{4}\/\d{2}$/;
    if (!idRegex.test(id.trim())) {
      setIdError("Invalid ID format. It should be like ETS0451/12");
      return false;
    }
    setIdError("");
    return true;
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailError("Invalid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePhoneNumber = () => {
    if (phoneNumber.trim() === "") {
      setPhoneNumberError("Phone number is required");
      return false;
    }
    const phoneRegex = /^251\d{9}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      setPhoneNumberError("Phone number should start with 251 and be 10 digits long");
      return false;
    }
    setPhoneNumberError("");
    return true;
  };

  const validatePassword = () => {
    if (password.trim() === "") {
      setPasswordError("Password is required");
      return false;
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character");
      return false;
    }
    setPasswordError("");
    return true;
  };
  

  const validateConfirmPassword = () => {
    if (confirmPassword.trim() === "") {
      setConfirmPasswordError("Confirm password is required");
      return false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleNext = () => {
    const isFullnameValid = validateFullname();
    const isIdValid = validateId();
    const isEmailValid = validateEmail();
    const isPhoneNumberValid = validatePhoneNumber();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (
      isFullnameValid &&
      isIdValid &&
      isEmailValid &&
      isPhoneNumberValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    ) {
      setShowCamera(true);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    // Additional logic for handling form submission
    // This is where you might want to save the form data, etc.
    // For now, we can just console.log the form data
    // Reset camera state
    setShowCamera(false);
    history.push(`/admin`);
  };
  const handleFullnameChange = (e) => {
    setFullname(e.target.value);
  };

  const handleIdChange = (e) => {
    setId(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handlePictureChange = async () => {
    try {
      if (!videoRef.current || !videoRef.current.srcObject) {
        console.error("No video stream available.");
        return;
      }
      const mediaStream = videoRef.current.srcObject;
      const videoTrack = mediaStream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(videoTrack);

      const blob = await imageCapture.takePhoto();
      const file = new File([blob], "profile_picture.jpg", {
        type: "image/jpeg",
      });

      setPicture(file);
    } catch (error) {
      console.error("Error capturing picture:", error);
    }
  };

  return (
    <div className="registration-container">
      <img className="moving-image" src={movingImage} alt="Moving Image" />
      <div className="registration-box">
      <form onSubmit={handleSubmit} className="registration-form">
          <h1 className="text-3xl font-bold text-blue-500 text-center mb-4">
            Register Here
          </h1>
          <h2 className="text-xl font-semibold text-blue-500 text-center mb-8">
            Welcome
          </h2>
          {!showCamera && (
            <>
              <label className="registration-label">
                Full Name:
                <input
                  type="text"
                  value={fullname}
                  onChange={handleFullnameChange}
                  onBlur={validateFullname}
                  className={`registration-input ${fullnameError && "error"}`}
                />
                {fullnameError && (
                  <p className="error-message">{fullnameError}</p>
                )}
              </label>
              <label className="registration-label">
                ID:
                <input
                  type="text"
                  value={id}
                  onChange={handleIdChange}
                  onBlur={validateId}
                  className={`registration-input ${idError && "error"}`}
                />
                {idError && <p className="error-message">{idError}</p>}
              </label>
              <label className="registration-label">
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={validateEmail}
                  className={`registration-input ${emailError && "error"}`}
                />
                {emailError && <p className="error-message">{emailError}</p>}
              </label>
              <label className="registration-label">
                Phone Number:
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  onBlur={validatePhoneNumber}
                  className={`registration-input ${
                    phoneNumberError && "error"
                  }`}
                />
                {phoneNumberError && (
                  <p className="error-message">{phoneNumberError}</p>
                )}
              </label>
              <label className="registration-label">
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={validatePassword}
                  className={`registration-input ${passwordError && "error"}`}
                />
                {passwordError && (
                  <p className="error-message">{passwordError}</p>
                )}
              </label>
              <label className="registration-label">
                Confirm Password:
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  onBlur={validateConfirmPassword}
                  className={`registration-input ${
                    confirmPasswordError && "error"
                  }`}
                />
                {confirmPasswordError && (
                  <p className="error-message">{confirmPasswordError}</p>
                )}
              </label>{" "}
              <button
                type="button"
                onClick={handleNext}
                className="registration-button"
              >
                Next
              </button>
            </>
          )}
          {showCamera && (
            <div className="camera-container">
              <video ref={videoRef} className="camera-feed" autoPlay />
              <button
                type="button"
                onClick={handlePictureChange}
                className="take-picture-button"
              >
                Take Picture
              </button>
            </div>
          )}
          {showCamera && (
            <button
              type="submit"
              className="registration-button"
              onClick={handleSubmit}
            >
              Register
            </button>
          )}
          <p className="registration-login-link">
            Already have an account?{" "}
            <span className="login-link" onClick={handleLoginNavigation}>
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
