import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      setMessage(response.data.message);
      
      // Przechowywanie tokenu w localStorage
      localStorage.setItem('token', response.data.token);
      onLogin(); // Informacja do aplikacji, że użytkownik jest zalogowany
    } catch (error) {
      setMessage(error.response?.data?.message || 'Błąd serwera');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Logowanie</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border p-2 mb-4 w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Hasło"
          onChange={handleChange}
          className="border p-2 mb-4 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Zaloguj</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Login;