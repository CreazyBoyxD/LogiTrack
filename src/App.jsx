import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Header';
import Warehouse from './components/Warehouse';
import Tracking from './components/Tracking';
import Reports from './components/Reports';
import Suppliers from './components/Suppliers';
import Footer from './components/Footer';

// Link do VPS
export const BASE_URL = 'https://vps.logitrack.site:40761';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        
        {/* Heaher */}
        <Header onLogout={handleLogout} isAuthenticated={isAuthenticated} />
        
        {/* Main content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
            <Route path="/warehouse" element={isAuthenticated ? <Warehouse /> : <Navigate to="/login" />} />
            <Route path="/tracking" element={isAuthenticated ? <Tracking /> : <Navigate to="/login" />} />
            <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/login" />} />
            <Route path="/suppliers" element={isAuthenticated ? <Suppliers /> : <Navigate to="/login" />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;