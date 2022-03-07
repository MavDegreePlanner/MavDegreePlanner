import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { auth, logout } from './../../service/AuthService';
import { FirestoreError } from 'firebase/firestore';
import { kNavigateOnNotAuthenticated } from '../../Constants';
import { getUserData } from '../../service/DatabaseService';
function Dashboard() {
  const [user, loading, authError] = useAuthState(auth);
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userData = await getUserData();
        setName(userData?.name ?? 'Not logged in')
      } catch (err) {
        if (err instanceof FirestoreError) {
          console.error('user-data-get-failed');
          setErrorMessage('An error occured while fetching user data');
        } else {
          console.error('user-data-get-failed');
          setErrorMessage('An error occured while fetching user data');
        }
        
      }
    };

    if (loading) {

    }
    else if (authError) {
      console.warn(authError.message)
    }
    else if (!user) {
      navigate(kNavigateOnNotAuthenticated);
    } else {
      fetchUserName();
    }
  }, [user, loading, authError, navigate]);

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        Logged in as
        <div>{name}</div>
        <div>{user?.email}</div>
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
export default Dashboard;
