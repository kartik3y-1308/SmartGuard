import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicRoute = () => {
  const { token , isLoading} = useContext(AuthContext);
if (isLoading) { // 2. Add loading check
    return null;
  }
  // If a token exists (user is logged in), redirect them to the dashboard.
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If no token (user is logged out), show the public page (e.g., Login, Landing).
  return <Outlet />;
};

export default PublicRoute;