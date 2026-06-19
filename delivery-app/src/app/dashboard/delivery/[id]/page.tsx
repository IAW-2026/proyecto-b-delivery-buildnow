"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Package,
  MapPin,
  CheckCircle,
  Truck,
  Navigation,
  AlertTriangle,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Delivery } from "../../../../types/index";
import texts from "../../../../../es.json";

export default function DeliveryPage() {
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("ASSIGNED");
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    duration: number;
  } | null>(null);
  const { user } = useUser();

  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    async function fetchOrder() {
      if (!id) return;

      try {
        setLoading(true);

        // Consultamos el registro de Delivery usando su ID
        const response = await fetch(`/api/delivery/${id}`);
        const data = await response.json();

        setDelivery(data);
        if (data.status) setStatus(data.status);
      } catch (error) {
        console.error("Error al cargar el pedido:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  // Recuperar información de la ruta en vivo si estamos en camino
  // Esto garantiza que la info sobreviva si el repartidor recarga la página.
  useEffect(() => {
    if (status === "ON_THE_WAY" && !routeInfo && delivery) {
      const fetchRoute = async () => {
        try {
          const params = new URLSearchParams({
            origin: delivery.pickupLocation || "",
            destination: delivery.deliveryAddress || "",
          });
          const vehicle = (
            (user?.publicMetadata?.vehicle as string) || "MOTORBIKE"
          ).toUpperCase();
          const response = await fetch(
            `/api/distance/${vehicle}?${params.toString()}`,
          );

          if (response.ok) {
            const data = await response.json();
            setRouteInfo({
              distance: data.distanceKm || data.distance || 4.5,
              duration: data.durationMinutes || data.duration || 12,
            });
          } else {
            setRouteInfo({ distance: 4.5, duration: 12 });
          }
        } catch (error) {
          console.error("Error obteniendo ruta en vivo inicial:", error);
          setRouteInfo({ distance: 4.5, duration: 12 });
        }
      };

      fetchRoute();
    }
  }, [status, delivery, routeInfo, user?.publicMetadata?.vehicle]);

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setStatus(newStatus);

      // Si el pedido fue entregado, redirigimos de nuevo al inicio al cabo de 2 segundos.
      if (newStatus === "DELIVERED") {
        // Solicitamos la creación del payout
        await fetch("/api/payments/payouts", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            orderId: (delivery as any)?.orderId || id,
            recipientType: "DELIVERY",
          }),
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }

      await fetch(`/api/delivery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      await fetch(`/api/orders/${delivery?.orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">{texts.DELIVERY.deliveryPage.notFound}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-orange-500 font-semibold hover:underline cursor-pointer"
        >
          {texts.DELIVERY.deliveryPage.backToHome}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header Fijo */}
      <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-gray-500 hover:text-gray-800 font-medium cursor-pointer"
          >
            {texts.DELIVERY.deliveryPage.backButton}
          </button>
          <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
            {texts.DELIVERY.deliveryPage.title}
          </h1>
        </div>
        <div className="px-4 py-1.5 bg-orange-100 text-orange-700 font-bold rounded-full text-sm">
          {status === "ASSIGNED" && texts.DELIVERY.deliveryPage.status.ASSIGNED}
          {status === "ON_THE_WAY" &&
            texts.DELIVERY.deliveryPage.status.ON_THE_WAY}
          {status === "DELIVERED" &&
            texts.DELIVERY.deliveryPage.status.DELIVERED}
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto flex flex-col md:flex-row max-w-6xl mx-auto w-full gap-4 p-4">
        {/* Columna Izquierda: Información y Botones */}
        <div className="flex flex-col gap-4 md:w-1/3 shrink-0">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Package className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                  {delivery.storeName}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {texts.DELIVERY.deliveryPage.orderNumber}
                  {delivery.id}
                </p>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1.5">
                  {texts.DELIVERY.deliveryPage.pickup}
                </p>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-800 leading-snug">
                    {delivery.pickupLocation}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1.5">
                  {texts.DELIVERY.deliveryPage.delivery}
                </p>
                <div className="flex items-start gap-2">
                  <Navigation className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-800 font-medium leading-snug">
                    {delivery.deliveryAddress}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  <strong className="text-gray-900">
                    {texts.DELIVERY.deliveryPage.packages}
                  </strong>{" "}
                  {delivery.totalItems}
                </p>
                <p className="text-sm text-gray-600">
                  <strong className="text-gray-900">
                    {texts.DELIVERY.deliveryPage.weight}
                  </strong>{" "}
                  {delivery.totalWeight}kg
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
            <h3 className="font-bold text-gray-900 mb-2">
              {texts.DELIVERY.deliveryPage.updateStatus}
            </h3>
            <button
              onClick={() => handleUpdateStatus("ON_THE_WAY")}
              disabled={status !== "ASSIGNED"}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${status === "ASSIGNED" ? "bg-orange-700 hover:bg-orange-500 text-white shadow-sm hover:-translate-y-0.5 cursor-pointer" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            >
              <Truck className="w-5 h-5" />{" "}
              {texts.DELIVERY.deliveryPage.btnOnTheWay}
            </button>
            <button
              onClick={() => handleUpdateStatus("DELIVERED")}
              disabled={status !== "ON_THE_WAY"}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${status === "ON_THE_WAY" ? "bg-green-700 hover:bg-green-500 text-white shadow-sm hover:-translate-y-0.5 cursor-pointer" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            >
              <CheckCircle className="w-5 h-5" />{" "}
              {texts.DELIVERY.deliveryPage.btnDelivered}
            </button>
            {status === "DELIVERED" && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100 text-center animate-pulse">
                <p className="text-sm text-green-700 font-semibold">
                  {texts.DELIVERY.deliveryPage.successMessage}
                </p>
              </div>
            )}
          </div>

          {/* Información de la Ruta en Vivo (Solo visible EN CAMINO) */}
          {status === "ON_THE_WAY" && routeInfo && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm flex items-start gap-3 mt-auto md:mt-0">
              <Navigation className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h3 className="text-sm font-bold text-blue-800 mb-1">
                  Viaje en curso
                </h3>
                <p className="text-sm text-blue-700 leading-relaxed font-medium">
                  Estás a{" "}
                  <span className="font-bold">{routeInfo.distance} km</span> del
                  destino.
                  <br />
                  Tiempo estimado:{" "}
                  <span className="font-bold">
                    {routeInfo.duration} minutos
                  </span>
                  .
                </p>
              </div>
            </div>
          )}

          {/* Recuadro de Seguridad Vial */}
          <div className="bg-orange-100 p-4 rounded-xl border border-orange-200 shadow-sm flex items-start gap-3 mt-auto md:mt-0">
            <AlertTriangle className="w-5 h-5 text-orange-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-orange-700 mb-1">
                {texts.DELIVERY.deliveryPage.safetyTitle}
              </h3>
              <p className="text-xs text-orange-700 leading-relaxed">
                {texts.DELIVERY.deliveryPage.safetyDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Mapa */}
        <div className="flex-1 bg-gray-200 rounded-xl overflow-hidden border border-gray-300 min-h-100 md:min-h-full relative shadow-sm">
          {delivery.pickupLocation && delivery.deliveryAddress ? (
            <iframe
              title={`Ruta desde ${delivery.pickupLocation} hasta ${delivery.deliveryAddress}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://maps.google.com/maps?saddr=${encodeURIComponent(delivery.pickupLocation)}&daddr=${encodeURIComponent(delivery.deliveryAddress)}&output=embed`}
            ></iframe>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-100">
              <MapPin className="w-12 h-12 text-gray-400 mb-3" />
              <p className="font-medium">
                {texts.DELIVERY.deliveryPage.mapError}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
