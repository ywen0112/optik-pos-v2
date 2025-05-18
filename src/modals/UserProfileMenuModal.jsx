import { useNavigate } from "react-router-dom";

const UserProfileMenu = ({isOpen, afterSelect}) => {
    const navigate = useNavigate();
    if (!isOpen) return null;

    return (
        <div className="absolute right-5 mt-40 w-40 bg-white border rounded-md shadow-lg z-50">
            <ul className="py-1 text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() =>{
                    navigate("/user-profile")
                    afterSelect(false)
                }}>User Profile</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {
                    //TODO: No Function here yet awaiting discuss with Jessica
                }}>Help</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {
                    sessionStorage.clear()
                    sessionStorage.clear()
                    navigate("/login")
                }}>Logout</li>
            </ul>
        </div>
    )
}

export default UserProfileMenu