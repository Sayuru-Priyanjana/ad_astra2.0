import React, { createContext, useContext, useState, useEffect } from 'react';
import { database, ref, onValue, update, set } from '../firebase';

// 1. Create the context
const FirebaseContext = createContext();

// 2. Create the provider component
export const FirebaseProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const teamsRef = ref(database, 'teams');
    
    const unsubscribe = onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const teamsArray = Object.entries(data).map(([id, team]) => ({
          id,
          ...team
        }));
        teamsArray.sort((a, b) => b.score - a.score);
        setTeams(teamsArray);
      } else {
        setTeams([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addTeam = async (teamName) => {
    const newTeamRef = ref(database, `teams/${Date.now()}`);
    await set(newTeamRef, {
      name: teamName,
      score: 0
    });
  };

  const updateScore = async (teamId, points) => {
    const teamRef = ref(database, `teams/${teamId}`);
    const team = teams.find(t => t.id === teamId);
    
    if (team) {
      const newScore = team.score + points;
      await update(teamRef, { score: newScore });
      return newScore;
    }
  };

  const addNewTeam = async (teamName) => {
    await addTeam(teamName);
  };

  const value = {
    teams,
    loading,
    addNewTeam,
    updateScore
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

// 3. Create and export the custom hook
export const useFirebaseContext = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebaseContext must be used within a FirebaseProvider');
  }
  return context;
};

// Optional: Export the context itself if needed elsewhere
export { FirebaseContext };