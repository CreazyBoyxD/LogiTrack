import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';
import Suppliers from './components/Suppliers';
import Warehouse from './components/Warehouse';
import Tracking from './components/Tracking';
import DeliveryManagement from './components/DeliveryManagement';
import Reports from './components/Reports';
import NotAuthorized from './components/NotAuthorized';
import FAQ from './components/FAQ';
import TermsAndConditions from './components/TermsAndConditions';

// Link to VPS
export const BASE_URL = 'https://vps.logitrack.site:40761';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'gość');

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('role', role); // Save the role to localStorage
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole('gość');
  };

  // Helper function to check if a user has the necessary role for a page
  const checkRoleAccess = (allowedRoles) => allowedRoles.includes(userRole);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header onLogout={handleLogout} isAuthenticated={isAuthenticated} role={userRole} />

        {/* Main content */}
        <main className="flex-grow">
          <Routes>
            {/* Default dashboard access for all roles */}
            <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />

            {/* Registration and login routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />

            {/* Role-based routes */}
            <Route
              path="/warehouse"
              element={
                isAuthenticated && checkRoleAccess(['admin', 'magazynier'])
                  ? <Warehouse />
                  : <Navigate to={isAuthenticated ? '/not-authorized' : '/login'} />
              }
            />
            <Route
              path="/tracking"
              element={
                isAuthenticated && checkRoleAccess(['admin', 'kurier'])
                  ? <Tracking />
                  : <Navigate to={isAuthenticated ? '/not-authorized' : '/login'} />
              }
            />
            <Route
              path="/reports"
              element={
                isAuthenticated && checkRoleAccess(['admin'])
                  ? <Reports />
                  : <Navigate to={isAuthenticated ? '/not-authorized' : '/login'} />
              }
            />
            <Route
              path="/suppliers"
              element={
                isAuthenticated && checkRoleAccess(['admin'])
                  ? <Suppliers />
                  : <Navigate to={isAuthenticated ? '/not-authorized' : '/login'} />
              }
            />
            <Route
              path="/deliveries"
              element={
                isAuthenticated && checkRoleAccess(['admin', 'magazynier'])
                  ? <DeliveryManagement />
                  : <Navigate to={isAuthenticated ? '/not-authorized' : '/login'} />
              }
            />
            
            {/* Unauthorized page for restricted access */}
            <Route path="/not-authorized" element={<NotAuthorized />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;