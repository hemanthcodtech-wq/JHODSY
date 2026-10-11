import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || '234072432956-ja2vqpal1n7u6c01am5hmbs26eptbkl5.apps.googleusercontent.com'}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
