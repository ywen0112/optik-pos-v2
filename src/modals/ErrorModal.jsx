const ErrorModal = ({ title, message, onClose }) => {
  if (!message) return null; 
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold text-gray-900 text-center">{title || "Error"}</h2>
        <p className="mt-2 text-gray-700 text-center">{message}</p>
        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-primary text-white rounded-lg hover:bg-yellow-500 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
