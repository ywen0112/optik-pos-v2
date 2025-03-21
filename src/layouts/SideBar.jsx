import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Clock, Briefcase, FileText, UserCheck, Building, BarChart2, Wrench } from "lucide-react"; 
import ErrorModal from "../modals/ErrorModal";
import { CheckCounterSession } from "../apiconfig";
import ClipLoader from "react-spinners/ClipLoader";


const SideBar = ({ onSelectCompany = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [selectedCompany, setSelectedCompany] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedCompany")) || null;
  });

  const [companyOptions, setCompanyOptions] = useState([]);
  const [activeMenu, setActiveMenu] = useState(location.pathname); 
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedCompanies = JSON.parse(localStorage.getItem("companies")) || [];
    const storedSelectedCompany = JSON.parse(localStorage.getItem("selectedCompany")) || null;

    if (storedCompanies.length > 0) {
      setCompanyOptions(storedCompanies);

      if (storedSelectedCompany && storedCompanies.some(c => c.customerId === storedSelectedCompany.customerId)) {
        setSelectedCompany(storedSelectedCompany);
      } else {
        const defaultCompany = storedCompanies[0];
        setSelectedCompany(defaultCompany);
        localStorage.setItem("selectedCompany", JSON.stringify(defaultCompany));
      }
    }
  }, []);

  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location.pathname]);

  const handleCompanyChange = (event) => {
    const companyId = event.target.value;
    const newSelectedCompany = companyOptions.find(c => String(c.customerId) === companyId); 

    if (newSelectedCompany) {
      setSelectedCompany(newSelectedCompany);
      localStorage.setItem("selectedCompany", JSON.stringify(newSelectedCompany));
      localStorage.setItem("userId", newSelectedCompany.userId);
      localStorage.setItem("customerId", newSelectedCompany.customerId);
      localStorage.setItem("locationId", newSelectedCompany.locationId);
      localStorage.setItem("accessRights", JSON.stringify(newSelectedCompany.accessRight));

      onSelectCompany(newSelectedCompany.customerId);
    }
  };

  const handleTransactionsClick = async () => {
    setIsLoading(true);

    const customerId = localStorage.getItem("customerId");
    const userId = localStorage.getItem("userId");
    const locationId = localStorage.getItem("locationId");

    const requestBody = {
      customerId: Number(customerId),
      userId,
      locationId,
      id: ""
    };

    try {
      const response = await fetch(CheckCounterSession, {
        method: "POST",
        headers: {
          "Accept": "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data.success) {
        navigate("/transactions", { state: { counterSession: data.data } });
      } else {
        throw new Error(data.errorMessage || "Failed to check counter session.");
      }
    } catch (error) {
      setErrorModal({ title: "Counter Session Error", message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <Clock size={20} />, path: "/dashboard" },
    { name: "Transactions", icon: <Briefcase size={20} />, path: "/transactions", onClick: handleTransactionsClick },
    { name: "Transactions Inquiry", icon: <FileText size={20} />, path: "/transactions-inquiry" },
    { name: "Maintenance", icon: <Wrench size={20} />, path: "/maintenances" },
    { name: "Audit Logs", icon: <UserCheck size={20} />, path: "/audit-logs" },
    { name: "Company Profile", icon: <Building size={20} />, path: "/company-profile" },
    { name: "Reports", icon: <BarChart2 size={20} />, path: "/reports" },
  ];

  return (
    <div className="w-60 bg-secondary text-white h-screen flex flex-col p-4">
     <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
     {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center z-50">
          <ClipLoader color="#ffffff" size={35} />
          <p className="mt-2 text-sm text-white">Loading Transactions...</p>
        </div>
      )}
      
      <div className="items-center justify-center mb-4">
        <span className="text-yellow-500 font-bold text-lg mt-2">OPTIK</span>
        <span className="text-white font-bold text-lg">POS</span>
      </div>

      <div className="border-b border-gray-500 mb-8"></div>

      <label className="text-sm">Select Company:</label>
      <select
        className="w-full bg-white p-1 rounded mt-2 text-secondary text-sm"
        value={selectedCompany?.customerId || ""}
        onChange={handleCompanyChange}
      >
        {companyOptions.length > 0 ? (
          companyOptions.map((company) => (
            <option key={company.customerId} value={company.customerId}>
              {company.companyName}
            </option>
          ))
        ) : (
          <option value="">No companies available</option>
        )}
      </select>

      <nav className="mt-8 flex-grow">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`flex items-center p-3 rounded cursor-pointer transition-colors 
                ${activeMenu === item.path ? "bg-primary text-black font-semibold" : "hover:bg-gray-700"}`}
              onClick={() => {
                setActiveMenu(item.path);
                if (item.onClick) {
                  item.onClick();
                } else {
                  navigate(item.path);
                }
              }}
            >
              {item.icon}
              <span className="ml-2 text-sm">{item.name}</span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
