import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import SideBar from "./SideBar";
import HeaderBar from "./HeaderBar";
import Dashboard from "../pages/Dashboard";
import AuditLogs from "../pages/AuditLogs";
import CompanyProfile from "../pages/Settings/CompanyProfile";
import Reports from "../pages/Reports";
import UserMaintenance from "../pages/Settings/UserMaintenance";
import AccessRightMaintenance from "../pages/Settings/AccessRightMaintenance";
import DebtorMaintenance from "../pages/MasterData/DebtorMaintenance";
import CreditorMaintenance from "../pages/MasterData/CreditorMaintenance";
import ItemMaintenance from "../pages/MasterData/ItemMaintenance";
import UserProfile from "../pages/UserProfile";
import MainMenuPage from "../pages/MasterData/MainMenuPage";
import ItemOpening from "../pages/Settings/ItemOpening";

import SalesOrder from "../pages/Transactions/SalesOrder"
import PaymentMethod from "../pages/MasterData/PaymentMethod";
import ProductInquiry from "../pages/Inquiry/ProductInquiry";
import CashSales from "../pages/Transactions/CashSale";
import PurchaseInvoice from "../pages/Transactions/PurchasesInvoice";
import StockAdjustment from "../pages/Transactions/StockAdjustment";
import GoodsTransit from "../pages/Transactions/GoodsTransit";
import SalesInquiry from "../pages/Inquiry/SalesInquiry";
import NumberingFormat from "../pages/MasterData/NumberingFormat";

import ProductTypeMaintenance from "../pages/MasterData/ProductTypeMaintenence";
import ProductGroupMaintenance from "../pages/MasterData/ProductGroupMaintenance";
import DailyClosingSummaryReport from "../pages/Reports/DailyClosingSummary";
import CommissionReport from "../pages/Reports/CommissionReport";

const MainLayout = ({ title }) => {
  const location = useLocation();
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const renderContent = () => {
    switch (location.pathname) {
      case "/user-profile":
        return <UserProfile />
      case "/dashboard":
        return <Dashboard />;
      case "/sales-order":
        return <SalesOrder />
      case "/cash-sale":
        return <CashSales />;
      case "/sales-inquiry":
        return <SalesInquiry />;
      case "/purchase-invoice":
        return <PurchaseInvoice />;
      case "/stock-adjustment":
        return <StockAdjustment />;
      case "/good-transit":
        return <GoodsTransit />;
      case "/audit-logs":
        return <AuditLogs />;
      case "/company-profile":
        return <CompanyProfile />;
      case "/reports":
        return <Reports />;
      case "/counter-session-report":
        return <Reports />;
      case "/daily-closing-summay-report":
        return <DailyClosingSummaryReport />;
      case "/outstanding-report":
        return <Reports />;
      case "/uncollected-order-list":
        return <Reports />;
      case "/commision-report":
        return <CommissionReport />;
      case "/close-counter":
        return <Reports />;
      case "/user":
        return <UserMaintenance />;
      case "/user-role":
        return <AccessRightMaintenance />;
      case "/customer":
        return <DebtorMaintenance />;
      case "/supplier":
        return <CreditorMaintenance />;
      case "/product":
        return <ItemMaintenance />;
      case "/maintenances/member":
        return <div className="text-secondary">Member Maintenance Page in Maintenance ...</div>;
      case "/maintenances/pwp":
        return <div className="text-secondary">PWP Maintenance Page in Maintenance</div>;
      case "/master-data":
        return <MainMenuPage />
      case "/item-opening":
        return <ItemOpening />
      case "/payment-method":
        return <PaymentMethod />
      case "/products-inquiry":
        return <ProductInquiry />
      case "/numbering-format":
        return <NumberingFormat />
      case "/product-group":
        return <ProductGroupMaintenance />
      case "/product-type":
        return <ProductTypeMaintenance />
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
      <SideBar visible={sidebarVisible} />
      <div className="flex flex-col flex-1 bg-gray-100">
        <HeaderBar currentPage={title} onToggleSidebar={() => setSidebarVisible(!sidebarVisible)} />
        <div className="flex-grow py-2 px-4 overflow-y-auto">{renderContent()}</div>
      </div>
    </div>
  );
};

export default MainLayout;
