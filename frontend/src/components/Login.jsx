import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsForgotPasswordFlow }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Password cannot be empty');
      return;
    }

    const loginData = { email, password };
    
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include'  // Ensure cookies are included in the request
      });

      const result = await response.json();
      console.log("result loginka: ", result);

      if (response.status === 200) {
        const role = result.user.role;
        if (role === 'student') {
          navigate('/student');
        } else if (role === 'faculty') {
          navigate('/faculty');
        } else if (role === 'eventManager') {
          navigate('/eventManager');
        }
      } else {
        setError('Error during login. Please try again.');
      }
    } catch (error) {
      console.log(error);
      setError('Error during login. Please try again.');
    }
};

  const handleForgotPassword = () => {
    setIsForgotPasswordFlow(true); // Set flow state
    navigate('/forgot-password');
  };

  const goSignup = () => {
    window.location.href = '/signup';
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>

      <form onSubmit={handleManualLogin} className="login-form">
        <div className="form-group">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='Email:'
            className="input-field"
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Password:'
            className="input-field"
          />
        </div>

        <div className="forgot-password">
        <a href="#" onClick={handleForgotPassword}>Forgot Password?</a>
        <button type="submit" className="login-btn">
          {isLoading ? 'Logging in...' : 'Login'}

        </button>
      </div>
        
      </form>

      {error && <p className="error-text">{error}</p>}

      <p className="or-text">OR</p>

      <div className='otherBtns'>
      <button onClick={handleGoogleLogin} className="google-login-btn">
        <i className="fab fa-google"></i> Login with Google
      </button>

      <button className="google-login-btn" onClick={goSignup}>
        Signup
      </button>

      </div>
      
    </div>
  );
};

export default Login;
