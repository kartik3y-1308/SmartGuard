import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   if (token) {
  //     try {
  //       localStorage.setItem('token', token);
  //       // Decode the token to get the user's role
  //       const decodedToken = jwtDecode(token);
  //       setUserRole(decodedToken.user.role);
  //     } catch (error) {
  //       console.error("Failed to decode token:", error);
  //       localStorage.removeItem('token');
  //       setToken(null);
  //       setUserRole(null);
  //     }
  //   } else {
  //     localStorage.removeItem('token');
  //     setUserRole(null);
  //   }
  // }, [token]);
  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.user.role);
      } else {
        localStorage.removeItem('token');
        setToken(null);
        setUserRole(null);
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
      localStorage.removeItem('token');
      setToken(null);
      setUserRole(null);
    } finally {
      setIsLoading(false); // <-- 2. SET LOADING TO FALSE AT THE END
    }
  }, [token]);

  const contextValue = {
    token,
    setToken,
    userRole, // Expose the role
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};