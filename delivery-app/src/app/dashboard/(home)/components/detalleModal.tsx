import { Order } from "../../../../types/index";

const DetalleModal = ({
  order,
  onClose,
  onAccept,
}: {
  order: Order;
  onClose: () => void;
  onAccept: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-amber-900">
          Detalles del Envío
        </h2>

        <div className="mb-4 space-y-1">
          <p className="text-sm text-gray-600">
            <strong>Tienda:</strong> {order.storeName}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Recogida:</strong> {order.storeAddress}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Entrega:</strong> {order.deliveryAddress}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Carga:</strong> {order.totalItems} bultos (aprox.{" "}
            {order.totalWeight}kg)
          </p>
        </div>

        {order.storeAddress && order.deliveryAddress ? (
          <div className="w-full h-80 bg-gray-200 rounded-lg overflow-hidden relative border border-gray-300">
            <iframe
              title={`Ruta desde ${order.storeAddress} hasta ${order.deliveryAddress}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://maps.google.com/maps?saddr=${encodeURIComponent(order.storeAddress)}&daddr=${encodeURIComponent(order.deliveryAddress)}&output=embed`}
            ></iframe>
          </div>
        ) : (
          <div className="bg-orange-50 text-orange-600 p-4 rounded-lg text-sm text-center">
            No hay direcciones suficientes para calcular la ruta en el mapa.
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <p className="text-sm text-gray-500 mr-auto mt-2">
            <strong>¿Desea aceptar este envío?</strong>
          </p>
          <button
            onClick={onAccept}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-sm text-sm md:text-base mt-auto cursor-pointer"
          >
            Aceptar
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleModal;
