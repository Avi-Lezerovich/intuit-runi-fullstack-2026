import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import AppTheme from './theme/AppTheme.tsx'

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <AppTheme>
          <CssBaseline />
          <App />
        </AppTheme>
      </BrowserRouter>
    </StrictMode>,
  );
}
