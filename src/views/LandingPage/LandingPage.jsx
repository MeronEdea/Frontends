import React from 'react';
import './LandingPage.css';

import { useHistory } from "react-router-dom";
function LandingPage() {
  const history = useHistory();
  const handleClick = () => {
    history.push(`/signup`);
  };
  return (
    <div className="App">
      <header>
        <div className="top-bar">
          <button className="button">Sign In</button>
          <button className="button">Register</button>
        </div>
      </header>
      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="image-container">
              <img src="your-image-url.jpg" alt="Your Image" />
            </div>
            <div className="text-container">
              <h1>Welcome to Face Recognition Attendance System</h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <button className="button" onClick={handleClick}>Get Started</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;