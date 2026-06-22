// pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import '../css/LandingPage.css';

const LandingPage = ({ isAuthenticated }) => {
  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="nav-brand">
          <h2>🗳️ E Vote</h2>
        </div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-btn login-btn">Login</Link>
              <Link to="/signup" className="nav-btn signup-btn">Sign Up</Link>
            </>
          ) : (
            <Link to="/dashboard" className="nav-btn dashboard-btn">Dashboard</Link>
          )}
        </div>
      </nav>

      <section id="home" className="hero-section">
        <div className="hero-content">
          <h1>Secure Online Voting Platform</h1>
          <p>Cast your vote from anywhere, anytime. Your voice matters in shaping the future.</p>
          {!isAuthenticated && (
            <div className="hero-buttons">
              <Link to="/signup" className="hero-btn primary">Get Started</Link>
              <Link to="/login" className="hero-btn secondary">Login</Link>
            </div>
          )}
        </div>
      </section>

      <section id="features" className="features-section">
        <h2>Why Choose E Vote?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Encrypted</h3>
            <p>Bank-level security to ensure your vote remains anonymous and tamper-proof.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-time Results</h3>
            <p>Watch votes update in real-time with our live dashboard technology.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Remote Access</h3>
            <p>Vote from anywhere in the world using any device with internet connection.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>One Vote Per User</h3>
            <p>Prevent duplicate voting with our unique user verification system.</p>
          </div>
        </div>
      </section>

      <section id="about" className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Active Voters</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">150+</span>
            <span className="stat-label">Elections Held</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">99.9%</span>
            <span className="stat-label">Uptime</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support</span>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>VoteSphere</h4>
            <p>Empowering democracy through secure online voting.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>📧 support@votesphere.com</p>
            <p>📞 +1 (555) 123-4567</p>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#">Twitter</a>
              <a href="#">Facebook</a>
              <a href="#">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 E Vote. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;