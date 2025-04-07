import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import HeaderBar from "./HeaderBar";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import TransactionsInquiry from "../pages/TransactionsInquiry";
import AuditLogs from "../pages/AuditLogs";
import CompanyProfile from "../pages/Settings/CompanyProfile";
import Reports from "../pages/Reports";
import UserMaintenance from "../pages/Settings/UserMaintenance";
import AccessRightMaintenance from "../pages/Settings/AccessRightMaintenance";
import DebtorMaintenance from "../pages/MasterData/DebtorMaintenance";
import CreditorMaintenance from "../pages/MasterData/CreditorMaintenance";
import LocationMaintenance from "../pages/MasterData/LocationMaintenance";
import ItemMaintenance from "../pages/MasterData/ItemMaintenance";
import UserProfile from "../pages/UserProfile"

const MainLayout = ({ title }) => {
  const location = useLocation();
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const renderContent = () => {
    switch (location.pathname) {
      case "/user-profile":
        return <UserProfile />
      case "/dashboard":
        return <Dashboard />;
      case "/transactions":
        return <Transactions />;
      case "/transactions-inquiry":
        return <TransactionsInquiry />;
      case "/audit-logs":
        return <AuditLogs />;
      case "/company-profile":
        return <CompanyProfile />;
      case "/reports":
        return <Reports />;
      case "/maintenances/user":
        return <UserMaintenance />;
      case "/maintenances/access-right":
        return <AccessRightMaintenance />;
      case "/maintenances/debtor":
        return <DebtorMaintenance />;
      case "/maintenances/creditor":
        return <CreditorMaintenance />;
      case "/maintenances/item":
        return <ItemMaintenance />;
      case "/maintenances/location":
        return <LocationMaintenance />;
      case "/maintenances/member":
        return <div className="text-secondary">Member Maintenance Page in Maintenance ...</div>;
      case "/maintenances/pwp":
        return <div className="text-secondary">PWP Maintenance Page in Maintenance</div>;
      default:
        return <Dashboard />;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1366) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-screen">
      <SideBar visible={sidebarVisible}/>
      <div className="flex flex-col flex-1 bg-gray-100">
        <HeaderBar currentPage={title} onToggleSidebar={() => setSidebarVisible(!sidebarVisible)}/>
        <div className="flex-grow py-2 px-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default MainLayout;
