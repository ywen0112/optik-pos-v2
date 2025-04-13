import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Menu, LayoutDashboard, Settings } from "lucide-react";
import Profile from "../pages/Profile";
import UserProfileMenu from "../modals/UserProfileMenuModal";
import SettingsMenuModal from "../modals/SettingsMenuModal";

const HeaderBar = ({ currentPage, onToggleSidebar }) => {
  const [showProfileMenu, setProfileMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setShowSettingsMenu(false); 
    setProfileMenu(false); 
  }, [location.pathname]);

  const masterDataPages = {
    "/location": "Location",
    "/customer": "Customer",
    "/supplier": "Supplier",
    "/product": "Product",
    "/payment-method": "Payment Method",
  };

  const buildBreadcrumb = () => {
    const path = location.pathname;

    if (masterDataPages[path]) {
      return (
        <div className="flex items-center text-secondary space-x-1 cursor-default">
          <span
            className="hover:underline cursor-pointer"
            onClick={() => navigate("/master-data")}
          >
            Master Data
          </span>
          <span>/</span>
          <span className="font-semibold">{masterDataPages[path]}</span>
        </div>
      );
    }

    return (
      <div className="text-secondary font-bold text-2xl">
        {currentPage || "Untitled"}
      </div>
    );
  };

  return (
    <div className="w-full min-h-12 bg-white flex justify-between items-center px-8 shadow-md">
      <SettingsMenuModal isOpen={showSettingsMenu} onClose={() => setShowSettingsMenu(false)} />
      
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
        onClick={() => {
          setShowSettingsMenu((prev) => !prev);
          setProfileMenu(false);
        }}
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
