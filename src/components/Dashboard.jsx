import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
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
  const [couriers, setCouriers] = useState([]); // Lokalizacje kurierów
  const [directions, setDirections] = useState({}); // Trasy kurierów

  // Załaduj Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  // Pobierz lokalizacje aktywnych kurierów
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
    const interval = setInterval(fetchCouriers, 5000); // Aktualizacja co 5 sekund
    return () => clearInterval(interval); // Usuń interwał
  }, []);

  // Wyznacz trasy dla kurierów
  useEffect(() => {
    if (!isLoaded) return;

    couriers.forEach((courier) => {
      if (courier.destination_lat && courier.destination_lng) {
        const origin = { lat: courier.latitude, lng: courier.longitude };
        const destination = { lat: courier.destination_lat, lng: courier.destination_lng };

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
                [courier.courier_id]: result, // Zapisz trasę dla kuriera
              }));
            } else {
              console.error(`Error fetching directions for courier ${courier.courier_id}:`, status);
            }
          }
        );
      }
    });
  }, [couriers, isLoaded]);

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
          <p>Zamówienia w trakcie realizacji: 8</p>
          <p>Zamówienia dostarczone dzisiaj: 3</p>
          <p>Opóźnione zamówienia: 2</p>
        </div>

        {/* Sekcja Śledzenia Dostaw */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Śledzenie Dostaw</h2>
          <p>Pojazdy w trasie: 4</p>
          <p>Średni czas dostawy: 35 min</p>
          <p>Najbliższa dostawa: 15:30</p>
        </div>
      </div>

      {/* Mapa z lokalizacją pojazdów */}
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Mapa Śledzenia Dostaw</h2>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={12}
            center={defaultCenter}
          >
            {/* Markery dla kurierów */}
            {couriers.map((courier) => (
              <Marker
                key={courier.courier_id}
                position={{
                  lat: courier.latitude,
                  lng: courier.longitude,
                }}
                label={`${courier.courier_id}`} // Oznaczenie kuriera
              />
            ))}

            {/* Trasy dla kurierów */}
            {Object.keys(directions).map((courierId) => (
              <DirectionsRenderer
                key={courierId}
                options={{
                  directions: directions[courierId],
                }}
              />
            ))}
          </GoogleMap>
        ) : (
          <div>Ładowanie mapy...</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;