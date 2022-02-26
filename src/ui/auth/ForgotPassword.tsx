import { useEffect } from 'react';
import {useState } from 'react';
import './ForgotPassword.css';
import Navbar from './../Navbar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, sendPasswordReset } from '../../service/AuthService';
import { useNavigate } from 'react-router';
import { kNavigateOnAuthenticated } from '../../Constants';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [user, loading, authError] = useAuthState(auth);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    sendPasswordReset(
      email,
      () => {
        setSuccessMessage('Password reset link sent!')
      },
      (onError) => {
        console.log(onError);
        setErrorMessage('Could not send reset password email... Please try again later')
      },
    );
  };

  useEffect(() => {
    if (loading) {
      // TODO: trigger a loading screen
      return;
    }
    if (user) navigate(kNavigateOnAuthenticated);
    if (authError) {
      // TODO: Show authentication error on screen
      alert(authError.message)
      return;
    }
  }, [user, loading, authError, navigate]);

  useEffect(() => {
    if (errorMessage.length > 0) {
      // TODO: Show error message in UI
      alert(errorMessage);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage.length > 0) {
      // TODO: Show success message in UI
      alert(successMessage);
    }
  }, [successMessage]);

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


