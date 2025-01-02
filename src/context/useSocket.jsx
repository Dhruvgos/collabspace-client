import { useContext } from 'react';
import { SocketContext } from './SocketProvider'; // Assuming you have a SocketProvider

// Custom hook to access the socket connection
export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return context;
};
