// Componente rápido de Modal
const DetalleModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-amber-900">Detalles del Envío</h2>
        <p className="text-gray-600">Aquí iría la información técnica del pedido...</p>
      </div>
    </div>
  );
};

export default DetalleModal