import React, { useState, useRef, useEffect } from 'react';
import './RegistrationForm.css'; // Import CSS file for additional styling
import movingImage from './movingImage.webp'; // Import the image
import { useHistory } from "react-router-dom";

const RegistrationForm = () => {
  const handleLoginNavigation = () => {
    history.push(`/signin`);
    };
  const history = useHistory();

  const [fullname, setFullname] = useState('');
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [picture, setPicture] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      console.error('Error accessing camera:', error);
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
  const handleClickRegister = () => {
    history.push(`/admin`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Additional logic for handling form submission
    // This is where you might want to save the form data, etc.
    // For now, we can just console.log the form data
    console.log('Form data:', {
      fullname,
      id,
      email,
      picture,
      phoneNumber,
      password,
      confirmPassword
    });
    // Clear form fields after submission
    setFullname('');
    setId('');
    setEmail('');
    setPicture(null);
    setPhoneNumber('');
    setPassword('');
    setConfirmPassword('');
    // Reset camera state
    setShowCamera(false);
  };

  const handleNext = () => {
    setShowCamera(true);
  };

  const handlePictureChange = async () => {
    try {
      if (!videoRef.current || !videoRef.current.srcObject) {
        console.error('No video stream available.');
        return;
      }
      const mediaStream = videoRef.current.srcObject;
      const videoTrack = mediaStream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(videoTrack);

      const blob = await imageCapture.takePhoto();
      const file = new File([blob], 'profile_picture.jpg', { type: 'image/jpeg' });

      setPicture(file);
    } catch (error) {
      console.error('Error capturing picture:', error);
    }
  };

  return (
    <div className="registration-container">
      <img
        className="moving-image"
        src={movingImage}
        alt="Moving Image"
      />
      <div className="registration-box">
        <form onSubmit={handleSubmit} className="registration-form">
          <h1 className="registration-title">Register here</h1>
          <h2 className="registration-subtitle">Welcome</h2>
          {!showCamera && (
            <>
              <label className="registration-label">
                Full Name:
                <input
                  type="text"
                  value={fullname}
                  onChange={handleFullnameChange}
                  className="registration-input"
                />
              </label>
              <label className="registration-label">
                ID:
                <input
                  type="text"
                  value={id}
                  onChange={handleIdChange}
                  className="registration-input"
                />
              </label>
              <label className="registration-label">
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="registration-input"
                />
              </label>
              <label className="registration-label">
                Phone Number:
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  className="registration-input"
                />
              </label>
              <label className="registration-label">
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="registration-input"
                />
              </label>
              <label className="registration-label">
                Confirm Password:
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="registration-input"
                />
              </label>
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
            <button type="submit" className="registration-button" onClick={handleClickRegister}
            >
              Register
            </button>
          )}
          <p className="registration-login-link">
            Already have an account?{' '}
            <span
              className="login-link"
              onClick={handleLoginNavigation}
            >
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;