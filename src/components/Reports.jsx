import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../App.jsx';

const Reports = () => {
  const [deliveryStats, setDeliveryStats] = useState({
    averageTime: null,
    delayedDeliveries: null,
    totalDeliveries: null,
  });

  const [warehouseStats, setWarehouseStats] = useState({
    totalProducts: null,
    stockPercentage: null,
    productsToReplenish: null,
  });

  const [orderStats, setOrderStats] = useState({
    inProgressOrders: null,
    deliveredToday: null,
    delayedOrders: null,
  });

  const [courierStats, setCourierStats] = useState({
    activeRoutes: null,
    averageTimeToDestination: null,
    destinations: null,
  });

  const [employeeStats, setEmployeeStats] = useState({
    activeCouriers: null,
    averageDeliveriesPerCourier: null,
  });

  const [userStats, setUserStats] = useState({
    newRegistrations: null,
    activeUsers: null,
  });

  useEffect(() => {
    const fetchDeliveryStats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/delivery-stats`);
        setDeliveryStats(response.data);
      } catch (error) {
        console.error('Error fetching delivery stats data:', error);
      }
    };

    const fetchWarehouseStats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/warehouse-stats`);
        setWarehouseStats(response.data);
      } catch (error) {
        console.error('Error fetching warehouse stats:', error);
      }
    };

    const fetchOrderStats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/order-stats`);
        setOrderStats(response.data);
      } catch (error) {
        console.error('Error fetching order stats:', error);
      }
    };

    const fetchCourierStats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/courier-stats`);
        setCourierStats(response.data);
      } catch (error) {
        console.error('Error fetching courier stats:', error);
      }
    };

    const fetchEmployeeStats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/employee-stats`);
        setEmployeeStats(response.data);
      } catch (error) {
        console.error('Error fetching employee stats:', error);
      }
    };

    const fetchUserStats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/user-stats`);
        setUserStats(response.data);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchDeliveryStats();
    fetchWarehouseStats();
    fetchOrderStats();
    fetchCourierStats();
    fetchEmployeeStats();
    fetchUserStats();
  }, []);

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

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Raporty</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Raport Efektywności Dostaw */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Efektywność Dostaw</h3>
          <p>Średni czas dostawy: {formatDuration(deliveryStats.averageDeliveryTime)} minut</p>
          <p>Opóźnione dostawy: {orderStats.delayed}</p>
          <p>Całkowita liczba dostaw: {deliveryStats.totalDeliveries}</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">
            Zobacz Szczegóły
          </button>
        </div>

        {/* Raport Statystyk Magazynu */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Statystyki Magazynu</h3>
          <p>Liczba produktów w magazynie: {warehouseStats.totalProducts}</p>
          <p>Stan magazynowy: {warehouseStats.stockPercentage}%</p>
          <p>Produkty wymagające uzupełnienia: {warehouseStats.productsToReplenish}</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">
            Zobacz Szczegóły
          </button>
        </div>

        {/* Raport Zamówień */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Zamówienia</h3>
          <p>Zamówienia w trakcie realizacji: {orderStats.in_progress}</p>
          <p>Zamówienia dostarczone dzisiaj: {orderStats.delivered_today}</p>
          <p>Opóźnione zamówienia: {orderStats.delayed}</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">
            Zobacz Szczegóły
          </button>
        </div>

        {/* Raport Śledzenia Kurierów */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Śledzenie Kurierów</h3>
          <p>Aktywne trasy kurierów: {courierStats.activeRoutes}</p>
          <p>Średni czas dotarcia do celu: {formatDuration(courierStats.averageTimeToDestination)} minut</p>
          <p>Miejsca docelowe: {courierStats.destinations}</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">
            Zobacz Szczegóły
          </button>
        </div>

        {/* Raport Pracowników */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Pracownicy</h3>
          <p>Liczba aktywnych kurierów: {employeeStats.activeCouriers}</p>
          <p>Średnia liczba dostaw na kuriera: {employeeStats.averageDeliveriesPerCourier}</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">
            Zobacz Szczegóły
          </button>
        </div>

        {/* Raport Użytkowników */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Użytkownicy</h3>
          <p>Nowe rejestracje: {userStats.newRegistrations}</p>
          <p>Aktywni użytkownicy: {userStats.activeUsers}</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">
            Zobacz Szczegóły
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;