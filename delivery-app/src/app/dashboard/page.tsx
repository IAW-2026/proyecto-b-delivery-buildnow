'use client';

import { useState, useEffect } from 'react';
import { MapPin, Package } from 'lucide-react';
import { SignOutButton, useUser } from '@clerk/nextjs';
import DetalleModal from './components/detalleModal';
import { Order } from '../../types/index';

type TabType = 'closest' | 'highest' | 'heavy';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('closest');
  const [isOnline, setIsOnline] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'closest', label: 'Más cercanos' },
    { id: 'highest', label: 'Mayor pago' },
    { id: 'heavy', label: 'Cargas pesadas' },
  ];

  // Llamada a tu API GET /api/orders?status=READY para obtener los pedidos disponibles
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const response = await fetch('/api/orders?status=READY');
        if (!response.ok) throw new Error('Error al obtener pedidos disponibles');
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error al consultar pedidos disponibles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex flex-col gap-4 p-4 bg-white border-b border-gray-200 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
              <span className="text-xl">🚚</span>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{`buildNOW`}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              <p className="font-semibold">{`Hola ${user?.firstName ?? 'Repartidor'}`}</p>
              <p className="text-xs text-gray-500">Rol: DELIVERY</p>
            </div>
            <SignOutButton>Salir</SignOutButton>
          </div>
        </div>

        <div className="px-4 py-3 flex flex-wrap gap-2 max-w-4xl mx-auto border-t border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-orange-500 text-orange-600'
                  : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 py-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Envíos Disponibles</h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No hay pedidos disponibles en este momento.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-4 p-4 md:flex-row">
                <div className="shrink-0">
                  <div className="w-full max-w-40 h-32 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Mapa</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-2">
                      <Package className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-gray-900">{order.storeName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Recogida:</strong> {order.storeAddress}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Entrega:</strong> {order.deliveryAddress}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-orange-500">${}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Carga:</strong> {order.totalItems} bultos (aprox. {order.totalWeight}kg)
                  </p>

                  <button 
                  onClick={() => setIsOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                    Ver Detalles
                  </button>

                  {isOpen && <DetalleModal onClose={() => setIsOpen(false)} />}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </main>
    </div>
  )
}
