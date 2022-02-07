import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import './App.css';
import Homepage from './ui/homepage/Homepage';
import Login from './ui/auth/Login';
import SignUp from './ui/auth/SignUp';
import Dashboard from './ui/dashboard/Dashboard';
import ForgotPassword from './ui/auth/ForgotPassword';


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Home" element={<Homepage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
