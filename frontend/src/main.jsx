import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ToastProvider } from './components/ui/ToastProvider.jsx';
import './index.css';

// Opt in to React Router v7 future flags early to silence upgrade warnings.
const routerFutureFlags = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={routerFutureFlags}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
