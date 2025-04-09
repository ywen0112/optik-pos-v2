import { useState } from "react";

const ChangePasswordModal = ({ isOpen, onCancel, onSave }) => {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [passwordMismatch, setPasswordMismatch] = useState(false);

    const handleNewPassword = (e) => {
        const userInput = e.target.value;
        setNewPassword(userInput);
        if (confirmNewPassword && userInput !== confirmNewPassword) {
            setPasswordMismatch(true);
        } else {
            setPasswordMismatch(false);
        }
    };

    const handleConfirmNewPassword = (e) => {
        const userInput = e.target.value;
        setConfirmNewPassword(userInput);
        if (newPassword && userInput !== newPassword) {
            setPasswordMismatch(true);
        } else {
            setPasswordMismatch(false);
        }
    };

    const CancelChangePassword = () =>{
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setPasswordMismatch(false);
        onCancel();
    };

    const SaveNewPassword = () =>{
        if(oldPassword === '' || newPassword === '' || confirmNewPassword === ''){
            return;
        }
        onSave(oldPassword, newPassword)
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setPasswordMismatch(false);
        onCancel();
    };

    

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-40">
                <div className=" h-max md:w-1/4 sm:w-3/4 p-6 bg-white">
                    <div className="text-black text-2xl">
                        Change Password
                    </div>
                    <div className="mt-4 text-black">Current Password</div>
                    <input
                        type="password"
                        className="bg-gray-300 mt-1 text-black p-2 rounded w-full"
                        value={oldPassword}
                        placeholder="Current Password"
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <div className="mt-4 text-black">New Password</div>
                    <p
                        className={`text-red-600 text-sm transition-all duration-200 ${passwordMismatch ? 'opacity-100 h-auto mt-1' : 'opacity-0 h-0 overflow-hidden'
                            }`}
                    >
                        Passwords do not match.
                    </p>
                    <input
                        type="password"
                        className="bg-gray-300 mt-1 text-black p-2 rounded w-full"
                        value={newPassword}
                        placeholder="New Password"
                        onChange={handleNewPassword}
                    />
                    <div className="mt-4 text-black">Confirm New Password</div>
                    <p
                        className={`text-red-600 text-sm transition-all duration-200 ${passwordMismatch ? 'opacity-100 h-auto mt-1' : 'opacity-0 h-0 overflow-hidden'
                            }`}
                    >
                        Passwords do not match.
                    </p>
                    <input
                        type="password"
                        className="bg-gray-300 mt-1 text-black p-2 rounded w-full"
                        value={confirmNewPassword}
                        placeholder="Retype New Password"
                        onChange={handleConfirmNewPassword}
                    />
                    <div className="grid grid-cols-2 mt-5">
                            <button className="bg-red-600 m-1 rounded" onClick={CancelChangePassword}>Cancel</button>
                            <button className="bg-primary m-1 rounded" onClick={SaveNewPassword}>Save</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangePasswordModal