import { useState, useEffect } from 'react';
import '../css/UserDashboard.css';

const UserDashboard = ({ user, onLogout }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState({
    candidate1: 1247,
    candidate2: 983,
    candidate3: 2156,
    candidate4: 842
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const candidates = [
    { 
      id: 'candidate1', 
      name: 'Sarah Johnson', 
      party: 'Progressive Party', 
      color: '#4CAF50', 
      description: 'Former Senator, 15 years of public service', 
      agenda: ['Healthcare Reform', 'Climate Action', 'Education Funding'] 
    },
    { 
      id: 'candidate2', 
      name: 'Michael Chen', 
      party: 'Unity Alliance', 
      color: '#2196F3', 
      description: 'Tech entrepreneur, education reform advocate', 
      agenda: ['Digital Economy', 'Tech Innovation', 'Job Creation'] 
    },
    { 
      id: 'candidate3', 
      name: 'Patricia Williams', 
      party: 'Democratic Front', 
      color: '#9C27B0', 
      description: 'Community organizer, human rights lawyer', 
      agenda: ['Social Justice', 'Equal Rights', 'Community Development'] 
    },
    { 
      id: 'candidate4', 
      name: 'Robert Martinez', 
      party: 'Liberty Party', 
      color: '#FF9800', 
      description: 'Small business owner, fiscal conservative', 
      agenda: ['Tax Reform', 'Small Business', 'Economic Freedom'] 
    }
  ];

  useEffect(() => {
    const voted = localStorage.getItem(`voted_${user?.email}`);
    if (voted) {
      setHasVoted(true);
    }
  }, [user]);

  const handleVote = () => {
    if (selectedCandidate && !hasVoted) {
      setShowConfirmation(true);
    }
  };

  const confirmVote = () => {
    setVotes(prev => ({
      ...prev,
      [selectedCandidate]: prev[selectedCandidate] + 1
    }));
    setHasVoted(true);
    localStorage.setItem(`voted_${user?.email}`, selectedCandidate);
    setShowConfirmation(false);
    alert('Thank you for voting! Your vote has been recorded.');
  };

  const getPercentage = (votesCount) => {
    const total = Object.values(votes).reduce((a, b) => a + b, 0);
    return total > 0 ? ((votesCount / total) * 100).toFixed(1) : 0;
  };

  const getTotalVotes = () => {
    return Object.values(votes).reduce((a, b) => a + b, 0);
  };

  return (
    <div className="user-dashboard">
      <nav className="user-nav">
        <div className="nav-brand">
          <h2>🗳️ VoteSphere - Voter Dashboard</h2>
        </div>
        <div className="user-info">
          <span>👤 {user?.name}</span>
          <span>📧 {user?.email}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="user-dashboard-content">
        {!hasVoted ? (
          <div className="voting-section">
            <div className="voting-header">
              <h1>Cast Your Vote</h1>
              <p>2024 General Election - Choose your candidate wisely</p>
            </div>

            <div className="candidates-grid">
              {candidates.map(candidate => (
                <div
                  key={candidate.id}
                  className={`candidate-card ${selectedCandidate === candidate.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCandidate(candidate.id)}
                >
                  <div className="candidate-avatar" style={{ backgroundColor: candidate.color }}>
                    {candidate.name.charAt(0)}
                  </div>
                  <h3>{candidate.name}</h3>
                  <p className="party">{candidate.party}</p>
                  <p className="description">{candidate.description}</p>
                  <div className="agenda">
                    <strong>Key Agenda:</strong>
                    <ul>
                      {candidate.agenda.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  {selectedCandidate === candidate.id && (
                    <div className="selected-badge">✓ Selected</div>
                  )}
                </div>
              ))}
            </div>

            <div className="vote-action">
              <button
                className={`vote-now-btn ${!selectedCandidate ? 'disabled' : ''}`}
                onClick={handleVote}
                disabled={!selectedCandidate}
              >
                {selectedCandidate ? 'Proceed to Vote' : 'Select a Candidate First'}
              </button>
            </div>
          </div>
        ) : (
          <div className="results-section">
            <div className="results-header">
              <h1>Election Results</h1>
              <p>Thank you for participating in democracy!</p>
            </div>

            <div className="results-stats">
              <div className="stat-card">
                <span className="stat-label">Total Votes Cast</span>
                <span className="stat-value">{getTotalVotes()}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Your Vote</span>
                <span className="stat-value">✓ Recorded</span>
              </div>
            </div>

            <div className="results-list">
              {candidates.map(candidate => {
                const voteCount = votes[candidate.id];
                const percentage = getPercentage(voteCount);
                return (
                  <div key={candidate.id} className="result-row">
                    <div className="result-info">
                      <div className="candidate-name">
                        <div className="color-dot" style={{ backgroundColor: candidate.color }}></div>
                        <strong>{candidate.name}</strong>
                        <span className="party-name">{candidate.party}</span>
                      </div>
                      <div className="vote-numbers">
                        <span>{voteCount} votes</span>
                        <span className="percentage">{percentage}%</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${percentage}%`, backgroundColor: candidate.color }}
                      >
                        <span className="progress-text">{percentage}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="thank-you-message">
              <h3>✅ Your Voice Matters!</h3>
              <p>Thank you for being an active participant in our democracy.</p>
            </div>
          </div>
        )}
      </div>

      {showConfirmation && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h3>Confirm Your Vote</h3>
            <p>Are you sure you want to vote for:</p>
            <div className="confirmed-candidate">
              <strong>{candidates.find(c => c.id === selectedCandidate)?.name}</strong>
              <span>{candidates.find(c => c.id === selectedCandidate)?.party}</span>
            </div>
            <p className="warning">⚠️ This action cannot be undone!</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setShowConfirmation(false)}>Cancel</button>
              <button className="confirm-btn" onClick={confirmVote}>Confirm Vote</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;