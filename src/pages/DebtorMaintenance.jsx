import { useEffect, useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import {
  GetDebtorRecords,
  NewDebtor,
  EditDebtor,
  SaveDebtor,
  DeleteDebtor
} from "../apiconfig";
import ErrorModal from "../modals/ErrorModal";
import NotificationModal from "../modals/NotificationModal";
import ConfirmationModal from "../modals/ConfirmationModal";

const DebtorMaintenance = () => {
  const customerId = localStorage.getItem("customerId");
  const userId = localStorage.getItem("userId");
  const locationId = localStorage.getItem("locationId");

  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null });

  const [debtors, setDebtors] = useState([]);
  const [selectedDebtor, setSelectedDebtor] = useState(null);
  const [formAction, setFormAction] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  });

  useEffect(() => {
    fetchDebtors();
  }, [pagination.currentPage]);

  const fetchDebtors = async () => {
    setLoading(true);
    const offset = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const limit = pagination.itemsPerPage;

    try {
      const res = await fetch(GetDebtorRecords, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: Number(customerId), keyword: "", offset, limit })
      });
      const data = await res.json();
      if (data.success) {
        setDebtors(data.data);
        setPagination((prev) => ({ ...prev, totalItems: data.data.length }));
      } else throw new Error(data.errorMessage || "Failed to fetch debtors.");
    } catch (error) {
      setErrorModal({ title: "Fetch Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(pagination.totalItems / pagination.itemsPerPage)) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleAddNew = async () => {
    try {
      const res = await fetch(NewDebtor, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: Number(customerId), userId, locationId, id: "" })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedDebtor(data.data);
        setFormAction("add");
        setViewMode(false);
      } else throw new Error(data.errorMessage || "Failed to create new debtor.");
    } catch (error) {
      setErrorModal({ title: "New Debtor Error", message: error.message });
    }
  };

  const handleOpenModal = async (debtor, mode) => {
    if (mode === "edit") {
      try {
        const res = await fetch(EditDebtor, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId: Number(customerId), userId, locationId, id: debtor.debtorId })
        });
        const data = await res.json();
        if (data.success) {
          setSelectedDebtor(data.data);
          setFormAction("edit");
          setViewMode(false);
        } else throw new Error(data.errorMessage || "Failed to fetch debtor data");
      } catch (error) {
        setErrorModal({ title: "Edit Error", message: error.message });
      }
    } else {
      setSelectedDebtor(debtor);
      setViewMode(true);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
    setConfirmModal({ isOpen: true, action: "delete" });
  };

  const handleInputChange = (field, value) => {
    setSelectedDebtor((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field) => {
    setSelectedDebtor((prev) => ({ ...prev, [field]: !prev[field] }));
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
          setNotifyModal({ isOpen: true, message: "Debtor deleted successfully!" });
          fetchDebtors();
        } else throw new Error(data.errorMessage || "Failed to delete debtor.");
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
          setNotifyModal({ isOpen: true, message: "Debtor saved successfully!" });
          setSelectedDebtor(null);
          fetchDebtors();
        } else throw new Error(data.errorMessage || "Failed to save debtor.");
      }
    } catch (error) {
      setErrorModal({ title: `${action === "delete" ? "Delete" : "Save"} Error`, message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const confirmationTitleMap = {
    add: "Confirm Add",
    edit: "Confirm Edit",
    delete: "Confirm Delete"
  };

  const confirmationMessageMap = {
    add: "Are you sure you want to add this debtor?",
    edit: "Are you sure you want to edit this debtor?",
    delete: "Are you sure you want to delete this debtor?"
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

      <div className="text-right">
        <button className="bg-secondary text-white px-4 py-1 rounded text-xs hover:bg-secondary/90 transition" onClick={handleAddNew}>
          Add Debtor
        </button>
      </div>

      <div className="mt-2 bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="text-center py-4 text-gray-500">Loading...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 border-b-2 border-gray-100 font-bold text-xs text-secondary text-left">
              <tr>
                <th className="px-4 py-3">NO</th>
                <th className="py-3">DEBTOR CODE</th>
                <th className="py-3">COMPANY NAME</th>
                <th className="py-3">DEBTOR TYPE CODE</th>
                <th className="py-3">MOBILE</th>
                <th className="py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {debtors.map((debtor, index) => (
                <tr key={debtor.debtorId} className="text-xs font-medium text-secondary border-gray-100">
                  <td className="pl-4 p-2">{index + 1}</td>
                  <td className="p-1">{debtor.debtorCode}</td>
                  <td className="p-1">{debtor.companyName || "-"}</td>
                  <td className="p-1">{debtor.debtorTypeId || "-"}</td>
                  <td className="p-1">{debtor.mobile || "-"}</td>
                  <td className="p-1 flex space-x-1">
                    <button className="text-blue-600 pl-0" onClick={() => handleOpenModal(debtor, "view")}><Eye size={14} /></button>
                    <button className="text-yellow-500 pl-0" onClick={() => handleOpenModal(debtor, "edit")}><Pencil size={14} /></button>
                    <button className="text-red-500 pl-0" onClick={() => handleDeleteClick(debtor.debtorId)}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-between p-4 text-xs text-secondary mt-4">
        <span>
          Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems}
        </span>
        <div className="flex">
          <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} className="px-2 py-1 bg-white border rounded disabled:opacity-50 cursor-not-allowed">←</button>
          <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage * pagination.itemsPerPage >= pagination.totalItems} className="px-2 py-1 bg-white border rounded disabled:opacity-50 cursor-not-allowed">→</button>
        </div>
      </div>

      {selectedDebtor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white w-fit p-6 rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto text-secondary text-xs">
            <h3 className="text-lg font-semibold mb-4">
              {viewMode ? "View Debtor" : formAction === "edit" ? "Edit Debtor" : "Add Debtor"}
            </h3>

            <div className="grid grid-cols-4 gap-4">
              {[
                ["Debtor Code", "debtorCode"],
                ["Company Name", "companyName"],
                ["Debtor Type ID", "debtorTypeId"],
                ["Mobile", "mobile"],
                ["Phone 1", "phone1"],
                ["Phone 2", "phone2"],
                ["Post Code", "postCode"],
                ["Address 1", "address1"],
                ["Address 2", "address2"],
                ["Address 3", "address3"],
                ["Address 4", "address4"],
                ["Medical Others", "medicalOthers"],
                ["Ocular Others", "ocularOthers"]
              ].map(([label, key, disabled = false]) => (
                <div key={key}>
                  <label className="block">{label}</label>
                  <input
                    type="text"
                    value={selectedDebtor[key] || ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    readOnly={viewMode || disabled}
                    className={`mt-1 w-full p-2 border rounded ${viewMode || disabled ? "bg-gray-100" : "bg-white"}`}
                  />
                </div>
              ))}

                {[
                ["Is Active", "isActive"],
                ["Diabetes", "medicalIsDiabetes"],
                ["Hypertension", "medicalIsHypertension"],
                ["Squint", "ocularIsSquint"],
                ["Lazy Eye", "ocularIsLazyEye"],
                ["Had Surgery", "ocularHasSurgery"]
                ].map(([label, key]) => (
                <div key={key} className="flex items-center space-x-2 mt-2">
                    <label className="inline-block relative w-4 h-4">
                    <input
                        type="checkbox"
                        checked={!!selectedDebtor[key]}
                        disabled={viewMode}
                        onChange={() => handleCheckboxChange(key)}
                        className="peer sr-only"
                    />
                    <div
                        className={`w-4 h-4 rounded border flex items-center justify-center 
                        ${viewMode ? "cursor-default" : "cursor-pointer"} 
                        ${selectedDebtor[key] ? "bg-secondary border-secondary" : "bg-white border-gray-300"}`}
                    >
                        {selectedDebtor[key] && (
                        <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        )}
                    </div>
                    </label>
                    <label>{label}</label>
                </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              {!viewMode && (
                <button
                  className="px-4 py-1 rounded text-sm bg-green-500 text-white"
                  onClick={() => {
                    if (!selectedDebtor.debtorCode?.trim()) {
                      setErrorModal({ title: "Validation Error", message: "Debtor Code is required." });
                      return;
                    }
                    setConfirmModal({ isOpen: true, action: formAction });
                  }}
                >
                  Save
                </button>
              )}
              <button className="px-4 py-1 rounded text-sm bg-red-500 text-white" onClick={() => setSelectedDebtor(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtorMaintenance;
