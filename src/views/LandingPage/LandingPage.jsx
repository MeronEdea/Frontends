import React from 'react';
import './LandingPage.css';
import landingimage from '../../assets/img/auth/svg.svg'; // Import your image file

import { useHistory } from "react-router-dom";

function LandingPage() {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/signup`);
  };

  const handleClickLogin = () => {
    history.push(`/signin`);
  };
 
  return (
    <div className="landing-page">
      <header className="header">
     
        <div className="logo" >AASTU Attendance</div>
        <button className="sign-in-button" onClick={handleClickLogin}>Sign In</button>
      </header>
      <main className="main-content">
        <div className="image-container">
          <img src={landingimage} alt="Your Image" className="main-image" /> {/* Use the imported image */}
        </div>
        <div className="text-container">
          <h1>Welcome to AASTU Attendance</h1>
          <p>Better attendance for educators.</p>
          <button className="get-started-button" onClick={handleClick}>Get Started</button>
        </div>
      </main>
    </div>
  );
}
  
export default LandingPage;