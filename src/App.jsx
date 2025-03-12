import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./login/Login";
import CompanySelection from "./login/CompanySelection";
import MainLayout from "./layouts/MainLayout"; 

const App = () => {
  const [companies, setCompanies] = useState(() => {
    const savedCompanies = localStorage.getItem("companies");
    return savedCompanies ? JSON.parse(savedCompanies) : null;
  });

  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";

  const handleLoginSuccess = (data) => {
    localStorage.setItem("companies", JSON.stringify(data));
    localStorage.setItem("isLoggedIn", "true");
    setCompanies(data);
  };

  const handleCancel = () => {
    localStorage.removeItem("companies");
    localStorage.removeItem("isLoggedIn");
    setCompanies(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={!companies ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/company-selection" />} />
        <Route path="/company-selection" element={companies ? <CompanySelection companies={companies} onCancel={handleCancel} /> : <Navigate to="/" />} /> 

        <Route path="/dashboard" element={isAuthenticated ? <MainLayout title="Dashboard" /> : <Navigate to="/" />} />
        <Route path="/transactions" element={isAuthenticated ? <MainLayout title="Transactions" /> : <Navigate to="/" />} />
        <Route path="/transactions-inquiry" element={isAuthenticated ? <MainLayout title="Transactions Inquiry" /> : <Navigate to="/" />} />
        <Route path="/audit-logs" element={isAuthenticated ? <MainLayout title="Audit Logs" /> : <Navigate to="/" />} />
        <Route path="/company-profile" element={isAuthenticated ? <MainLayout title="Company Profile" /> : <Navigate to="/" />} />
        <Route path="/reports" element={isAuthenticated ? <MainLayout title="Reports" /> : <Navigate to="/" />} />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
