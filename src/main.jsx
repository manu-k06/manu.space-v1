import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

// Global Styles
import './styles/base.css';
import './styles/layout.css';
import './styles/hero.css';

/**
 * Application Entry Point.
 * 
 * Uses ReactDOM.createRoot (React 18+) to render the React tree
 * inside the #root DOM element from index.html.
 * Wraps the application in BrowserRouter for client-side routing.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
