import { useState } from 'react';
import Navbar from './Navbar';
import './Login.css';

export default function Login() {
  const [loginDetails, setLogin] = useState({ email: '', password: '' });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    loginForm();
  };

  function loginForm() {
    console.log(loginDetails);
  }
  return (
    <div>
      <Navbar />
      <div className="loginPage">
        <form onSubmit={handleSubmit}>
          <div className="formBox">
            <h2>LOGIN</h2>
            <div className="formInfo">
              <label>
                Email:
                <input
                  className="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={loginDetails.email}
                  onChange={(e) =>
                    setLogin({ ...loginDetails, email: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="formInfo">
              <label>
                Password:
                <input
                  className="password"
                  type="password"
                  value={loginDetails.password}
                  onChange={(e) =>
                    setLogin({ ...loginDetails, password: e.target.value })
                  }
                />
              </label>
            </div>
            <input type="submit" value="LOGIN" />
          </div>
        </form>
      </div>
    </div>
  );
}
