import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../App.jsx';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setMessage('Wszystkie pola są wymagane');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, formData);
      setMessage(response.data.message);

      // Zapis tokenu w zależności od wyboru "Zapamiętaj mnie"
      if (rememberMe) {
        localStorage.setItem('token', response.data.token);
      } else {
        sessionStorage.setItem('token', response.data.token);
      }

      onLogin();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Błąd serwera');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 to-blue-100 px-4">
      <div className="bg-white/80 shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Witaj!</h1>
          <p className="text-gray-500">Zaloguj się na swoje konto</p>
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
            type="password"
            name="password"
            placeholder="Hasło"
            onChange={handleChange}
            className="w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
          />
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={handleRememberMeChange} 
                className="form-checkbox text-blue-600" 
              />
              <span>Zapamiętaj mnie</span>
            </label>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/register"
              className="w-1/2 bg-blue-600 text-white py-2 rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors"
            >
              ZAREJESTRUJ SIĘ
            </Link>
            <button
              type="submit"
              className="w-1/2 bg-yellow-500 text-blue-900 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              ZALOGUJ
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default Login;