// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    const role = localStorage.getItem('userRole');
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
      setUserRole(role || 'user');
    }
  }, []);

  const handleLogin = (userData, role = 'user') => {
    localStorage.setItem('authToken', 'demo-token-123');
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setCurrentUser(userData);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserRole(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage isAuthenticated={isAuthenticated} />} />
        <Route path="/login" element={
          !isAuthenticated ? <Login onLogin={handleLogin} /> : 
          <Navigate to={userRole === 'admin' ? '/admin-dashboard' : '/dashboard'} />
        } />
        <Route path="/signup" element={
          !isAuthenticated ? <Signup onSignup={handleLogin} /> : 
          <Navigate to={userRole === 'admin' ? '/admin-dashboard' : '/dashboard'} />
        } />
        <Route path="/dashboard" element={
          isAuthenticated && userRole === 'user' ? <UserDashboard user={currentUser} onLogout={handleLogout} /> : 
          <Navigate to="/login" />
        } />
        <Route path="/admin-dashboard" element={
          isAuthenticated && userRole === 'admin' ? <AdminDashboard user={currentUser} onLogout={handleLogout} /> : 
          <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;