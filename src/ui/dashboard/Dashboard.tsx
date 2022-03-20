import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { auth } from './../../service/AuthService';
import { kNavigateOnNotAuthenticated } from '../../Constants';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Sidebar from './../Sidebar'

function Dashboard() {
  const [user, loading, authError] = useAuthState(auth);
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
    if (loading) {

    }
    else if (authError) {
      console.warn(authError.message);
    }
    else if (!user) {
      navigate(kNavigateOnNotAuthenticated, { replace: true });
    }
    else if (user) {
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
        <Sidebar/>
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
