'use client';

import { useState, useEffect } from 'react';
import { MapPin, Package } from 'lucide-react';
import { SignOutButton, useUser } from '@clerk/nextjs';
import DetalleModal from './components/detalleModal';
import { Order, OrderWithQuote } from '../../types/index';
import { useSortedOrders } from '../../hooks/useSortedOrders';
import { VehicleType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { obtenerUrlMapaEstatico } from '../lib/delivery/maps';
import Image from 'next/image';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function DashboardPage() {
  // const [isOnline, setIsOnline] = useState(true);
  const [selectedOrder,setSelectedOrder] = useState<Order | null>(null);
  const [loading,setLoading] = useState(true);
  const [orders,setOrders] = useState<OrderWithQuote[]>([]);
  const [selectedVehicle,setSelectedVehicle] = useState<VehicleType>(VehicleType.CAR);

  const { user } = useUser();
  const { orderdOrders, activeTab, setActiveTab, tabs } = useSortedOrders(orders);

  useEffect(() => {
  async function fetchOrdersAndQuotes() {
    setLoading(true);
    try {
      const response = await fetch('/api/orders?status=READY');
      const data: Order[] = await response.json();
      const enrichedOrders = await Promise.all(
        data.map(async (order) => {
            try {
              const params = new URLSearchParams({
                storeAddress: order.storeAddress || '',
                deliveryAddress: order.deliveryAddress || '',
                vehicle: selectedVehicle
              });
              const quoteResponse = await fetch(`/api/delivery/quote?${params.toString()}`);

              if (!quoteResponse.ok) {
                return order;
              }

              const quote = await quoteResponse.json();
              return {...order, quote};

            } catch {
              return order;
            }
          })
        );
      setOrders(enrichedOrders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  } fetchOrdersAndQuotes(); 
  }, [selectedVehicle]);

  const router = useRouter();
  const handleAcceptOrder = async (order: OrderWithQuote) =>{
    try {
      const response = await fetch(`/api/delivery`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          storeName: order.storeName,
          storeAddress: order.storeAddress,
          deliveryAddress: order.deliveryAddress,
          totalItems: order.totalItems,
          totalWeight: order.totalWeight
        })
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(`Error al aceptar el pedido: ${errData.details || errData.error}`);
      }
      const delivery = await response.json();
      
      router.push(`/delivery/${delivery.id}`);
    } catch (error) {
      console.error('Error al aceptar el pedido:', error);
    }
  }

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

        <div className="px-4 py-3 max-w-4xl mx-auto border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label htmlFor="ordenar-pedidos" className="text-sm font-medium text-gray-600">
            Ordenar por:
          </label>
          
          <Select
            value={activeTab || 'default'}
            onValueChange={(value) => setActiveTab(value === 'default' ? "" : value)}
          >
            <SelectTrigger
              id="ordenar-pedidos"
              className=" w-55 rounded-xl border-orange-200 bg-white text-gray-700 shadow-sm transition-all hover:border-orange-400 focus:ring-2 focus:ring-orange-400 cursor-pointer"
            >
            <SelectValue placeholder="Orden por defecto" />
            </SelectTrigger>

            <SelectContent position="popper" className="rounded-xl border-orange-100 shadow-lg">
              <SelectItem value="default">
                Orden por defecto
              </SelectItem>

              {tabs.map((tab) => (
                <SelectItem
                  key={tab.id}
                  value={tab.id}
                  className="focus:bg-orange-50 focus:text-orange-600"
                >
                  {tab.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                      {order.quote?.latitude && order.quote?.longitude ? (
                        <Image
                          fill
                          unoptimized
                          src={obtenerUrlMapaEstatico({
                            latitud: order.quote.latitude,
                            longitud: order.quote.longitude,
                            zoom: 15,
                            ancho: 600,
                            alto: 400
                          })}
                          alt={`Mapa de ${order.storeName}`}
                          sizes="600px"
                          className="object-cover rounded-lg"
                        />
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
                <div className="flex flex-row justify-between items-center pt-2 border-t border-gray-100 md:border-0 md:pt-0 md:flex-col md:justify-between md:items-end md:shrink-0 md:space-y-4">
                    {order.quote && (
                    <div className="text-right">
                      <p className="text-xl font-bold text-orange-500">${order.quote.price}</p>
                    </div>
                    )}
                  
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-sm text-sm md:text-base cursor-pointer"
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
            onAccept={() => handleAcceptOrder(selectedOrder)}
          />
        )}
      </main>
    </div>
  )
}
