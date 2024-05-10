import React, { useState, useRef, useEffect } from "react";
import movingImage from "../../../assets/img/auth/class.jpg";
import { useHistory } from "react-router-dom";
import { FaUser, FaIdCard, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";

const RegistrationForm = () => {
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
  const [showCamera, setShowCamera] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
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
      setPhoneNumberError(
        "Phone number should start with 251 and be 10 digits long"
      );
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
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
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
<div className="registration-container flex min-h-screen w-full items-center justify-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${movingImage})` }}>
      <div className="flex flex-col justify-between h-full py-8">
        <div className="rounded-xl bg-gray-600 bg-opacity-50 px-24 py-12 w-full h-full shadow-lg backdrop-blur-md max-sm:px-8">
          <div className="text-white">
            <div className="mb-8 flex flex-col items-center">
              <h1 className="mb-2 text-blue-500 text-2xl font-bold">
                Register Here
              </h1>
              <span className="text-gray-300">Welcome</span>
            </div>
            {!showCamera && (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <div className="relative">
                    <input
                      id="fullname"
                      type="text"
                      placeholder=" "
                      value={fullname}
                      onChange={handleFullnameChange}
                      onBlur={validateFullname}
                      onFocus={(e) => (e.target.placeholder = "")}
                      className={`registration-input ${
                        fullnameError ? "border-red-500" : ""
                      } text-white pl-4 mb-4 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200`}
                    />
                    <label
                      htmlFor="fullname"
                      className={`absolute top-0 left-0 -mt-2 ml-2 text-gray-400 ${
                        fullname ? "hidden" : ""
                      }`}
                    >
                      <FaUser className="inline-block mr-2 mt-1" /> Enter your
                      full name
                    </label>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="relative">
                    <input
                      id="id"
                      type="text"
                      placeholder=" "
                      value={id}
                      onChange={handleIdChange}
                      onBlur={validateId}
                      className={`registration-input ${
                        idError ? "border-red-500" : ""
                      } text-white pl-4 mb-4 block w-full px-0 mt-3 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200`}
                    />
                    <label
                      htmlFor="id"
                      className={`absolute top-0 left-0 mt-2 ml-2 text-gray-400 ${
                        id ? "hidden" : ""
                      }`}
                    >
                      <FaIdCard className="inline-block mr-2 mt-1" /> Enter your
                      ID
                    </label>
                  </div>
                  {idError && <p className="text-red-500 text-sm">{idError}</p>}
                </div>

                <div className="flex flex-col">
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      placeholder=" "
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={validateEmail}
                      className={`registration-input ${
                        emailError ? "border-red-500" : ""
                      } text-white pl-4 mb-4 block w-full px-0 mt-3 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200`}
                    />
                    <label
                      htmlFor="email"
                      className={`absolute top-0 left-0 mt-2 ml-2 text-gray-400 ${
                        email ? "hidden" : ""
                      }`}
                    >
                      <FaEnvelope className="inline-block mr-2 mb-1" /> Enter
                      your email
                    </label>
                  </div>
                  {emailError && (
                    <p className="text-red-500 text-sm">{emailError}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="relative">
                    <input
                      id="phoneNumber"
                      type="tel"
                      placeholder=" "
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      onBlur={validatePhoneNumber}
                      className={`registration-input ${
                        phoneNumberError ? "border-red-500" : ""
                      } text-white pl-4 mb-4 block w-full px-0 mt-3 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200`}
                    />
                    <label
                      htmlFor="phoneNumber"
                      className={`absolute top-0 left-0 mt-2 ml-2 text-gray-400 ${
                        phoneNumber ? "hidden" : ""
                      }`}
                    >
                      <FaPhone className="inline-block mr-2 mb-1" /> Enter your
                      phone number
                    </label>
                  </div>
                  {phoneNumberError && (
                    <p className="text-red-500 text-sm">{phoneNumberError}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      placeholder=" "
                      value={password}
                      onChange={handlePasswordChange}
                      onBlur={validatePassword}
                      className={`registration-input ${
                        passwordError ? "border-red-500" : ""
                      } text-white  pl-4 mb-4 block w-full px-0 mt-3 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200`}
                    />
                    <label
                      htmlFor="password"
                      className={`absolute top-0 left-0 mt-2 ml-2 text-gray-400 ${
                        password ? "hidden" : ""
                      }`}
                    >
                      <FaLock className="inline-block mr-2 mb-1" /> Enter your
                      password
                    </label>
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-sm">{passwordError}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder=" "
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      onBlur={validateConfirmPassword}
                      className={`registration-input ${
                        confirmPasswordError ? "border-red-500" : ""
                      } text-white pl-4 block w-full px-0 mt-3 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200`}
                    />
                    <label
                      htmlFor="confirmPassword"
                      className={`absolute top-0 left-0 mt-2 ml-2 text-gray-400 ${
                        confirmPassword ? "hidden" : ""
                      }`}
                    >
                      <FaLock className="inline-block mr-2 mb-1" /> Confirm your
                      password
                    </label>
                  </div>
                  {confirmPasswordError && (
                    <p className="text-red-500 text-sm">
                      {confirmPasswordError}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="registration-button ml-12 mr-12 mt-4 rounded-lg bg-blue-500 text-white px-4 py-1 transition-colors duration-300 hover:bg-transparent hover:text-blue-500"
                >
                  Next
                </button>
              </form>
            )}
            {showCamera && (
              <div className="camera-container">
                <video ref={videoRef} className="camera-feed" autoPlay />
                <button
                  type="button"
                  onClick={handlePictureChange}
                  className="take-picture-button ml-64 mt-4 rounded-lg bg-blue-500 text-white px-4 py-1 transition-colors duration-300 hover:bg-transparent hover:text-blue-500"
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
            <p className="text-center font-bold text-blue-500">
              Already have an account?{" "}
              <span
                className="login-link"
                onClick={() => history.push(`/signin`)}
              >
                Login here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegistrationForm;
