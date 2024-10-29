import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const Suppliers = () => {
  const [couriers, setCouriers] = useState([]); // Lista kurierów
  const [selectedCourier, setSelectedCourier] = useState(null); // Wybrany kurier

  useEffect(() => {
    // Przykładowe dane kurierów (możesz je pobrać z API)
    const exampleCouriers = [
      { id: 1, name: 'Kurier A', location: { lat: 53.4300, lng: 14.5500 }, orders: [] },
      { id: 2, name: 'Kurier B', location: { lat: 53.4290, lng: 14.5400 }, orders: [] },
      { id: 3, name: 'Kurier C', location: { lat: 53.4280, lng: 14.5600 }, orders: [] },
    ];
    setCouriers(exampleCouriers);
  }, []);

  const handleMarkerClick = (courier) => {
    setSelectedCourier(courier);
  };

  const handleAssignOrder = (order) => {
    // Logika przypisywania zamówienia do kuriera
    if (selectedCourier) {
      setSelectedCourier((prev) => ({
        ...prev,
        orders: [...prev.orders, order],
      }));
    }
  };

  const handleRemoveOrder = (orderId) => {
    // Logika usuwania zamówienia
    if (selectedCourier) {
      setSelectedCourier((prev) => ({
        ...prev,
        orders: prev.orders.filter((order) => order.id !== orderId),
      }));
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Zarządzanie Dostawcami</h2>

      {/* Mapa kurierów */}
      <div className="bg-white rounded-lg shadow p-6 h-96">
        <h3 className="text-xl font-semibold mb-4">Mapa Kurierów</h3>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          zoom={10}
          center={{ lat: 53.4285, lng: 14.5528 }} // Centrum Szczecina
        >
          {couriers.map((courier) => (
            <Marker
              key={courier.id}
              position={courier.location}
              onClick={() => handleMarkerClick(courier)}
            />
          ))}
        </GoogleMap>
      </div>

      {/* Szczegóły wybranego kuriera */}
      {selectedCourier && (
        <div className="bg-white rounded-lg shadow p-6 mt-4">
          <h3 className="text-xl font-semibold mb-4">{selectedCourier.name}</h3>
          <p>Aktywne zamówienia:</p>
          <ul>
            {selectedCourier.orders.length > 0 ? (
              selectedCourier.orders.map((order) => (
                <li key={order.id}>
                  {order.name} <button onClick={() => handleRemoveOrder(order.id)}>Usuń</button>
                </li>
              ))
            ) : (
              <p>Brak aktywnych zamówień.</p>
            )}
          </ul>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4" onClick={() => handleAssignOrder({ id: Date.now(), name: 'Nowe zamówienie' })}>
            Przypisz nowe zamówienie
          </button>
        </div>
      )}
    </div>
  );
};

export default Suppliers;