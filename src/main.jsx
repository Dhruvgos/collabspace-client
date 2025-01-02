import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './context/AppContextProvider.jsx'
import { SocketProvider } from './context/SocketProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppContextProvider>
      <SocketProvider>
        <App/>
      </SocketProvider>
    </AppContextProvider>
  </StrictMode>,
)
