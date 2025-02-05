import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/verify-auth', {
          method: 'GET',
          credentials: 'include', // Ensure cookies are included in the request
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);

          setUserRole(data.role);
          console.log(data.role);
          
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error verifying user:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
