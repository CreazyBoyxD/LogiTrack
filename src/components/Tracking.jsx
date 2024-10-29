import React from 'react';
import Map from './Map';

const Tracking = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Śledzenie Dostaw</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mapa */}
        <div className="bg-white rounded-lg shadow p-6 h-auto">
          <h3 className="text-xl font-semibold mb-4">Mapa Dostaw</h3>
          <div className="h-80 w-full md:h-96 rounded overflow-hidden">
            <Map />
          </div>
        </div>

        {/* Status Dostaw */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Status Dostaw</h3>
          <p>Pojazd #1 - Dostarczono (15:30)</p>
          <p>Pojazd #2 - W trasie (Oczekiwany: 16:15)</p>
          <p>Pojazd #3 - Opóźniony (Nowy czas: 17:00)</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">
            Aktualizuj Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tracking;