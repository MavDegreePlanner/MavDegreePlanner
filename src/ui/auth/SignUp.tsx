import { FirebaseError } from 'firebase/app';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { kNavigateOnAuthenticated } from '../../Constants';
import { auth, registerWithEmailAndPassword } from '../../service/AuthService';
import Navbar from './../Navbar';
import './Login.css';

export default function SignUp() {
  const navigate = useNavigate();
  const [user, loading, authError] = useAuthState(auth);
  const [errorMessage, setErrorMessage] = useState('');

  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Password2, setPassword2] = useState('');
  const [Name, setName] = useState('');
  const [Sem, setSem] = useState('');
  const [Year, setYear] = useState<string>('');
  const [Major, setMajor] = useState('');

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
      // TODO: Show error message on screen
    }
  }, [errorMessage]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    signUpUser();
  };

  async function signUpUser(): Promise<void> {
    if (Password !== Password2) {
      console.log('Passwords did not match');
      setErrorMessage('passwords-do-not-match');
      return;
    }

    console.log(`Name: ${Name}`);
    console.log(`Email: ${Email}`);
    console.log(`Major: ${Major}`);
    console.log(`Semester: ${Sem}`);
    console.log(`Year: ${Year}`);
    await registerWithEmailAndPassword({
      name: Name,
      email: Email,
      password: Password,
      major: Major,
      startingSemester: Sem,
      startingYear: Year,
      onError: (error) => {
        if (error instanceof FirebaseError) {
          setErrorMessage(`Sign up failed: ${error.message}`);
        } else {
          setErrorMessage(`Sign up failed: ${error}`);
        }
      }
    });
    console.log('Signed up');
  }

  return (
    <div>
      <Navbar />
      <div className="loginPage">
        <form className="myForm" onSubmit={handleSubmit}>
          <div className="formBox">
            <h2>SignUp</h2>
            <div className="formInfo">
              <label>
                Email:
                <input
                  className="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={Email}
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
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            <div className="formInfo">
              <label>
                Repeat Password:
                <input
                  className="password"
                  type="password"
                  value={Password2}
                  onChange={(e) => setPassword2(e.target.value)}
                />
              </label>
            </div>

            <div className="formInfo">
              <label>
                Name:
                <input
                  className="name"
                  type="string"
                  placeholder="John Doe"
                  value={Name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            </div>
            <div className="formInfo">
              <label className="ey" htmlFor="sem">
                Starting Semester:{' '}
              </label>
              <select
                className="selectbox"
                required
                value={Sem}
                onChange={(e) => {
                  const semesterYear = e.target.value;
                  const semesterYearSplit = semesterYear.split(' ');
                  setSem(semesterYearSplit[0]);
                  setYear(semesterYearSplit[1]);
                }}
              >
                <option value="1">Fall 2018</option>
                <option value="2">Spring 2019</option>
                <option value="3">Fall 2020</option>
                <option value="4">Spring 2021</option>
              </select>
            </div>
            <div className="formInfo">
              <label className="ey" htmlFor="major">
                Major:{' '}
              </label>
              <select
                className="selectbox"
                required
                value={Major}
                onChange={(e) => setMajor(e.target.value)}
              >
                <option value="1">SE</option>
                <option value="2">CSE</option>
                <option value="3">CE</option>
              </select>
            </div>
            <input type="submit" value="SIGNUP" />
          </div>
        </form>
      </div>
    </div>
  );
}
