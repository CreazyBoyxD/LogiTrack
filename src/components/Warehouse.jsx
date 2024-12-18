import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../App.jsx';

const Warehouse = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', quantity: '', location: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/warehouse/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/warehouse/products`, newProduct);
      setProducts([...products, { ...newProduct, id: response.data.productId }]);
      setNewProduct({ name: '', quantity: '', location: '' });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/warehouse/products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateQuantity = async (id, change) => {
    try {
      const product = products.find((product) => product.id === id);
      if (!product) return;
  
      const updatedQuantity = product.quantity + change;
      if (updatedQuantity < 0) return alert('Ilość nie może być ujemna.');
  
      await axios.put(`${BASE_URL}/api/warehouse/products/${id}`, { quantity: updatedQuantity });
  
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === id ? { ...p, quantity: updatedQuantity } : p
        )
      );
    } catch (error) {
      console.error('Error updating product quantity:', error);
      alert('Wystąpił błąd podczas aktualizacji ilości produktu.');
    }
  };  

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Zarządzanie Magazynem</h2>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Dodaj Produkt</h3>
        <input
          type="text"
          placeholder="Nazwa produktu"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border px-4 py-2 mr-2"
        />
        <input
          type="number"
          placeholder="Ilość"
          value={newProduct.quantity}
          onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
          className="border px-4 py-2 mr-2"
        />
        <input
          type="text"
          placeholder="Lokalizacja"
          value={newProduct.location}
          onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
          className="border px-4 py-2 mr-2"
        />
        <button onClick={handleAddProduct} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Dodaj Produkt
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Lista Produktów</h3>
        <table className="min-w-full bg-white border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="py-3 px-4 border">ID</th>
              <th className="py-3 px-4 border">Nazwa</th>
              <th className="py-3 px-4 border">Ilość</th>
              <th className="py-3 px-4 border">Lokalizacja</th>
              <th className="py-3 px-4 border">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-3 px-4 border">{product.id}</td>
                <td className="py-3 px-4 border">{product.name}</td>
                <td className="py-3 px-4 border flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQuantity(product.id, -1)}
                    className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                  >
                    -
                  </button>
                  <span>{product.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(product.id, 1)}
                    className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                  >
                    +
                  </button>
                </td>
                <td className="py-3 px-4 border">{product.location}</td>
                <td className="py-3 px-4 border">
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-500 hover:underline"
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Warehouse;