import React, { useCallback, useState } from "react";
import ErrorModal from "../../modals/ErrorModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import NotificationModal from "../../modals/NotificationModal";
import { SaveUserUpdate, InviteUser, DeleteUser } from "../../api/userapi";
import UserDataGrid from "../../Components/DataGrid/UserDataGrid";
import CustomStore from 'devextreme/data/custom_store';
import { X, Plus } from 'lucide-react';
import { getInfoLookUp } from "../../api/infolookupapi";
import { GetUserRole } from "../../api/maintenanceapi";
import { DropDownBox } from "devextreme-react";
import DataGrid, {
  Selection,
  Paging,
  Scrolling,
  SearchPanel,
  Column
} from "devextreme-react/data-grid";

const UserMaintenance = () => {
  const companyId = sessionStorage.getItem("companyId");
  const userId = sessionStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [editUser, setEditUser] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: "", targetUser: null });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [isUserRoleBoxOpened, setIsUserRoleBoxOpened] = useState(false);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

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

        const actionData = {
          companyId: companyId,
          userId: userId,
          id: user.userId,
        };

        const result = await SaveUserUpdate({
          actionData: actionData,
          userId: user.userId,
          userName: user.userName,
          userEmailAddress: user.userEmailAddress,
          userRoleId: user.userRoleId,
        });
        if (result.success) {
          setNotifyModal({ isOpen: true, message: "User updated successfully!" });
          setEditUser(null);
        } else {
          throw new Error(result.errorMessage || "Failed to update user.");
        }
      } else if (confirmModal.type === "delete") {
        const result = await DeleteUser({
          companyId: companyId,
          userId: userId,
          id: user.userId,
        });
        if (result.success) {
          setNotifyModal({ isOpen: true, message: "User deleted successfully!" });
        } else {
          throw new Error(result.errorMessage || "Failed to delete user.");
        }
      }
      if (confirmModal.type === "invite") {
        const result = await InviteUser({
          companyId: companyId,
          userId: userId,
          userEmailAddress: inviteEmail,
        });

        if (result.success) {
          setNotifyModal({ isOpen: true, message: `Invitation link: ${result.errorMessage}` });
          setShowInviteModal(false);
          setInviteEmail("");
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

  const userRoleStore = new CustomStore({
    key: "userRoleId",
    load: async (loadOptions) => {
      const filter = loadOptions.filter;
      let keyword = filter?.[2]?.[2] || "";

      const params = {
        keyword: keyword || "",
        offset: loadOptions.skip,
        limit: loadOptions.take,
        type: "user_role",
        companyId,
      };
      const res = await getInfoLookUp(params);

      const filteredData = res.data.filter(
        (item) => item.userRoleCode !== "SUPER ADMIN"
      );

      return {
        data: filteredData,
        totalCount: loadOptions.skip + res.data.count,
      }
    },
    byKey: async (key) => {
      const res = await GetUserRole({
        companyId,
        userId,
        id: key
      });
      return res.data;
    }
  })

  const userRoleDataGridOnSelectionChanged = useCallback((e) => {
    const selected = e.selectedRowsData?.[0];
    if (selected) {
      setEditUser(prev => ({
        ...prev,
        userRoleId: selected.userRoleId
      }));
      
      setUserRole(selected);
      setIsUserRoleBoxOpened(false);
    }
  }, []);

  const userRoleGridBoxRender = useCallback(() => (
    <DataGrid
      dataSource={userRoleStore}
      showBorders={true}
      hoverStateEnabled={true}
      selectedRowKeys={userRole?.userRoleId}
      onSelectionChanged={userRoleDataGridOnSelectionChanged}
      height="100%"
      remoteOperations={{
        paging: true,
        filtering: true,
      }}
    >
      <Selection mode="single" />
      <Scrolling mode="infinite" />
      <Paging enabled pageSize={5} />
      <SearchPanel visible={true} highlightSearchText />
      <Column dataField="userRoleCode" caption="Code" />
      <Column dataField="description" caption="Desc" />

    </DataGrid>
  ), [userRole, userRoleDataGridOnSelectionChanged]);

  const handleUserRoleGridBoxValueChanges = (e) => {
    if (!e.value) {
      setUserRole(null)
    }
    console.log(editUser)
  }

  const onUserRoleGridBoxOpened = useCallback((e) => {
    if (e.name === 'opened') {
      setIsUserRoleBoxOpened(e.value);
    }
  }, [])

  const openEditModal = (user, isView = false) => {
    setEditUser(user);
    setViewMode(isView);
    setEmail(user.userEmail || "");
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

  return (
    <div>
      <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
      <ConfirmationModal isOpen={confirmModal.isOpen} title={confirmationTitleMap[confirmModal.type] || "Confirm Action"} message={confirmationMessageMap[confirmModal.type] || "Are you sure?"} onConfirm={confirmAction} onCancel={() => setConfirmModal({ isOpen: false, type: "", targetUser: null })} />
      <NotificationModal isOpen={notifyModal.isOpen} message={notifyModal.message} onClose={() => setNotifyModal({ isOpen: false, message: "" })} />
      <div className="text-right p-2">
        
        <button className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90 transition mb-2 flex flex-row justify-self-end" onClick={() => setShowInviteModal(true)}>
          <Plus size={20}/> New
        </button>
      </div>
      <div className="mt-2 bg-white h-[72vh] rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="text-center py-4 text-gray-500">Loading...</p>
        ) : (
          <UserDataGrid
            className={"p-2"}
            companyId={companyId}
            onError={setErrorModal}
            onDelete={handleDelete}
            onEdit={openEditModal}
          >
          </UserDataGrid>
        )}
      </div>

      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-w-full text-secondary text-xs">
            <div className="flex flex-row justify-between">
              <h3 className="font-semibold mb-4">
                Edit User
              </h3>
              <div className='col-span-4' onClick={() => setEditUser(null)}>
                <X size={20} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="col-span-2 mt-2">
                <label className="block mb-2">Username</label>
                <input
                  type="text"
                  className="mr-2 border w-full h-[40px] px-2 bg-gray-200"
                  placeholder="Username"
                  value={editUser.userName}
                  readOnly
                />
              </div>

              <div className="col-span-2 mt-2">
                <label className="block mb-2">User Role</label>
                <DropDownBox
                  id="UserRoleSelection"
                  value={userRole?.userRoleId}
                  placeholder="User Role"
                  openOnFieldClick={true}
                  displayExpr={(item) => item && `${item.userRoleCode}-${item.description}`}
                  onValueChanged={handleUserRoleGridBoxValueChanges}
                  valueExpr="userRoleId"
                  opened={isUserRoleBoxOpened}
                  onOptionChanged={onUserRoleGridBoxOpened}
                  contentRender={userRoleGridBoxRender}
                  className="mr-2 border w-full h-[40px] px-2"
                  dataSource={userRoleStore}

                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button className="bg-red-600 text-white w-36 px-4 py-2 rounded hover:bg-red-700"
                onClick={() => {
                  setEditUser(null)
                  setUserRole(null)
                }}>Cancel</button>
              <button className="bg-primary text-white w-36 px-4 py-2 rounded hover:bg-primary/90"
                onClick={() => {
                  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                  if (!editUser.userEmailAddress.trim()) {
                    setErrorModal({ title: "Validation Error", message: "Email is required." });
                    return;
                  }

                  if (!emailPattern.test(editUser.userEmailAddress)) {
                    setErrorModal({ title: "Validation Error", message: "Invalid email format." });
                    return;
                  }
                  handleSave();
                  setUserRole(null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-y-auto text-secondary">
            <div className="flex flex-row justify-between">
              <h3 className="font-semibold mb-4">
                Invite New User
              </h3>
              <div className='col-span-4' onClick={() => setShowInviteModal(false)}>
                <X size={20} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-1">
              <div>
                <label className="block mb-2">Email</label>
                <input type="text" placeholder="Email"
                  value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
                  className="mr-2 border w-full h-[40px] px-2" />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button className="bg-red-600 text-white w-36 px-4 py-2 rounded hover:bg-red-700"
                onClick={() => setShowInviteModal(false)}>Cancel</button>
              <button className="bg-primary text-white w-36 px-4 py-2 rounded hover:bg-primary/90"
                onClick={() => {
                  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                  if (!inviteEmail.trim()) {
                    setErrorModal({ title: "Validation Error", message: "Email is required." });
                    return;
                  }

                  if (!emailPattern.test(inviteEmail)) {
                    setErrorModal({ title: "Validation Error", message: "Invalid email format." });
                    return;
                  }

                  handleInvite();
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default UserMaintenance;
