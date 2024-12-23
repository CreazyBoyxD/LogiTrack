import React, { useState, useEffect, useCallback } from 'react';
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

const Tracking = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [origin, setOrigin] = useState(defaultCenter);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [estimatedTimes, setEstimatedTimes] = useState({});
  const [isNavigating, setIsNavigating] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    version: "3.58",
  });

  // Aktualizacja lokalizacji kuriera
  useEffect(() => {
    const updatePosition = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newOrigin = { lat: latitude, lng: longitude };
            setOrigin(newOrigin);
          },
          (error) => {
            console.error('Błąd podczas uzyskiwania lokalizacji:', error);
          }
        );
      }
    };

    const interval = setInterval(updatePosition, 15000); // Aktualizacja co 15 sekund
    return () => clearInterval(interval); // Usuń interwał przy demontażu komponentu
  }, []);

  // Pobierz status aktywności kuriera
  const fetchCourierStatus = async () => {
    const courierId = localStorage.getItem('courierId');
    if (!courierId) {
      console.error('Brak courierId w localStorage');
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/couriers/${courierId}`);
      setIsActive(response.data.active); // Ustaw status aktywności
    } catch (error) {
      console.error('Błąd podczas pobierania statusu kuriera:', error);
    }
  };

  const toggleCourierActive = async () => {
    const courierId = localStorage.getItem('courierId');
    if (!courierId) {
      console.error('Brak courierId w localStorage');
      return;
    }

    try {
      await axios.put(`${BASE_URL}/api/couriers/${courierId}/active`, {
        active: !isActive,
      });
      setIsActive(!isActive); // Aktualizuj lokalny stan
    } catch (error) {
      console.error('Błąd podczas zmiany statusu aktywności kuriera:', error);
    }
  };

  useEffect(() => {
    fetchCourierStatus();
  }, []);

  const startDelivery = async (deliveryId) => {
    try {
      console.log('Delivery ID:', deliveryId);
      await axios.put(`${BASE_URL}/api/deliveries/${deliveryId}/start`);
      console.log(`Czas rozpoczęcia dostawy ${deliveryId} został zapisany.`);
    } catch (error) {
      console.error('Błąd podczas zapisywania czasu rozpoczęcia dostawy:', error);
    }
  };  

  const fetchDeliveryDuration = async (deliveryId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/deliveries/${deliveryId}/duration`);
      console.log('Delivery duration: ', response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania czasu dostawy:', error);
    }
  };
  
  const markDeliveryAsCompleted = async (deliveryId) => {
    try {
      await axios.put(`${BASE_URL}/api/deliveries/${deliveryId}/complete`);
      setDeliveries((prev) => prev.filter((delivery) => delivery.id !== deliveryId));
      setSelectedDelivery(null); // Resetuj wybraną dostawę
      console.log(`Dostawa ${deliveryId} została oznaczona jako zakończona.`);
    } catch (error) {
      console.error('Błąd podczas oznaczania dostawy jako zakończonej:', error);
    }
  };
  
  const isSignificantChange = (oldPosition, newPosition, threshold = 0.001) => {
    const latDiff = Math.abs(oldPosition.lat - newPosition.lat);
    const lngDiff = Math.abs(oldPosition.lng - newPosition.lng);
    return latDiff > threshold || lngDiff > threshold;
  };

  const handleNavigate = useCallback((delivery) => {
    setSelectedDelivery(delivery);
  
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
          setIsNavigating(true); // Zmień stan na "nawigowanie"
        } else {
          console.error('Error calculating route:', status);
        }
      }
    );
  }, [origin]);

  // Aktualizuj trasę przy dużych zmianach lokalizacji
  useEffect(() => {
    if (selectedDelivery && isSignificantChange(mapCenter, origin)) {
      handleNavigate(selectedDelivery);
    }
  }, [origin, mapCenter, selectedDelivery, handleNavigate]);

  // Wywołuj API co 30 sekund
  useEffect(() => {
    let interval = null;

    if (selectedDelivery) {
      interval = setInterval(() => {
        handleNavigate(selectedDelivery);
      }, 30000);
    }

    return () => clearInterval(interval);
  }, [selectedDelivery, handleNavigate]);
  
  // Aktualizacja lokalizacji w bazie danych
  const updateCourierLocationInDB = useCallback(async () => {
    const courierId = localStorage.getItem('courierId');
    if (!courierId) {
      console.error('Brak courierId w localStorage');
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const destination = selectedDelivery
            ? { lat: parseFloat(selectedDelivery.latitude), lng: parseFloat(selectedDelivery.longitude) }
            : { lat: null, lng: null };

          try {
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

  // Aktualizuj lokalizację co 30 sekund
  useEffect(() => {
    const interval = setInterval(updateCourierLocationInDB, 30000);
    return () => clearInterval(interval);
  }, [updateCourierLocationInDB]);

  // Pobierz dostawy
  useEffect(() => {
    const fetchDeliveries = async () => {
      const courierId = localStorage.getItem('courierId');
      if (!courierId) {
        console.error('Brak courierId w localStorage');
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/deliveries`, {
          params: { courierId },
        });
        setDeliveries(response.data);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    fetchDeliveries();
  }, []);

  // Oblicz szacowany czas
  const calculateEstimatedTime = (delivery) => {
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
          const durationText = result.routes[0].legs[0].duration.text;
          const durationInSeconds = parseDurationToSeconds(durationText); // Convert to seconds

          // Update the frontend state with the readable duration
          setEstimatedTimes((prev) => ({
            ...prev,
            [delivery.id]: durationText,
          }));

          // Send the duration in seconds to the backend
          try {
            await axios.put(`${BASE_URL}/api/deliveries/${delivery.id}/estimated-time`, {
              estimatedTime: durationInSeconds, // Send duration in seconds
            });
          } catch (error) {
            console.error('Error updating estimated time:', error);
          }
        } else {
          console.error('Error calculating estimated time:', status);
        }
      }
    );
  };

  // Helper function to convert duration text to seconds
  const parseDurationToSeconds = (durationText) => {
    const timeUnits = durationText.match(/(\d+)\s*(hour|minute|second|h|m|s)/gi);
    let totalSeconds = 0;

    timeUnits?.forEach((timeUnit) => {
      const [, value, unit] = timeUnit.match(/(\d+)\s*(hour|minute|second|h|m|s)/i) || [];
      const numericValue = parseInt(value, 10);

      if (unit.startsWith('hour') || unit === 'h') totalSeconds += numericValue * 3600;
      else if (unit.startsWith('minute') || unit === 'm') totalSeconds += numericValue * 60;
      else if (unit.startsWith('second') || unit === 's') totalSeconds += numericValue;
    });

    return totalSeconds;
  };

  // Anulowanie trasy
  const handleCancelNavigation = () => {
    setSelectedDelivery(null);
    setDirectionsResponse(null); // Usuń trasę
    setIsNavigating(false); // Zresetuj stan na "nie nawigowanie"
  };

  // Wyśrodkowanie mapy
  const handleCenterMap = () => {
    setMapCenter(origin);
  };

  const optimizeDeliveryOrder = async () => {
    if (!deliveries || deliveries.length === 0) {
      alert('Brak przypisanych dostaw do optymalizacji.');
      return;
    }
  
    try {
      const waypoints = deliveries.map((delivery) => ({
        location: `${delivery.latitude},${delivery.longitude}`,
        stopover: true,
      }));
  
      new window.google.maps.DirectionsService().route(
        {
          origin: `${origin.lat},${origin.lng}`, // Lokalizacja kuriera
          destination: `${origin.lat},${origin.lng}`, // Powrót do punktu początkowego (opcjonalne)
          waypoints: waypoints,
          optimizeWaypoints: true, // Optymalizacja kolejności
          travelMode: 'DRIVING',
        },
        (result, status) => {
          if (status === 'OK') {
            // Optymalizowana kolejność
            const optimizedOrder = result.routes[0].waypoint_order;
  
            // Ustawienie nowej kolejności w liście dostaw
            const sortedDeliveries = optimizedOrder.map((index) => deliveries[index]);
            setDeliveries(sortedDeliveries);
            alert('Dostawy zostały zoptymalizowane.');
          } else {
            console.error('Error optimizing deliveries:', status);
            alert('Nie udało się zoptymalizować dostaw.');
          }
        }
      );
    } catch (error) {
      console.error('Error during delivery optimization:', error);
      alert('Wystąpił błąd podczas optymalizacji dostaw.');
    }
  };  

  if (!isLoaded) return <div>Ładowanie mapy...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen space-y-8">
      <h2 className="text-4xl font-bold text-center text-blue-700">Śledzenie Dostaw</h2>
  
      {/* Status aktywności */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800">Twój Status Aktywności</h3>
        <p className="text-lg">
          <strong>Status:</strong>{' '}
          <span className={isActive ? 'text-green-600' : 'text-red-600'}>
            {isActive ? 'Aktywny' : 'Nieaktywny'}
          </span>
        </p>
        <button
          onClick={toggleCourierActive}
          className={`w-full py-3 rounded-lg font-semibold shadow transition-colors ${
            isActive
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isActive ? 'Ustaw jako Nieaktywny' : 'Ustaw jako Aktywny'}
        </button>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lista dostaw */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h3 className="text-2xl font-semibold text-gray-800">Twoje Dostawy</h3>
          {deliveries.length > 0 ? (
            <ul className="space-y-4">
              {deliveries.map((delivery, index) => (
                <li key={delivery.id} className="p-4 border rounded-lg shadow hover:bg-gray-50">
                  <p className="text-lg">
                    <strong>{index + 1}. Adres:</strong> {delivery.address}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Szacowany czas:</strong> {estimatedTimes[delivery.id] || 'N/A'}
                  </p>
                  <div className="flex justify-between space-x-2 mt-4">
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600"
                      onClick={() => calculateEstimatedTime(delivery)}
                    >
                      Oblicz czas
                    </button>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                      onClick={() => {
                        handleNavigate(delivery);
                        startDelivery(delivery.id);
                        setIsNavigating(true);
                      }}
                    >
                      Jedź
                    </button>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
                      onClick={() => {
                        handleCancelNavigation();
                        markDeliveryAsCompleted(delivery.id);
                        fetchDeliveryDuration(delivery.id);
                      }}
                    >
                      Oznacz jako wykonane
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Brak dostaw do zrealizowania.</p>
          )}
        </div>
  
        {/* Mapa */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h3 className="text-2xl font-semibold text-gray-800">Mapa</h3>
          <button
            onClick={optimizeDeliveryOrder}
            className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold shadow hover:bg-green-600 transition-colors"
          >
            Optymalizuj kolejność dostaw
          </button>
          <div className="rounded overflow-hidden shadow">
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={mapCenter}>
              {/* Marker dla lokalizacji kuriera */}
              <Marker
                position={origin}
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                }}
                label="Ty"
              />
  
              {/* Markery dla dostaw */}
              {deliveries.map((delivery) => (
                <Marker
                  key={delivery.id}
                  position={{
                    lat: parseFloat(delivery.latitude),
                    lng: parseFloat(delivery.longitude),
                  }}
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  }}
                  onClick={() => setSelectedDelivery(delivery)}
                />
              ))}
  
              {/* DirectionsRenderer dla trasy */}
              {directionsResponse && (
                <DirectionsRenderer
                  options={{
                    directions: directionsResponse,
                    suppressMarkers: false,
                  }}
                />
              )}
            </GoogleMap>
          </div>
          <button
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition-colors"
            onClick={handleCenterMap}
          >
            Wyśrodkuj mapę
          </button>
        </div>
      </div>
  
      {/* Szczegóły dostawy */}
      {selectedDelivery && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Szczegóły Dostawy</h3>
          <p>
            <strong>Adres:</strong> {selectedDelivery.address}
          </p>
          <p>
            <strong>Szacowany czas:</strong>{' '}
            {estimatedTimes[selectedDelivery.id] || 'N/A'}
          </p>
          <div className="flex justify-between space-x-2">
            {!isNavigating ? (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                onClick={() => {
                  handleNavigate(selectedDelivery);
                  startDelivery(selectedDelivery.id);
                  setIsNavigating(true);
                }}
              >
                Rozpocznij trasę
              </button>
            ) : (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
                onClick={() => {
                  handleCancelNavigation();
                  setIsNavigating(false);
                }}
              >
                Anuluj trasę
              </button>
            )}
            <button
              className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
              onClick={() => {
                handleCancelNavigation();
                markDeliveryAsCompleted(selectedDelivery.id);
                fetchDeliveryDuration(selectedDelivery.id);
              }}
            >
              Oznacz jako wykonane
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Tracking;