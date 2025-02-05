import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import './ResetPassword.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();  // Initialize the navigate hook

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !newPassword.trim()) {
      setError('Please enter both email and new password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/reset-password', {
        email,
        newPassword
      });

      if (response.status === 200) {
        setMessage(response.data.message);
        setError('');
        // After successful reset, wait for 2 seconds then navigate to login
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setError('Error occurred. Please try again.');
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/login'); // Replace with your actual path
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>

      <form onSubmit={handleResetPasswordSubmit}>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="input-field"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter your new password"
            className="input-field"
          />
        </div>

        <button type="submit" className="submit-btn">
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Back Button */}
      <button onClick={handleBackClick} className="back-btn">
        Back to Forgot Password
      </button>
    </div>
  );
};

export default ResetPassword;
