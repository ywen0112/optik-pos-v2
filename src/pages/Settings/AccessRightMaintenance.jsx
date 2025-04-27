import { useState } from "react";
import { Plus } from "lucide-react";
import UserRoleTableDataGrid from "../../Components/DataGrid/Settings/UserRoleTableDataGrid";
import { EditAccessRight, SaveAccessRight, DeleteAccessRight } from "../../api/apiconfig";
import ErrorModal from "../../modals/ErrorModal";
import NotificationModal from "../../modals/NotificationModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import { DeleteUserRole, GetUserRole, NewUserRole, SaveUserRole } from "../../api/maintenanceapi";
import UserRoleDetailTableDataGrid from "../../Components/DataGrid/Settings/UserRoleDetailDataGrid";

const AccessRightMaintenance = () => {
  const companyId = sessionStorage.getItem("companyId");
  const userId = sessionStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null });
  const [formAction, setFormAction] = useState("")
 
  const [selectedAccessRight, setSelectedAccessRight] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleOpenModal = async (accessRight, mode) => {
    try {
      if (mode === "edit" || mode === "view") {

        const data = await GetUserRole({ companyId: companyId, userId: userId, id: accessRight.userRoleId });
        if (data.success) {
          setSelectedAccessRight(data.data);
          setFormAction(mode);
        } else {
          throw new Error(data.errorMessage || "Failed to fetch access right data");
        }

      } else if (mode === "new") {
        const data = await NewUserRole({ companyId: companyId, userId: userId, id: userId });
        if (data.success) {
          setSelectedAccessRight(data.data);
          setFormAction("new");
        } else {
          throw new Error(data.errorMessage || "Failed to create new access right data");
        }

      }
    } catch (error) {
      setErrorModal({ title: "Update Error", message: error.message });
    }
  };

  const handleInputChange = (e) => {
    setSelectedAccessRight({ ...selectedAccessRight, description: e.target.value });
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
        const data = await DeleteUserRole({companyId: companyId, userId: userId, id: deleteTarget});
        if (data.success) {
          setNotifyModal({ isOpen: true, message: "Access Right deleted successfully!" });
        } else {
          throw new Error(data.errorMessage || "Failed to delete access right.");
        }
      } else {
       
        const data = await SaveUserRole({...selectedAccessRight});
        if (data.success) {
          setNotifyModal({ isOpen: true, message: "Access Right saved successfully!" });
          setSelectedAccessRight(null);
        } else {
          throw new Error(data.errorMessage || "Failed to save access right.");
        }
      }
    } catch (error) {
      setErrorModal({ title: `${action === "delete" ? "Delete" : "Save"} Error`, message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDetailEdit = (e) => {
    setSelectedAccessRight(prev => ({
      ...prev,
      accessRights: prev.accessRights.map(item => 
        item.module === e.data.module
          ? { ...item, ...e.data }
          : item
      )
    }));
  };
  

  const confirmationTitleMap = {
    add: "Confirm New",
    edit: "Confirm Edit",
    delete: "Confirm Delete"
  };

  const confirmationMessageMap = {
    add: "Are you sure you want to add this user role?",
    edit: "Are you sure you want to edit this user role?",
    delete: "Are you sure you want to delete this user role?"
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
        <button className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90 transition mb-2 flex flex-row justify-self-end" onClick={ () => {handleOpenModal(null, "new")}}>
          <Plus size={20} /> New
        </button>
      </div>


      <div className="mt-2 bg-white h-[72vh] rounded-lg shadow overflow-hidden">
        <UserRoleTableDataGrid
          className={"p-2"}
          companyId={companyId}
          onError={setErrorModal}
          onDelete={handleDeleteClick}
          onEdit={handleOpenModal}
        />
      </div>



      {selectedAccessRight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto text-secondary text-xs scrollbar-hide">
            <h3 className="font-semibold mb-4">
              {formAction === "view"
                ? "View User Role"
                : formAction === "edit"
                  ? "Edit User Role"
                  : "New User Role"}

            </h3>
            <div className="mb-4">
              <label className="block mb-1">User Role</label>
              <input
                type="text"
                value={selectedAccessRight.description}
                readOnly={formAction === "view"}
                onChange={handleInputChange}
                className={`mt-1 w-full p-2 border rounded ${formAction === "view" ? "bg-gray-100" : "bg-white"}`}
              />
            </div>
            <div className="mb-2 font-semibold">Access Rights</div>
            <div className="overflow-x-auto">
             <UserRoleDetailTableDataGrid
              action={formAction}
              selectedRole={selectedAccessRight.accessRights}
              className={""}
              onEdit={handleDetailEdit}
             />
            </div>
            <div className="mt-6 flex justify-end space-x-2">
            <button className="px-4 py-1 rounded text-sm bg-red-500 text-white" onClick={() => setSelectedAccessRight(null)}>Close</button>
              {formAction !== "view" && (
                <button
                  className="px-4 py-1 rounded text-sm bg-green-500 text-white"
                  onClick={() => {
                    if (!selectedAccessRight.description.trim()) {
                      setErrorModal({
                        title: "Validation Error",
                        message: "User Role is required.",
                      });
                      return;
                    }
                    setConfirmModal({ isOpen: true, action: formAction });
                  }}
                >Save</button>
              )}
              
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AccessRightMaintenance;
