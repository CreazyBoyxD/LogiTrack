import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { BASE_URL } from '../App.jsx';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 53.4285, // Centrum Szczecina
  lng: 14.5528,
};

const Tracking = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Klucz API
  });

  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null); // Trasa
  const [origin, setOrigin] = useState(defaultCenter); // Pozycja kuriera (domyślnie defaultCenter)
  const [mapCenter, setMapCenter] = useState(defaultCenter); // Centrum mapy
  const [estimatedTimes, setEstimatedTimes] = useState({}); // Przechowuje szacowany czas dla każdej dostawy

  // Use useCallback to wrap updateCourierLocationInDB for stability
  const updateCourierLocationInDB = useCallback(async () => {
    const courierId = localStorage.getItem('courierId'); // Pobierz ID kuriera
    if (!courierId) {
      console.error('Brak courierId w localStorage');
      return;
    }
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
  
          const destination = selectedDelivery
            ? { lat: selectedDelivery.latitude, lng: selectedDelivery.longitude }
            : { lat: null, lng: null }; // Jeśli nie ma destynacji, ustaw null
  
          try {
            // Use UPSERT query to insert or update location
            await axios.post(`${BASE_URL}/api/courier-location`, {
              courier_id: courierId,
              latitude,
              longitude,
              destination_lat: destination.lat,
              destination_lng: destination.lng,
            });
            console.log('Lokalizacja kuriera została zaktualizowana w bazie danych');
          } catch (error) {
            console.error('Błąd podczas aktualizacji lokalizacji kuriera w bazie danych:', error);
          }
        },
        (error) => {
          console.error('Błąd podczas uzyskiwania lokalizacji:', error);
        }
      );
    }
  }, [selectedDelivery]);  

  // Ustaw interwał do aktualizacji lokalizacji w bazie danych
  useEffect(() => {
    const interval = setInterval(updateCourierLocationInDB, 10000); // Aktualizuj co 10 sekund
    return () => clearInterval(interval); // Usuń interwał przy demontażu komponentu
  }, [updateCourierLocationInDB]); // Add as a dependency

  // Pobierz dostawy dla kuriera
  useEffect(() => {
    const fetchDeliveries = async () => {
      const courierId = localStorage.getItem('courierId'); // Pobierz ID kuriera z localStorage
      if (!courierId) {
        console.error('Brak courierId w localStorage');
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/deliveries`, {
          params: { courierId }, // Przekaż courierId jako parametr zapytania
        });
        setDeliveries(response.data);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    fetchDeliveries();
  }, []);

  // Pobierz aktualną pozycję kuriera przy załadowaniu komponentu i aktualizuj co 5 sekund
  useEffect(() => {
    const updatePosition = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newOrigin = { lat: latitude, lng: longitude };
            setOrigin(newOrigin); // Zaktualizuj pozycję kuriera
          },
          (error) => {
            console.error('Error getting current position:', error);
          }
        );
      }
    };

    const interval = setInterval(updatePosition, 5000); // Aktualizacja co 5 sekund
    return () => clearInterval(interval); // Usuń interwał przy demontażu komponentu
  }, []);

  // Oblicz szacowany czas dla wszystkich dostaw
  useEffect(() => {
    const calculateAllEstimatedTimes = () => {
      deliveries.forEach((delivery) => {
        if (!delivery.latitude || !delivery.longitude) return;

        const destination = {
          lat: parseFloat(delivery.latitude),
          lng: parseFloat(delivery.longitude),
        };

        new window.google.maps.DirectionsService().route(
          {
            origin,
            destination,
            travelMode: 'DRIVING',
          },
          async (result, status) => {
            if (status === 'OK' && result.routes.length > 0) {
              const duration = result.routes[0].legs[0].duration.text; // Pobierz czas trwania jako tekst (np. "15 min")
              setEstimatedTimes((prev) => ({
                ...prev,
                [delivery.id]: duration, // Ustaw czas dla tej dostawy
              }));

              try {
                // Wyślij szacowany czas do bazy danych
                await axios.put(`${BASE_URL}/api/deliveries/${delivery.id}/estimated-time`, {
                  estimatedTime: duration,
                });
              } catch (error) {
                console.error('Error updating estimated time:', error);
              }
            } else {
              console.error('Error calculating estimated time:', status);
            }
          }
        );
      });
    };

    const interval = setInterval(calculateAllEstimatedTimes, 5000); // Aktualizacja szacowanego czasu co 5 sekund
    return () => clearInterval(interval); // Usuń interwał przy demontażu komponentu
  }, [origin, deliveries]);

  const handleNavigate = (delivery) => {
    setSelectedDelivery(delivery);

    // Oblicz trasę dla wybranej dostawy
    const destination = {
      lat: parseFloat(delivery.latitude),
      lng: parseFloat(delivery.longitude),
    };

    new window.google.maps.DirectionsService().route(
      {
        origin,
        destination,
        travelMode: 'DRIVING',
      },
      (result, status) => {
        if (status === 'OK') {
          setDirectionsResponse(result);
        } else {
          console.error('Error calculating route:', status);
        }
      }
    );
  };

  const handleCancelNavigation = () => {
    setSelectedDelivery(null);
    setDirectionsResponse(null); // Usuń trasę
  };

  const markAsDelivered = async (deliveryId) => {
    try {
      await axios.put(`${BASE_URL}/api/deliveries/${deliveryId}`, { status: 'delivered' }); // Aktualizuj status w backendzie
      setDeliveries((prev) => prev.filter((d) => d.id !== deliveryId)); // Usuń dostawę z listy
      setSelectedDelivery(null); // Resetuj wybraną dostawę
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  const handleCenterMap = () => {
    setMapCenter(origin); // Wyśrodkuj mapę na aktualnej pozycji kuriera
  };

  if (loadError) return <div>Błąd ładowania mapy</div>;
  if (!isLoaded) return <div>Ładowanie mapy...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Śledzenie Dostaw</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lista dostaw */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Twoje dostawy</h3>
          {deliveries.length > 0 ? (
            <ul>
              {deliveries.map((delivery) => (
                <li key={delivery.id} className="mb-4">
                  <p>
                    <strong>Adres:</strong> {delivery.address}
                  </p>
                  <p>
                    <strong>Szacowany czas:</strong>{' '}
                    {estimatedTimes[delivery.id] || 'Obliczanie...'}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => handleNavigate(delivery)}
                    >
                      Jedź
                    </button>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={() => markAsDelivered(delivery.id)}
                    >
                      Oznacz jako zrealizowane
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Brak dostaw do zrealizowania.</p>
          )}
        </div>

        {/* Mapa */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Mapa</h3>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={12}
            center={mapCenter} // Centrum mapy kontrolowane przez użytkownika
          >
            {/* Markery dla dostaw */}
            {deliveries
              .filter((delivery) => delivery.latitude && delivery.longitude) // Filtruj tylko poprawne punkty
              .map((delivery) => (
                <Marker
                  key={delivery.id}
                  position={{
                    lat: parseFloat(delivery.latitude),
                    lng: parseFloat(delivery.longitude),
                  }}
                  onClick={() => setSelectedDelivery(delivery)} // Ustaw wybraną dostawę po kliknięciu na marker
                  icon={{
                    url:
                      selectedDelivery?.id === delivery.id
                        ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Niebieski marker dla wybranej dostawy
                        : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // Czerwony marker dla innych
                  }}
                />
              ))}

            {/* Obsługa DirectionsRenderer */}
            {directionsResponse && (
              <DirectionsRenderer
                options={{
                  directions: directionsResponse,
                }}
              />
            )}
          </GoogleMap>

          {/* Przycisk do wyśrodkowania mapy */}
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleCenterMap}
          >
            Wyśrodkuj mapę
          </button>

          {/* Szczegóły dostawy */}
          {selectedDelivery && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
              <h4 className="text-lg font-semibold">Szczegóły Dostawy</h4>
              <p>
                <strong>Adres:</strong> {selectedDelivery.address}
              </p>
              <p>
                <strong>Szacowany czas:</strong>{' '}
                {estimatedTimes[selectedDelivery.id] || 'Obliczanie...'}
              </p>
              <div className="flex space-x-2">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => markAsDelivered(selectedDelivery.id)}
                >
                  Oznacz jako zrealizowane
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={handleCancelNavigation}
                >
                  Anuluj nawigację
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tracking;