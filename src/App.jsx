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
import Suppliers from './components/Suppliers'; // Import nowego komponentu

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
      <Header onLogout={handleLogout} isAuthenticated={isAuthenticated} />

      <Routes>
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        
        <Route path="/warehouse" element={isAuthenticated ? <Warehouse /> : <Navigate to="/login" />} />
        <Route path="/tracking" element={isAuthenticated ? <Tracking /> : <Navigate to="/login" />} />
        <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/login" />} />
        <Route path="/suppliers" element={isAuthenticated ? <Suppliers /> : <Navigate to="/login" />} /> {/* Nowa ścieżka */}
      </Routes>
    </Router>
  );
}

export default App;