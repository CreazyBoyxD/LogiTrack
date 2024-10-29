import React from 'react';
import Map from './Map';

const Dashboard = () => {
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
        <Map />
      </div>
    </div>
  );
};

export default Dashboard;