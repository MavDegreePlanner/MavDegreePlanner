import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { auth, logout } from './../../service/AuthService';
import { FirestoreError } from 'firebase/firestore';
import { kNavigateOnNotAuthenticated } from '../../Constants';
import { getUserData } from '../../service/DatabaseService';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
function Dashboard() {
  const [user, loading, authError] = useAuthState(auth);
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const [degree, setDegree] = useState("SE.jpg");
  const [title, setTitle] = useState("Software Engineering")
  
  function changeDegree(degreeName:any)
  {
      if(degreeName === "Software Engineering")
      {
        setTitle("Software Engineering");
        setDegree("SE.jpg");
      }
      if(degreeName === "Computer Engineering")
      {
        setTitle("Computer Engineering");
        setDegree("CE.jpg");
      }
      if(degreeName === "Computer Science")
      {
        setTitle("Computer Science");
        setDegree("CS.jpg");
      }
  }

  useEffect(() => {
    if (errorMessage.length > 0) {
      // TODO: Show error message on screen
    }
  }, [errorMessage]);

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
      console.warn(authError.message);
    }
    else if (!user) {
      navigate(kNavigateOnNotAuthenticated, { replace: true });
    }
    else if (user) {
      fetchUserName();
    }
  }, [user, loading, authError, navigate]);

  return (
    // <div className="dashboard">
    //   <div className="dashboard__container">
    //     Logged in as
    //     <div>{name}</div>
    //     <div>{user?.email}</div>
    //     <button className="dashboard__btn" onClick={logout}>
    //       Logout
    //     </button>
    //   </div>
    // </div>
    <div className='dashboard'>
        
        <div className="flowchart_types">
          <h1 className='title'>{title}</h1>
          <div className='degree_options'>
            <button className = "btn_degree" onClick={() => changeDegree("Software Engineering")}>
              Software Engineering
            </button>
          </div>
          <div className='degree_options'>
            <button className = "btn_degree" onClick={() => changeDegree("Computer Engineering")}>
              Computer Engineering
            </button>
          </div>
          <div className='degree_options'>
            <button className = "btn_degree" onClick={() => changeDegree("Computer Science")}>
              Computer Science
            </button>
          </div>
        </div>
        <div className='flowchart'>
          <TransformWrapper
          initialScale={1}
          initialPositionX={200}
          initialPositionY={100}
          >
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <React.Fragment>
                <div className="tools">
                  <div className='btns'>   
                    <button className="btn_tools" onClick={() => zoomIn()}>
                      <i className="gg-zoom-in"></i>
                    </button>
                  </div>
                  <div className='btns'>
                    <button className="btn_tools" onClick={() => zoomOut()}>
                      <i className="gg-zoom-out"></i>
                    </button>
                  </div>
                  <div className='btns'>
                    <button className="btn_tools" onClick={() => resetTransform()}>
                      <i className="gg-redo"></i>
                    </button>
                  </div>
                </div>
                <TransformComponent>
                  <img src={degree} className = "img" alt="test" />
                </TransformComponent>
                
              </React.Fragment>
            )}
          </TransformWrapper>
        </div>
    </div>

  );
}
export default Dashboard;
