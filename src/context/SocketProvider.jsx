import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client'; // Make sure to install socket.io-client

// Create a context for the socket connection
export const SocketContext = createContext();

const SOCKET_URL = import.meta.env.REACT_APP_S_URL||"http://localhost:4000"; // Your socket server URL

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL); // Establish socket connection
    setSocket(socketInstance);
    console.log("connected")
    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
