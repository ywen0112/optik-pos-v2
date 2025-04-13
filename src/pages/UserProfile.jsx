import { useState } from "react";
import ChangePasswordModal from "../modals/ChangePasswordModal";

const UserProfile = () => {
    const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false)
    const [userName, setUserName] = useState("")
    const [userPhone, setUserPhone] = useState("")

    const handleChangePassword = () => {
        setOpenChangePasswordModal(true);
    };

    const closeChangePasswordModal = () =>{
        setOpenChangePasswordModal(false);
    }

    const handleSaveNewPassword = (oldPassword, newPassword) =>{
        console.log(oldPassword)
        console.log(newPassword)
    }

    return (
        <>
            <div className="p-6 h-full">
                <div className="grid grid-cols-1 gap-4 h-full">
                    <div className="bg-white p-10 shadow rounded w-full">
                        <div className="grid grid-cols-4 gap-2 h-max">
                            <div className="col-end-5 flex flex-row-reverse">
                                <button className="bg-green-600 w-1/2 text-white">Save</button>
                            </div>
                            
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
                                    disabled={false}
                                    className="bg-gray-300 text-black p-2 rounded w-full"
                                    value={userName}
                                    placeholder="Name."
                                    onChange={(e) => setUserName(e.target.value)}
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
                                    disabled={false}
                                    className="bg-gray-300 text-black p-2 rounded w-full"
                                    value={userPhone}
                                    onChange={(e) => setUserPhone(e.target.value)}
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
                                    value="User Email"
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

            <ChangePasswordModal isOpen={openChangePasswordModal} onCancel={closeChangePasswordModal} onSave={handleSaveNewPassword}/>
        </>
    )
}

export default UserProfile