// pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AdminDashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newElection, setNewElection] = useState({
    title: '',
    candidates: [{ name: '', party: '', symbol: '' }]
  });
  const [editingElection, setEditingElection] = useState(null);

  // Load elections from localStorage
  useEffect(() => {
    const savedElections = JSON.parse(localStorage.getItem('elections') || '[]');
    setElections(savedElections);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleAddCandidate = () => {
    setNewElection({
      ...newElection,
      candidates: [...newElection.candidates, { name: '', party: '', symbol: '' }]
    });
  };

  const handleRemoveCandidate = (index) => {
    if (newElection.candidates.length > 1) {
      const updatedCandidates = newElection.candidates.filter((_, i) => i !== index);
      setNewElection({ ...newElection, candidates: updatedCandidates });
    }
  };

  const handleCandidateChange = (index, field, value) => {
    const updatedCandidates = newElection.candidates.map((candidate, i) => {
      if (i === index) {
        return { ...candidate, [field]: value };
      }
      return candidate;
    });
    setNewElection({ ...newElection, candidates: updatedCandidates });
  };

  const handleCreateElection = () => {
    if (!newElection.title.trim()) {
      alert('Please enter election title');
      return;
    }

    const validCandidates = newElection.candidates.filter(c => c.name.trim());
    if (validCandidates.length === 0) {
      alert('Please add at least one candidate');
      return;
    }

    const election = {
      id: Date.now(),
      title: newElection.title,
      candidates: validCandidates,
      createdAt: new Date().toLocaleDateString(),
      status: 'active',
      totalVotes: 0
    };

    const updatedElections = [...elections, election];
    setElections(updatedElections);
    localStorage.setItem('elections', JSON.stringify(updatedElections));

    setNewElection({
      title: '',
      candidates: [{ name: '', party: '', symbol: '' }]
    });
    setShowCreateForm(false);
    alert('Election created successfully!');
  };

  const handleDeleteElection = (electionId) => {
    if (window.confirm('Are you sure you want to delete this election?')) {
      const updatedElections = elections.filter(e => e.id !== electionId);
      setElections(updatedElections);
      localStorage.setItem('elections', JSON.stringify(updatedElections));
    }
  };

  const handleEndElection = (electionId) => {
    if (window.confirm('Are you sure you want to end this election?')) {
      const updatedElections = elections.map(e => 
        e.id === electionId ? { ...e, status: 'ended' } : e
      );
      setElections(updatedElections);
      localStorage.setItem('elections', JSON.stringify(updatedElections));
    }
  };

  const getCandidateCount = (election) => {
    return election.candidates ? election.candidates.length : 0;
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <h1>🗳️ E-Voting Made Easy</h1>
          <div className="admin-info">
            <span className="admin-welcome">Welcome, {user?.name || 'Admin'}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <ul>
              <li className="active">
                <span className="nav-icon">📊</span>
                Dashboard
              </li>
              <li>
                <span className="nav-icon">🗳️</span>
                All Elections
              </li>
              <li>
                <span className="nav-icon">👥</span>
                Voters
              </li>
              <li>
                <span className="nav-icon">📈</span>
                Results
              </li>
              <li>
                <span className="nav-icon">⚙️</span>
                Settings
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Elections List */}
          <section className="elections-section">
            <div className="section-header">
              <h2>All Elections</h2>
              <button 
                className="create-election-btn"
                onClick={() => setShowCreateForm(true)}
              >
                + Create New Election
              </button>
            </div>

            <div className="elections-list">
              {elections.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🗳️</div>
                  <p>No elections created yet</p>
                  <p className="empty-sub">Click "Create New Election" to get started</p>
                </div>
              ) : (
                elections.map((election) => (
                  <div key={election.id} className="election-card">
                    <div className="election-info">
                      <h3>{election.title}</h3>
                      <div className="election-meta">
                        <span className="election-date">📅 {election.createdAt}</span>
                        <span className={`election-status ${election.status}`}>
                          {election.status === 'active' ? '🟢 Active' : '🔴 Ended'}
                        </span>
                        <span className="candidate-count">
                          👤 {getCandidateCount(election)} Candidates
                        </span>
                        <span className="vote-count">
                          📊 {election.totalVotes || 0} Votes
                        </span>
                      </div>
                      <div className="candidates-preview">
                        <strong>Candidates:</strong>
                        {election.candidates && election.candidates.map((c, idx) => (
                          <span key={idx} className="candidate-tag">
                            {c.name} {c.party && `(${c.party})`}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="election-actions">
                      {election.status === 'active' && (
                        <button 
                          className="end-btn"
                          onClick={() => handleEndElection(election.id)}
                        >
                          End Election
                        </button>
                      )}
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteElection(election.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Create Election Modal */}
          {showCreateForm && (
            <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Create New Election</h2>
                  <button 
                    className="modal-close"
                    onClick={() => setShowCreateForm(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="modal-body">
                  <div className="form-group">
                    <label>Election Title</label>
                    <input
                      type="text"
                      value={newElection.title}
                      onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
                      placeholder="Enter election title"
                      className="form-input"
                    />
                  </div>

                  <div className="candidates-section">
                    <h3>Candidates</h3>
                    {newElection.candidates.map((candidate, index) => (
                      <div key={index} className="candidate-form">
                        <div className="candidate-header">
                          <h4>Candidate {index + 1}</h4>
                          {newElection.candidates.length > 1 && (
                            <button 
                              className="remove-candidate-btn"
                              onClick={() => handleRemoveCandidate(index)}
                            >
                              ✕ Remove
                            </button>
                          )}
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Candidate Name</label>
                            <input
                              type="text"
                              value={candidate.name}
                              onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                              placeholder="Enter candidate name"
                              className="form-input"
                            />
                          </div>
                          <div className="form-group">
                            <label>Party Name</label>
                            <input
                              type="text"
                              value={candidate.party}
                              onChange={(e) => handleCandidateChange(index, 'party', e.target.value)}
                              placeholder="Enter party name"
                              className="form-input"
                            />
                          </div>
                          <div className="form-group">
                            <label>Symbol</label>
                            <input
                              type="text"
                              value={candidate.symbol}
                              onChange={(e) => handleCandidateChange(index, 'symbol', e.target.value)}
                              placeholder="Enter symbol (e.g., 🌿, 🦁)"
                              className="form-input"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button 
                      className="add-candidate-btn"
                      onClick={handleAddCandidate}
                    >
                      + Add Candidate
                    </button>
                  </div>
                </div>

                <div className="modal-footer">
                  <button 
                    className="btn-secondary"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={handleCreateElection}
                  >
                    Create Election
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;