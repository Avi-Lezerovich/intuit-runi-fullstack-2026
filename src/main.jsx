import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AppTheme from './theme/AppTheme.tsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppTheme>
        <CssBaseline />
        <App />
      </AppTheme>
    </BrowserRouter>
  </StrictMode>,
)
