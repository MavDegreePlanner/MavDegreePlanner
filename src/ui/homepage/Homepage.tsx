import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../service/AuthService';

function Homepage() {
  const [user,, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      console.log(error.message);
    }
  }, [error]);

  return (
    <div className="home">
      {/*<Navbar/>*/}
      <div className="Title">
        MAV DEGREE PLANNER
        <i className="fas fa-graduation-cap"></i>
      </div>
      <div className="btn__section">
        <button className="btn__login" onClick={() => {
          if (user) {
            return navigate('/Dashboard');
          }
          return navigate('/Login');
        }}>
          Login
        </button>
        <button className="btn__signup" onClick={() => {
          if (user) {
            return navigate('/Dashboard');
          }
          return navigate('/SignUp');
        }}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Homepage;
