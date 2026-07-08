import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.tsx';
import { loadPersistedColorMode } from '@/lib/theme-switcher';
import '@/styles/index.css';

// Restore the persisted light/dark choice before first paint so a reload keeps
// the user's mode (sets [data-theme]; no-op when nothing is persisted).
loadPersistedColorMode();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
