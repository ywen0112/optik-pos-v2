import { useEffect, useState } from "react";
import {
  SaveDebtor,
  DeleteDebtor
} from "../../api/apiconfig";
import ErrorModal from "../../modals/ErrorModal";
import NotificationModal from "../../modals/NotificationModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import CustomerTableDataGrid from "../../Components/DataGrid/CustomerTableDataGrid";
import AddCustomerModal from "../../modals/MasterData/Customer/AddCustomerModal";
import { GetDebtor, NewDebtor } from "../../api/maintenanceapi";

const DebtorMaintenance = () => {
  const companyId = sessionStorage.getItem("companyId");
  const userId = sessionStorage.getItem("userId");
  const locationId = sessionStorage.getItem("locationId");

  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null });

  const [debtors, setDebtors] = useState([]);
  const [selectedDebtor, setSelectedDebtor] = useState(null);
  const [formAction, setFormAction] = useState(null);
  const [isUpdateModelOpen, setIsUpdateModelOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAddNew = async () => {
    try {
      
      const data = await NewDebtor({companyId: companyId, userId: userId, id: userId});
      if (data.success) {
        setSelectedDebtor(data.data);
        setFormAction("add");
        setIsUpdateModelOpen(true);
      } else throw new Error(data.errorMessage || "Failed to create new customer.");
    } catch (error) {
      setErrorModal({ title: "New Customer Error", message: error.message });
    }
  };

  const handleOpenModal = async (debtor, mode) => {
    if (mode === "edit") {
      try {
        
        const data = await GetDebtor({companyId:companyId, userId:userId, id:debtor.debtorId});
        if (data.success) {
          setSelectedDebtor(data.data);
          setFormAction("edit");
          setIsUpdateModelOpen(true);
        } else throw new Error(data.errorMessage || "Failed to fetch debtor data");
      } catch (error) {
        setErrorModal({ title: "Edit Error", message: error.message });
      }
    } else {
      setSelectedDebtor(debtor);
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
        const res = await fetch(DeleteDebtor, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId: Number(customerId), userId, locationId, id: deleteTarget })
        });
        const data = await res.json();
        if (data.success) {
          setNotifyModal({ isOpen: true, message: "Customer deleted successfully!" });
          // fetchLocations();
        } else throw new Error(data.errorMessage || "Failed to delete customer.");
      } else {
        const res = await fetch(SaveDebtor, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionData: {
              customerId: Number(customerId),
              userId,
              locationId,
              id: selectedDebtor.debtorId || ""
            },
            debtorId: selectedDebtor.debtorId,
            debtorCode: selectedDebtor.debtorCode || "",
            companyName: selectedDebtor.companyName || "",
            debtorTypeId: selectedDebtor.debtorTypeId || "",
            isActive: !!selectedDebtor.isActive,
            address1: selectedDebtor.address1 || "",
            address2: selectedDebtor.address2 || "",
            address3: selectedDebtor.address3 || "",
            address4: selectedDebtor.address4 || "",
            postCode: selectedDebtor.postCode || "",
            phone1: selectedDebtor.phone1 || "",
            phone2: selectedDebtor.phone2 || "",
            mobile: selectedDebtor.mobile || "",
            medicalIsDiabetes: !!selectedDebtor.medicalIsDiabetes,
            medicalIsHypertension: !!selectedDebtor.medicalIsHypertension,
            medicalOthers: selectedDebtor.medicalOthers || "",
            ocularIsSquint: !!selectedDebtor.ocularIsSquint,
            ocularIsLazyEye: !!selectedDebtor.ocularIsLazyEye,
            ocularHasSurgery: !!selectedDebtor.ocularHasSurgery,
            ocularOthers: selectedDebtor.ocularOthers || ""
          })
        });
        const data = await res.json();
        if (data.success) {
          setNotifyModal({ isOpen: true, message: "Customer saved successfully!" });
          setSelectedDebtor(null);
          // fetchLocations();
        } else throw new Error(data.errorMessage || "Failed to save customer.");
      }
    } catch (error) {
      setErrorModal({ title: `${action === "delete" ? "Delete" : "Save"} Error`, message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseUpdateModal = async () => {
    setIsUpdateModelOpen(false);
    setSelectedDebtor(null);
  };

  const confirmationTitleMap = {
    add: "Confirm Add",
    edit: "Confirm Edit",
    delete: "Confirm Delete"
  };

  const confirmationMessageMap = {
    add: "Are you sure you want to add this customer?",
    edit: "Are you sure you want to edit this customer?",
    delete: "Are you sure you want to delete this customer?"
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

      <AddCustomerModal
        selectedCustomer={selectedDebtor}
        isEdit={formAction === "edit"}
        isOpen={isUpdateModelOpen}
        onConfirm={confirmAction}
        onError={setErrorModal}
        onClose={handleCloseUpdateModal}
      />

      <div className="text-right p-2">
        <button className="bg-secondary text-white px-4 py-1 rounded hover:bg-secondary/90 transition" onClick={handleAddNew}>
          Add Customer
        </button>
      </div>

      <div className="mt-2 bg-white h-[50vh] rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="text-center py-4 text-gray-500">Loading...</p>
        ) : (
          <CustomerTableDataGrid
            vustomerRecords={debtors}
            className={"p-2"}
            companyId={companyId}
            onError={setErrorModal}
            onDelete={handleDeleteClick}
            onEdit={handleOpenModal}
          >
          </CustomerTableDataGrid>

        )}
      </div>

    </div>
  );
};

export default DebtorMaintenance;
