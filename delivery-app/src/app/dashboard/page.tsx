'use client';

import { useState, useEffect } from 'react';
import { MapPin, Package } from 'lucide-react';
import { SignOutButton, useUser } from '@clerk/nextjs';
import DetalleModal from './components/detalleModal';
import { Order } from '../../types/index';
import { useSortedOrders } from '../../hooks/useSortedOrders';

export default function DashboardPage() {
  // const [isOnline, setIsOnline] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const { user } = useUser();

  const { orderdOrders, activeTab, setActiveTab, tabs } = useSortedOrders(orders);


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
              // Si el tab actual es el clickeado, lo desactivamos (pasando un string vacío), sino lo activamos
              onClick={() => setActiveTab(activeTab === tab.id ? '' : tab.id)}
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
          {orderdOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Contenedor principal: En móviles va en vertical, en md se alinea en fila horizontal */}
              <div className="flex flex-col justify-between gap-4 p-4 md:flex-row">
                
                {/* LADO IZQUIERDO: Mapa + Datos del pedido */}
                <div className="flex flex-col gap-4 sm:flex-row flex-1">
                  {/* Contenedor del Mapa */}
                  <div className="shrink-0 mx-auto sm:mx-0">
                    <div className="w-40 h-32 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300 overflow-hidden relative">
                      {order.storeAddress ? (
                        <iframe
                          title={`Mapa para ${order.storeAddress}`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(order.storeAddress)}&output=embed`}
                        ></iframe>
                      ) : (
                        <div className="text-center">
                          <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-500">Mapa</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Información del pedido */}
                  <div className="flex items-start gap-2 flex-1">
                    <Package className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">{order.storeName}</h3>
                      <p className="text-sm text-gray-600 mt-2">
                        <strong className="text-gray-800">Recogida:</strong> {order.storeAddress}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong className="text-gray-800">Entrega:</strong> {order.deliveryAddress}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong className="text-gray-800">Carga:</strong> {order.totalItems} bultos (aprox. {order.totalWeight}kg)
                      </p>
                    </div>
                  </div>
                </div>

                {/* LADO DERECHO: Precio arriba y Botón abajo (solo en pantallas md) */}
                <div className="flex flex-row justify-between items-center pt-2 border-t border-gray-100 md:border-0 md:pt-0 md:flex-col md:justify-between md:items-end md:shrink-0">
                  <div className="text-right">
                    <p className="text-xl font-bold text-orange-500">$PAGO</p>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-sm text-sm md:text-base mt-auto"
                  >
                    Ver Detalles
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
        )}

        {selectedOrder && (
          <DetalleModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
          />
        )}
      </main>
    </div>
  )
}
