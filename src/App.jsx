import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./login/Login";
import CompanySelection from "./login/CompanySelection";
import MainLayout from "./layouts/MainLayout"; 

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

        <Route path="/dashboard" element={isAuthenticated ? <MainLayout title="Dashboard" /> : <Navigate to="/login" />} />
        <Route path="/transactions" element={isAuthenticated ? <MainLayout title="Transactions" /> : <Navigate to="/login" />} />
        <Route path="/transactions-inquiry" element={isAuthenticated ? <MainLayout title="Transactions Inquiry" /> : <Navigate to="/login" />} />
        <Route path="/maintenances" element={isAuthenticated ? <MainLayout title="Maintenance" /> : <Navigate to="/login" />} />
        <Route path="/audit-logs" element={isAuthenticated ? <MainLayout title="Audit Logs" /> : <Navigate to="/login" />} />
        <Route path="/company-profile" element={isAuthenticated ? <MainLayout title="Company Profile" /> : <Navigate to="/login" />} />
        <Route path="/reports" element={isAuthenticated ? <MainLayout title="Reports" /> : <Navigate to="/login" />} />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
