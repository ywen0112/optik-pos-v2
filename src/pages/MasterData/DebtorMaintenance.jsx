import { useState } from "react";
import { Plus } from "lucide-react";
import ErrorModal from "../../modals/ErrorModal";
import NotificationModal from "../../modals/NotificationModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import CustomerTableDataGrid from "../../Components/DataGrid/CustomerTableDataGrid";
import AddCustomerModal from "../../modals/MasterData/Customer/AddCustomerModal";
import { GetDebtor, NewDebtor, SaveDebtor, DeleteDebtor } from "../../api/maintenanceapi";

const DebtorMaintenance = () => {
  const companyId = sessionStorage.getItem("companyId");
  const userId = sessionStorage.getItem("userId");

  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null });

  const [selectedDebtor, setSelectedDebtor] = useState(null);
  const [formAction, setFormAction] = useState(null);
  const [isUpdateModelOpen, setIsUpdateModelOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAddNew = async () => {
    setLoading(true);
    try {
      const data = await NewDebtor({companyId: companyId, userId: userId, id: userId});
      if (data.success) {
        setSelectedDebtor(data.data);
        setFormAction("add");
        setIsUpdateModelOpen(true);
      } else throw new Error(data.errorMessage || "Failed to create new customer.");
    } catch (error) {
      setErrorModal({ title: "New Customer Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async (debtor, mode) => {
    if (mode === "edit") {
      setLoading(true);
      try {
        const data = await GetDebtor({companyId: companyId, userId: userId, id: debtor.debtorId});
        if (data.success) {
          setSelectedDebtor(data.data);
          setFormAction("edit");
          setIsUpdateModelOpen(true);
        } else throw new Error(data.errorMessage || "Failed to fetch debtor data");
      } catch (error) {
        setErrorModal({ title: "Edit Error", message: error.message });
      } finally {
        setLoading(false);
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

  const confirmAction = async ({action, data}) => {
    setSaving(true);
    setConfirmModal({ isOpen: false, action: null });

    try {
      if (action === "delete") {
        const data = await DeleteDebtor({companyId: companyId, userId: userId, id: deleteTarget})
        if (data.success) {
          setNotifyModal({ isOpen: true, message: "Customer deleted successfully!" });
        } else throw new Error(data.errorMessage || "Failed to delete customer.");
      } else {
        console.log(data.actionData)
        const saveRes = await SaveDebtor ({
          actionData: data.actionData,
          debtorId: data.debtorId,
          debtorCode: data.debtorCode,
          companyName: data.companyName,
          isActive: data.isActive,
          identityNo: data.identityNo,
          dob: data.dob || null,
          address: data.address,
          remark: data.remark,
          phone1: data.phone1,
          phone2: data.phone2,
          emailAddress: data.emailAddress,
          medicalIsDiabetes: data.medicalIsDiabetes,
          medicalIsHypertension: data.medicalIsHypertension,
          medicalOthers: data.medicalOthers,
          ocularIsSquint: data.ocularIsSquint,
          ocularIsLazyEye: data.ocularIsLazyEye,
          ocularHasSurgery: data.ocularHasSurgery,
          ocularOthers: data.ocularOthers,
        });
        if (saveRes.success) {
          setNotifyModal({ isOpen: true, message: "Customer saved successfully!" });
          setSelectedDebtor(null);
        } else throw new Error(saveRes.errorMessage || "Failed to save customer.");
      }
    } catch (error) {
      setErrorModal({ title: `${action === "delete" ? "Delete" : "Save"} Error`, message: error.message });
    } finally {
      setSaving(false);
      setIsUpdateModelOpen(false);
    }
  };

  const handleCloseUpdateModal = async () => {
    setIsUpdateModelOpen(false);
    setSelectedDebtor(null);
  };

  const confirmationTitleMap = {
    add: "Confirm New",
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
        onConfirm={() => confirmAction({action: confirmModal.action})}
        onCancel={() => setConfirmModal({ isOpen: false, action: null })}
      />

      <AddCustomerModal
        selectedCustomer={selectedDebtor}
        isEdit={formAction === "edit"}
        isOpen={isUpdateModelOpen}
        onConfirm={confirmAction}
        onError={setErrorModal}
        onClose={handleCloseUpdateModal}
        companyId={companyId}
        userId={userId}
      />

      <div className="text-right p-2">
      <button className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90 transition mb-2 flex flex-row justify-self-end" onClick={handleAddNew}>
          <Plus size={20}/> New
        </button>
      </div>

      <div className="mt-2 bg-white h-[72vh] rounded-lg shadow overflow-hidden">
      
          <CustomerTableDataGrid
            className={"p-2"}
            companyId={companyId}
            onError={setErrorModal}
            onDelete={handleDeleteClick}
            onEdit={handleOpenModal}
          >
          </CustomerTableDataGrid>

      </div>

    </div>
  );
};

export default DebtorMaintenance;
