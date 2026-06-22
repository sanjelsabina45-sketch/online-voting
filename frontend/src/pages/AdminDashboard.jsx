import { useState, useEffect } from 'react';
import '../css/AdminDashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
  const [votes, setVotes] = useState({
    candidate1: 1247,
    candidate2: 983,
    candidate3: 2156,
    candidate4: 842
  });
  const [users, setUsers] = useState([]);
  const [electionStatus, setElectionStatus] = useState('active');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');

  const candidates = [
    { id: 'candidate1', name: 'Sarah Johnson', party: 'Progressive Party', color: '#4CAF50' },
    { id: 'candidate2', name: 'Michael Chen', party: 'Unity Alliance', color: '#2196F3' },
    { id: 'candidate3', name: 'Patricia Williams', party: 'Democratic Front', color: '#9C27B0' },
    { id: 'candidate4', name: 'Robert Martinez', party: 'Liberty Party', color: '#FF9800' }
  ];

  useEffect(() => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    setUsers(registeredUsers);
    
    const savedAnnouncements = JSON.parse(localStorage.getItem('announcements') || '[]');
    setAnnouncements(savedAnnouncements);
  }, []);

  const getTotalVotes = () => Object.values(votes).reduce((a, b) => a + b, 0);
  const getTurnout = () => ((getTotalVotes() / (users.length || 1)) * 100).toFixed(1);
  
  const getLeadingCandidate = () => {
    const entries = Object.entries(votes);
    const leading = entries.reduce((max, [id, count]) => 
      count > max.count ? { id, count } : max, 
      { id: null, count: 0 }
    );
    return candidates.find(c => c.id === leading.id);
  };

  const resetElection = () => {
    if (window.confirm('Are you sure you want to reset all votes? This action cannot be undone!')) {
      setVotes({
        candidate1: 0,
        candidate2: 0,
        candidate3: 0,
        candidate4: 0
      });
      localStorage.clear();
      alert('Election has been reset successfully!');
    }
  };

  const addAnnouncement = () => {
    if (newAnnouncement.trim()) {
      const announcement = {
        id: Date.now(),
        text: newAnnouncement,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      };
      const updated = [announcement, ...announcements];
      setAnnouncements(updated);
      localStorage.setItem('announcements', JSON.stringify(updated));
      setNewAnnouncement('');
    }
  };

  const deleteAnnouncement = (id) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem('announcements', JSON.stringify(updated));
  };

  const endElection = () => {
    if (window.confirm('Are you sure you want to end the election?')) {
      setElectionStatus('ended');
      alert('Election has been ended!');
    }
  };

  const startElection = () => {
    setElectionStatus('active');
    alert('Election has been started!');
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <div className="nav-brand">
          <h2>👑 VoteSphere - Admin Control Panel</h2>
          <span className={`election-status-badge ${electionStatus}`}>
            {electionStatus === 'active' ? '● LIVE' : '● ENDED'}
          </span>
        </div>
        <div className="admin-info">
          <span>👋 Welcome, {user?.name}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="admin-tabs">
        <button className={`tab ${selectedTab === 'overview' ? 'active' : ''}`} onClick={() => setSelectedTab('overview')}>
          📊 Overview
        </button>
        <button className={`tab ${selectedTab === 'candidates' ? 'active' : ''}`} onClick={() => setSelectedTab('candidates')}>
          👥 Candidates
        </button>
        <button className={`tab ${selectedTab === 'voters' ? 'active' : ''}`} onClick={() => setSelectedTab('voters')}>
          🗳️ Voters
        </button>
        <button className={`tab ${selectedTab === 'settings' ? 'active' : ''}`} onClick={() => setSelectedTab('settings')}>
          ⚙️ Settings
        </button>
      </div>

      <div className="admin-content">
        {selectedTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🗳️</div>
                <div className="stat-info">
                  <span className="stat-label">Total Votes</span>
                  <span className="stat-value">{getTotalVotes()}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <span className="stat-label">Registered Voters</span>
                  <span className="stat-value">{users.length}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <span className="stat-label">Turnout Rate</span>
                  <span className="stat-value">{getTurnout()}%</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-info">
                  <span className="stat-label">Leading Candidate</span>
                  <span className="stat-value">{getLeadingCandidate()?.name || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="results-panel">
              <h3>Live Results</h3>
              {candidates.map(candidate => {
                const voteCount = votes[candidate.id];
                const percentage = getTotalVotes() === 0 ? 0 : ((voteCount / getTotalVotes()) * 100).toFixed(1);
                return (
                  <div key={candidate.id} className="result-item">
                    <div className="result-header">
                      <div>
                        <strong>{candidate.name}</strong>
                        <span className="party">{candidate.party}</span>
                      </div>
                      <span>{voteCount} votes ({percentage}%)</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${percentage}%`, backgroundColor: candidate.color }}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="announcements-panel">
              <h3>Announcements</h3>
              <div className="add-announcement">
                <input
                  type="text"
                  placeholder="New announcement..."
                  value={newAnnouncement}
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                />
                <button onClick={addAnnouncement}>Post</button>
              </div>
              <div className="announcements-list">
                {announcements.map(ann => (
                  <div key={ann.id} className="announcement-item">
                    <p>{ann.text}</p>
                    <small>{ann.date} at {ann.time}</small>
                    <button className="delete-announcement" onClick={() => deleteAnnouncement(ann.id)}>×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'candidates' && (
          <div className="candidates-section">
            <h3>Manage Candidates</h3>
            <div className="candidates-table">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Party</th>
                    <th>Votes</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map(candidate => (
                    <tr key={candidate.id}>
                      <td><strong>{candidate.name}</strong></td>
                      <td>{candidate.party}</td>
                      <td>{votes[candidate.id]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'voters' && (
          <div className="voters-section">
            <h3>Registered Voters</h3>
            <div className="voters-table">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Voted</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userItem, idx) => (
                    <tr key={idx}>
                      <td>{userItem.name}</td>
                      <td>{userItem.email}</td>
                      <td><span className="status-badge active">Active</span></td>
                      <td>{localStorage.getItem(`voted_${userItem.email}`) ? '✅ Yes' : '❌ No'}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center' }}>No registered users yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'settings' && (
          <div className="settings-section">
            <div className="settings-card">
              <h3>Election Controls</h3>
              <div className="setting-item">
                <label>Election Status</label>
                <div className="status-controls">
                  <button className={`status-btn ${electionStatus === 'active' ? 'active' : ''}`} onClick={startElection}>
                    Start Election
                  </button>
                  <button className={`status-btn ${electionStatus === 'ended' ? 'ended' : ''}`} onClick={endElection}>
                    End Election
                  </button>
                </div>
              </div>
              <div className="setting-item">
                <label>Danger Zone</label>
                <button className="reset-btn" onClick={resetElection}>Reset Entire Election</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;