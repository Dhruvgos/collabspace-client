import { useContext } from 'react';
import { AppContext } from './AppContextProvider.jsx'; // Assuming you have a context provider

// Custom hook to access the app context
export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }

  return context;
};
