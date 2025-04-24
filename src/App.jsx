import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import config from 'devextreme/core/config'
import {licenseKey} from "./devextreme-license"

import Login from "./Login/Login";
import CompanySelection from "./login/CompanySelection";
import MainLayout from "./layouts/MainLayout"; 
import UserRegistrationPage from "./Registration";

config({licenseKey})

const App = () => {
  const [companies, setCompanies] = useState(() => {
    const savedCompanies = sessionStorage.getItem("companies");
    return savedCompanies ? JSON.parse(savedCompanies) : null;
  });

  const isAuthenticated = sessionStorage.getItem("isLoggedIn") === "true";
  const handleLoginSuccess = (data) => {
    sessionStorage.setItem("companies", JSON.stringify(data));
    sessionStorage.setItem("isLoggedIn", "true");
    setCompanies(data);
  };

  const handleCancel = () => {
    sessionStorage.clear();
    setCompanies(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/company-selection" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/company-selection" element={companies ? <CompanySelection companies={companies} onCancel={handleCancel} /> : <Navigate to="/login" />} /> 

        <Route path="/user-profile"element={isAuthenticated ? <MainLayout title="User Profile" /> : <Navigate to="/login" />} />

        <Route path="/dashboard" element={isAuthenticated ? <MainLayout title="Dashboard" /> : <Navigate to="/login" />} />
        <Route path="/cash-sale" element={isAuthenticated ? <MainLayout title="Cash Sale" /> : <Navigate to="/login" />} />
        <Route path="/sales-order" element={isAuthenticated ? <MainLayout title="Sales Order"/> : <Navigate to="/login"/>} />
        <Route path="/purchase-invoice" element={isAuthenticated ? <MainLayout title="Purchase Invoice" /> : <Navigate to="/login" />} />
        <Route path="/stock-adjustment" element={isAuthenticated ? <MainLayout title="Stock Adjustment" /> : <Navigate to="/login" />} />
        <Route path="/good-transit" element={isAuthenticated ? <MainLayout title="Goods Transit" /> : <Navigate to="/login" />} />
        <Route path="/audit-logs" element={isAuthenticated ? <MainLayout title="Audit Logs" /> : <Navigate to="/login" />} />
        <Route path="/reports" element={isAuthenticated ? <MainLayout title="Reports" /> : <Navigate to="/login" />} />

        <Route path="/counter-session-report" element={isAuthenticated ? <MainLayout title="Counter Session Report" /> : <Navigate to="/login" />} />
        <Route path="/daily-closing-summay-report" element={isAuthenticated ? <MainLayout title="Daily Closing Summary Report" /> : <Navigate to="/login" />} />
        <Route path="/outstanding-report" element={isAuthenticated ? <MainLayout title="Outstanding Balance Report" /> : <Navigate to="/login" />} />
        <Route path="/uncollected-order-list" element={isAuthenticated ? <MainLayout title="Uncollected Order List" /> : <Navigate to="/login" />} />
        <Route path="/commision-report" element={isAuthenticated ? <MainLayout title="Commission Report" /> : <Navigate to="/login" />} />

        <Route path="/close-counter" element={isAuthenticated ? <MainLayout title="Close Counter" /> : <Navigate to="/login" />} />

        <Route path="/master-data" element={isAuthenticated ? <MainLayout title="Master Data" /> : <Navigate to="/login" />} />
        <Route path="/customer" element={isAuthenticated ? <MainLayout title="Debtor Maintenance" /> : <Navigate to="/login" />} />
        <Route path="/supplier" element={isAuthenticated ? <MainLayout title="Creditor Maintenance" /> : <Navigate to="/login" />} />
        <Route path="/product" element={isAuthenticated ? <MainLayout title="Item Maintenance" /> : <Navigate to="/login" />} />
        <Route path="/location" element={isAuthenticated ? <MainLayout title="Location Maintenance" /> : <Navigate to="/login" />} />
        <Route path="/numbering-format" element={isAuthenticated ? <MainLayout title="Numbering Format" /> : <Navigate to="/login" />} />
        <Route path="/payment-method" element={isAuthenticated ? <MainLayout title="Payment Method" /> : <Navigate to="/login" />} />

        <Route path="/item-opening" element={isAuthenticated ? <MainLayout title="Item Opening" /> : <Navigate to="/login" />} />
        <Route path="/user" element={isAuthenticated ? <MainLayout title="User Maintenance" /> : <Navigate to="/login" />} />
        <Route path="/user-role" element={isAuthenticated ? <MainLayout title="User Role Maintenance" /> : <Navigate to="/login" />} />
        <Route path="/company-profile" element={isAuthenticated ? <MainLayout title="Company Profile" /> : <Navigate to="/login" />} />

        <Route path="/sales-inquiry" element={isAuthenticated ? <MainLayout title="Sales Inquiry" /> : <Navigate to="/login" />} />
        <Route path="/products-inquiry" element={isAuthenticated ? <MainLayout title="Products Inquiry" /> : <Navigate to="/login" />} />

        <Route path="/maintenances/member" element={isAuthenticated ? <MainLayout title="Member Maintenance" /> : <Navigate to="/login" />} />
        <Route path="/maintenances/pwp" element={isAuthenticated ? <MainLayout title="PWP Maintenance" /> : <Navigate to="/login" />} />

        <Route path="/invite" element={<UserRegistrationPage /> } />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
