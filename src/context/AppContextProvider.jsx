import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [drawingData, setDrawingData] = useState(null); // Store drawing data

  return (
    <AppContext.Provider value={{ drawingData, setDrawingData }}>
      {children}
    </AppContext.Provider>
  );
};
