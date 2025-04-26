import { useState } from "react";
import ErrorModal from "../../modals/ErrorModal";
import NotificationModal from "../../modals/NotificationModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import PaymentMethodDataGrid from "../../Components/DataGrid/PaymentMethodDataGrid";
import AddPaymentModal from "../../modals/AddPaymentModal";
import { DeletePaymentMethod, NewPaymentMethod, SavePaymentMethod } from "../../api/maintenanceapi";

const PaymentMethod = () => {
  const companyId = sessionStorage.getItem("companyId");
  const userId = sessionStorage.getItem("userId");
  const [formats, setFormats] = useState([]);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null });
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [formAction, setFormAction] = useState(null);
  const [isUpdateModelOpen, setIsUpdateModelOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAddNew = async () => {
    try {
      const data = await NewPaymentMethod({ companyId: companyId, userId: userId, id: userId });
      if (data.success) {
        setSelectedFormat(data.data)
        setFormAction("add");
        setIsUpdateModelOpen(true);
      } else throw new Error(data.errorMessage || "Failed to create new Payment Method.");
    } catch (error) {
      setErrorModal({ title: "New Payment Method Error", message: error.message });
    }


  };

  const handleOpenModal = (format, mode) => {
    setSelectedFormat(format);
    setFormAction(mode);
    setIsUpdateModelOpen(true);
  };

  const handleDeleteClick = async (id) => {
    setDeleteTarget(id);
    setConfirmModal({ isOpen: true, action: "delete" });
  };

  const confirmAction = async ({ isOpen, action, data }) => {
    setSaving(true);
    setConfirmModal({ isOpen: false, action: null });
    if (action === "delete") {
      setFormats((prev) => prev.filter((f) => f.formatId !== deleteTarget));
      try{
        const result = await DeletePaymentMethod({companyId: companyId, userId: userId, id: deleteTarget})
        if(result.success){
          setNotifyModal({ isOpen: true, message: "Payment Method deleted successfully!" });
        }else throw new Error(result.errorMessage || "Failed to delete payment method");
      }catch(error){
        setErrorModal({ title: "Delete Payment Method Error", message: error.message });
      }
     
    } else {

      try {
        const res = await SavePaymentMethod({ ...data });
        if (res.success) {
          if (formAction === "edit") {
            setNotifyModal({ isOpen: true, message: "Payment Method updated successfully!" });
          } else {
            setNotifyModal({ isOpen: true, message: "Payment Method added successfully!" });
          }
        } else throw new Error(data.errorMessage || "Failed to Save Payment Method.");

      } catch (error) {
        if (formAction === "edit") {
          setErrorModal({ title: "Update Payment Method Error", message: error.message });
        } else {
          setErrorModal({ title: "Save Payment Method Error", message: error.message });
        }
      }
      setSelectedFormat(null);
      setIsUpdateModelOpen(false);
    }
    setSaving(false);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModelOpen(false);
    setSelectedFormat(null);
  };

  const confirmationTitleMap = {
    add: "Confirm Add",
    edit: "Confirm Edit",
    delete: "Confirm Delete",
  };

  const confirmationMessageMap = {
    add: "Are you sure you want to add this payment method?",
    edit: "Are you sure you want to edit this payment method?",
    delete: "Are you sure you want to delete this payment method?",
  };

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
        onConfirm={() => confirmAction({isOpen: confirmModal.isOpen, action: confirmModal.action})}
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
      <div className="text-right p-2">
        <button
          className="bg-secondary text-white px-4 py-2 mb-2 rounded hover:bg-secondary/90 transition"
          onClick={handleAddNew}
        >
          + New
        </button>
      </div>
      <div className="mt-2 bg-white h-[72vh] rounded-lg shadow overflow-hidden">
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
