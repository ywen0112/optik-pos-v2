const NotificationModal = ({ isOpen, title, message, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
        <div className="bg-white p-6 rounded-lg shadow-lg w-fit z-30">
          <h2 className="text-xl font-bold text-gray-900 text-center">{title || "Notification"}</h2>
          <p className="mt-2 text-gray-700 text-center">{message}</p>
          <div className="mt-4 flex justify-center">
            <button
              onClick={onClose}
              className="px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default NotificationModal;
  