import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import movingImage from "../../../assets/img/auth/class.jpg";

const ForgotPasswordProcess = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailError("Invalid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail();
    if (isEmailValid) {
      try {
        const response = await fetch("http://localhost:8000/api/generate_otp/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const responseData = await response.json();
        console.log("Response data from backend:", responseData); // Log the response data
        if (response.ok) {
          setStep(2);
        } else {
          setErrorMessage(responseData.message);
        }
      } catch (error) {
        console.error("Failed to send OTP:", error);
        setErrorMessage("Failed to send OTP. Please try again later.");
      }
    }
  };
  
  const handleSubmitVerificationCode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/update_password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: verificationCode, new_password: newPassword }),
      });
      const responseData = await response.json();
      console.log("Response data from backend:", responseData); // Log the response data
      if (response.ok) {
        setStep(3);
      } else {
        setErrorMessage(responseData.message);
      }
    } catch (error) {
      console.error("Failed to update password:", error);
      setErrorMessage("Failed to update password. Please try again later.");
    }
  };  

  const renderStepForm = () => {
    switch (step) {
      case 1:
        return (
          <form className="form" onSubmit={handleSubmitEmail}>
            <div className="flex flex-col">
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`registration-input ${
                    emailError ? "border-red-500" : ""
                  } text-white pl-4 mb-4 block w-full px-0 mt-3 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200`}
                  required
                />
                <label
                  htmlFor="email"
                  className={`absolute top-0 left-0 mt-2 ml-2 text-gray-400 ${
                    email ? "hidden" : ""
                  }`}
                >
                  <FaEnvelope className="inline-block mr-2 mt-1" /> Enter your
                  email
                </label>
              </div>
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
            </div>
            <button className="button ml-36 mr-12 mt-4 rounded-lg bg-blue-500 text-white px-8 py-1 transition-colors duration-300 hover:bg-transparent hover:text-blue-500" type="submit">
              Next
            </button>
          </form>
        );
        case 2:
          return (
            <form className="form" onSubmit={handleSubmitVerificationCode}>
              <div className="flex flex-col">
                {/* Verification code input */}
                <div className="relative">
                  <input
                    id="verificationCode"
                    type="text"
                    placeholder=" "
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="registration-input text-white pl-4 mb-4 block w-full px-0 mt-3 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                    required
                  />
                  <label
                    htmlFor="verificationCode"
                    className={`absolute top-0 left-0 mt-2 ml-2 text-gray-400 ${
                      verificationCode ? "hidden" : ""
                    }`}
                  >
                    Enter verification code
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="newPassword"
                    type="password"
                    placeholder=" "
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="registration-input text-white pl-4 mb-4 block w-full px-0 mt-3 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
                    required
                  />
                  <label
                    htmlFor="newPassword"
                    className={`absolute top-0 left-0 mt-2 ml-2 text-gray-400 ${
                      newPassword ? "hidden" : ""
                    }`}
                  >
                    Enter new password
                  </label>
                </div>
                <button
                  className="button ml-12 mr-12 mt-4 rounded-lg bg-blue-500 text-white px-4 py-1 transition-colors duration-300 hover:bg-transparent hover:text-blue-500"
                  type="submit"
                >
                  Reset Password
                </button>
              </div>
            </form>
          );
      case 3:
        return (
          <div>
            <p>Password successfully changed!</p>
            {/* Redirect to login page */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center"
      style={{
        backgroundImage: `url(${movingImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col justify-between h-full py-8">
        <div
          className="rounded-xl bg-gray-600 bg-opacity-50 px-16 w-96 py-10 shadow-lg backdrop-blur-md max-sm:px-8"
          style={{ width: "500px" }}
        >
          <div className="text-white">
            <div className="mb-8 flex flex-col items-center">
              <h1 className="mb-2 text-blue-500 text-2xl font-bold">
                Forgot Password
              </h1>
              <span className="text-gray-300">Recover your account</span>
            </div>
            {renderStepForm()}
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordProcess;
