import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, TrafficLayer } from '@react-google-maps/api';
import axios from 'axios';
import { BASE_URL } from '../App.jsx';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 53.4285, // Centrum Szczecina
  lng: 14.5528,
};

const Dashboard = () => {
  const [couriers, setCouriers] = useState([]);
  const [directions, setDirections] = useState({});
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [showTrafficLayer, setShowTrafficLayer] = useState(false);
  const [orderStats, setOrderStats] = useState({
    in_progress: 0,
    delivered_today: 0,
    delayed: 0,
  });
  const [deliveryStats, setDeliveryStats] = useState({
    vehiclesInTransit: 0,
    averageDeliveryTime: 0,
    nextDelivery: null,
  });
  const [warehouseStats, setWarehouseStats] = useState({
    totalProducts: 0,
    stockPercentage: 0,
    productsToReplenish: 0,
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    version: "3.58",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response1 = await axios.get(`${BASE_URL}/api/delivery-stats`);
        const response2 = await axios.get(`${BASE_URL}/api/order-stats`);
        const response3 = await axios.get(`${BASE_URL}/api/warehouse-stats`);
        setDeliveryStats(response1.data);
        setOrderStats(response2.data);
        setWarehouseStats(response3.data);
      } catch (error) {
        console.error('Błąd podczas pobierania statystyk:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

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
    const interval = setInterval(fetchCouriers, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedCourier || !selectedCourier.destination_lat || !selectedCourier.destination_lng)
      return;

    const origin = {
      lat: parseFloat(selectedCourier.latitude),
      lng: parseFloat(selectedCourier.longitude),
    };
    const destination = {
      lat: parseFloat(selectedCourier.destination_lat),
      lng: parseFloat(selectedCourier.destination_lng),
    };

    new window.google.maps.DirectionsService().route(
      {
        origin,
        destination,
        travelMode: 'DRIVING',
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections((prev) => ({
            ...prev,
            [selectedCourier.courier_id]: result,
          }));
        } else {
          console.error(
            `Error fetching directions for courier ${selectedCourier.courier_id}:`,
            status
          );
        }
      }
    );
  }, [selectedCourier]);

  const handleCourierClick = async (courier) => {
    setSelectedCourier(courier);
    try {
      const response = await axios.get(`${BASE_URL}/api/couriers/${courier.courier_id}/destination`);
      setSelectedCourier((prev) => ({
        ...prev,
        destination_address: response.data?.destination_address || 'Brak celu',
      }));
    } catch (error) {
      console.error('Error fetching courier destination:', error);
      setSelectedCourier((prev) => ({
        ...prev,
        destination_address: 'Brak celu',
      }));
    }
  };  

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes}`;
    } else if (minutes > 0) {
      return `${minutes}`;
    } else {
      return `${secs}`;
    }
  };  

  const handleCancelTracking = () => {
    setSelectedCourier(null);
    setDirections({});
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <h1 className="text-4xl font-bold text-center text-black-700">Dashboard</h1>
  
      {/* Statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Przegląd Magazynu */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Przegląd Magazynu</h2>
          <p className="text-sm text-gray-600">
            <strong>Liczba produktów:</strong> {warehouseStats.totalProducts}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Stan magazynowy:</strong> {warehouseStats.stockPercentage}%
          </p>
          <p className="text-sm text-gray-600">
            <strong>Produkty wymagające uzupełnienia:</strong> {warehouseStats.productsToReplenish}
          </p>
        </div>
  
        {/* Aktywne Zamówienia */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Aktywne Zamówienia</h2>
          <p className="text-sm text-gray-600">
            <strong>W trakcie realizacji:</strong> {orderStats.in_progress}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Dostarczone dzisiaj:</strong> {orderStats.delivered_today}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Opóźnione:</strong> {orderStats.delayed}
          </p>
        </div>
  
        {/* Śledzenie Dostaw */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Śledzenie Dostaw</h2>
          <p className="text-sm text-gray-600">
            <strong>Pojazdy w trasie:</strong> {deliveryStats.vehiclesInTransit}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Średni czas dostawy:</strong> {formatDuration(deliveryStats.averageDeliveryTime)} min
          </p>
          <p className="text-sm text-gray-600">
            <strong>Najbliższa dostawa:</strong>{' '}
            {deliveryStats.nextDelivery ? deliveryStats.nextDelivery.slice(0, 5) : 'Brak'}
          </p>
        </div>
      </div>
  
      {/* Mapa Śledzenia Dostaw */}
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Mapa Śledzenia Dostaw</h2>
        {isLoaded ? (
          <div className="rounded overflow-hidden shadow-lg">
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={defaultCenter}>
              {couriers.map((courier) => (
                <Marker
                  key={courier.courier_id}
                  position={{
                    lat: parseFloat(courier.latitude),
                    lng: parseFloat(courier.longitude),
                  }}
                  label={`${courier.courier_id}`}
                  onClick={() => handleCourierClick(courier)}
                />
              ))}
              {selectedCourier && directions[selectedCourier.courier_id] && (
                <DirectionsRenderer
                  options={{
                    directions: directions[selectedCourier.courier_id],
                  }}
                />
              )}
              {showTrafficLayer && <TrafficLayer />}
            </GoogleMap>
          </div>
        ) : (
          <div className="text-center text-gray-500">Ładowanie mapy...</div>
        )}
        <button
          onClick={() => setShowTrafficLayer((prev) => !prev)}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium shadow hover:bg-blue-600 transition-colors"
        >
          {showTrafficLayer ? 'Ukryj natężenie ruchu' : 'Pokaż natężenie ruchu'}
        </button>
      </div>
  
      {/* Szczegóły Kuriera */}
      {selectedCourier && (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Szczegóły Kuriera</h3>
          <p className="text-sm text-gray-600">
            <strong>ID Kuriera:</strong> {selectedCourier.courier_id}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Status:</strong>{' '}
            {selectedCourier.destination_address !== 'Brak celu' ? 'W trasie' : 'Nie ma celu'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Miejsce Docelowe:</strong> {selectedCourier.destination_address}
          </p>
          <button
            onClick={handleCancelTracking}
            className="mt-2 w-full py-3 bg-red-500 text-white rounded-lg font-medium shadow hover:bg-red-600 transition-colors"
          >
            Anuluj śledzenie
          </button>
        </div>
      )}
    </div>
  );  
};

export default Dashboard;