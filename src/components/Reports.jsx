import React from 'react';

const Reports = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Raporty</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Raport Sprzedaży */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Raport Sprzedaży</h3>
          <p>Dzisiejsze Sprzedaże: 150 sztuk</p>
          <p>Wartość: $3000</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">
            Zobacz Pełny Raport
          </button>
        </div>

        {/* Raport Efektywności Dostaw */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Efektywność Dostaw</h3>
          <p>Średni czas dostawy: 45 minut</p>
          <p>Opóźnione dostawy: 2</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">
            Zobacz Szczegóły
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;