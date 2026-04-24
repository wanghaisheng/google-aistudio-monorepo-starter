import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from '@web/App';
import './index.css';

// Global error interceptor for early diagnostics
window.addEventListener('error', (event) => {
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') {
    root.innerHTML = `
      <div style="padding: 20px; color: #ef4444; font-family: sans-serif; border: 2px solid #ef4444; border-radius: 8px; margin: 20px; background: #fee2e2;">
        <h1 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem;">Critical Boot Error</h1>
        <p style="font-size: 0.875rem; margin-bottom: 0.5rem;">The application failed to start before React could mount.</p>
        <pre style="background: rgba(0,0,0,0.05); padding: 10px; border-radius: 4px; overflow: auto; font-size: 0.75rem;">${event.message}\nat ${event.filename}:${event.lineno}:${event.colno}</pre>
      </div>
    `;
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
