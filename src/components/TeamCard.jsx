import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/TeamCard.css';

// Array of vibrant colors for rank badges
const rankColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', 
  '#FF6F69', '#88D8B0', '#FFCC5C', '#96CEB4', '#FF6F69',
  '#5DADE2', '#48C9B0', '#F1948A', '#85C1E9', '#F7DC6F'
];

const TeamCard = ({ team, rank, isTop3 = false, isHighlighted, isUpdated }) => {
  const prevScoreRef = useRef(team.score);
  
  // Detect score changes
  useEffect(() => {
    prevScoreRef.current = team.score;
  }, [team.score]);
  
  // Get color for rank badge
  const getRankColor = () => {
    if (isTop3) {
      // Top 3 have special colors
      if (rank === 1) return '#FFD700'; // Gold
      if (rank === 2) return '#C0C0C0'; // Silver
      if (rank === 3) return '#CD7F32'; // Bronze
    }
    
    // Other ranks get random colors from our palette
    const colorIndex = (rank - 1) % rankColors.length;
    return rankColors[colorIndex];
  };
  
  const badgeColor = getRankColor();

  return (
    <motion.div
      className={`team-card ${isTop3 ? 'top-3' : ''} ${isHighlighted ? 'highlighted' : ''}`}
      initial={{ opacity: 0, height: 0 }}
      animate={{ 
        opacity: 1, 
        height: "auto",
        backgroundColor: isHighlighted ? 'rgba(255, 165, 0, 0.3)' : 
                         isTop3 ? 'rgba(255, 215, 0, 0.15)' : 'rgba(30, 41, 59, 0.7)',
        borderColor: isHighlighted ? 'rgba(255, 165, 0, 0.5)' : 
                      isTop3 ? 'rgba(255, 215, 0, 0.5)' : 'rgba(56, 189, 248, 0.3)',
        scale: isUpdated ? 1.03 : 1,
      }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        backgroundColor: { duration: 0.5 },
        scale: { duration: 0.2 }
      }}
    >
      <div className="rank-container">
        <motion.div 
          className="rank-badge"
          style={{ backgroundColor: badgeColor }}
          animate={{
            scale: isHighlighted ? [1, 1.2, 1] : 1,
            rotate: isTop3 ? [0, 5, -5, 0] : 0,
          }}
          transition={{ 
            duration: 0.5,
            times: [0, 0.5, 1],
            repeat: isTop3 ? Infinity : 0,
            repeatType: "reverse"
          }}
        >
          {rank}
        </motion.div>
      </div>
      
      <div className="team-name-container">
        <motion.h3 
          className={`team-name ${isHighlighted ? 'highlighted' : ''}`}
          animate={{
            x: isHighlighted ? [0, 10, -10, 0] : 0,
          }}
          transition={{ 
            duration: 0.5,
            times: [0, 0.25, 0.75, 1]
          }}
        >
          {team.name}
        </motion.h3>
      </div>
      
      <div className="score-container">
        <motion.div 
          className="score-value"
          key={team.score}
          initial={{ 
            scale: prevScoreRef.current !== team.score ? 1.5 : 1,
            color: prevScoreRef.current !== team.score ? "#ffa500" : isTop3 ? "#ffd700" : "#ffffff"
          }}
          animate={{ 
            scale: 1, 
            color: isTop3 ? "#ffd700" : "#ffffff" 
          }}
          transition={{ duration: 0.5 }}
        >
          {team.score}
          <span className="score-label">pts</span>
        </motion.div>
        
        {/* Score change indicator */}
        {prevScoreRef.current !== team.score && (
          <motion.div
            className="score-change"
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            +{team.score - prevScoreRef.current}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TeamCard;