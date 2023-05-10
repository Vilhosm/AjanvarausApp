// Import necessary libraries and components
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

import { AuthProvider } from "react-auth-kit";
import { BrowserRouter } from 'react-router-dom';

axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider
      authType={'cookie'}a
      authName={'_auth'}
      cookieDomain={window.location.hostname}
      cookieSecure={false} // true if using https
    >
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

