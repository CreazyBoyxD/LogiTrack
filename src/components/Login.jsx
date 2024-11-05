import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../App.jsx';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [email, setEmail] = useState('');

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
      const { token, role } = response.data;
      setMessage(response.data.message);

      if (rememberMe) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }

      onLogin(role);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Błąd serwera';
      setMessage(errorMessage);

      if (errorMessage === 'Email not verified. A new code has been sent.') {
        setEmail(formData.username);
        setShowConfirmationModal(true);
      }
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
  
    if (!confirmationCode) {
      setMessage('Wprowadź kod potwierdzenia');
      return;
    }
  
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/confirm`, {
        username: formData.username,  // Pass username instead of email
        confirmationCode
      });
      setMessage(response.data.message);
  
      setShowConfirmationModal(false);
      window.location.href = '/login';
    } catch (error) {
      setMessage(error.response?.data?.message || 'Błąd serwera');
    }
  };  

  const resendConfirmationCode = async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/resend-confirmation`, { email });
      setMessage('Nowy kod potwierdzenia został wysłany.');
    } catch (error) {
      setMessage('Błąd podczas wysyłania nowego kodu.');
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
            autoComplete="username"
            onChange={handleChange}
            className="w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Hasło"
            autoComplete="current-password"
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
            <button
              type="submit"
              className="w-1/2 bg-yellow-500 text-blue-900 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              ZALOGUJ
            </button>
            <Link
              to="/register"
              className="w-1/2 bg-blue-600 text-white py-2 rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors"
            >
              ZAREJESTRUJ SIĘ
            </Link>
          </div>
        </form>

        {showConfirmationModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Potwierdzenie Email</h2>
              <p className="text-gray-500 text-center mb-6">Wprowadź kod wysłany na {email}</p>
              <form onSubmit={handleConfirm} className="space-y-4">
                <input
                  type="text"
                  name="confirmationCode"
                  placeholder="Kod potwierdzenia"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className="w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Potwierdź
                </button>
                <button
                  type="button"
                  onClick={resendConfirmationCode}
                  className="w-full mt-2 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Wyślij kod ponownie
                </button>
              </form>
              {message && <p className="mt-4 text-center text-red-500">{message}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;