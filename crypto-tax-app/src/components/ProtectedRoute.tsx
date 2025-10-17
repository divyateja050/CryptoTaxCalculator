import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Check for the authentication token in localStorage
  const authToken = localStorage.getItem('authToken');

  // 2. If the token exists, render the child component (e.g., the Dashboard).
  //    The <Outlet /> component is a placeholder for the actual child route.
  // 3. If the token does NOT exist, redirect the user to the /login page.
  return authToken ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
