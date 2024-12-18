import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ onLogout, isAuthenticated, role }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Define accessible links based on role
  const accessibleLinks = {
    admin: ['/', '/warehouse', '/tracking', '/suppliers', '/reports', '/deliveries'],
    kurier: ['/', '/tracking'],
    magazynier: ['/', '/warehouse', '/deliveries'],
    gość: ['/']
  };

  // Only show links the user has access to
  const roleLinks = accessibleLinks[role] || [];

  return (
    <header className="bg-blue-600 text-white shadow-lg relative z-10">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo with link to home */}
        <Link to="/" className="flex items-center">
          <img src={`${process.env.PUBLIC_URL}/logo_white.png`} alt="Logo" className="h-10 mr-2" />
          <span className="text-2xl font-bold hover:text-yellow-400 transition">LogiTrack</span>
        </Link>

        {/* Hamburger icon for mobile menu */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          {roleLinks.includes('/') && <Link to="/" className="hover:text-yellow-400 transition">Dashboard</Link>}
          {roleLinks.includes('/warehouse') && <Link to="/warehouse" className="hover:text-yellow-400 transition">Zarządzanie Magazynem</Link>}
          {roleLinks.includes('/tracking') && <Link to="/tracking" className="hover:text-yellow-400 transition">Śledzenie Dostaw</Link>}
          {roleLinks.includes('/suppliers') && <Link to="/suppliers" className="hover:text-yellow-400 transition">Zarządzanie Kurierami</Link>}
          {roleLinks.includes('/deliveries') && <Link to="/deliveries" className="hover:text-yellow-400 transition">Zarządzanie Dostawami</Link>}
          {roleLinks.includes('/reports') && <Link to="/reports" className="hover:text-yellow-400 transition">Raporty</Link>}
          <Link to="/faq" className="hover:text-yellow-400 transition">FAQ</Link>
          <Link to="/terms-and-conditions" className="hover:text-yellow-400 transition">Warunki Korzystania</Link>
        </nav>

        {/* Desktop profile links */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <button onClick={onLogout} className="bg-yellow-500 text-blue-900 px-4 py-2 rounded hover:bg-yellow-400 transition">
              Wyloguj
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-400 transition">Logowanie</Link>
              <Link to="/register" className="hover:text-yellow-400 transition">Rejestracja</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile navigation overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-blue-700 text-white rounded-b-lg shadow-lg z-20">
          <nav className="flex flex-col space-y-2 p-4 text-center">
            {roleLinks.includes('/') && <Link to="/" className="hover:bg-blue-600 hover:rounded-lg p-2 transition">Dashboard</Link>}
            {roleLinks.includes('/warehouse') && <Link to="/warehouse" className="hover:bg-blue-600 hover:rounded-lg p-2 transition">Zarządzanie Magazynem</Link>}
            {roleLinks.includes('/tracking') && <Link to="/tracking" className="hover:bg-blue-600 hover:rounded-lg p-2 transition">Śledzenie Dostaw</Link>}
            {roleLinks.includes('/suppliers') && <Link to="/suppliers" className="hover:bg-blue-600 hover:rounded-lg p-2 transition">Zarządzanie Kurierami</Link>}
            {roleLinks.includes('/deliveries') && <Link to="/deliveries" className="hover:bg-blue-600 hover:rounded-lg p-2 transition">Zarządzanie Dostawami</Link>}
            {roleLinks.includes('/reports') && <Link to="/reports" className="hover:bg-blue-600 hover:rounded-lg p-2 transition">Raporty</Link>}
            <Link to="/faq" className="hover:bg-blue-600 hover:rounded-lg p-2 transition">FAQ</Link>
            <Link to="/terms-and-conditions" className="hover:bg-blue-600 hover:rounded-lg p-2 transition">Warunki Korzystania</Link>
          </nav>
          <div className="flex flex-col space-y-2 p-4 text-center border-t border-blue-500">
            {isAuthenticated ? (
              <button onClick={onLogout} className="bg-yellow-500 text-blue-900 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition">
                Wyloguj
              </button>
            ) : (
              <>
                <Link to="/login" className="hover:bg-blue-600 hover:rounded-lg p-2 transition">Logowanie</Link>
                <Link to="/register" className="hover:bg-blue-600 hover:rounded-lg p-2 transition">Rejestracja</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;