// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppRouter from './AppRouter';   // ✅ import the router, not App

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />  
  </StrictMode>,
);
