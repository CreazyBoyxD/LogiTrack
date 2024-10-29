import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 53.4285, // Szerokość geograficzna dla Szczecina
  lng: 14.5528, // Długość geograficzna dla Szczecina
};

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Sprawdza, czy Geolocation API jest dostępne
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.error('Nie udało się uzyskać lokalizacji');
        }
      );
    } else {
      console.error('Geolocation API nie jest obsługiwane przez tę przeglądarkę');
    }
  }, []);

  if (loadError) return <div>Błąd ładowania mapy</div>;
  if (!isLoaded) return <div>Ładowanie mapy...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={10}
      center={userLocation || defaultCenter} // Wyśrodkuj na lokalizacji użytkownika, jeśli dostępna
    >
      {/* Marker użytkownika */}
      {userLocation && <Marker position={userLocation} />}
    </GoogleMap>
  );
};

export default Map;