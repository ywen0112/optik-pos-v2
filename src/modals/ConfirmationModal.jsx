const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
        <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
        <div className="text-4xl mb-2 text-red-5000"> <span className="icon">❗</span></div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-gray-600 mt-2">{message}</p>
          <div className="flex justify-center gap-4 mt-4">
            <button onClick={onConfirm} className="px-6 py-1 bg-green-500 text-white rounded-md">Yes</button>
            <button onClick={onCancel} className="px-6 py-1 bg-red-500 text-white rounded-md">No</button>
          </div>
        </div>
      </div>
    );
  };

  export default ConfirmationModal;