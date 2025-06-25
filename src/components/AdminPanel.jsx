import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFirebaseContext } from '../context/FirebaseContext';
import AddTeamForm from './AddTeamForm';
import '../styles/AdminPanel.css'; 

const AdminPanel = ({ toggleMode }) => {
  const { teams, updateScore } = useFirebaseContext();
  const [selectedTeam, setSelectedTeam] = useState('');
  const [points, setPoints] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTeam) {
      alert('Please select a team');
      return;
    }
    
    if (!points || isNaN(points)) {
      alert('Please enter a valid number for points');
      return;
    }
    
    try {
      await updateScore(selectedTeam, parseInt(points));
      setSuccessMessage(`+${points} points added successfully!`);
      
      // Reset after success
      setTimeout(() => {
        setSuccessMessage('');
        setSelectedTeam('');
        setPoints('');
      }, 3000);
    } catch (error) {
      console.error('Error updating score:', error);
      alert('Failed to update score. Please try again.');
    }
  };
  
  return (
    <div className="admin-panel">
      {/* Header */}
      <header className="admin-header">
        <h1 className="admin-title">Admin Panel</h1>
        <h2 className="admin-subtitle">Manage Teams and Scores</h2>
      </header>
      
      {/* Main Content */}
      <div className="admin-content">
        {/* Add Points Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-card"
        >
          <h3 className="card-title">Add Points to Team</h3>
          
          <form onSubmit={handleSubmit} className="points-form">
            <div className="form-group">
              <label className="form-label">Select Team</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="form-select"
                required
              >
                <option value="">Choose a team</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name} ({team.score} pts)
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Points to Add</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="form-input"
                placeholder="Enter points"
                min="1"
                required
              />
            </div>
            
            <div className="form-submit">
              <button
                type="submit"
                className="submit-button"
              >
                Add Points
              </button>
            </div>
            
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="success-message"
              >
                {successMessage}
              </motion.div>
            )}
          </form>
        </motion.div>
        
        {/* Team Management */}
        <div className="team-management">
          <div className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className="add-team-button"
            >
              Add New Team
            </button>
          </div>
          
          <div className="teams-list-card">
            <h3 className="card-title">Current Teams</h3>
            
            {teams.length === 0 ? (
              <p className="empty-teams-message">No teams added yet</p>
            ) : (
              <div className="teams-list">
                {teams.map((team, index) => (
                  <div 
                    key={team.id}
                    className="team-item"
                  >
                    <div>
                      <span className="team-rank">{index + 1}.</span>
                      <span className="team-name">{team.name}</span>
                    </div>
                    <div className="team-score">{team.score}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Back to Scoreboard Button */}
      <div className="back-button-container">
        <button 
          onClick={toggleMode}
          className="back-button"
        >
          View Scoreboard
        </button>
      </div>
      
      {/* Add Team Modal */}
      {showForm && <AddTeamForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default AdminPanel;