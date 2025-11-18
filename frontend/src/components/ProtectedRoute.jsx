import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { token, isLoading } = useContext(AuthContext);

  if (isLoading) { // 2. Add loading check
    return null; 
  }
  
  // If there's a token, render the child routes (e.g., Dashboard).
  // The <Outlet /> component from react-router-dom does this.
  if (token) {
    return <Outlet />;
  }

  // If there's no token, redirect the user to the /login page.
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;