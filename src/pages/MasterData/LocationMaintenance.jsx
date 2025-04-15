import { useEffect, useState } from "react";
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
import LocationDataGrid from "../../Components/DataGrid/LocationDataGrid";
import UpdatelocationModal from "../../modals/MasterData/Location/AddLocationModal";

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
  const [isUpdateModelOpen, setIsUpdateModelOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);


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
        setIsUpdateModelOpen(true);
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
          setIsUpdateModelOpen(true);
        } else throw new Error(data.errorMessage || "Failed to fetch location data");
      } catch (error) {
        setErrorModal({ title: "Edit Error", message: error.message });
      }
    } else {
      setSelectedLocation(location);
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

  const handleCloseUpdateModal = async () =>{
    setIsUpdateModelOpen(false);
    setSelectedLocation(null);
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

      <UpdatelocationModal
        selectedLocation={selectedLocation}
        isEdit={formAction === "edit"}
        Open={isUpdateModelOpen}
        onConfirm={confirmAction}
        onError={setErrorModal}
        onClose={handleCloseUpdateModal}
      />

      <div className="text-right p-2">
        <button className="bg-secondary text-white px-4 py-1 rounded hover:bg-secondary/90 transition" onClick={handleAddNew}>
          Add Location
        </button>
      </div>

      <div className="mt-2 bg-white h-[50vh] rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="text-center py-4 text-gray-500">Loading...</p>
        ) : (
          <LocationDataGrid
            locationRecords={locations}
            className={"p-2"}
            customerId={customerId}
            onError={setErrorModal}
            onDelete={handleDeleteClick}
            onEdit={handleOpenModal}
          >

          </LocationDataGrid>

        )}
      </div>

    </div>
  );
};

export default LocationMaintenance;
