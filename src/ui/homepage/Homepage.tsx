import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import Navbar from './../Navbar';

function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/*<Navbar/>*/}
      <div className="Title">
        MAV DEGREE PLANNER
        <i className="fas fa-graduation-cap"></i>
      </div>
      <div className="btn__section">
        <button className="btn__login" onClick={() => navigate('/Login')}>
          Login
        </button>
        <button className="btn__signup" onClick={() => navigate('/SignUp')}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Homepage;
