import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { EditCompany, SaveCompany } from "../apiconfig";
import ConfirmationModal from "../modals/ConfirmationModal";
import ErrorModal from "../modals/ErrorModal";
import NotificationModal from "../modals/NotificationModal";

const CompanyProfile = () => {
  const location = useLocation();
  const company = location.state?.company;
  const [initialCompany, setInitialCompany] = useState(company);
  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [notificationModal, setNotificationModal] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => {
    setEditData(company);
  }, [company]);

  if (!company) {
    return <div className="p-4 text-center text-red-500">No company data available.</div>;
  }

  const handleEditClick = async () => {
    try {
      const customerId = localStorage.getItem("customerId");
      const userId = localStorage.getItem("userId");
      const locationId = localStorage.getItem("locationId");

      const response = await fetch(EditCompany, {
        method: "POST",
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId: Number(customerId), userId, locationId, id: "" }),
      });

      const data = await response.json();

      if (data.success) {
        setEditData(data.data);
        setIsEditing(true);
      } else {
        throw new Error(data.errorMessage || "Failed to enter edit mode.");
      }
    } catch (error) {
      setErrorModal({ title: "Edit Error", message: error.message });
    }
  };

  const handleCancelEdit = () => {
    setEditData(initialCompany);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setShowConfirm(true);
  };

  const confirmSave = async () => {
    setConfirmLoading(true);
    try {
      const response = await fetch(SaveCompany, {
        method: "POST",
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.errorMessage || "Failed to save company info.");
      }
      setNotificationModal({ isOpen: true, title: "Success", message: "Company info saved successfully." });
      setIsEditing(false);
      setInitialCompany(editData);
    } catch (error) {
      setErrorModal({ title: "Save Error", message: error.message });
    } finally {
      setConfirmLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="flex justify-center h-fit w-full bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm text-secondary">
          {[
            "registrationNo",
            "phone1",
            "phone2",
            "fax",
            "email",
            "address",
            "postcode",
            "city",
            "state",
            "country",
          ].map((field) => (
            <div key={field}>
              <strong className="capitalize">{field.replace(/([A-Z])/g, ' $1')}:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name={field}
                  value={editData[field] || ""}
                  onChange={handleChange}
                  className="w-full mt-1 p-1 border rounded bg-white"
                />
              ) : (
                <div>{initialCompany[field] || "N/A"}</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          {!isEditing ? (
            <button onClick={handleEditClick} className="px-4 py-1 border rounded text-sm bg-blue-100 text-blue-700 hover:bg-blue-200">Edit</button>
          ) : (
            <>
              <button onClick={handleCancelEdit} className="px-4 py-1 border rounded text-sm bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel Edit</button>
              <button onClick={handleSave} className="px-4 py-1 border rounded text-sm bg-green-200 text-green-700 hover:bg-green-300">Save</button>
            </>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        title="Confirm Save"
        message="Are you sure you want to save these changes?"
        onConfirm={confirmSave}
        onCancel={() => setShowConfirm(false)}
        loading={confirmLoading}
      />

      <ErrorModal
        title={errorModal.title}
        message={errorModal.message}
        onClose={() => setErrorModal({ title: "", message: "" })}
      />

      <NotificationModal
        isOpen={notificationModal.isOpen}
        title={notificationModal.title}
        message={notificationModal.message}
        onClose={() => setNotificationModal({ isOpen: false, title: "", message: "" })}
      />
    </div>
  );
};

export default CompanyProfile;