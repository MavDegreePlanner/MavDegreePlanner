import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import {
  auth,
  logInWithEmailAndPassword,
  logout,
  registerWithEmailAndPassword,
} from '../../service/AuthService';
import Navbar from './../Navbar';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // TODO: trigger a loading screen
      return;
    }
    if (user) navigate('/Dashboard');
  }, [user, loading, navigate]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    loginUser();
  };

  async function loginUser() {
    console.log(email + ': ' + password);
    let result = logInWithEmailAndPassword(email, password);
    console.log(result);
  }

  async function signOutUser(): Promise<void> {
    console.log(email + ': ' + password);
    await logout();
    console.log('Logged out');
  }

  async function logOutUser(): Promise<void> {
    console.log(email + ': ' + password);
    await logout();
    console.log('Logged out');
  }

  return (
    <div>
      <Navbar />
      <div className="loginPage">
        <form className = "myForm" onSubmit={handleSubmit}>
          <div className="formBox">
            <h2>LOGIN</h2>
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
            <div className="formInfo">
              <label>
                Password:
                <input
                  className="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            <input type="submit" value="LOGIN" />

            <span className = "forgotPass" onClick={() => navigate('/ForgotPassword')}>
              Forgot Password?
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
