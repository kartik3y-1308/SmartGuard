import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import Pages and Components
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AdminRoute from './components/AdminRoute'; // <-- 1. IMPORT
import AdminDashboardPage from './pages/AdminDashboardPage'; // <-- 2. IMPORT
import SecurityGuidesPage from './pages/SecurityGuidesPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected User Routes */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/guides" element={<SecurityGuidesPage />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminRoute />}> {/* <-- 3. ADD THIS SECTION */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            {/* We can add more admin pages here later, like /admin/users */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;