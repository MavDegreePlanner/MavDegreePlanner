import React from 'react';
import { useState } from 'react';

export default function SignUp() {

  const [SignUpDetails, setSignUp] = useState({ email: '', password: '', password2: '' });

  const handleClick = (e:any) => {
    e.preventDefault();
    console.log(SignUpDetails)
  }
  return (
    <div className="hell">
      <div className="box">
        <form className="box1" onSubmit={handleClick}>
          <div className="hell2">
            <h1>Degree Planner</h1>
            <p>Please fill in this form to create an account.</p>
            <div className="lineBox"></div>
            <div className="inputBox">
              <input
                type="text"
                placeholder="Enter Email"
                name="email"
                required
                value={SignUpDetails.email}
                onChange={(e) =>
                  setSignUp({ ...SignUpDetails, email: e.target.value })}
              />
            </div>
            <div className="inputBox">
              <input
                type="password"
                placeholder="Enter Password"
                name="psw"
                required
                value={SignUpDetails.password}
                onChange={(e) =>
                  setSignUp({ ...SignUpDetails, password: e.target.value })}
              ></input>
            </div>
            <div className="inputBox">
              <input
                type="password"
                placeholder="Repeat Password"
                name="psw-repeat"
                required
                value={SignUpDetails.password2}
                onChange={(e) =>
                  setSignUp({ ...SignUpDetails, password2: e.target.value })}
              />
            </div>
            <div className="buttonBox">
              <button type="submit" className="signupbtn">
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}