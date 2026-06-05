import React from 'react';
import ReactDOM from 'react-dom/client';
import DoctorDashboard from './components/DoctorDashboard';
import './index.css';

ReactDOM.createRoot(document.getElementById('doctor-root')).render(
  <React.StrictMode>
    <DoctorDashboard />
  </React.StrictMode>
);
