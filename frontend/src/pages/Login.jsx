// pages/Login.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Create demo users if no users exist
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (users.length === 0) {
      // Create demo users with roles
      const demoUsers = [
        {
          name: 'Demo User',
          email: 'demo@example.com',
          password: 'password123',
          role: 'user'
        },
        {
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin'
        }
      ];
      localStorage.setItem('registeredUsers', JSON.stringify(demoUsers));
      console.log('✅ Demo users created!');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Find user (case-insensitive email)
      const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );

      if (user) {
        // Call the onLogin from App.js with user data and role
        onLogin(
          { name: user.name, email: user.email }, 
          user.role || 'user' // Default to 'user' if role not specified
        );
        
        // Navigate based on role
        if (user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Login to your account</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-btn-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#999' }}>
            <p>Demo Accounts:</p>
            <p>👤 User: demo@example.com / password123</p>
            <p>👑 Admin: admin@example.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;