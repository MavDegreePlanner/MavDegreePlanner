import React, { useEffect,useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth, logout } from './../service/AuthService';
import { FirestoreError } from 'firebase/firestore';
import { kNavigateOnNotAuthenticated } from '../Constants';
import { getUserData } from '../service/DatabaseService';
import { Link } from 'react-router-dom';
import * as FaIcons from "react-icons/fa"
import * as AiIcons from "react-icons/ai"
import "./Navbar.css"
import "./Sidebar.css"
import { IconContext } from 'react-icons'

function Sidebar() {
    const [sidebar, setSidebar] = useState(false)
    const showsidebar = () => setSidebar(!sidebar)
    const [click, setClick] = useState(false);
    // DO NOT USE getAllCourses() IN THIS FUNCTION DIRECTLY
    // let r = getAllCourses()
    // console.log(r)

    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [confirmDialog, setConfirmDialog] = useState({isOpen:false, title:''});
    const [logoutPath, setLogoutPath] = useState('/Dashboard');

    // const handleClick = () => setClick(!click);//set opposite of click

    // const closeMobileMenu = () => setClick(false);
    const [user, loading, authError] = useAuthState(auth);
    const [name, setName] = useState('');
    const [major, setMajor] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
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
            setMajor(userData?.major ?? 'Not logged in')
          } catch (err) {
            if (err instanceof FirestoreError) {
              console.error('user-data-get-failed', err);
              setErrorMessage('An error occured while fetching user data');
            } else {
              console.error('user-data-get-failed', err);
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

    const notifyLogout = () =>
    {
      if(window.confirm('Are you sure you want to Logout?'))
      {
        setNotify({
          isOpen: true,
          message:'Logged out Successfully',
          type:'warning'
        })
        logout();
        setLogoutPath('/');
      }
        
    }
    return (
        <>
        <IconContext.Provider value={{ color: 'rgba(255, 255, 255, 0.829)' }}>
            <div className="opened">
                <Link to="#" className="menu-bars">
                    <FaIcons.FaBars onClick={showsidebar} />
                </Link>
                <Link to="/" className="navbar-logo" >
                    Mav Degree Planner
                    <i className="fas fa-graduation-cap"></i>
                </Link>
                <nav className="navbar1">
                    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                        <li className='nav-item '>
                            <Link to='/Dashboard' className='nav-links' >
                                Dashboard
                            </Link>
                        </li>
                        <li className='nav-item '>
                            <Link to='/Planner' className='nav-links'>
                                Planner
                            </Link>
                        </li>
                        <li className='nav-item '>
                            <Link to={logoutPath} className='nav-links' onClick={notifyLogout}>
                                Logout
                            </Link>
                        </li>
                    </ul>              
                </nav>
                <nav className={sidebar ? 'nav-menu1 active' : 'nav-menu1'}>
                    <div onClick={showsidebar} className="box">
                        <div className="sidebar-toggle ">
                            <Link to="#" className="list-items">
                                <AiIcons.AiOutlineClose />
                            </Link>
                        </div>
                        <ul className="menu-items" >
                            <li className="user_info">
                              Welcome {name}
                            </li>
                            <li className="user_info">
                              Major: {major}
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </IconContext.Provider>
        </>

    )
}

export default Sidebar
