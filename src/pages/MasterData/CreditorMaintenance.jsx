import { useEffect, useState } from "react";
import ErrorModal from "../../modals/ErrorModal";
import NotificationModal from "../../modals/NotificationModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import SupplierDataGrid from "../../Components/DataGrid/SupplierDataGrid";
import AddSupplierModal from "../../modals/MasterData/Supplier/AddSupplierModal";
import { 
  NewCreditor,
  GetCreditor,
  SaveCreditor,
  DeleteCreditor
} from "../../api/maintenanceapi"

const CreditorMaintenance = () => {
  const companyId = sessionStorage.getItem("companyId");
  const userId = sessionStorage.getItem("userId");

  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null });

  const [creditors, setCreditors] = useState([]);
  const [selectedCreditor, setSelectedCreditor] = useState(null);
  const [formAction, setFormAction] = useState(null);
  const [isUpdateModelOpen, setIsUpdateModelOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAddNew = async () => {
    try {
      const data = await NewCreditor({companyId: companyId, userId: userId, id: userId});
      if (data.success) {
        setSelectedCreditor(data.data);
        setFormAction("add");
        setIsUpdateModelOpen(true);
      } else throw new Error(data.errorMessage || "Failed to create new supplier.");
    } catch (error) {
      setErrorModal({ title: "New Supplier Error", message: error.message });
    }
  };

  const handleOpenModal = async (creditor, mode) => {
    if (mode === "edit") {
      try {
        const data = await GetCreditor({companyId: companyId, userId: userId, id: creditor.creditorId});
        if (data.success) {
          setSelectedCreditor(data.data);
          setFormAction("edit");
          setIsUpdateModelOpen(true);
        } else throw new Error(data.errorMessage || "Failed to fetch supplier data");
      } catch (error) {
        setErrorModal({ title: "Edit Error", message: error.message });
      }
    } else {
      setSelectedCreditor(creditor);
      setIsUpdateModelOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
    setConfirmModal({ isOpen: true, action: "delete" });
  };

  const confirmAction = async ({action, data}) => {
    setSaving(true);
    setConfirmModal({ isOpen: false, action: null });

    try {
      if (action === "delete") {
        const data = await DeleteCreditor({companyId: companyId, userId: userId, id: deleteTarget});
        if (data.success) {
          setNotifyModal({ isOpen: true, message: "Supplier deleted successfully!" });
        } else throw new Error(data.errorMessage || "Failed to delete Supplier.");
      } else {
        const saveRes = await SaveCreditor({
          actionData: data.actionData,
          creditorId: data.creditorId,
          creditorCode: data.creditorCode,
          companyName: data.companyName,
          isActive: data.isActive,
          identityNo: data.identityNo,
          dob: data.dob,
          address: data.address,
          remark: data.remark,
          phone1: data.phone1,
          phone2: data.phone2,
          emailAddress: data.emailAddress,
        });
        if (saveRes.success) {
          setNotifyModal({ isOpen: true, message: "Supplier saved successfully!" });
          setSelectedCreditor(null);
        } else throw new Error(saveRes.errorMessage || "Failed to save supplier.");
      }
    } catch (error) {
      setErrorModal({ title: `${action === "delete" ? "Delete" : "Save"} Error`, message: error.message });
    } finally {
      setSaving(false);
      setIsUpdateModelOpen(false);
    }
  };

  const handleCloseUpdateModal = async () =>{
    setIsUpdateModelOpen(false);
    setSelectedCreditor(null);
  };

  const confirmationTitleMap = {
    add: "Confirm Add",
    edit: "Confirm Edit",
    delete: "Confirm Delete"
  };

  const confirmationMessageMap = {
    add: "Are you sure you want to add this supplier?",
    edit: "Are you sure you want to edit this supplier?",
    delete: "Are you sure you want to delete this supplier?"
  };

  return (
    <div>
      <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
      <NotificationModal isOpen={notifyModal.isOpen} message={notifyModal.message} onClose={() => setNotifyModal({ isOpen: false, message: "" })} />
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmationTitleMap[confirmModal.action]}
        message={confirmationMessageMap[confirmModal.action]}
        loading={saving}
        onConfirm={() => confirmAction({action: confirmModal.action})}
        onCancel={() => setConfirmModal({ isOpen: false, action: null })}
      />

      <AddSupplierModal
        selectedSupplier={selectedCreditor}
        isEdit={formAction === "edit"}
        isOpen={isUpdateModelOpen}
        onConfirm={confirmAction}
        onError={setErrorModal}
        onClose={handleCloseUpdateModal}
      />

      <div className="text-right p-2">
        <button className="bg-secondary text-white px-4 py-1 rounded hover:bg-secondary/90 transition" onClick={handleAddNew}>
          Add Supplier
        </button>
      </div>

      <div className="mt-2 bg-white h-[50vh] rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="text-center py-4 text-gray-500">Loading...</p>
        ) : (
          <SupplierDataGrid
            supplierRecords={creditors}
            className={"p-2"}
            companyId={companyId}
            onError={setErrorModal}
            onDelete={handleDeleteClick}
            onEdit={handleOpenModal}
          >
          </SupplierDataGrid>

        )}
      </div>

    </div>
  );
};

export default CreditorMaintenance;
