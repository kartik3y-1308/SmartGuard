import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = () => {
  const { token, userRole, isLoading } = useContext(AuthContext);
if (isLoading) {
    // While context is loading, render nothing (or a loading spinner)
    // This PREVENTS the redirect from happening too early.
    return null; 
  }
  // --- DEBUGGING LOG ---
  console.log("--- AdminRoute Check ---");
  console.log("Token exists?", !!token);
  console.log("User Role:", userRole);
  // ---------------------

  // Check if logged in and if role is 'admin'
  if (token && userRole === "admin") {
    console.log("Result: Access GRANTED");
    return <Outlet />; // Show the admin page
  } else {
    console.log("Result: Access DENIED, redirecting...");
    return <Navigate to="/dashboard" replace />;
  }
  // If not an admin, redirect to the user dashboard
};

export default AdminRoute;
