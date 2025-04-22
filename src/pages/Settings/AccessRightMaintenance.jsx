import { useEffect, useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { GetAccessRightRecords, NewAccessRight, EditAccessRight, SaveAccessRight, DeleteAccessRight } from "../../api/apiconfig";
import ErrorModal from "../../modals/ErrorModal";
import NotificationModal from "../../modals/NotificationModal";
import ConfirmationModal from "../../modals/ConfirmationModal";

const AccessRightMaintenance = () => {
  const customerId = sessionStorage.getItem("customerId");
  const userId = sessionStorage.getItem("userId");
  const locationId = sessionStorage.getItem("locationId");
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
  const [accessRights, setAccessRights] = useState([]);
  const [selectedAccessRight, setSelectedAccessRight] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formAction, setFormAction] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });


  useEffect(() => {
    fetchAccessRights();
  }, [pagination.currentPage]);


  const fetchAccessRights = async () => {
    setLoading(true);
    const offset = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const limit = pagination.itemsPerPage;

    const requestBody = {
      customerId: Number(customerId),
      keyword: "",
      offset,
      limit,
    };

    try {
      const res = await fetch(GetAccessRightRecords, {
        method: "POST",
        headers: { Accept: "text/plain", "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });
      const data = await res.json();
      if (data.success) {
        const records = data.data.accessRightsRecords || [];
        const total = data.data.totalRecords || 0;

        setAccessRights(records);
        setPagination((prev) => ({
          ...prev,
          totalItems: total,
        }));
      }
      else throw new Error(data.errorMessage || "Failed to fetch access rights.");
    } catch (error) {
      setErrorModal({ title: "Fetch Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(pagination.totalItems / pagination.itemsPerPage)) {
      setPagination((prev) => ({
        ...prev,
        currentPage: newPage,
      }));
    }
  };

  const allowOnlyModules = [
    "Dashboard",
    "Audit Logs",
    "Report",
    "Sales Invoice",
    "Open/Close Counter",
    "Cash Transactions",
    "Counter Session Inquiry",
    "Cash Transactons Inquiry"
  ];

  const handleAddNew = async () => {
    try {
      const res = await fetch(NewAccessRight, {
        method: "POST",
        headers: { Accept: "text/plain", "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(customerId),
          userId,
          locationId,
          id: ""
        })
      });
      const data = await res.json();
      if (data.success) {
        const filledData = {
          ...data.data,
          description: "",
          accessRightActions: [
            "Dashboard",
            "Audit Logs",
            "Report",
            "Sales Invoice",
            "Open/Close Counter",
            "Cash Transactions",
            "Counter Session Inquiry",
            "Cash Transactons Inquiry",
            "Purchases Invoice",
            "Stock Adjustment",
            "User Maintenance",
            "Access Right Maintenance",
            "Debtor Maintenance",
            "Creditor Maintenance",
            "Item Maintenance",
            "Member Maintenance",
            "Location Maintenance",
            "PWP Maintenance"
          ].map(module => ({ module, allow: false, view: false, add: false, edit: false, delete: false }))
        };
        console.log(data.data);
        setSelectedAccessRight(filledData);
        setViewMode(false);
        setFormAction("add");
      } else {
        throw new Error(data.errorMessage || "Failed to create new access right.");
      }
    } catch (error) {
      setErrorModal({ title: "Add Error", message: error.message });
    }
  };

  const handleOpenModal = async (accessRight, mode) => {
    if (mode === "edit") {
      try {
        const res = await fetch(EditAccessRight, {
          method: "POST",
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            customerId: Number(customerId),
            userId,
            locationId,
            id: accessRight.accessRightId
          })
        });
        const data = await res.json();
        if (data.success) {
          setSelectedAccessRight(data.data);
          setViewMode(false);
          setFormAction("edit");
        } else {
          throw new Error(data.errorMessage || "Failed to fetch access right data");
        }
      } catch (error) {
        setErrorModal({ title: "Edit Error", message: error.message });
      }
    } else {
      setSelectedAccessRight(accessRight);
      setViewMode(true);
    }
  };

  const handleCheckboxChange = (idx, actionType) => {
    const updated = { ...selectedAccessRight };
    const action = updated.accessRightActions[idx];

    if (actionType === "allow") {
      const newAllowState = !action.allow;
      action.allow = newAllowState;

      // If it's an allow-only module, update view/add/edit/delete behind the scenes
      if (allowOnlyModules.includes(action.module)) {
        action.view = newAllowState;
        action.add = newAllowState;
        action.edit = newAllowState;
        action.delete = newAllowState;
      } else {
        action.view = newAllowState;
        action.add = newAllowState;
        action.edit = newAllowState;
        action.delete = newAllowState;
      }
    } else {
      // Toggle the specific permission
      action[actionType] = !action[actionType];

      // Recalculate allow based on other permissions
      const { view, add, edit, delete: del } = action;
      action.allow = view || add || edit || del;
    }

    updated.accessRightActions[idx] = action;
    setSelectedAccessRight(updated);
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
        const res = await fetch(DeleteAccessRight, {
          method: "POST",
          headers: { Accept: "text/plain", "Content-Type": "application/json" },
          body: JSON.stringify({ customerId: Number(customerId), userId, locationId, id: deleteTarget })
        });
        const data = await res.json();
        if (data.success) {
          setNotifyModal({ isOpen: true, message: "Access Right deleted successfully!" });
          fetchAccessRights();
        } else {
          throw new Error(data.errorMessage || "Failed to delete access right.");
        }
      } else {
        const res = await fetch(SaveAccessRight, {
          method: "POST",
          headers: { Accept: "text/plain", "Content-Type": "application/json" },
          body: JSON.stringify({
            actionData: {
              customerId: Number(customerId),
              userId,
              locationId,
              id: selectedAccessRight.accessRightId || "",
            },
            accessRightId: selectedAccessRight.accessRightId || "",
            description: selectedAccessRight.description,
            accessRightActions: selectedAccessRight.accessRightActions
          })
        });
        const data = await res.json();
        if (data.success) {
          setNotifyModal({ isOpen: true, message: "Access Right saved successfully!" });
          setSelectedAccessRight(null);
          fetchAccessRights();
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

  const confirmationTitleMap = {
    add: "Confirm Add",
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
        <button
          className="bg-secondary text-white px-4 py-1 rounded text-xs hover:bg-secondary/90 transition" onClick={handleAddNew}
        >
          Add User Role
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
                <th className="py-3">USER ROLE</th>
                <th className="py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {accessRights.map((accessRight, index) => (
                <tr key={accessRight.accessRightId} className="text-xs font-medium text-secondary border-gray-100 text-secondary">
                  <td className="pl-4 p-2">
                    {(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}
                  </td>
                  <td className="p-1">{accessRight.description === "" ? "-" : accessRight.description}</td>
                  <td className="p-1 flex space-x-1">
                    <button className="text-blue-600 bg-transparent pl-0" onClick={() => handleOpenModal(accessRight, "view")}>
                      <Eye size={14} />
                    </button>
                    <button className="text-yellow-500 bg-transparent pl-0" onClick={() => handleOpenModal(accessRight, "edit")}>
                      <Pencil size={14} />
                    </button>
                    <button className="bg-transparent text-red-500 pl-0" onClick={() => handleDeleteClick(accessRight.accessRightId)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-between p-4 text-xs text-secondary mt-4">
        <span>
          Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
          {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
          {pagination.totalItems}
        </span>
        <div className="flex">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`px-2 py-1 bg-white border rounded ${pagination.currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"
              }`}
          >
            ←
          </button>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage * pagination.itemsPerPage >= pagination.totalItems}
            className={`px-2 py-1 bg-white border rounded ${pagination.currentPage * pagination.itemsPerPage >= pagination.totalItems
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100 cursor-pointer"
              }`}
          >
            →
          </button>
        </div>
      </div>

      {selectedAccessRight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto text-secondary text-xs scrollbar-hide">
            <h3 className="font-semibold mb-4">
              {viewMode
                ? "View User Role"
                : formAction === "edit"
                  ? "Edit User Role"
                  : "Add User Role"}
            </h3>
            <div className="mb-4">
              <label className="block mb-1">User Role</label>
              <input
                type="text"
                value={selectedAccessRight.description}
                readOnly={viewMode}
                onChange={handleInputChange}
                className={`mt-1 w-full p-2 border rounded ${viewMode ? "bg-gray-100" : "bg-white"}`}
              />
            </div>
            <div className="mb-2 font-semibold">Access Rights</div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Access</th>
                    <th className="p-2 text-center">Allow</th>
                    <th className="p-2 text-center">View</th>
                    <th className="p-2 text-center">Add</th>
                    <th className="p-2 text-center">Edit</th>
                    <th className="p-2 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAccessRight.accessRightActions.map((action, idx) => {
                    const isAllowOnly = allowOnlyModules.includes(action.module);
                    return (
                      <tr key={idx} className="border-t">
                        <td className="p-2">{action.module}</td>

                        <td className="p-2 text-center">
                          <label className="inline-block relative w-4 h-4">
                            <input
                              type="checkbox"
                              checked={action.allow}
                              disabled={viewMode}
                              onChange={() => handleCheckboxChange(idx, "allow")}
                              className="peer sr-only"
                            />
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center 
                              ${viewMode ? "cursor-default" : "cursor-pointer"} 
                              ${action.allow ? "bg-secondary border-secondary" : "bg-white border-gray-300"}`}
                            >
                              {action.allow && (
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
                        </td>

                        {["view", "add", "edit", "delete"].map((type) => (
                          <td key={type} className="p-2 text-center">
                            {!isAllowOnly && (
                              <label className="inline-block relative w-4 h-4">
                                <input
                                  type="checkbox"
                                  checked={action[type]}
                                  disabled={viewMode}
                                  onChange={() => handleCheckboxChange(idx, type)}
                                  className="peer sr-only"
                                />
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center 
                                  ${viewMode ? "cursor-default" : "cursor-pointer"} 
                                  ${action[type] ? "bg-secondary border-secondary" : "bg-white border-gray-300"}`}
                                >
                                  {action[type] && (
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
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                  {accessRights.length === 0 && !loading && (
                    <tr><td colSpan="3" className="text-center py-4 text-gray-500">No access rights found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              {!viewMode && (
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
              <button className="px-4 py-1 rounded text-sm bg-red-500 text-white" onClick={() => setSelectedAccessRight(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AccessRightMaintenance;
