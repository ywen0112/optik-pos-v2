import { useState } from "react";
import ErrorModal from "../../modals/ErrorModal";
import NotificationModal from "../../modals/NotificationModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import PaymentMethodDataGrid from "../../Components/DataGrid/PaymentMethodDataGrid";
// import AddPaymentModal from "../../modals/Transacti";
import { Plus } from "lucide-react";

const PaymentMethod = () => {
  return (
    <div>
      <ErrorModal
        title={errorModal.title}
        message={errorModal.message}
        onClose={() => setErrorModal({ title: "", message: "" })}
      />
      <NotificationModal
        isOpen={notifyModal.isOpen}
        message={notifyModal.message}
        onClose={() => setNotifyModal({ isOpen: false, message: "" })}
      />
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmationTitleMap[confirmModal.action]}
        message={confirmationMessageMap[confirmModal.action]}
        loading={saving}
        onConfirm={confirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, action: null })}
      />
      <AddPaymentModal
        selectedPayment={selectedFormat}
        isEdit={formAction === "edit"}
        isOpen={isUpdateModelOpen}
        onConfirm={confirmAction}
        onError={setErrorModal}
        onClose={handleCloseUpdateModal}
      />
      <div className="p-2 flex justify-end">
        <button
          className="bg-secondary text-white px-4 py-1 rounded hover:bg-secondary/90 transition flex flex-row"
          onClick={handleAddNew}
        >
          <Plus size={24}/> <span className="mt-1 text-[15px]">New</span>
        </button>
      </div>
      <div className="mt-2 bg-white h-[61.7vh] rounded-lg shadow overflow-hidden">
        <PaymentMethodDataGrid
          methodRecords={formats}
          className="p-2"
          onError={setErrorModal}
          onDelete={handleDeleteClick}
          onEdit={handleOpenModal}
        />
      </div>
    </div>
  );
};

export default PaymentMethod;
