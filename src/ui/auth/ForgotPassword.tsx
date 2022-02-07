import React from 'react';
import {useState } from 'react';
import './ForgotPassword.css';
import Navbar from './../Navbar';

export default function ForgotPassword() 
{
    const [email, setEmail] = useState('');
    const handleSubmit = (e: any) => 
    {
        e.preventDefault();
        ForgotPassword();
    };

    async function ForgotPassword() 
    {
        console.log(email);
    }
  return(
    <div>
      <Navbar />
      <div className="forgotPassPage">
        <form className = "myForm" onSubmit={handleSubmit}>
          <div className="formBox">
            <h2>PASSWORD RESET</h2>
            <div className="formInfo">
              <label>
                Email:
                <input
                  className="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            <input type="submit" value="SUBMIT" />
          </div>
        </form>
      </div>
    </div>
  );
}


