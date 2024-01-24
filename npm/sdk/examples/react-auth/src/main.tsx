import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { subscribeToAuth } from '@trufflehq/sdk';

subscribeToAuth((app) => {
  const mtClient = app.mtClient;
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      {mtClient.isAuthenticated ? (
        <>
          {mtClient.isAnon ? <h3>Anonymous</h3> : <h3>Logged in</h3>}
          <App />
        </>
      ) : (
        <h1>Not logged in</h1>
      )}
    </React.StrictMode>
  );
});
