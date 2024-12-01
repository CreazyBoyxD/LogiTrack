import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
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

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  // Pobieranie statystyk z bazy danych
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response1 = await axios.get(`${BASE_URL}/api/delivery-stats`);
        const response2 = await axios.get(`${BASE_URL}/api/order-stats`);
        setDeliveryStats(response1.data);
        setOrderStats(response2.data);
      } catch (error) {
        console.error('Błąd podczas pobierania statystyk:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Aktualizacja co minutę
    return () => clearInterval(interval);
  }, []);

  // Pobierz lokalizacje kurierów
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

  // Aktualizacja lokalizacji kuriera
  useEffect(() => {
    if (!selectedCourier) return;
  
    const fetchCourierLocation = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/couriers/${selectedCourier.courier_id}`);
        const updatedCourier = response.data;
  
        // Zaktualizuj lokalizację wybranego kuriera
        setSelectedCourier((prev) => ({
          ...prev,
          latitude: updatedCourier.latitude,
          longitude: updatedCourier.longitude,
        }));
      } catch (error) {
        console.error(`Error updating location for courier ${selectedCourier.courier_id}:`, error);
      }
    };
  
    const interval = setInterval(fetchCourierLocation, 30000); // Aktualizacja co 30 sekund
    return () => clearInterval(interval); // Usuń interwał przy odmontowaniu komponentu
  }, [selectedCourier]);  

  // Obliczanie trasy dla wybranego kuriera
  useEffect(() => {
    if (!selectedCourier || !selectedCourier.destination_lat || !selectedCourier.destination_lng) return;
  
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
          console.error(`Error fetching directions for courier ${selectedCourier.courier_id}:`, status);
        }
      }
    );
  }, [selectedCourier]);  

  // Funkcja do obsługi kliknięcia na kuriera
  const handleCourierClick = (courier) => {
    setSelectedCourier(courier); // Ustaw wybranego kuriera
  };

 // Funkcja do obsługi kliknięcia na kuriera
  const handleCancelTracking = () => {
    setSelectedCourier(null); // Resetuj wybranego kuriera
    setDirections({}); // Usuń trasy
  };  

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Sekcja Przeglądu Magazynu */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Przegląd Magazynu</h2>
          <p>Liczba produktów: 120</p>
          <p>Stan magazynowy: 75%</p>
          <p>Produkty wymagające uzupełnienia: 5</p>
        </div>

        {/* Sekcja Aktywnych Zamówień */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Aktywne Zamówienia</h2>
          <p>Zamówienia w trakcie realizacji: {orderStats.in_progress}</p>
          <p>Zamówienia dostarczone dzisiaj: {orderStats.delivered_today}</p>
          <p>Opóźnione zamówienia: {orderStats.delayed}</p>
        </div>

        {/* Sekcja Śledzenia Dostaw */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Śledzenie Dostaw</h2>
          <p>Pojazdy w trasie: {deliveryStats.vehiclesInTransit}</p>
          <p>Średni czas dostawy: {deliveryStats.averageDeliveryTime} min</p>
          <p>Najbliższa dostawa: {deliveryStats.nextDelivery ? deliveryStats.nextDelivery.slice(0, 5) : 'Brak'}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Mapa Śledzenia Dostaw</h2>
        {isLoaded ? (
          <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={defaultCenter}>
            {/* Markery dla kurierów */}
            {couriers
              .filter(courier => !isNaN(courier.latitude) && !isNaN(courier.longitude))
              .map(courier => (
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

            {/* Trasa dla wybranego kuriera */}
            {selectedCourier && directions[selectedCourier.courier_id] && (
              <DirectionsRenderer
                options={{
                  directions: directions[selectedCourier.courier_id],
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <div>Ładowanie mapy...</div>
        )}
        {/* Przycisk "Anuluj śledzenie" */}
        {selectedCourier && (
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleCancelTracking}
          >
            Anuluj śledzenie
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;