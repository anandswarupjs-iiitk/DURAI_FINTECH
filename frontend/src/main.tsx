// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';

import App from './Landing';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';

import Dashboard from './pages/Dashboard';
import FraudMonitor from './pages/FraudMonitor';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>

    <BrowserRouter>

      <Routes>
        <Route path="/transactions" element={<Transactions />} />

        <Route path="/settings" element={<Settings />} />
        
        <Route path="/analytics" element={<Analytics />} />

        <Route path="/" element={<App />} />

        <Route path="/signup" element={<SignupPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/fraud-monitor"
          element={<FraudMonitor />}
        />

      </Routes>

    </BrowserRouter>

  </React.StrictMode>
);