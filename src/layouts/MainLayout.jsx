import { useState } from "react";
import { useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import HeaderBar from "./HeaderBar";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import TransactionsInquiry from "../pages/TransactionsInquiry";
import AuditLogs from "../pages/AuditLogs";
import CompanyProfile from "../pages/CompanyProfile";
import Reports from "../pages/Reports";
import UserMaintenance from "../pages/UserMaintenance";
import AccessRightMaintenance from "../pages/AccessRightMaintenance";
import DebtorMaintenance from "../pages/DebtorMaintenance";
import CreditorMaintenance from "../pages/CreditorMaintenance";
import LocationMaintenance from "../pages/LocationMaintenance";

const MainLayout = ({ title }) => {
  const location = useLocation();
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const renderContent = () => {
    switch (location.pathname) {
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
        return <div className="text-secondary">Item Maintenance Page in Maintenance ...</div>;
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

  return (
    <div className="flex h-screen w-screen">
      <SideBar visible={sidebarVisible}/>
      <div className="flex flex-col flex-1 bg-gray-100">
        <HeaderBar onToggleSidebar={() => setSidebarVisible(!sidebarVisible)}/>
        <div className="px-4 mt-4 text-2xl font-bold text-secondary">{title}</div>
        <div className="flex-grow py-2 px-4 overflow-y-auto max-h-[calc(100vh-100px)] pr-2 scrollbar-hide">{renderContent()}</div>
      </div>
    </div>
  );
};

export default MainLayout;
