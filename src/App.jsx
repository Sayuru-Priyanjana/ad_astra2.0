import React, { useState } from 'react';
import { FirebaseProvider } from './context/FirebaseContext';
import Scoreboard from './components/Scoreboard';
import AdminPanel from './components/AdminPanel';

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  const toggleMode = () => {
    setIsAdminMode(!isAdminMode);
  };

  return (
    <FirebaseProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-950 text-white">
        {isAdminMode ? (
          <AdminPanel toggleMode={toggleMode} />
        ) : (
          <Scoreboard toggleMode={toggleMode} />
        )}
      </div>
    </FirebaseProvider>
  );
}

export default App;