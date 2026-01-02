//main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  // Runs components twice in dev mode to detect side effects.
  // Disabled automatically in production.
  <StrictMode>
    <App />
  </StrictMode>,
)
