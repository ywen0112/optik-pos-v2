import { useState } from "react";
import { User, Menu, LayoutDashboard, Settings } from "lucide-react";
import Profile from "../pages/Profile";
import UserProfileMenu from "../modals/UserProfileMenuModal";

const HeaderBar = ({ currentPage, onToggleSidebar }) => {
  const [showProfileMenu, setProfileMenu] = useState(false);
  const [showMasterMaintenanceMenu, setMasterMaintenanceMenu] = useState(false)

  return (
    <div className="w-full min-h-12 bg-white flex justify-between items-center px-8 shadow-md">
      <div className="flex items-center">
        <Menu
          className="text-secondary w-6 h-6 cursor-pointer mr-4"
          title="Toggle Sidebar"
          onClick={onToggleSidebar}
        />
        <div className="px-4 text-2xl font-bold text-secondary">{currentPage}</div>
      </div>

      <div className="flex items-center space-x-6 ml-auto">
        <LayoutDashboard
          className="text-secondary w-6 h-6 cursor-pointer"
          onClick={() =>{
            setMasterMaintenanceMenu(true);
            setProfileMenu(false);
          }}
        />
        <Settings
          className="text-secondary w-6 h-6 cursor-pointer"
        />
        {
          //TODO: CREATE A MASTER DATA MAINTENANC PAGE
        }
        <div className="text-lg font-bold text-secondary">UserName</div>
        <User
          className="text-secondary w-6 h-6 cursor-pointer"
          title="Profile"
          onClick={() => setProfileMenu(!showProfileMenu)}
        />
        <UserProfileMenu isOpen={showProfileMenu} afterSelect={setProfileMenu}/>
      </div>
    </div>
  );
};

export default HeaderBar;
