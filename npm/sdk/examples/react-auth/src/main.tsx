import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { subscribeToAuth } from '@trufflehq/sdk';

const Main = () => {
  // keep track of auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnon, setIsAnon] = useState(false);

  // subscribe to auth changes
  useEffect(() => {
    subscribeToAuth(
      (app) => {
        const mtClient = app.mtClient;
        setIsAuthenticated(mtClient.isAuthenticated);
        setIsAnon(mtClient.isAnon);
      },
      { url: 'https://mothertree.truffle.vip/graphql' }
    );
  }, []);

  return (
    <>
      {/* determine if the user is authenticated */}
      {isAuthenticated ? (
        <>
          {/* determine if the user is anonymous */}
          {isAnon ? <h3>Anonymous</h3> : <h3>Logged in</h3>}
          <App />
        </>
      ) : (
        <h1>Not logged in</h1>
      )}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
