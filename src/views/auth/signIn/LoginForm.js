import React, { useState } from "react";
// import "./LoginForm.css"; // Import external CSS file for styling
import loginImage from "./../../../assets/img/auth/class.jpg";
import { useHistory } from "react-router-dom";

const LoginForm = () => {
  const [loginMethod, setLoginMethod] = useState("");
  const [loginId, setLoginId] = useState("");
  const [loginIdError, setLoginIdError] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginPasswordError, setLoginPasswordError] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const history = useHistory();

  const handleforgotpassword = () => {
    history.push(`/forgotpwd`);
  };

  const handlesignupNavigation = () => {
    history.push(`/signup`);
  };

  const handleLoginMethodChange = (e) => {
    setLoginMethod(e.target.value);
  };

  const handleLoginIdChange = (e) => {
    setLoginId(e.target.value);
  };

  const handleLoginPasswordChange = (e) => {
    setLoginPassword(e.target.value);
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
    const handleInputFocus = () => {
      setIsInputFocused(true);
    };
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
  const handleInputBlur = () => {
    setIsInputFocused(false);
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
    <div
      className="flex min-h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${loginImage})` }}
    >
      <div className="flex flex-col justify-between h-full py-8">
        <div
          className="rounded-xl bg-gray-600 bg-opacity-50 px-16 w-96 py-10 shadow-lg backdrop-blur-md max-sm:px-8"
          style={{ width: "500px" }}
        >
          <div className="text-white">
            <div className="mb-8 flex flex-col items-center">
              <img
                src="https://www.logo.wine/a/logo/Instagram/Instagram-Glyph-Color-Logo.wine.svg"
                width="150"
                alt=""
                srcSet=""
              />
              <h1 className="mb-2 text-blue-500 text-2xl font-bold">Login</h1>
              <span className="text-gray-300">Enter Login Details</span>
            </div>
            <form action="#">
              <div className="mb-4 text-lg">
                <input
                  className={`rounded-2xl border border-32 border-white bg-blue-100  bg-opacity-100 focus:border-blue focus:ring-1 focus:ring-blue-500 ${
                    isInputFocused ? "focus:bg-white text-black" : ""
                  } w-full px-6 py-2 text-left text-inherit text-black placeholder-slate-400 shadow-lg outline-none backdrop-blur-md`}
                  type="text"
                  name="name"
                  style={{ color: isInputFocused ? "#000" : "inherit" }} // Set text color to black when input is focused
                  placeholder="Enter ID number"
                  onFocus={() => setIsInputFocused(true)} // Set isInputFocused to true when input is focused
                  onBlur={() => setIsInputFocused(false)} // Set isInputFocused to false when input is blurred
                />
              </div>

              <div className="mb-4 text-lg">
                <input
                  className={`rounded-2xl border border-32 border-white bg-blue-100  bg-opacity-100 focus:border-blue focus:ring-1 focus:ring-blue-500 ${
                    isInputFocused ? "focus:bg-white text-black" : ""
                  } w-full px-6 py-2 text-left text-inherit  placeholder-slate-400 shadow-lg outline-none backdrop-blur-md`}
                  type="password"
                  name="name"
                  placeholder="*********"
                  style={{ color: isInputFocused ? "#000" : "inherit" }} // Set text color to black when input is focused
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                />
              </div>
              <div className="mt-8 flex justify-center text-lg text-black">
                <button
                  type="submit"
                  className="rounded-4xl bg-blue-200 bg-opacity-50  py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-blue-300"
                  onClick={handleLoginSubmit}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
        <div>
          <p className="text-center text-blue-500">
            Don't have an account?{" "}
            <span className="login-link" onClick={handlesignupNavigation}>
              SignUp here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
