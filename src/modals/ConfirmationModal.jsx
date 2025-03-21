const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, loading = false, confirmButtonText = "Yes", }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-40">
        <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center z-40">
        <div className="text-4xl mb-2 text-red-5000"> <span className="icon">❗</span></div>
          <h2 className="text-lg font-semibold text-secondary">{title}</h2>
          <p className="text-sm text-gray-600 mt-2">{message}</p>
          <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onConfirm}
            className={`px-6 py-1 rounded-md text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmButtonText}
          </button>
          <button onClick={onCancel} className="px-6 py-1 bg-red-500 text-white rounded-md">No</button>
          </div>
        </div>
      </div>
    );
  };

  export default ConfirmationModal;