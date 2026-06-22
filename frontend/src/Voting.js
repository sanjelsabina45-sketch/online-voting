import React, { useState } from "react";

const Voting = () => {
  const [votes, setVotes] = useState({
    CandidateA: 0,
    CandidateB: 0,
    CandidateC: 0,
  });

  const handleVote = (candidate) => {
    setVotes((prev) => ({
      ...prev,
      [candidate]: prev[candidate] + 1,
    }));
  };

  const resetVotes = () => {
    setVotes({
      CandidateA: 0,
      CandidateB: 0,
      CandidateC: 0,
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🗳️ Online Voting System</h1>

      <div>
        <h2>Candidate A: {votes.CandidateA}</h2>
        <button onClick={() => handleVote("CandidateA")}>Vote A</button>
      </div>

      <div>
        <h2>Candidate B: {votes.CandidateB}</h2>
        <button onClick={() => handleVote("CandidateB")}>Vote B</button>
      </div>

      <div>
        <h2>Candidate C: {votes.CandidateC}</h2>
        <button onClick={() => handleVote("CandidateC")}>Vote C</button>
      </div>

      <br />

      <button onClick={resetVotes} style={{ marginTop: "20px" }}>
        🔄 Reset Votes
      </button>
    </div>
  );
};

export default Voting;