import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ onLogout, isAuthenticated }) => {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo z linkiem do strony głównej */}
        <Link to="/" className="flex items-center">
          <img src={`${process.env.PUBLIC_URL}/logo_white.png`} alt="Logo" className="h-10 mr-2" />
          <span className="text-2xl font-bold hover:text-yellow-400 transition">LogiTrack</span>
        </Link>

        {/* Nawigacja */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-yellow-400 transition">Dashboard</Link>
          <Link to="/warehouse" className="hover:text-yellow-400 transition">Zarządzanie Magazynem</Link>
          <Link to="/tracking" className="hover:text-yellow-400 transition">Śledzenie Dostaw</Link>
          <Link to="/suppliers" className="hover:text-yellow-400 transition">Zarządzanie Dostawcami</Link>
          <Link to="/reports" className="hover:text-yellow-400 transition">Raporty</Link>
        </nav>

        {/* Profil użytkownika / Logowanie / Wylogowanie */}
        <div className="flex items-center space-x-4">
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
    </header>
  );
};

export default Header;