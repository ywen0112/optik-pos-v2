import { useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import HeaderBar from "./HeaderBar";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import TransactionsInquiry from "../pages/TransactionsInquiry";
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
    <div className="flex h-screen">
      <SideBar />
      <div className="flex flex-col flex-1 bg-gray-100">
        <HeaderBar />
        <div className="p-6 text-2xl font-bold">{title}</div>
        <div className="p-2 h-screen w-screen">{renderContent()}</div>
      </div>
    </div>
  );
};

export default MainLayout;
