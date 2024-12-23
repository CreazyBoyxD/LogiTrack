import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 px-6">
        
        {/* Logo and Description */}
        <div className="text-center md:text-left">
          <div className="flex items-center space-x-3 mb-3">
            <img src={`${process.env.PUBLIC_URL}/logo_white.png`} alt="Logo" className="h-10" />
            <span className="text-lg font-bold">LogiTrack</span>
          </div>
          <p className="text-gray-300 text-sm">
            Najlepsze rozwiązania dla zarządzania dostawami, magazynami i śledzeniem w czasie rzeczywistym.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
          <div>
            <h5 className="font-bold mb-2 text-gray-100">Navigation</h5>
            <ul className="space-y-1">
              <li><Link to="/" className="text-gray-300 hover:text-yellow-400 transition">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-2 text-gray-100">Support</h5>
            <ul className="space-y-1">
              <li><Link to="/faq" className="text-gray-300 hover:text-yellow-400 transition">FAQ</Link></li>
              <li><Link to="/terms-and-conditions" className="text-gray-300 hover:text-yellow-400 transition">T&C</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-2 text-gray-100">Contact</h5>
            <ul className="space-y-1">
              <li><a href="mailto:support@logitrack.site" className="text-gray-300 hover:text-yellow-400 transition">support@logitrack.site</a></li>
              <li><a href="tel:+48530469524" className="text-gray-300 hover:text-yellow-400 transition">+48 530 469 524</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center mt-8">
        <p className="text-gray-300">Copyright © {new Date().getFullYear()}. All rights reserved. LogiTrack.</p>
      </div>
    </footer>
  );
};

export default Footer;