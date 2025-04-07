import { useEffect, useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import {
  GetLocationRecords,
  NewLocation,
  EditLocation,
  SaveLocation,
  DeleteLocation
} from "../../apiconfig";
import ErrorModal from "../../modals/ErrorModal";
import NotificationModal from "../../modals/NotificationModal";
import ConfirmationModal from "../../modals/ConfirmationModal";

const LocationMaintenance = () => {
  const customerId = localStorage.getItem("customerId");
  const userId = localStorage.getItem("userId");
  const locationId = localStorage.getItem("locationId");

  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null });

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
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
    fetchLocations();
  }, [pagination.currentPage]);

  const fetchLocations = async () => {
    setLoading(true);
    const offset = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const limit = pagination.itemsPerPage;

    try {
      const res = await fetch(GetLocationRecords, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: Number(customerId), keyword: "", offset, limit })
      });
      const data = await res.json();
      if (data.success) {
      const records = data.data.locationRecords || [];
      const total = data.data.totalRecords || 0;

      setLocations(records);
      setPagination((prev) => ({
        ...prev,
        totalItems: total,
       }));
      } else throw new Error(data.errorMessage || "Failed to fetch locations.");
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
      const res = await fetch(NewLocation, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: Number(customerId), userId, locationId, id: "" })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedLocation(data.data);
        setFormAction("add");
        setViewMode(false);
      } else throw new Error(data.errorMessage || "Failed to create new location.");
    } catch (error) {
      setErrorModal({ title: "New Location Error", message: error.message });
    }
  };

  const handleOpenModal = async (location, mode) => {
    if (mode === "edit") {
      try {
        const res = await fetch(EditLocation, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId: Number(customerId), userId, locationId, id: location.locationId })
        });
        const data = await res.json();
        if (data.success) {
          setSelectedLocation(data.data);
          setFormAction("edit");
          setViewMode(false);
        } else throw new Error(data.errorMessage || "Failed to fetch location data");
      } catch (error) {
        setErrorModal({ title: "Edit Error", message: error.message });
      }
    } else {
      setSelectedLocation(location);
      setViewMode(true);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
    setConfirmModal({ isOpen: true, action: "delete" });
  };

  const handleInputChange = (field, value) => {
    setSelectedLocation((prev) => ({ ...prev, [field]: value }));
  };

  const confirmAction = async () => {
    setSaving(true);
    const action = confirmModal.action;
    setConfirmModal({ isOpen: false, action: null });

    try {
      if (action === "delete") {
        const res = await fetch(DeleteLocation, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId: Number(customerId), userId, locationId, id: deleteTarget })
        });
        const data = await res.json();
        if (data.success) {
          setNotifyModal({ isOpen: true, message: "Location deleted successfully!" });
          fetchLocations();
        } else throw new Error(data.errorMessage || "Failed to delete location.");
      } else {
        const res = await fetch(SaveLocation, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionData: {
                customerId: Number(customerId),
                userId,
                locationId,
                id: selectedLocation.locationId || ""
            },
            locationId: selectedLocation.locationId,
            locationCode: selectedLocation.locationCode || "",
            description: selectedLocation.description || ""
          })
        });
        const data = await res.json();
        if (data.success) {
          setNotifyModal({ isOpen: true, message: "Location saved successfully!" });
          setSelectedLocation(null);
          fetchLocations();
        } else throw new Error(data.errorMessage || "Failed to save location.");
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
    add: "Are you sure you want to add this location?",
    edit: "Are you sure you want to edit this location?",
    delete: "Are you sure you want to delete this location?"
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
          Add Location
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
                <th className="py-3">LOCATION CODE</th>
                <th className="py-3">DESCRIPTION</th>
                <th className="py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location, index) => (
                <tr key={location.locationid} className="text-xs font-medium text-secondary border-gray-100">
                  <td className="pl-4 p-2">
                    {(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}
                  </td>
                  <td className="p-1">{location.locationCode}</td>
                  <td className="p-1">{location.description || "-"}</td>
                  <td className="p-1 flex space-x-1">
                    <button className="text-blue-600 pl-0" onClick={() => handleOpenModal(location, "view")}><Eye size={14} /></button>
                    <button className="text-yellow-500 pl-0" onClick={() => handleOpenModal(location, "edit")}><Pencil size={14} /></button>
                    <button className="text-red-500 pl-0" onClick={() => handleDeleteClick(location.locationId)}><Trash2 size={14} /></button>
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
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className={`px-2 py-1 bg-white border rounded ${
            pagination.currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"
          }`}
        >
          ←
        </button>

        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage * pagination.itemsPerPage >= pagination.totalItems}
          className={`px-2 py-1 bg-white border rounded ${
            pagination.currentPage * pagination.itemsPerPage >= pagination.totalItems
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100 cursor-pointer"
          }`}
        >
          →
        </button>
        </div>
      </div>

      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white w-fit p-6 rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto text-secondary text-xs">
            <h3 className="text-lg font-semibold mb-4">
              {viewMode ? "View Location" : formAction === "edit" ? "Edit Location" : "Add Location"}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {[
                ["Location Code", "locationCode"],
                ["Description", "description"],
              ].map(([label, key, disabled = false]) => (
                <div key={key}>
                  <label className="block">{label}</label>
                  <input
                    type="text"
                    value={selectedLocation[key] || ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    readOnly={viewMode || disabled}
                    className={`mt-1 w-full p-2 border rounded ${viewMode || disabled ? "bg-gray-100" : "bg-white"}`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              {!viewMode && (
                <button
                  className="px-4 py-1 rounded text-sm bg-green-500 text-white"
                  onClick={() => {
                    if (!selectedLocation.locationCode?.trim()) {
                      setErrorModal({ title: "Validation Error", message: "Location Code is required." });
                      return;
                    }
                    setConfirmModal({ isOpen: true, action: formAction });
                  }}
                >
                  Save
                </button>
              )}
              <button className="px-4 py-1 rounded text-sm bg-red-500 text-white" onClick={() => setSelectedLocation(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMaintenance;
