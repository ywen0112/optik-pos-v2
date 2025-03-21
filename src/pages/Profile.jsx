import React, { useEffect, useState } from "react";
import Select from "react-select";
import { GetSpecificUser, GetLocationRecords, GetAccessRightRecords, UpdateUser, ChangePassword } from "../apiconfig";
import ErrorModal from "../modals/ErrorModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import NotificationModal from "../modals/NotificationModal";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileModal = ({ open, onClose }) => {
    const [userData, setUserData] = useState(null);
    const [originalLocation, setOriginalLocation] = useState(null);
    const [originalAccessRight, setOriginalAccessRight] = useState(null);
    const [errorModal, setErrorModal] = useState({ title: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [locationOptions, setLocationOptions] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [accessRightOptions, setAccessRightOptions] = useState([]);
    const [selectedAccessRight, setSelectedAccessRight] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showPasswordConfirmModal, setShowPasswordConfirmModal] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordNotification, setPasswordNotification] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const userId = localStorage.getItem("userId");
    const customerId = localStorage.getItem("customerId");
    const locationId = localStorage.getItem("locationId");
    const navigate = useNavigate();

    useEffect(() => {
        if (!open) return;

        const fetchUser = async () => {
        const requestBody = {
            customerId: Number(customerId),
            userId,
            locationId,
            id: userId,
        };

        try {
            setLoading(true);
            const response = await fetch(GetSpecificUser, {
            method: "POST",
            headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
            });

            const result = await response.json();
            if (result.success) {
            setUserData(result.data);

            const matchedLocation = locationOptions.find(
                (loc) => loc.value === result.data.locationId
            );
            if (matchedLocation) {
                setSelectedLocation(matchedLocation);
                setOriginalLocation(matchedLocation);
            }

            const matchedAccess = accessRightOptions.find(
                (acc) => acc.value === result.data.accessRightId
            );
            if (matchedAccess) {
                setSelectedAccessRight(matchedAccess);
                setOriginalAccessRight(matchedAccess);
                localStorage.setItem("accessRightDescription", matchedAccess.label);
            }
            } else {
            throw new Error(result.errorMessage || "Failed to fetch user");
            }
        } catch (error) {
            setErrorModal({ title: "Fetch Error", message: error.message });
        } finally {
            setLoading(false);
        }
        };

        fetchUser();
    }, [open, locationOptions, accessRightOptions]);

    useEffect(() => {
        const fetchLocations = async () => {
        const requestBody = {
            customerId: Number(customerId),
            keyword: "",
            offset: 0,
            limit: 9999,
        };

        try {
            const response = await fetch(GetLocationRecords, {
            method: "POST",
            headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
            });

            const result = await response.json();
            if (result.success) {
            const options = result.data.map((location) => ({
                value: location.locationId,
                label: location.locationCode,
            }));
            setLocationOptions(options);
            } else {
            throw new Error(result.errorMessage || "Failed to fetch locations");
            }
        } catch (error) {
            setErrorModal({ title: "Fetch Error", message: error.message });
        }
        };

        const fetchAccessRights = async () => {
        const requestBody = {
            customerId: Number(customerId),
            keyword: "",
            offset: 0,
            limit: 9999,
        };

        try {
            const response = await fetch(GetAccessRightRecords, {
            method: "POST",
            headers: {
                Accept: "text/plain",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
            });

            const result = await response.json();
            if (result.success) {
            const options = result.data.map((right) => ({
                value: right.accessRightId,
                label: right.description,
            }));
            setAccessRightOptions(options);
            } else {
            throw new Error(result.errorMessage || "Failed to fetch access rights");
            }
        } catch (error) {
            setErrorModal({ title: "Fetch Error", message: error.message });
        }
        };

        fetchLocations();
        fetchAccessRights();
    }, []);

    const handleCancelEdit = () => {
        setIsEditable(false);
        setSelectedLocation(originalLocation);
        setSelectedAccessRight(originalAccessRight);
    };

    const handleSaveConfirm = async () => {
        setConfirmLoading(true);
        try {
        const requestBody = {
            customerId: Number(customerId),
            userId: userId,
            editorUserId: userId,
            accessRightId: selectedAccessRight?.value,
            locationId: selectedLocation?.value,
        };

        const response = await fetch(UpdateUser, {
            method: "POST",
            headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();
        if (result.success) {
            setIsEditable(false);
            setOriginalAccessRight(selectedAccessRight);
            setOriginalLocation(selectedLocation);
            setShowConfirmModal(false);
            setShowNotification(true);
        } else {
            throw new Error(result.errorMessage || "Update failed");
        }
        } catch (error) {
        setErrorModal({ title: "Update Error", message: error.message });
        } finally {
        setConfirmLoading(false);
        }
    };

    const handlePasswordSave = async () => {
        setPasswordLoading(true);
            try {
            const requestBody = {
                customerId: Number(customerId),
                userName: userData.userName,
                userEmail: userData.userEmail,
                userPassword: oldPassword,
                newPassword: newPassword
            };

            const response = await fetch(ChangePassword, {
                method: "POST",
                headers: {
                Accept: "text/plain",
                "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();
            if (result.success) {
                setShowPasswordModal(false);
                setShowPasswordConfirmModal(false);
                setPasswordNotification(true);
                setOldPassword("");
                setNewPassword("");
            } else {
                setShowPasswordConfirmModal(false);
                setShowPasswordModal(false);
                throw new Error(result.errorMessage || "Failed to change password");
            }
        } catch (error) {
            setErrorModal({ title: "Change Password Error", message: error.message });
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleCancelChangePassword = () => {
        setShowPasswordModal(false);
        setOldPassword("");
        setNewPassword("");
    };

    const handleLogout = () => {
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("companies");
        localStorage.removeItem("userId");
        localStorage.removeItem("customerId");
        localStorage.removeItem("locationId");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("accessRights");
        localStorage.removeItem("selectedCompany");
        navigate("/login");
    };
    
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
        <ErrorModal
          title={errorModal.title}
          message={errorModal.message}
          onClose={() => setErrorModal({ title: "", message: "" })}
        />     
        <ConfirmationModal
            isOpen={showConfirmModal}
            title="Confirm Update"
            message="Are you sure you want to save the changes?"
            onConfirm={handleSaveConfirm}
            onCancel={() => setShowConfirmModal(false)}
            loading={confirmLoading}
        />

        <NotificationModal
            isOpen={showNotification}
            title="Update Successful"
            message="User profile has been updated successfully."
            onClose={() => setShowNotification(false)}
        />

        <div className="bg-white w-96 rounded-lg shadow-lg p-6 relative z-10">
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-500 hover:text-black text-sm bg-white"
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold mb-4 text-secondary">User Profile</h2>

          <div className="flex gap-2 mb-4">
            {isEditable ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-1 border rounded text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel Edit
                </button>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="px-4 py-1 border rounded text-sm bg-green-200 text-green-700 hover:bg-green-300"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditable(true)}
                className="px-4 py-1 border rounded text-sm bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                Edit
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center text-sm text-gray-500">Loading Profile...</div>
            ) : userData ? (
                <div className="grid grid-cols-2 gap-y-4 gap-x-1">
                <div className="text-sm font-medium text-black">Username:</div>
                <div className="text-sm text-secondary">{userData.userName}</div>

                <div className="text-sm font-medium text-black">Email:</div>
                <div className="text-sm text-secondary">{userData.userEmail}</div>

                <div className="text-sm font-medium text-black">User Role:</div>
                <div>
                    <Select
                    value={selectedAccessRight}
                    isDisabled={!isEditable}
                    options={accessRightOptions}
                    onChange={setSelectedAccessRight}
                    className="text-sm"
                    />
                </div>

                <div className="text-sm font-medium text-black">Location:</div>
                <div>
                    <Select
                    value={selectedLocation}
                    isDisabled={!isEditable}
                    options={locationOptions}
                    onChange={setSelectedLocation}
                    className="text-sm"
                    />
                </div>
                </div>
            ) : (
                <div className="text-center text-sm text-gray-500">No user data available.</div>
            )}

          <div className="mt-6 flex justify-between">
            <button
              className="text-sm text-white bg-green-500"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </button>
            <button className="text-sm text-white bg-red-500" onClick={() => setShowLogoutConfirm(true)}>Logout</button>
          </div>
        </div>
        <ConfirmationModal
            isOpen={showLogoutConfirm}
            title="Confirm Logout"
            message="Are you sure you want to logout?"
            onConfirm={handleLogout}
            onCancel={() => setShowLogoutConfirm(false)}
        />
      </div>

      <ConfirmationModal
        isOpen={showPasswordConfirmModal}
        title="Confirm Password Change"
        message="Are you sure you want to change your password?"
        onConfirm={handlePasswordSave}
        onCancel={() => setShowPasswordConfirmModal(false)}
        loading={passwordLoading}
      />

      <NotificationModal
        isOpen={passwordNotification}
        title="Password Changed"
        message="Your password has been changed successfully."
        onClose={() => setPasswordNotification(false)}
      />

      {showPasswordModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg z-20">
            <h2 className="text-lg font-semibold text-center mb-4 text-secondary">Change Password</h2>
            <div className="mb-3 relative">
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Old Password"
                className="w-full border px-3 py-2 rounded bg-white text-secondary"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <div className="absolute top-2.5 right-3 cursor-pointer bg-white text-secondary" onClick={() => setShowOldPassword(!showOldPassword)}>
                {showOldPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </div>
            </div>
            <div className="mb-4 relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                className="w-full border px-3 py-2 rounded bg-white text-secondary"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div className="absolute top-2.5 right-3 cursor-pointer bg-white text-secondary" onClick={() => setShowNewPassword(!showNewPassword)}>
                {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={handleCancelChangePassword} className="px-4 py-1 rounded bg-gray-300 text-gray-700">Cancel</button>
              <button onClick={() => setShowPasswordConfirmModal(true)} className="px-4 py-1 rounded bg-green-500 text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileModal;