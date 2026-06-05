import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import OverviewPanel from './components/OverviewPanel';
import ManageDoctors from './components/ManageDoctors';
import ManageRequests from './components/ManageRequests';
import BookingsLog from './components/BookingsLog';
import PatientReports from './components/PatientReports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<OverviewPanel />} />
          <Route path="doctors" element={<ManageDoctors />} />
          <Route path="requests" element={<ManageRequests />} />
          <Route path="bookings" element={<BookingsLog />} />
          <Route path="reports" element={<PatientReports />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
