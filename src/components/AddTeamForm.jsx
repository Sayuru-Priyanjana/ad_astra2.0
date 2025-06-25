import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFirebaseContext } from '../context/FirebaseContext';
import '../styles/AddTeamForm.css';

const AddTeamForm = ({ onClose }) => {
  const { addNewTeam } = useFirebaseContext();
  const [teamName, setTeamName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!teamName.trim()) {
      setError('Please enter a team name');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await addNewTeam(teamName.trim());
      setSuccess(true);
      
      // Reset after success
      setTimeout(() => {
        setSuccess(false);
        setTeamName('');
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error adding team:', err);
      setError('Failed to add team. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div 
      className="form-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="form-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="form-header">
          <h3 className="form-title">Add New Team</h3>
          <button 
            onClick={onClose}
            className="close-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="team-form">
          <div className="form-group">
            <label className="form-label">Team Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="form-input"
              placeholder="Enter team name"
              autoFocus
            />
          </div>
          
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              {error}
            </motion.div>
          )}
          
          <div className="form-actions">
            <motion.button
              type="button"
              onClick={onClose}
              className="cancel-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="submit-button"
              disabled={isSubmitting || !teamName.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <span className="button-loading">
                  <span className="spinner"></span>
                  Adding...
                </span>
              ) : (
                'Add Team'
              )}
            </motion.button>
          </div>
        </form>
        
        {success && (
          <motion.div
            className="success-message"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Team added successfully!
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AddTeamForm;