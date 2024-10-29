import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Błąd serwera');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Rejestracja</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Nazwa użytkownika"
          onChange={handleChange}
          className="border p-2 mb-4 w-full"
        />
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Zarejestruj</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Register;