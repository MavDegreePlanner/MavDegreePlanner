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
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [Email, setEmail] = useState<string>('');
  const [Password, setPassword] = useState<string>('');
  const [Password2, setPassword2] = useState<string>('');
  const [Name, setName] = useState<string>('');
  const [Sem, setSem] = useState<string>('Fall');
  const [Year, setYear] = useState<string>('2022');
  const [Major, setMajor] = useState<string>('SE');

  useEffect(() => {
    if (loading) {

    }
    else if (authError) {
      console.warn(authError.message);
    }
    else if (!user) {

    }
    else if (user) {

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
    const userCred = await registerWithEmailAndPassword({
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

    if (userCred) {
      console.log('Signed up');
      navigate(kNavigateOnAuthenticated);
    }

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
                value={Sem + " " + Year}
                onChange={(e) => {
                  const semesterYear = e.target.value;
                  const semesterYearSplit = semesterYear.split(' ');
                  setSem(semesterYearSplit[0]);
                  setYear(semesterYearSplit[1]);
                }}
              >
                <option value="Fall 2022">Fall 2022</option>
                <option value="Spring 2021">Spring 2021</option>
                <option value="Fall 2020">Fall 2020</option>
                <option value="Spring 2019">Spring 2019</option>
                <option value="Fall 2018">Fall 2018</option>
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
                <option value="SE">SE</option>
                <option value="CSE">CSE</option>
                <option value="CE">CE</option>
              </select>
            </div>
            <input type="submit" value="SIGNUP" />
          </div>
        </form>
      </div>
    </div>
  );
}
