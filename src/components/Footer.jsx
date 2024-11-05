import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 space-y-4 md:space-y-0">
        
        {/* Logo and Description */}
        <div className="flex items-center space-x-3">
          <img src={`${process.env.PUBLIC_URL}/logo_white.png`} alt="Logo" className="h-8" />
          <span className="text-lg font-bold">LogiTrack</span>
        </div>
        
        {/* Links */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 text-center">
          <Link to="/" className="hover:text-yellow-400 transition">Dashboard</Link>
          <Link to="/warehouse" className="hover:text-yellow-400 transition">Zarządzanie Magazynem</Link>
          <Link to="/tracking" className="hover:text-yellow-400 transition">Śledzenie Dostaw</Link>
          <Link to="/suppliers" className="hover:text-yellow-400 transition">Zarządzanie Dostawcami</Link>
          <Link to="/reports" className="hover:text-yellow-400 transition">Raporty</Link>
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-4 text-center">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>

      {/* Copyright section */}
      <div className="text-center mt-8">
        <p className="text-gray-300">Copyright © {new Date().getFullYear()}. All rights reserved. LogiTrack.</p>
      </div>
    </footer>
  );
};

export default Footer;