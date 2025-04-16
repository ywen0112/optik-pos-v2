import { useEffect, useState } from "react";
import {
  NewCreditor,
  EditCreditor,
  SaveCreditor,
  DeleteCreditor
} from "../../apiconfig";
import ErrorModal from "../../modals/ErrorModal";
import NotificationModal from "../../modals/NotificationModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import SupplierDataGrid from "../../Components/DataGrid/SupplierDataGrid";
import AddSupplierModal from "../../modals/MasterData/Supplier/AddSupplierModal";

const CreditorMaintenance = () => {
  const customerId = localStorage.getItem("customerId");
  const userId = localStorage.getItem("userId");
  const locationId = localStorage.getItem("locationId");

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
      const res = await fetch(NewCreditor, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: Number(customerId), userId, locationId, id: "" })
      });
      const data = await res.json();
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
        const res = await fetch(EditCreditor, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId: Number(customerId), userId, locationId, id: creditor.creditorId })
        });
        const data = await res.json();
        if (data.success) {
          setSelectedCreditor(data.data);
          setFormAction("edit");
          setIsUpdateModelOpen(true);
        } else throw new Error(data.errorMessage || "Failed to fetch supplier data");
      } catch (error) {
        setErrorModal({ title: "Edit Error", message: error.message });
      }
    } else {
      setSelectedCreditor(location);
      setIsUpdateModelOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
    setConfirmModal({ isOpen: true, action: "delete" });
  };

  const confirmAction = async () => {
    setSaving(true);
    const action = confirmModal.action;
    setConfirmModal({ isOpen: false, action: null });

    try {
      if (action === "delete") {
        const res = await fetch(DeleteCreditor, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId: Number(customerId), userId, locationId, id: deleteTarget })
        });
        const data = await res.json();
        if (data.success) {
          setNotifyModal({ isOpen: true, message: "Location deleted successfully!" });
          // fetchLocations();
        } else throw new Error(data.errorMessage || "Failed to delete location.");
      } else {
        const res = await fetch(SaveCreditor, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionData: {
              customerId: Number(customerId),
              userId,
              locationId,
              id: selectedCreditor.creditorId || ""
          },
          creditorId: selectedCreditor.creditorId,
          creditorCode: selectedCreditor.creditorCode || "",
          companyName: selectedCreditor.companyName || "",
          creditorTypeId: selectedCreditor.creditorTypeId || "",
          isActive: !!selectedCreditor.isActive,
          address1: selectedCreditor.address1 || "",
          address2: selectedCreditor.address2 || "",
          address3: selectedCreditor.address3 || "",
          address4: selectedCreditor.address4 || "",
          postCode: selectedCreditor.postCode || "",
          phone1: selectedCreditor.phone1 || "",
          phone2: selectedCreditor.phone2 || "",
          mobile: selectedCreditor.mobile || ""
        })
        });
        const data = await res.json();
        if (data.success) {
          setNotifyModal({ isOpen: true, message: "Supplier saved successfully!" });
          setSelectedCreditor(null);
          // fetchLocations();
        } else throw new Error(data.errorMessage || "Failed to save supplier.");
      }
    } catch (error) {
      setErrorModal({ title: `${action === "delete" ? "Delete" : "Save"} Error`, message: error.message });
    } finally {
      setSaving(false);
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
        onConfirm={confirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, action: null })}
      />

      <AddSupplierModal
        selectedLocation={selectedCreditor}
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
            customerId={customerId}
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
