import React from 'react';

const Warehouse = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Zarządzanie Magazynem</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel Stanu Magazynu */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Stan Magazynowy</h3>
          <p>Liczba produktów: 250</p>
          <p>Wolne miejsca magazynowe: 120</p>
          <p>Produkty do uzupełnienia: 5</p>
        </div>

        {/* Panel Zarządzania Produktami */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Zarządzanie Produktami</h3>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Dodaj Produkt
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-4">
            Usuń Produkt
          </button>
        </div>

        {/* Panel Zamówień */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Oczekujące Zamówienia</h3>
          <p>Zamówienie #1245 - Produkt A (ilość: 50)</p>
          <p>Zamówienie #1246 - Produkt B (ilość: 20)</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4">
            Przejdź do Zamówień
          </button>
        </div>
      </div>
    </div>
  );
};

export default Warehouse;