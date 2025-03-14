import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Clock, Briefcase, FileText, UserCheck, Building, BarChart2, Wrench } from "lucide-react"; 

const SideBar = ({ onSelectCompany }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [selectedCompany, setSelectedCompany] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedCompany")) || null;
  });

  const [companyOptions, setCompanyOptions] = useState([]);
  const [activeMenu, setActiveMenu] = useState(location.pathname); 

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

  const menuItems = [
    { name: "Dashboard", icon: <Clock size={20} />, path: "/dashboard" },
    { name: "Transactions", icon: <Briefcase size={20} />, path: "/transactions" },
    { name: "Transactions Inquiry", icon: <FileText size={20} />, path: "/transactions-inquiry" },
    { name: "Maintenance", icon: <Wrench size={20} />, path: "/maintenances" },
    { name: "Audit Logs", icon: <UserCheck size={20} />, path: "/audit-logs" },
    { name: "Company Profile", icon: <Building size={20} />, path: "/company-profile" },
    { name: "Reports", icon: <BarChart2 size={20} />, path: "/reports" },
  ];

  return (
    <div className="w-60 bg-secondary text-white h-screen flex flex-col p-4">
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
                navigate(item.path);
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
