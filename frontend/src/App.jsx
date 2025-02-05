import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Student from "./components/Student";
import Faculty from "./components/Faculty";
import ResetPassword from "./components/ResetPassword";
import EventMaker from "./components/EventMaker";
import EventDashboard from "./components/EventDashboard";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ResetPassword />} />

        {/* Private Routes */}
        {[
          { path: "/student", component: <Student />, role: "student" },
          { path: "/faculty", component: <Faculty />, role: "faculty" },
          { path: "/eventManager", component: <EventMaker />, role: "eventManager" },
          { path: "/event/dashboard", component: <EventDashboard />, role: "eventManager" },
        ].map(({ path, component, role }) => (
          <Route key={path} path={path} element={<PrivateRoute allowedRoles={[role]}>{component}</PrivateRoute>} />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
