import { useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import HeaderBar from "./HeaderBar";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import TransactionsInquiry from "../pages/TransactionsInquiry";
import Maintenance from "../pages/Maintenance";
import AuditLogs from "../pages/AuditLogs";
import CompanyProfile from "../pages/CompanyProfile";
import Reports from "../pages/Reports";

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
      case "/maintenances":
        return <Maintenance />;
      case "/audit-logs":
        return <AuditLogs />;
      case "/company-profile":
        return <CompanyProfile />;
      case "/reports":
        return <Reports />;
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
        <div className="flex-grow py-2 px-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default MainLayout;
