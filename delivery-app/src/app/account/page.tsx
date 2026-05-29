"use client";

import { useState, useEffect } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Package, Wallet, Edit2, Save, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";
import PayoutTabs from "./components/payoutTabs";
import DeliveryTab from "./components/deliveryTab";
import ProtectByRole from "./components/protectByRole";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Estado para los datos del perfil editables
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    vehicle: "",
    email: "",
  });

  // Estados para los datos de los historiales
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [payouts, setPayouts] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [earnings, setEarnings] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deliveries, setDeliveries] = useState<any[]>([]);

  // Sincronizar datos de Clerk evitando el setState síncrono dentro de useEffect
  // Esto actualiza el estado derivado en la fase de renderizado y previene "cascading renders"
  const [prevUserId, setPrevUserId] = useState<string | undefined>(undefined);
  if (isLoaded && user && user.id !== prevUserId) {
    setPrevUserId(user.id);
    setProfileData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.primaryPhoneNumber?.phoneNumber || "",
      vehicle: "",
      email: user.primaryEmailAddress?.emailAddress || "",
    });
  }

  // Fetch de historiales cuando se cambia de tab
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      try {
        const res = await fetch("/api/account/profile");
        if (!res.ok) return;
        const data = await res.json();
        setProfileData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          vehicle: data.vehicle || "",
          email: data.email || "",
        });
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      }
    }

    async function fetchData() {
      if (!user) return;
      try {
        if (activeTab === "payouts") {
          // Llamada real a tu API de Payouts (que actualmente devuelve mocks)
          const resPayout = await fetch(
            `/api/payments/payouts?recipientId=${user.id}&recipientType=DELIVERY`,
          );
          if (resPayout.ok) {
            const data = await resPayout.json();
            setPayouts(data);
          }

          const resEarnings = await fetch(
            `/api/payments/earnings?recipientId=${user.id}&recipientType=DELIVERY`,
          );
          if (resEarnings.ok) {
            const data = await resEarnings.json();

            setEarnings([
              {
                id: `earn_${user.id}`,
                amount: data.totalEarnings,
                date: "",
                description: "Ganancias totales",
              },
            ]);
          }
        }

        if (activeTab === "deliveries") {
          // Llamar API deliveries (que también lee la BD) para obtener los envíos reales del repartidor
          const res = await fetch(`/api/delivery?userId=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setDeliveries(data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingData(false);
      }
    }

    if (isLoaded && user) {
      fetchProfile();
    }

    if (activeTab !== "profile") {
      fetchData();
    }
  }, [activeTab, user, isLoaded]);

  const handleSaveProfile = async () => {
    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "No se pudo actualizar el perfil.");
      }

      setIsEditing(false);
      alert("¡Perfil actualizado con éxito!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error al guardar perfil:", error);
      alert(error?.message || "Error al actualizar el perfil.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleExit = () => {
    const role = user?.publicMetadata?.role;

    // Forzamos una redirección limpia hacia adelante, rompiendo la pila vieja
    if (role === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={handleExit}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="w-10 h-10 overflow-hidden rounded-md bg-orange-100 flex items-center justify-center">
              <User className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">Mi Perfil</p>
            </div>
          </div>
          <SignOutButton>
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer">
              Salir
            </button>
          </SignOutButton>
        </div>
      </header>

      <main className="px-4 py-6 max-w-4xl mx-auto">
        <ProtectByRole allowedRoles={["delivery"]}>
          {/* Tabs de navegación */}
          <div className="flex justify-center overflow-x-auto border-b border-gray-200 mb-6 hide-scrollbar gap-2">
            {[
              { id: "profile", label: "Datos Personales", icon: User },
              { id: "deliveries", label: "Mis Envíos", icon: Package },
              { id: "payouts", label: "Payouts", icon: Wallet },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== "profile") setLoadingData(true);
                }}
                className={`flex items-center gap-2 whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600 bg-orange-50 rounded-t-lg"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-t-lg"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </ProtectByRole>

        {/* Contenido de los Tabs */}
        <div className="space-y-4">
          {/* TAB: PERFIL */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Información Personal
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-orange-500 hover:text-orange-600 flex items-center gap-1 text-sm font-semibold bg-orange-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" /> Editar
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm font-semibold bg-gray-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" /> Cancelar
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="text-white bg-orange-500 hover:bg-orange-600 flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> Guardar
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full h-10 px-3 rounded-lg border text-sm ${isEditing ? "border-orange-300 focus:ring-2 focus:ring-orange-200 outline-none bg-white" : "border-transparent bg-gray-50 text-gray-600"} transition-all`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full h-10 px-3 rounded-lg border text-sm ${isEditing ? "border-orange-300 focus:ring-2 focus:ring-orange-200 outline-none bg-white" : "border-transparent bg-gray-50 text-gray-600"} transition-all`}
                  />
                </div>
                <ProtectByRole allowedRoles={["delivery"]}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehículo
                    </label>
                    <Select
                      value={profileData.vehicle}
                      onValueChange={(value) =>
                        setProfileData({ ...profileData, vehicle: value })
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger
                        size="lg"
                        className={`w-full h-10 px-3 rounded-lg cursor-pointer ${
                          isEditing
                            ? "border-orange-300 bg-white text-gray-700 transition-all hover:border-orange-400 focus:ring-2 focus:ring-orange-400"
                            : "border-transparent bg-gray-50 text-gray-600"
                        }`}
                      >
                        <SelectValue placeholder="Selecciona un vehículo" />
                      </SelectTrigger>

                      <SelectContent
                        position="popper"
                        className="rounded-xl border-orange-100 shadow-lg"
                      >
                        <SelectItem
                          value="BICYCLE"
                          className="focus:bg-orange-50 focus:text-orange-600 cursor-pointer"
                        >
                          Bicicleta
                        </SelectItem>
                        <SelectItem
                          value="MOTORBIKE"
                          className="focus:bg-orange-50 focus:text-orange-600 cursor-pointer"
                        >
                          Moto
                        </SelectItem>
                        <SelectItem
                          value="CAR"
                          className="focus:bg-orange-50 focus:text-orange-600 cursor-pointer"
                        >
                          Auto
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </ProtectByRole>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mail asociado a la cuenta
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={true}
                    className={`w-full h-10 px-3 rounded-lg border text-sm border-transparent bg-gray-50 text-gray-600 transition-all`}
                  />
                </div>
              </div>

              <div className="mt-8 border-t pt-6">
                <p className="text-sm text-gray-600 mb-4">
                  Gestión de la seguridad y contraseña:
                </p>

                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => router.push("/account/security")}
                >
                  Seguridad de la cuenta
                </Button>
              </div>
            </div>
          )}

          <ProtectByRole allowedRoles={["delivery"]}>
            {/* LOADER GENÉRICO PARA LOS TABS DE HISTORIAL */}
            {loadingData && activeTab !== "profile" && (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            )}

            {/* TAB: PAYOUTS y EARNINGS (Conectado a la API) */}
            {!loadingData && activeTab === "payouts" && (
              <PayoutTabs payouts={payouts} earnings={earnings} />
            )}

            {/* TAB: HISTORIAL DE ENVÍOS */}
            {!loadingData && activeTab === "deliveries" && (
              <DeliveryTab deliveries={deliveries} />
            )}
          </ProtectByRole>
        </div>
      </main>
    </div>
  );
}
