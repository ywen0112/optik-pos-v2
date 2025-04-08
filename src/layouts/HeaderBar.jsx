import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Menu, LayoutDashboard, Settings } from "lucide-react";
import Profile from "../pages/Profile";
import UserProfileMenu from "../modals/UserProfileMenuModal";

const HeaderBar = ({ currentPage, onToggleSidebar }) => {
  const [showProfileMenu, setProfileMenu] = useState(false);
  const navigate = useNavigate();

  const buildBreadcrumb = () => {
    const path = location.pathname;
    const segments = path.split("/").filter(Boolean);

    if (path.startsWith("/maintenances/") && segments.length === 2) {
      const childName = segments[1]
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");

      return (
        <div className="flex items-center text-secondary space-x-1 cursor-default">
          <span
            className="hover:underline cursor-pointer"
            onClick={() => navigate("/master-data")}
          >
            Master Data
          </span>
          <span>/</span>
          <span className="font-semibold">{childName}</span>
        </div>
      );
    }

    return (
      <div className="text-secondary font-bold text-xl">
        {currentPage || "Untitled"}
      </div>
    );
  };

  return (
    <div className="w-full min-h-12 bg-white flex justify-between items-center px-8 shadow-md">
      <div className="flex items-center">
        <Menu
          className="text-secondary w-6 h-6 cursor-pointer mr-4"
          title="Toggle Sidebar"
          onClick={onToggleSidebar}
        />
        <div className="px-4 text-xl font-bold text-secondary">
          {buildBreadcrumb()}
        </div>
      </div>

      <div className="flex items-center space-x-6 ml-auto">
      <LayoutDashboard
        className="text-secondary w-6 h-6 cursor-pointer"
        onClick={() => {
          navigate("/master-data");
          setProfileMenu(false);
        }}
      />
        <Settings
          className="text-secondary w-6 h-6 cursor-pointer"
        />
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
