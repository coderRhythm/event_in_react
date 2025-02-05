import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Signup from './components/signup';
import Student from './components/Student';
import Faculty from './components/Faculty';
import ResetPassword from './components/ResetPassword';
import EventMaker from './components/EventMaker';
import './App.css'
import EventDashboard from './components/EventDashboard';
// EventDashboard
const App = () => {
  const [isForgotPasswordFlow, setIsForgotPasswordFlow] = useState(true); // Track flow
   
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setIsForgotPasswordFlow={setIsForgotPasswordFlow} />} />
        <Route path="/login" element={<Login setIsForgotPasswordFlow={setIsForgotPasswordFlow} />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/student" 
          element={
            <PrivateRoute allowedRoles={['student']}>
              <Student />
            </PrivateRoute>
          }
        />
        <Route 
          path="/faculty" 
          element={
            <PrivateRoute allowedRoles={['faculty']}>
              <Faculty />
            </PrivateRoute>
          }
        />
        <Route 
          path="/eventManager" 
          element={
            <PrivateRoute allowedRoles={['eventManager']}>
              <EventMaker />
            </PrivateRoute>
          }
        />
        <Route 
          path="/event/dashboard" 
          element={
            <PrivateRoute allowedRoles={['eventManager']}>
              <EventDashboard />
            </PrivateRoute>
          }
        />
       <Route path="/forgot-password" element={<ResetPassword isForgotPasswordFlow={isForgotPasswordFlow} />} />
        
      </Routes>
    </Router>
  );
};

export default App;
