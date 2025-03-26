import { useState } from "react";
import { User, Menu } from "lucide-react";
import Profile from "../pages/Profile";

const HeaderBar = ({ onToggleSidebar }) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="w-full min-h-12 bg-white flex justify-between items-center px-8 shadow-md">
      <div className="flex items-center">
        <Menu
          className="text-secondary w-6 h-6 cursor-pointer mr-4"
          title="Toggle Sidebar"
          onClick={onToggleSidebar}
        />
      </div>

      <div className="flex items-center space-x-6 ml-auto">
        <User
          className="text-secondary w-6 h-6 cursor-pointer"
          title="Profile"
          onClick={() => setProfileOpen(true)}
        />
      </div>

      <Profile open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
};

export default HeaderBar;
