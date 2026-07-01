// pages/UserDashboard.jsx
import { useState, useEffect } from 'react';
import '../css/UserDashboard.css';

const UserDashboard = ({ user, onLogout }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCreateElection, setShowCreateElection] = useState(false);
  const [votes, setVotes] = useState({});
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    candidates: [{ name: '', party: '', symbol: '' }]
  });

  // Load elections from localStorage
  useEffect(() => {
    const savedElections = JSON.parse(localStorage.getItem('elections') || '[]');
    setElections(savedElections);
    
    // Load votes
    const savedVotes = JSON.parse(localStorage.getItem('electionVotes') || '{}');
    setVotes(savedVotes);
  }, []);

  // Load votes for selected election
  useEffect(() => {
    if (selectedElection) {
      const voted = localStorage.getItem(`voted_${user?.email}_${selectedElection}`);
      if (voted) {
        setHasVoted(true);
      } else {
        setHasVoted(false);
      }
      setSelectedCandidate(null);
    }
  }, [selectedElection, user]);

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
      alert('Please add at least one candidate with a name');
      return;
    }

    const election = {
      id: Date.now(),
      title: newElection.title.trim(),
      description: newElection.description.trim() || 'No description provided',
      candidates: validCandidates.map(c => ({
        name: c.name.trim(),
        party: c.party.trim() || 'Independent',
        symbol: c.symbol.trim() || '🗳️'
      })),
      createdBy: user?.email,
      createdAt: new Date().toLocaleDateString(),
      createdBy: user?.name,
      status: 'active',
      totalVotes: 0
    };

    const updatedElections = [...elections, election];
    setElections(updatedElections);
    localStorage.setItem('elections', JSON.stringify(updatedElections));

    // Initialize votes for this election
    const newVotes = { ...votes };
    election.candidates.forEach(c => {
      newVotes[`${election.id}_${c.name}`] = 0;
    });
    setVotes(newVotes);
    localStorage.setItem('electionVotes', JSON.stringify(newVotes));

    setNewElection({
      title: '',
      description: '',
      candidates: [{ name: '', party: '', symbol: '' }]
    });
    setShowCreateElection(false);
    alert('✅ Election created successfully!');
  };

  const handleVote = () => {
    if (selectedCandidate && !hasVoted && selectedElection) {
      setShowConfirmation(true);
    }
  };

  const confirmVote = () => {
    if (!selectedElection) return;
    
    const election = elections.find(e => e.id === selectedElection);
    const candidate = election?.candidates.find(c => c.name === selectedCandidate);
    
    if (candidate) {
      const voteKey = `${selectedElection}_${candidate.name}`;
      const updatedVotes = {
        ...votes,
        [voteKey]: (votes[voteKey] || 0) + 1
      };
      setVotes(updatedVotes);
      localStorage.setItem('electionVotes', JSON.stringify(updatedVotes));
      localStorage.setItem(`voted_${user?.email}_${selectedElection}`, selectedCandidate);
      setHasVoted(true);
      setShowConfirmation(false);
      alert('✅ Thank you for voting! Your vote has been recorded.');
    }
  };

  const getVotesForElection = (electionId) => {
    const election = elections.find(e => e.id === electionId);
    if (!election) return {};
    
    const result = {};
    election.candidates.forEach(c => {
      const key = `${electionId}_${c.name}`;
      result[c.name] = votes[key] || 0;
    });
    return result;
  };

  const getTotalVotesForElection = (electionId) => {
    const electionVotes = getVotesForElection(electionId);
    return Object.values(electionVotes).reduce((a, b) => a + b, 0);
  };

  const getPercentage = (electionId, candidateName) => {
    const total = getTotalVotesForElection(electionId);
    if (total === 0) return 0;
    const voteCount = getVotesForElection(electionId)[candidateName] || 0;
    return ((voteCount / total) * 100).toFixed(1);
  };

  const getVotedCandidate = (electionId) => {
    return localStorage.getItem(`voted_${user?.email}_${electionId}`);
  };

  const handleDeleteElection = (electionId) => {
    if (window.confirm('Are you sure you want to delete this election?')) {
      const updatedElections = elections.filter(e => e.id !== electionId);
      setElections(updatedElections);
      localStorage.setItem('elections', JSON.stringify(updatedElections));
      if (selectedElection === electionId) {
        setSelectedElection(null);
      }
      alert('🗑️ Election deleted successfully!');
    }
  };

  const handleEndElection = (electionId) => {
    if (window.confirm('Are you sure you want to end this election?')) {
      const updatedElections = elections.map(e => 
        e.id === electionId ? { ...e, status: 'ended' } : e
      );
      setElections(updatedElections);
      localStorage.setItem('elections', JSON.stringify(updatedElections));
      alert('⏹️ Election ended successfully!');
    }
  };

  const activeElections = elections.filter(e => e.status === 'active');
  const endedElections = elections.filter(e => e.status === 'ended');

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
        {/* Create Election Button */}
        <div className="create-election-header">
          <button 
            className="create-election-btn"
            onClick={() => setShowCreateElection(true)}
          >
            ➕ Create New Election
          </button>
        </div>

        {/* Elections List */}
        <div className="elections-section">
          <h3>Active Elections</h3>
          <div className="elections-grid">
            {activeElections.length === 0 ? (
              <div className="empty-state">
                <p>No active elections available</p>
                <p className="empty-sub">Create a new election to get started!</p>
              </div>
            ) : (
              activeElections.map(election => (
                <div 
                  key={election.id} 
                  className={`election-card ${selectedElection === election.id ? 'selected' : ''}`}
                  onClick={() => setSelectedElection(election.id)}
                >
                  <h3>{election.title}</h3>
                  <p className="election-desc">{election.description}</p>
                  <div className="election-meta">
                    <span>📅 {election.createdAt}</span>
                    <span>👤 By: {election.createdBy}</span>
                    <span>👥 {election.candidates.length} Candidates</span>
                    <span>📊 {getTotalVotesForElection(election.id)} Votes</span>
                  </div>
                  {selectedElection === election.id && (
                    <div className="selected-badge">✓ Selected</div>
                  )}
                  {election.createdBy === user?.email && (
                    <div className="election-actions">
                      <button 
                        className="end-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEndElection(election.id);
                        }}
                      >
                        End Election
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteElection(election.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ended Elections */}
        {endedElections.length > 0 && (
          <div className="elections-section">
            <h3>Ended Elections</h3>
            <div className="elections-grid">
              {endedElections.map(election => (
                <div 
                  key={election.id} 
                  className={`election-card ended ${selectedElection === election.id ? 'selected' : ''}`}
                  onClick={() => setSelectedElection(election.id)}
                >
                  <h3>{election.title} 🔴</h3>
                  <p className="election-desc">{election.description}</p>
                  <div className="election-meta">
                    <span>📅 {election.createdAt}</span>
                    <span>👤 By: {election.createdBy}</span>
                    <span>👥 {election.candidates.length} Candidates</span>
                    <span>📊 {getTotalVotesForElection(election.id)} Votes</span>
                  </div>
                  {election.createdBy === user?.email && (
                    <button 
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteElection(election.id);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Voting Section - Only show when an election is selected and active */}
        {selectedElection && !hasVoted && (
          <div className="voting-section">
            <div className="voting-header">
              <h2>{elections.find(e => e.id === selectedElection)?.title}</h2>
              <p>Cast your vote for this election</p>
            </div>

            <div className="candidates-grid">
              {elections.find(e => e.id === selectedElection)?.candidates.map((candidate, index) => (
                <div
                  key={index}
                  className={`candidate-card ${selectedCandidate === candidate.name ? 'selected' : ''}`}
                  onClick={() => setSelectedCandidate(candidate.name)}
                >
                  <div className="candidate-avatar" style={{ backgroundColor: '#667eea' }}>
                    {candidate.symbol || candidate.name.charAt(0)}
                  </div>
                  <h3>{candidate.name}</h3>
                  <p className="party">{candidate.party}</p>
                  {selectedCandidate === candidate.name && (
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
                {selectedCandidate ? '🗳️ Proceed to Vote' : 'Select a Candidate First'}
              </button>
            </div>
          </div>
        )}

        {/* Results Section - Show when election is selected and user has voted */}
        {selectedElection && hasVoted && (
          <div className="results-section">
            <div className="results-header">
              <h2>📊 Election Results</h2>
              <p>{elections.find(e => e.id === selectedElection)?.title}</p>
            </div>

            <div className="results-stats">
              <div className="stat-card">
                <span className="stat-label">Total Votes Cast</span>
                <span className="stat-value">{getTotalVotesForElection(selectedElection)}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Your Vote</span>
                <span className="stat-value">✓ Recorded</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Voted For</span>
                <span className="stat-value" style={{ fontSize: '1rem' }}>
                  {getVotedCandidate(selectedElection) || 'N/A'}
                </span>
              </div>
            </div>

            <div className="results-list">
              {elections.find(e => e.id === selectedElection)?.candidates.map((candidate, index) => {
                const voteCount = getVotesForElection(selectedElection)[candidate.name] || 0;
                const percentage = getPercentage(selectedElection, candidate.name);
                const isWinner = percentage === Math.max(
                  ...(elections.find(e => e.id === selectedElection)?.candidates.map(c => 
                    parseFloat(getPercentage(selectedElection, c.name))
                  ) || [0])
                );
                const isVoted = getVotedCandidate(selectedElection) === candidate.name;
                
                return (
                  <div key={index} className="result-row">
                    <div className="result-info">
                      <div className="candidate-name">
                        <div className="color-dot" style={{ backgroundColor: '#667eea' }}></div>
                        <strong>{candidate.symbol} {candidate.name}</strong>
                        <span className="party-name">{candidate.party}</span>
                        {isWinner && <span className="winner-badge">🏆 Winner</span>}
                        {isVoted && <span className="voted-badge">✓ Your Vote</span>}
                      </div>
                      <div className="vote-numbers">
                        <span>{voteCount} votes</span>
                        <span className="percentage">{percentage}%</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${percentage}%`, backgroundColor: '#667eea' }}
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

        {/* Create Election Modal */}
        {showCreateElection && (
          <div className="modal-overlay" onClick={() => setShowCreateElection(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create New Election</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowCreateElection(false)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Election Title *</label>
                  <input
                    type="text"
                    value={newElection.title}
                    onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
                    placeholder="Enter election title"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newElection.description}
                    onChange={(e) => setNewElection({ ...newElection, description: e.target.value })}
                    placeholder="Enter election description"
                    className="form-input"
                    rows="3"
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
                          <label>Candidate Name *</label>
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
                            placeholder="Enter symbol (e.g., 🌿)"
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
                  onClick={() => setShowCreateElection(false)}
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

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="modal-overlay">
            <div className="confirmation-modal">
              <h3>🗳️ Confirm Your Vote</h3>
              <p>Are you sure you want to vote for:</p>
              <div className="confirmed-candidate">
                <strong>{selectedCandidate}</strong>
                <span>{elections.find(e => e.id === selectedElection)?.candidates.find(c => c.name === selectedCandidate)?.party}</span>
              </div>
              <p className="warning">⚠️ This action cannot be undone!</p>
              <div className="modal-buttons">
                <button className="cancel-btn" onClick={() => setShowConfirmation(false)}>Cancel</button>
                <button className="confirm-btn" onClick={confirmVote}>✅ Confirm Vote</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;