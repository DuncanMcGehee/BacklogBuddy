import { createContext, useContext, useState, useEffect } from 'react';

const BacklogContext = createContext(null);
const STORAGE_KEY = 'backlogbuddy-entries';

function loadEntries() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function BacklogProvider({ children }) {
  const [entries, setEntries] = useState(loadEntries);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      console.error('Could not save backlog');
    }
  }, [entries]);

  const addToBacklog = (game) => {
    setEntries(prev => {
      if (prev.some(entry => entry.id === game.id)) {
        return prev;
      }
      return [
        ...prev,
        {
          id: game.id,
          name: game.name,
          background_image: game.background_image,
          released: game.released,
          status: 'Backlog'
        }
      ];
    });
  };

  const removeFromBacklog = (id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const updateStatus = (id, status) => {
    setEntries(prev =>
      prev.map(entry => (entry.id === id ? { ...entry, status } : entry))
    );
  };

  const isInBacklog = (id) => {
    return entries.some(entry => entry.id === id);
  };

  return (
    <BacklogContext.Provider
      value={{ entries, addToBacklog, removeFromBacklog, updateStatus, isInBacklog }}
    >
      {children}
    </BacklogContext.Provider>
  );
}

export function useBacklog() {
  const context = useContext(BacklogContext);
  if (!context) {
    throw new Error('useBacklog must be used within BacklogProvider');
  }
  return context;
}