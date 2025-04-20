import { useState, useEffect } from "react";
import ChangePasswordModal from "../modals/ChangePasswordModal";
import ErrorModal from "../modals/ErrorModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import NotificationModal from "../modals/NotificationModal";
import { ChangePassword, GetSpecificUser, SaveUserUpdate } from "../api/userapi";

const UserProfile = () => {
    const [errorModal, setErrorModal] = useState({ title: "", message: "" });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: "", targetUser: null });
    const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
    const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false)
    const [user, setUser] =  useState({userName: "", userEmail: "", userPhone: "", userRoleId: ""})
    const companyId = sessionStorage.getItem("companyId");
    const userId = sessionStorage.getItem("userId");

    const confirmationTitleMap = {
        update: "Confirm Update",
        udpatePassword: "Confirm Update Password",
    };

    const confirmationMessageMap = {
        update: "Are you sure you want to update this user?",
        updatePassword: "Are you sure you want to update password?",
    };

    useEffect(() => {
        fetchSpecificUser()
    }, [])

    const fetchSpecificUser = async () => {
        try {
            const response = await GetSpecificUser({
                companyId: companyId,
                userId: userId,
                id: userId,
            });
            if (response.success) {
                const records = response.data || [];
                setUser({userName: records.userName, userEmail: records.userEmailAddress, userPhone: "", userRoleId: records.userRoleId})
            } else {
                throw new Error(response.errorMessage || "Failed to fetch user");
            }
        } catch (error) {
            setErrorModal({ title: "Fetch Error", message: error.message });
        }

    };

    const handleChangePassword = () => {
        setOpenChangePasswordModal(true);
    };

    const closeChangePasswordModal = () => {
        setOpenChangePasswordModal(false);
    };

    const handleSaveNewPassword = (oldPassword, newPassword) => {
        setConfirmModal({isOpen: true, type: "updatePassword", targetUser: {oldPassword: oldPassword, newPassword: newPassword}})
    };

    const confirmAction = async () =>{
        setConfirmModal({ isOpen: false, type: "", targetUser: null });
        try{
            if(confirmModal.type == "update"){
                const actionData = {
                    companyId: companyId,
                    userId: userId,
                    id: userId,
                };
        
                const result = await SaveUserUpdate({
                    actionData: actionData,
                    userId: userId,
                    userName: user.userName,
                    userEmailAddress: user.userEmail,
                    userRoleId: user.userRoleId,
                });
                if(result.success){
                    setNotifyModal({isOpen:true, message: "User updated successfully!"});
                }
                else{
                    throw new Error(result.errorMessage || "Failed to update user.");
                }
            }
            else if(confirmModal.type == "updatePassword"){
                const result = await ChangePassword({
                    userId: userId,
                    userPassword: confirmModal.targetUser.oldPassword,
                    userNewPassword: confirmModal.targetUser.newPassword,
                });
                if(result.success){
                    setNotifyModal({isOpen:true, message: "User password updated successfully!"});
                }
                else{
                    throw new Error(result.errorMessage || "Failed to update user password.");
                }

            }
            
    
        }catch(error){
            setErrorModal({ title: "Error", message: error.message });
        }
        
    };

    // const handleUpdateUser = () =>{
    //     setConfirmModal({isOpen: true, type: "update", targetUser: null});
    // };

    return (
        <>
            <div className="p-6 h-full">
                <div className="grid grid-cols-1 gap-4 h-full">
                    <div className="bg-white p-10 shadow rounded w-full">
                        <div className="grid grid-cols-4 gap-2 h-max">
                            {/* <div className="col-end-5 flex flex-row-reverse">
                                <button className="bg-green-600 w-1/2 text-white" onClick={handleUpdateUser}>Save</button>
                            </div> */}

                        </div>
                        <div className="grid grid-cols-1 gap-2 h-max">
                            <div className="text-black font-extrabold text-2xl">
                                User Info
                            </div>
                        </div>
                        <div className="grid grid-cols-4 mt-4 gap-2 h-max">
                            <div className="text-black text-md">
                                User Name
                            </div>
                            <div>
                                <input
                                    type="text"
                                    disabled={true}
                                    className="bg-gray-300 text-black p-2 rounded w-full"
                                    value={user.userName}
                                    placeholder="Name."
                                    onChange={(e) => setUser({userName: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 mt-4 gap-2 h-max">
                            <div className="text-black text-md">
                                User Phone
                            </div>
                            <div>
                                <input
                                    type="tel"
                                    disabled={true}
                                    className="bg-gray-300 text-black p-2 rounded w-full"
                                    value={user.userPhone}
                                    onChange={(e) => setUser({userPhone: e.target.value})}
                                    placeholder="Phone No."
                                />
                            </div>
                        </div>
                        <div className=" mt-10 w-full h-0.5 bg-black"></div>
                        <div className="mt-10 grid grid-cols-1 gap-2 h-max">
                            <div className="text-black font-extrabold text-2xl">
                                Account Settings
                            </div>
                        </div>
                        <div className="grid grid-cols-4 mt-4 gap-2 h-max">
                            <div className="text-black text-md">
                                User Email
                            </div>
                            <div>
                                <input
                                    disabled={true}
                                    className="bg-gray-300 text-black p-2 rounded w-full"
                                    value={user.userEmail}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 mt-4 gap-2 h-max">
                            <div className="text-black text-md">
                                User Password
                            </div>
                            <div>
                                <button
                                    className="bg-red-600 w-full p-2 text-white"
                                    onClick={handleChangePassword}
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
            <ConfirmationModal isOpen={confirmModal.isOpen} title={confirmationTitleMap[confirmModal.type] || "Confirm Action"} message={confirmationMessageMap[confirmModal.type] || "Are you sure?"} onConfirm={confirmAction} onCancel={() => setConfirmModal({ isOpen: false, type: "", targetUser: null })} />
            <NotificationModal isOpen={notifyModal.isOpen} message={notifyModal.message} onClose={() => setNotifyModal({ isOpen: false, message: "" })} />
            <ChangePasswordModal isOpen={openChangePasswordModal} onCancel={closeChangePasswordModal} onSave={handleSaveNewPassword} />
        </>
    )
}

export default UserProfile