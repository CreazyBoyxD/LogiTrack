import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../App';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingData, setEditingData] = useState({ username: '', email: '', role: '' });
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const roles = ['admin', 'kurier', 'magazynier', 'gość'];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/users`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleEditUser = (user) => {
    setEditingUserId(user.id);
    setEditingData({ username: user.username, email: user.email, role: user.role });
  };

  const handleSaveEdit = async (userId) => {
    try {
      await axios.put(`${BASE_URL}/api/users/${userId}`, editingData);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, ...editingData } : user
        )
      );
      setEditingUserId(null);
    } catch (error) {
      console.error('Error saving user changes:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (deleteConfirmation !== 'USUŃ') {
      alert('Aby usunąć konto, wpisz dokładnie "USUŃ".');
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/api/users/${deletingUserId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deletingUserId));
      setDeletingUserId(null);
      setDeleteConfirmation('');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Zarządzanie Użytkownikami</h2>

        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border text-left">ID</th>
              <th className="py-3 px-4 border text-left">Nazwa użytkownika</th>
              <th className="py-3 px-4 border text-left">Email</th>
              <th className="py-3 px-4 border text-left">Rola</th>
              <th className="py-3 px-4 border text-center">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="py-3 px-4 border">{user.id}</td>
                <td className="py-3 px-4 border">
                  {editingUserId === user.id ? (
                    <input
                      type="text"
                      value={editingData.username}
                      onChange={(e) =>
                        setEditingData({ ...editingData, username: e.target.value })
                      }
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td className="py-3 px-4 border">
                  {editingUserId === user.id ? (
                    <input
                      type="email"
                      value={editingData.email}
                      onChange={(e) =>
                        setEditingData({ ...editingData, email: e.target.value })
                      }
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="py-3 px-4 border">
                  {editingUserId === user.id ? (
                    <select
                      value={editingData.role}
                      onChange={(e) =>
                        setEditingData({ ...editingData, role: e.target.value })
                      }
                      className="border px-2 py-1 rounded w-full"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="py-3 px-4 border text-center">
                  {editingUserId === user.id ? (
                    <button
                      onClick={() => handleSaveEdit(user.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Zapisz
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditUser(user)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Edytuj
                    </button>
                  )}
                  <button
                    onClick={() => setDeletingUserId(user.id)}
                    className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deletingUserId && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4 text-center text-red-600">
              Potwierdź usunięcie
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Aby usunąć konto, wpisz <strong>"USUŃ"</strong> poniżej.
            </p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-4"
              placeholder="Wpisz USUŃ"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setDeletingUserId(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Anuluj
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;