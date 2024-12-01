import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import axios from 'axios';
import { BASE_URL } from '../App';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 53.4285, // Centrum Szczecina
  lng: 14.5528,
};

const Suppliers = () => {
  const [couriers, setCouriers] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/active-couriers`);
        setCouriers(response.data);
      } catch (error) {
        console.error('Error fetching couriers:', error);
      }
    };

    fetchCouriers();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/orders`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleMarkerClick = async (courier) => {
    setSelectedCourier(courier);

    try {
      const response = await axios.get(`${BASE_URL}/api/couriers/${courier.courier_id}/orders`);
      setSelectedCourier((prev) => ({ ...prev, orders: response.data }));
    } catch (error) {
      console.error(`Error fetching orders for courier ${courier.courier_id}:`, error);
    }
  };

  const handleOrderMarkerClick = (order) => {
    setSelectedOrder(order);
  };

  const handleAssignOrder = async (orderId, courierId) => {
    if (!courierId) return;
  
    try {
      await axios.post(`${BASE_URL}/api/orders/assign`, {
        courier_id: courierId,
        order_id: orderId,
      });
  
      // Zaktualizuj listę zamówień
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, courier_id: courierId } : order
        )
      );
    } catch (error) {
      console.error('Error assigning order:', error);
    }
  };  

  const handleRemoveOrder = async (orderId) => {
    if (!selectedCourier) return;

    try {
      await axios.post(`${BASE_URL}/api/orders/remove`, {
        order_id: orderId,
      });

      setSelectedCourier((prev) => ({
        ...prev,
        orders: prev.orders.filter((order) => order.id !== orderId),
      }));

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, courier_id: null } : order
        )
      );
    } catch (error) {
      console.error('Error removing order:', error);
    }
  };

  if (!isLoaded) return <div>Ładowanie mapy...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-700">Zarządzanie Dostawcami</h2>

      {/* Mapa kurierów i dostaw */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-600">Mapa Kurierów i Dostaw</h3>
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={13} center={defaultCenter}>
          {/* Markery dla kurierów */}
          {couriers.map((courier) => (
            <Marker
              key={`courier-${courier.courier_id}`}
              position={{
                lat: parseFloat(courier.latitude),
                lng: parseFloat(courier.longitude),
              }}
              label={`${courier.courier_id}`}
              onClick={() => handleMarkerClick(courier)}
            />
          ))}

          {/* Markery dla dostaw */}
          {orders.map((order) => (
            <Marker
              key={`order-${order.id}`}
              position={{
                lat: parseFloat(order.latitude),
                lng: parseFloat(order.longitude),
              }}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              }}
              label={`${order.id}`}
              onClick={() => handleOrderMarkerClick(order)}
            />
          ))}
        </GoogleMap>
      </div>

      {/* Szczegóły wybranej dostawy */}
      {selectedOrder && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-600">Szczegóły Dostawy</h3>
          <table className="min-w-full bg-white border-collapse border border-gray-200">
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 border border-gray-200 font-semibold">ID</td>
                <td className="py-3 px-4 border border-gray-200">{selectedOrder.id}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 border border-gray-200 font-semibold">Adres</td>
                <td className="py-3 px-4 border border-gray-200">{selectedOrder.address}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 border border-gray-200 font-semibold">Start Dostawy</td>
                <td className="py-3 px-4 border border-gray-200">{selectedOrder.start_time || 'Nie rozpoczęta'}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 border border-gray-200 font-semibold">Szacowany Czas</td>
                <td className="py-3 px-4 border border-gray-200">{selectedOrder.estimated_time || 'N/A'}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 border border-gray-200 font-semibold">Status</td>
                <td className="py-3 px-4 border border-gray-200">
                  {selectedOrder.status === 'delivered' ? 'Dostarczone' : 'W trakcie'}
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 border border-gray-200 font-semibold">Kurier</td>
                <td className="py-3 px-4 border border-gray-200">
                  {selectedOrder.courier_id ? `Kurier ${selectedOrder.courier_id}` : 'Nie przypisane'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Szczegóły wybranego kuriera */}
      {selectedCourier && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-600">Kurier: {selectedCourier.courier_id}</h3>
          <table className="min-w-full bg-white border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border border-gray-200">ID</th>
                <th className="py-3 px-4 border border-gray-200">Adres</th>
                <th className="py-3 px-4 border border-gray-200">Start Dostawy</th>
                <th className="py-3 px-4 border border-gray-200">Szacowany Czas</th>
                <th className="py-3 px-4 border border-gray-200">Status</th>
                <th className="py-3 px-4 border border-gray-200">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {selectedCourier.orders && selectedCourier.orders.length > 0 ? (
                selectedCourier.orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border border-gray-200">{order.id}</td>
                    <td className="py-3 px-4 border border-gray-200">{order.address}</td>
                    <td className="py-3 px-4 border border-gray-200">{order.start_time || 'Nie rozpoczęta'}</td>
                    <td className="py-3 px-4 border border-gray-200">{order.estimated_time || 'N/A'}</td>
                    <td className="py-3 px-4 border border-gray-200">
                      {order.status === 'delivered' ? 'Dostarczone' : 'W trakcie'}
                    </td>
                    <td className="py-3 px-4 border border-gray-200">
                      <button
                        onClick={() => handleRemoveOrder(order.id)}
                        className="text-red-500 hover:underline"
                      >
                        Usuń
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-3 px-4 border border-gray-200" colSpan="6">
                    Brak aktywnych zamówień.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Lista wszystkich zamówień */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-600">Wszystkie Dostawy</h3>
        <table className="min-w-full bg-white border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border border-gray-200">ID</th>
              <th className="py-3 px-4 border border-gray-200">Adres</th>
              <th className="py-3 px-4 border border-gray-200">Start Dostawy</th>
              <th className="py-3 px-4 border border-gray-200">Szacowany Czas</th>
              <th className="py-3 px-4 border border-gray-200">Status</th>
              <th className="py-3 px-4 border border-gray-200">Kurier</th>
              <th className="py-3 px-4 border border-gray-200">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border border-gray-200">{order.id}</td>
                <td className="py-3 px-4 border border-gray-200">{order.address}</td>
                <td className="py-3 px-4 border border-gray-200">{order.start_time || 'Nie rozpoczęta'}</td>
                <td className="py-3 px-4 border border-gray-200">{order.estimated_time || 'N/A'}</td>
                <td className="py-3 px-4 border border-gray-200">
                  {order.status === 'delivered' ? 'Dostarczone' : 'W trakcie'}
                </td>
                <td className="py-3 px-4 border border-gray-200">{order.courier_id || 'Nie przypisane'}</td>
                <td className="py-3 px-4 border border-gray-200">
                  {order.courier_id ? (
                    <button
                      onClick={() => handleRemoveOrder(order.id)}
                      className="text-red-500 hover:underline"
                    >
                      Usuń z kuriera
                    </button>
                  ) : (
                    <div>
                      <select
                        onChange={(e) => handleAssignOrder(order.id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="">Wybierz kuriera</option>
                        {couriers.map((courier) => (
                          <option key={courier.courier_id} value={courier.courier_id}>
                            Kurier {courier.courier_id}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Suppliers;