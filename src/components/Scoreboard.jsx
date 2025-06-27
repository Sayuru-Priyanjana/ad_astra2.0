import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirebaseContext } from '../context/FirebaseContext';
import TeamCard from './TeamCard';
import '../styles/Scoreboard.css';
import '../styles/globle.css';
import logo from '../assets/dark bg.png';

const Scoreboard = ({ toggleMode }) => {
  const { teams, loading } = useFirebaseContext();
  const [prevTeams, setPrevTeams] = useState([]);
  const [highlightedTeam, setHighlightedTeam] = useState(null);
  const [updatedTeam, setUpdatedTeam] = useState(null);
  const containerRef = useRef(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  // Generate stars with unique IDs for better performance
  const [stars] = useState(() => 
    Array.from({ length: 300 }, (_, i) => ({
      id: `star-${i}`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3}px`,
      opacity: Math.random() * 0.8 + 0.2,
      duration: `${Math.random() * 3 + 1}s`,
      delay: `${Math.random() * 2}s`
    }))
  );

  // Track team position changes and score updates
  useEffect(() => {
    if (!loading && teams.length > 0) {
      // Find teams that changed position
      const positionChange = findPositionChanges(prevTeams, teams);
      if (positionChange) {
        setHighlightedTeam(positionChange);
        setTimeout(() => setHighlightedTeam(null), 3000);
      }
      
      // Find teams with updated scores
      const scoreUpdate = findScoreUpdates(prevTeams, teams);
      if (scoreUpdate) {
        setUpdatedTeam(scoreUpdate);
        setTimeout(() => setUpdatedTeam(null), 1000);
      }
      
      setPrevTeams(teams);
    }
  }, [teams, loading]);

  // Password handling functions
  const handleAdminButtonClick = () => {
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === 'sedsruhuna') {
      setShowPasswordPrompt(false);
      setError('');
      setPasswordInput('');
      toggleMode(); // Call the original toggleMode function
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const cancelPasswordPrompt = () => {
    setShowPasswordPrompt(false);
    setError('');
    setPasswordInput('');
  };

  // Find teams that changed position in rankings
  const findPositionChanges = (prev, current) => {
    if (!prev.length) return null;
    
    const changes = [];
    for (let i = 0; i < current.length; i++) {
      const currentTeam = current[i];
      const prevTeamIndex = prev.findIndex(t => t.id === currentTeam.id);
      
      if (prevTeamIndex !== -1 && prevTeamIndex > i) {
        changes.push(currentTeam.id);
      }
    }
    return changes.length > 0 ? changes : null;
  };

  // Find teams with updated scores
  const findScoreUpdates = (prev, current) => {
    if (!prev.length) return null;
    
    const updates = [];
    for (let i = 0; i < current.length; i++) {
      const currentTeam = current[i];
      const prevTeam = prev.find(t => t.id === currentTeam.id);
      
      if (prevTeam && prevTeam.score !== currentTeam.score) {
        updates.push(currentTeam.id);
      }
    }
    return updates.length > 0 ? updates : null;
  };

  // Split teams into two columns
  const splitTeamsIntoColumns = () => {
    if (teams.length === 0) return [[], []];
    
    // Top 3 teams get special treatment
    const top3 = teams.slice(0, 3);
    
    // Remaining teams split into two columns
    const remaining = teams.slice(3);
    const middleIndex = Math.ceil(remaining.length / 2);
    const col1 = remaining.slice(0, middleIndex);
    const col2 = remaining.slice(middleIndex);
    
    return [top3, col1, col2];
  };

  const [top3, col1, col2] = splitTeamsIntoColumns();

  return (
    <div className="scoreboard" ref={containerRef}>
      {/* Animated Stars Background */}
      <div className="stars-background">
        {stars.map(star => (
          <motion.div 
            key={star.id}
            className="star"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }}
            animate={{ 
              opacity: [star.opacity, 1, star.opacity],
            }}
            transition={{ 
              duration: parseFloat(star.duration),
              repeat: Infinity,
              delay: parseFloat(star.delay)
            }}
          />
        ))}
      </div>
      
      {/* Header with Floating Animation */}
      <motion.header 
        className="header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="logo-container">
          <motion.div 
            className="logo-wrapper"
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="logo-inner">
              <div className="logo-icon"><img src={logo} alt="" srcset="" height={120}/></div>
            </div>
          </motion.div>
        </div>
        <motion.h1 
          className="title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          ADASTRA 2.0 SEDS RUHUNA
        </motion.h1>
        <motion.h2 
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          TEAM SCOREBOARD
        </motion.h2>
      </motion.header>

      {/* Top 3 Teams - Special Highlight with Animations */}
      {!loading && top3.length > 0 && (
        <motion.div 
          className="top-teams-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h3 className="top-teams-title">Event 1</h3>
          <div className="top-teams-grid">
            {top3.map((team, index) => (
              <TeamCard 
                key={team.id}
                team={team}
                rank={index + 1}
                isTop3={true}
                isHighlighted={highlightedTeam?.includes(team.id)}
                isUpdated={updatedTeam?.includes(team.id)}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Other Teams in Two Columns */}
      <div className="teams-container">
        {loading ? (
          <motion.div 
            className="loading-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div 
              className="loading-spinner"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="loading-text">Loading teams...</p>
          </motion.div>
        ) : teams.length === 0 ? (
          <motion.div 
            className="no-teams"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>No teams yet. Add teams in admin mode.</p>
          </motion.div>
        ) : (
          <div className="teams-columns-container">
            {/* Two Columns Layout */}
            <div className="teams-columns">
              <div className="team-column">
                <AnimatePresence>
                  {col1.map((team, index) => (
                    <TeamCard 
                      key={team.id}
                      team={team}
                      rank={index + 4} // Start from rank 4
                      isHighlighted={highlightedTeam?.includes(team.id)}
                      isUpdated={updatedTeam?.includes(team.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="team-column">
                <AnimatePresence>
                  {col2.map((team, index) => (
                    <TeamCard 
                      key={team.id}
                      team={team}
                      rank={index + 4 + col1.length} // Continue ranking
                      isHighlighted={highlightedTeam?.includes(team.id)}
                      isUpdated={updatedTeam?.includes(team.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Admin Access Button */}
      <motion.div 
        className="admin-button-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <motion.button 
          onClick={handleAdminButtonClick}
          className="admin-button"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 20px rgba(255, 123, 0, 0.6)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          Admin Mode
        </motion.button>
      </motion.div>

      {/* Password Prompt Modal */}
      <AnimatePresence>
        {showPasswordPrompt && (
          <motion.div 
            className="password-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}
          >
            <motion.div 
              className="password-box"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                backgroundColor: '#2a2a2a',
                padding: '2rem',
                borderRadius: '10px',
                maxWidth: '400px',
                width: '90%'
              }}
            >
              <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Enter Admin Password</h3>
              <form onSubmit={handlePasswordSubmit}>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    marginBottom: '1rem',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#444',
                    color: '#fff'
                  }}
                  autoFocus
                />
                {error && <p style={{ color: '#ff5555', marginBottom: '1rem' }}>{error}</p>}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#ff7b00',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    Submit
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={cancelPasswordPrompt}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Scoreboard;
