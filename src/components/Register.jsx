import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../App.jsx';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setMessage('Wszystkie pola są wymagane');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Błąd serwera');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 to-blue-100 px-4">
      <div className="bg-white/80 shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Rejestracja</h1>
          <p className="text-gray-500">Utwórz swoje konto</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Nazwa użytkownika"
            onChange={handleChange}
            className="w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Hasło"
            onChange={handleChange}
            className="w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
          />
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="w-1/2 bg-yellow-500 text-blue-900 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              ZALOGUJ SIĘ
            </Link>
            <button
              type="submit"
              className="w-1/2 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              ZAREJESTRUJ SIĘ
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default Register;