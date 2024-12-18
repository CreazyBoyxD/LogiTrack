import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../App.jsx';

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [currentDeliveryId, setCurrentDeliveryId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState({ product_id: '', quantity: '' });
  const [newDelivery, setNewDelivery] = useState({
    address: '',
    products: []
  });

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/deliveries-with-products`);
        setDeliveries(response.data);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/warehouse/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchDeliveries();
    fetchProducts();
  }, []);

  const openProductModal = (deliveryId) => {
    setCurrentDeliveryId(deliveryId);
    setSelectedProduct({ product_id: '', quantity: '' });
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setCurrentDeliveryId(null);
  };

  const handleAddProductToDelivery = async () => {
    if (!selectedProduct.product_id || !selectedProduct.quantity) {
      alert('Wybierz produkt i podaj ilość.');
      return;
    }

    try {
      // Sprawdź, czy produkt już istnieje w dostawie i aktualizuj ilość
      await axios.post(`${BASE_URL}/api/deliveries/${currentDeliveryId}/products`, {
        product_id: selectedProduct.product_id,
        quantity: selectedProduct.quantity,
      });

      // Odśwież dane dostaw i produktów
      const deliveriesResponse = await axios.get(`${BASE_URL}/api/deliveries-with-products`);
      setDeliveries(deliveriesResponse.data);
      const productsResponse = await axios.get(`${BASE_URL}/api/warehouse/products`);
      setProducts(productsResponse.data);

      alert('Produkt został dodany do dostawy lub zaktualizowany.');
      closeProductModal();
    } catch (error) {
      console.error('Error adding product to delivery:', error);
      alert('Wystąpił błąd podczas dodawania produktu do dostawy.');
    }
  };

  const handleRemoveProductFromDelivery = async (deliveryId, productId) => {
    try {
      // Usuń produkt z dostawy w całości
      await axios.delete(`${BASE_URL}/api/deliveries/${deliveryId}/products/${productId}`);

      // Odśwież dane dostaw i produktów
      const deliveriesResponse = await axios.get(`${BASE_URL}/api/deliveries-with-products`);
      setDeliveries(deliveriesResponse.data);
      const productsResponse = await axios.get(`${BASE_URL}/api/warehouse/products`);
      setProducts(productsResponse.data);

      alert('Produkt został całkowicie usunięty z dostawy.');
    } catch (error) {
      console.error('Error removing product from delivery:', error);
      alert('Wystąpił błąd podczas usuwania produktu z dostawy.');
    }
  };

  const handleAddProduct = () => {
    if (!selectedProduct.product_id || !selectedProduct.quantity) return;
    setNewDelivery((prev) => ({
      ...prev,
      products: [...prev.products, selectedProduct]
    }));
    setSelectedProduct({ product_id: '', quantity: '' });
  };

  const handleCreateDelivery = async () => {
    try {
      await axios.post(`${BASE_URL}/api/deliveries/add`, newDelivery);
      alert('Dostawa została dodana.');
      setNewDelivery({ address: '', products: [] });
      const response = await axios.get(`${BASE_URL}/api/deliveries-with-products`);
      setDeliveries(response.data);
    } catch (error) {
      console.error('Error creating delivery:', error);
      alert('Wystąpił błąd podczas dodawania dostawy.');
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-700">Zarządzanie Dostawami</h2>

      {/* Dodawanie nowej dostawy */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-600">Dodaj Nową Dostawę</h3>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Adres dostawy"
            value={newDelivery.address}
            onChange={(e) => setNewDelivery({ ...newDelivery, address: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <select
            value={selectedProduct.product_id}
            onChange={(e) => setSelectedProduct({ ...selectedProduct, product_id: e.target.value })}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Wybierz produkt</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Ilość"
            value={selectedProduct.quantity}
            onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: e.target.value })}
            className="p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddProduct}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Dodaj Produkt
          </button>
        </div>
        <ul>
          {newDelivery.products.map((product, index) => (
            <li key={index}>
              Produkt ID: {product.product_id}, Ilość: {product.quantity}
            </li>
          ))}
        </ul>
        <button
          onClick={handleCreateDelivery}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Dodaj Dostawę
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-600">Lista Dostaw</h3>
        <table className="min-w-full bg-white border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border">ID Dostawy</th>
              <th className="py-3 px-4 border">Adres</th>
              <th className="py-3 px-4 border">Produkty</th>
              <th className="py-3 px-4 border">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery.delivery_id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border">{delivery.delivery_id}</td>
                <td className="py-3 px-4 border">{delivery.address}</td>
                <td className="py-3 px-4 border">
                  {delivery.products.length > 0 ? (
                    <ul>
                      {delivery.products.map((product) => (
                        <li key={product.product_id}>
                          {product.product_name} - {product.quantity} szt.
                          <button
                            onClick={() => handleRemoveProductFromDelivery(
                              delivery.delivery_id,
                              product.product_id
                            )}
                            className="ml-4 text-red-500 hover:underline"
                          >
                            Usuń
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'Brak produktów'
                  )}
                </td>
                <td className="py-3 px-4 border">
                  <button
                    onClick={() => openProductModal(delivery.delivery_id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Dodaj Produkt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal do dodawania produktu */}
      {showProductModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Dodaj Produkt</h3>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700">Produkt</label>
              <select
                value={selectedProduct.product_id}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, product_id: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Wybierz produkt</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700">Ilość</label>
              <input
                type="number"
                value={selectedProduct.quantity}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: e.target.value })}
                placeholder="Podaj ilość"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeProductModal}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Anuluj
              </button>
              <button
                onClick={handleAddProductToDelivery}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Dodaj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryManagement;
