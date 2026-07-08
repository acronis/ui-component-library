import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.tsx';
import {
  loadPersistedBrand,
  loadPersistedColorMode,
} from '@/lib/theme-switcher';
import '@/styles/index.css';

// Restore the persisted brand + light/dark choice before first paint so a
// reload keeps the user's selection (brand sets [data-brand], mode sets
// [data-theme]; both no-op when nothing is persisted).
loadPersistedBrand();
loadPersistedColorMode();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
