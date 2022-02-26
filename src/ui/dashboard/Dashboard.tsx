import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { auth, db, logout } from './../../service/AuthService';
import { query, collection, getDocs, where } from 'firebase/firestore';
import { kNavigateOnNotAuthenticated } from '../../Constants';
function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        setName(data.name);
      } catch (err) {
        console.error(err);
        alert('An error occured while fetching user data');
      }
    };

    if (loading) return;
    if (!user) return navigate(kNavigateOnNotAuthenticated);
    fetchUserName();
  }, [user, loading, navigate]);

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
