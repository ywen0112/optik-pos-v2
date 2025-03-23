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

const MainLayout = ({ title }) => {
  const location = useLocation();

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
        return <div>Debtor Maintenance Page</div>;
      case "/maintenances/creditor":
        return <div>Creditor Maintenance Page</div>;
      case "/maintenances/item":
        return <div>Item Maintenance Page</div>;
      case "/maintenances/location":
        return <div>Location Maintenance Page</div>;
      case "/maintenances/member":
        return <div>Member Maintenance Page</div>;
      case "/maintenances/pwp":
        return <div>PWP Maintenance Page</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <SideBar />
      <div className="flex flex-col flex-1 bg-gray-100">
        <HeaderBar />
        <div className="px-4 mt-4 text-2xl font-bold text-secondary">{title}</div>
        <div className="flex-grow py-2 px-4 overflow-y-auto max-h-[calc(100vh-100px)] pr-2">{renderContent()}</div>
      </div>
    </div>
  );
};

export default MainLayout;
