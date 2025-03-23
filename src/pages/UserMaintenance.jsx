import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { GetUsers, GetLocationRecords, GetAccessRightRecords, UpdateUser, DeleteUser, InviteUser } from "../apiconfig";
import ErrorModal from "../modals/ErrorModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import NotificationModal from "../modals/NotificationModal";
import Select from "react-select";

const UserMaintenance = () => {
  const customerId = localStorage.getItem("customerId");
  const userId = localStorage.getItem("userId");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [accessRights, setAccessRights] = useState([]);
  const [locations, setLocations] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: "", targetUser: null });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
  const [email, setEmail] = useState("");
  const [selectedAccess, setSelectedAccess] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteAccess, setInviteAccess] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });

  useEffect(() => {
    fetchUsers();
    fetchAccessRights();
    fetchLocations();
  }, [pagination.currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    const offset = (pagination.currentPage - 1) * pagination.itemsPerPage;

    const requestBody = {
      customerId: Number(customerId),
      keyword: "",
      offset,
      limit: pagination.itemsPerPage,
    };

    try {
      const response = await fetch(GetUsers, {
        method: "POST",
        headers: {
          "Accept": "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
        setPagination((prev) => ({
          ...prev,
          totalItems: data.data.length,
        }));
      } else {
        throw new Error(data.errorMessage || "Failed to fetch users.");
      }
    } catch (error) {
      setErrorModal({ title: "Fetch Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchAccessRights = async () => {

    try{
    const res = await fetch(GetAccessRightRecords, {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerId: Number(customerId), keyword: "", offset: 0, limit: 9999 }),
    });
    const data = await res.json();
    if (data.success) {
        setAccessRights(data.data)
    } else {
        throw new Error(data.errorMessage || "Failed to fetch access right.");
      }
    } catch (error) {
      setErrorModal({ title: "Fetch Error", message: error.message });
    }
  };

  const fetchLocations = async () => {
    try {
    const res = await fetch(GetLocationRecords, {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerId: Number(customerId), keyword: "", offset: 0, limit: 9999 }),
    });
    const data = await res.json();
    if (data.success) {
        setLocations(data.data)
    } else {
        throw new Error(data.errorMessage || "Failed to fetch locations.");
      }
    } catch (error) {
      setErrorModal({ title: "Fetch Error", message: error.message });
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

  const handleSave = () => setConfirmModal({ isOpen: true, type: "update", targetUser: editUser });

  const handleDelete = (user) => {
    setConfirmModal({ isOpen: true, type: "delete", targetUser: user });
  };

  const handleInvite = () => {
    setConfirmModal({ isOpen: true, type: "invite", targetUser: null });
  };

  const confirmAction = async () => {
    setLoading(true);
    const user = confirmModal.targetUser;
    setConfirmModal({ isOpen: false, type: "", targetUser: null });

    try {
      if (confirmModal.type === "update") {
        const payload = {
          customerId: Number(customerId),
          userId: user.userId,
          editorUserId: user.userId,
          accessRightId: selectedAccess?.accessRightId || null,
          locationId: selectedLocation?.locationId || null,
        };
        const response = await fetch(UpdateUser, {
          method: "POST",
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (result.success) {
          setNotifyModal({ isOpen: true, message: "User updated successfully!" });
          setEditUser(null);
          fetchUsers();
        } else {
          throw new Error(result.errorMessage || "Failed to update user.");
        }
      } else if (confirmModal.type === "delete") {
        const payload = {
          customerId: Number(customerId),
          userId: user.userId,
          id: user.userId,
          locationId: selectedLocation?.locationId || null,
        };
        const response = await fetch(DeleteUser, {
          method: "POST",
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (result.success) {
          setNotifyModal({ isOpen: true, message: "User deleted successfully!" });
          fetchUsers();
        } else {
          throw new Error(result.errorMessage || "Failed to delete user.");
        }
      }
      if (confirmModal.type === "invite") {
        const payload = {
          customerId: Number(customerId),
          editorUserId: userId,
          companyName: "",
          userName: "",
          userEmail: inviteEmail,
          userPassword: "",
          accessRightId: inviteAccess.accessRightId,
          isOwner: false,
        };
        const response = await fetch(InviteUser, {
          method: "POST",
          headers: { Accept: "text/plain", "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.text();
        if (response.ok) {
          setNotifyModal({ isOpen: true, message: `Invitation link: ${result}` });
          setShowInviteModal(false);
          setInviteEmail("");
          setInviteAccess(null);
        } else {
          throw new Error(result.errorMessage || "Failed to send invitation.");
        }
      }
    } catch (error) {
      setErrorModal({ title: "Error", message: error.message });
    } finally {
      setLoading(false);
    } 
  };

  const getAccessRightLabel = (id) => accessRights.find((r) => r.accessRightId === id)?.description || "-";
  const getLocationLabel = (id) => locations.find((l) => l.locationId === id)?.locationCode || "-";

  const openEditModal = (user, isView = false) => {
    setEditUser(user);
    setViewMode(isView);
    setEmail(user.userEmail || "");
    setSelectedAccess(accessRights.find((r) => r.accessRightId === user.accessRightId) || null);
    setSelectedLocation(locations.find((l) => l.locationId === user.locationId) || null);
  };

  const confirmationTitleMap = {
    invite: "Confirm Invitation",
    update: "Confirm Update",
    delete: "Confirm Delete",
  };

  const confirmationMessageMap = {
    invite: "Are you sure you want to invite this user?",
    update: "Are you sure you want to update this user?",
    delete: "Are you sure you want to delete this user?",
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "1px solid #ccc",
      padding: "1px",
      fontSize: "0.75rem",
      width: "100%",
      minHeight: "2.5rem",
      backgroundColor: state.isDisabled ? "#f9f9f9" : "white",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
    }),
    input: (provided) => ({
      ...provided,
      fontSize: "0.75rem",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "0.75rem",
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: "0.75rem",
      zIndex: 9999,
      position: "absolute",
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "0.75rem",
      padding: "4px 8px",
      backgroundColor: state.isSelected ? "#f0f0f0" : "#fff",
      color: state.isSelected ? "#333" : "#000",
      ":hover": {
        backgroundColor: "#e6e6e6",
      },
    }),
  };

  return (
    <div>
      <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })}/>
      <ConfirmationModal isOpen={confirmModal.isOpen} title={confirmationTitleMap[confirmModal.type] || "Confirm Action"} message={confirmationMessageMap[confirmModal.type] || "Are you sure?"} onConfirm={confirmAction} onCancel={() => setConfirmModal({ isOpen: false, type: "", targetUser: null })} 
        confirmButtonDisabled={loading}
        confirmButtonText={loading ? "Saving..." : "Yes"}
      />
      <NotificationModal isOpen={notifyModal.isOpen} message={notifyModal.message} onClose={() => setNotifyModal({ isOpen: false, message: "" })} />

      <style>
        {`
          button:hover {
            border-color: transparent !important;
          }
          button:focus, button:focus-visible {
            outline: none !important;
          }
        `}
      </style>

      <div className="text-right">
        <button
            className="bg-secondary text-white px-4 py-1 rounded text-xs hover:bg-secondary/90 transition" onClick={() => setShowInviteModal(true)}
            >
            Add User
        </button>
     </div>
      <div className="mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
        {loading ? (
          <p className="text-center py-4 text-gray-500">Loading...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 border-b-2 border-gray-100 font-bold">
              <tr className="text-left text-xs text-secondary">
                <th className="px-4 py-3">NO</th>
                <th className="px-2 py-3">USERNAME</th>
                <th className="px-2 py-3">EMAIL</th>
                <th className="px-2 py-3">USER ROLE</th>
                <th className="px-2 py-3">LOCATION CODE</th>
                <th className="px-2 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.userId} className="text-xs border-b-2 border-gray-100 font-medium text-secondary">
                <td className="pl-4 p-2">{index + 1}</td>
                <td className="p-2">{user.userName || "-"}</td>
                <td className="p-2">{user.userEmail || "-"}</td>
                <td className="p-2">{getAccessRightLabel(user.accessRightId)}</td>
                <td className="p-2">{getLocationLabel(user.locationId)}</td>
                <td className="p-2 flex space-x-2">
                    <button className="text-blue-500 bg-transparent" onClick={() => openEditModal(user, true)}>
                    <Eye size={14} />
                    </button>
                    <button className="text-yellow-500 bg-transparent" onClick={() => openEditModal(user, false)}>
                    <Pencil size={14} />
                    </button>
                    <button className="text-red-500 bg-transparent" onClick={handleDelete}>
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
            className="px-2 py-1 bg-white border rounded disabled:opacity-50 cursor-not-allowed"
          >
            ←
          </button>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage * pagination.itemsPerPage >= pagination.totalItems}
            className="px-2 py-1 bg-white border rounded disabled:opacity-50 cursor-not-allowed"
          >
            →
          </button>
        </div>
      </div>

      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-w-full text-secondary text-xs">
            <h2 className="text-lg font-semibold mb-4">{viewMode ? "View User" : "Edit User"}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Username</label>
                <div className="mt-1 p-2 bg-gray-100 rounded">{editUser.userName}</div>
              </div>
              <div>
                <label>Email</label>
                {viewMode ? (
                  <div className="mt-1 p-2 bg-gray-100 rounded">{editUser.userEmail}</div>
                ) : (
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded w-full bg-white" />
                )}
              </div>
              <div>
                <label>User Role</label>
                {viewMode ? (
                  <div className="mt-1 p-2 bg-gray-100 rounded">{getAccessRightLabel(editUser.accessRightId)}</div>
                ) : (
                  <Select value={selectedAccess} onChange={setSelectedAccess} getOptionLabel={(e) => e.description} getOptionValue={(e) => e.accessRightId} options={accessRights} styles={customStyles} />
                )}
              </div>
              <div>
                <label>Location Code</label>
                {viewMode ? (
                  <div className="mt-1 p-2 bg-gray-100 rounded">{getLocationLabel(editUser.locationId)}</div>
                ) : (
                  <Select value={selectedLocation} onChange={setSelectedLocation} getOptionLabel={(e) => e.locationCode} getOptionValue={(e) => e.locationId} options={locations} styles={customStyles} />
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              {!viewMode && (
                <button className="px-4 py-1 rounded text-sm bg-green-500 text-white" onClick={handleSave}>Save</button>
              )}
              <button className="px-4 py-1 rounded text-sm bg-red-500 text-white" onClick={() => setEditUser(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] max-w-full text-secondary text-xs">
            <h2 className="text-lg font-semibold mb-4">Invite New User</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label>Email</label>
                <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded w-full bg-white" />
              </div>
              <div>
                <label>User Role</label>
                <Select value={inviteAccess} onChange={setInviteAccess} getOptionLabel={(e) => e.description} getOptionValue={(e) => e.accessRightId} options={accessRights} styles={customStyles} />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button className="px-4 py-1 rounded text-sm bg-green-500 text-white" onClick={handleInvite}>Save</button>
              <button className="px-4 py-1 rounded text-sm bg-red-500 text-white" onClick={() => setShowInviteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMaintenance;
