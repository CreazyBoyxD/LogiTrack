import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import axios from 'axios';
import { format } from 'date-fns';
import { BASE_URL } from '../App';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
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
    version: "3.58",
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
    try {
      await axios.post(`${BASE_URL}/api/orders/remove`, { order_id: orderId });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, courier_id: null } : order
        )
      );

      if (selectedCourier) {
        setSelectedCourier((prev) => ({
          ...prev,
          orders: prev.orders.filter((order) => order.id !== orderId),
        }));
      }
    } catch (error) {
      console.error('Error removing order:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nie zakończona';
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm:ss');
  };

  const autoAssignOrder = async (orderId, destination) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/orders/auto-assign`, { orderId, destination });
      
      
      // Zaktualizuj stan zamówień

      // Zaktualizuj stan zamówień
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, courier_id: response.data.courier.courier_id } : order
        )
      );
    } catch (error) {
      console.error('Error auto-assigning order:', error);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) {
      return 'N/A';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours} godz ${minutes} min`;
    } else if (minutes > 0) {
      return `${minutes} min`;
    } else {
      return `${secs} sek`;
    }
  };

  if (!isLoaded) return <div className="text-center text-gray-600">Ładowanie mapy...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-8">
      <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">Zarządzanie Kurierami</h2>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Mapa Kurierów i Dostaw</h3>
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={13} center={defaultCenter}>
          {/* Markery dla kurierów */}
          {couriers.map((courier) => (
            <Marker
              key={`courier-${courier.courier_id}`}
              position={{
                lat: parseFloat(courier.latitude),
                lng: parseFloat(courier.longitude),
              }}
              label={{
                text: `${courier.courier_id}`,
                color: 'black',
                fontSize: '12px',
              }}
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
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Szczegóły Dostawy</h3>
          <table className="min-w-full bg-white border-collapse border border-gray-200">
            <tbody>
              <tr>
                <td className="py-3 px-4 font-semibold border border-gray-200">ID</td>
                <td className="py-3 px-4 border border-gray-200">{selectedOrder.id}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold border border-gray-200">Adres</td>
                <td className="py-3 px-4 border border-gray-200">{selectedOrder.address}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold border border-gray-200">Czas Dostawy</td>
                <td className="py-3 px-4 border border-gray-200">{formatDate(selectedOrder.delivery_time)}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold border border-gray-200">Szacowany Czas</td>
                <td className="py-3 px-4 border border-gray-200">{formatDuration(selectedOrder.estimated_time)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Szczegóły wybranego kuriera */}
      {selectedCourier && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Kurier: {selectedCourier.courier_id}</h3>
          <table className="min-w-full bg-white border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border border-gray-200">ID</th>
                <th className="py-3 px-4 border border-gray-200">Adres</th>
                <th className="py-3 px-4 border border-gray-200">Czas Dostawy</th>
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
                    <td className="py-3 px-4 border border-gray-200">{formatDate(order.delivery_time)}</td>
                    <td className="py-3 px-4 border border-gray-200">{formatDuration(order.estimated_time)}</td>
                    <td className="py-3 px-4 border border-gray-200">{order.status === 'delivered' ? 'Dostarczone' : 'W trakcie'}</td>
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

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Wszystkie Dostawy</h3>
        <table className="min-w-full bg-white border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border border-gray-200">ID</th>
              <th className="py-3 px-4 border border-gray-200">Adres</th>
              <th className="py-3 px-4 border border-gray-200">Czas Dostawy</th>
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
                <td className="py-3 px-4 border border-gray-200">{formatDate(order.delivery_time)}</td>
                <td className="py-3 px-4 border border-gray-200">{formatDuration(order.estimated_time)}</td>
                <td className="py-3 px-4 border border-gray-200">{order.status === 'delivered' ? 'Dostarczone' : 'W trakcie'}</td>
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
                    <div className="flex items-center space-x-2">
                      {/* Dropdown list do ręcznego wyboru kuriera */}
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

                      {/* Przycisk do automatycznego przypisania */}
                      <button
                        onClick={() => autoAssignOrder(order.id, { lat: order.latitude, lng: order.longitude })}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Wybierz automatycznie
                      </button>
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