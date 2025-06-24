import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, UserCheck,Wrench, ChevronDown, ChevronRight,
  Gauge,
  Receipt,
  FileSearch,
  ScrollText,
  FilePen,
  FileBox,
  Monitor,
  NotepadText,
  FileX,
  PackageX,
  Calculator,
  MonitorX,
  ClipboardX,
  Calendar,
  Store,
  File
} from "lucide-react";
import ErrorModal from "../modals/ErrorModal";
import { CheckCounterSession } from "../api/apiconfig";
import ClipLoader from "react-spinners/ClipLoader";

const SideBar = ({ onSelectCompany = () => {}, visible = true }) => {
  const customerId = sessionStorage.getItem("customerId");
  const userId = sessionStorage.getItem("userId");
  const locationId = sessionStorage.getItem("locationId");
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCompany, setSelectedCompany] = useState(() => {
    return JSON.parse(sessionStorage.getItem("selectedCompany")) || null;
  });

  const [companyOptions, setCompanyOptions] = useState([]);
  const [activeMenu, setActiveMenu] = useState(location.pathname); 
  const [expandedMenus, setExpandedMenus] = useState([]);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedCompanies = JSON.parse(sessionStorage.getItem("companies")) || [];
    const storedSelectedCompany = JSON.parse(sessionStorage.getItem("selectedCompany")) || null;

    if (storedCompanies.length > 0) {
      setCompanyOptions(storedCompanies);

      if (storedSelectedCompany && storedCompanies.some(c => c.customerId === storedSelectedCompany.customerId)) {
        setSelectedCompany(storedSelectedCompany);
      } else {
        const defaultCompany = storedCompanies[0];
        setSelectedCompany(defaultCompany);
        sessionStorage.setItem("selectedCompany", JSON.stringify(defaultCompany));
      }
    }
  }, []);

  useEffect(() => {
    const matchedMenu = menuItems.find((item) => {
      if (item.children) {
        return item.children.some((child) => child.path === location.pathname);
      }
      return item.path === location.pathname;
    });
  
    if (matchedMenu) {
      setActiveMenu(matchedMenu.name);
      if (matchedMenu.children) {
        setExpandedMenus((prev) => [...prev, matchedMenu.name]);
      }
    }
  }, [location.pathname]);


  const handleTransactionsClick = async () => {
    setIsLoading(true);

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
        navigate("/cash-sale", { state: { counterSession: data.data } });
      } else {
        throw new Error(data.errorMessage || "Failed to check counter session.");
      }
    } catch (error) {
      setErrorModal({ title: "Counter Session Error", message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMenu = (menuName) => {
    setExpandedMenus((prev) =>
      prev.includes(menuName) ? prev.filter((m) => m !== menuName) : [...prev, menuName]
    );
  };

  const menuItems = [
    { name: "Dashboard", icon: <Gauge size={20} />, path: "/dashboard" },
    { name: "Transaction", icon: <Receipt size={20} />, 
      children: [
        { name: "Cash Sale", shortLabel: "CS", path: "/cash-sale"},
        { name: "Sales Order", shortLabel: "SO", path: "/sales-order" },
        { name: "Purchase Invoice", shortLabel: "PI", path: "/purchase-invoice" },
        { name: "Stock Adjustment", shortLabel: "SA", path: "/stock-adjustment" },
        // { name: "Goods Transit", shortLabel: "GT", path: "/good-transit" },
      ]
    },
    { name: "Inquiry", icon: <FileSearch size={20} />, 
      children: [
        { name: "Sales Inquiry", icon: <FilePen size={20}/>, path: "/sales-inquiry" },
        { name: "Products Inquiry", icon: <FileBox size={20}/>, path: "/products-inquiry" },
      ]
    },
    { name: "Reports", icon: <FileText size={20} />,
      children: [
        // { name: "Counter Session Report", icon: <Monitor size={20}/> , path: "/counter-session-report" },
        { name: "Daily Closing Summary", icon: <NotepadText size={20}/>, path: "/daily-closing-summay-report" },
        { name: "Outstanding Balance", icon: <FileX size={20}/>, path: "/outstanding-report" },
        { name: "Uncollected Order List", icon: <PackageX size={20}/>, path: "/uncollected-order-list" },
        { name: "Commission", icon: <Calculator size={20}/>, path: "/commision-report" },
        { name: "Stock Balance", icon: <Store size={20}/>, path: "/stock-balance-report" },
        { name: "Monthly Sales Summary", icon: <Calendar size={20}/>, path: "/monthly-sales-summary" },
        { name: "Sales Performance Summary", icon: <File size={20}/>, path: "/sales-performance-summary" },
        { name: "Purchase Return Listing", icon: <File size={20}/>, path: "/purchase-return-listing" },
      ]
    },
    { name: "Tools", icon: <Wrench size={20} />, 
      children: [
        { name: "Audit Logs", icon: <ClipboardX size={20}/>, path: "/audit-logs" },
        // { name: "Close Counter", icon: <MonitorX size={20}/>, path: "/close-counter" },
      ]
    }
  ];

  return (
    <div className={`bg-secondary text-white h-screen flex flex-col p-2 relative transition-all duration-300
      ${visible ? "w-60" : "w-16"}`}>
      <ErrorModal
        title={errorModal.title}
        message={errorModal.message}
        onClose={() => setErrorModal({ title: "", message: "" })}
      />

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center z-50">
          <ClipLoader color="#ffffff" size={35} />
          <p className="mt-2 text-sm text-white">Loading</p>
        </div>
      )}

      {visible && (
        <>
          <div className="flex items-center justify-center mb-4">
            <span className="text-yellow-500 font-bold text-2xl mt-2">OPTIK</span>
            <span className="text-white font-bold text-2xl mt-2">POS</span>
          </div>

          <div className="border-b border-gray-500 mb-8"></div>
        </>
      )}

      <nav className="mt-1 flex-grow overflow-y-auto scrollbar-hide">
        <ul>
          {menuItems.map((item) => {
            const isExpanded = expandedMenus.includes(item.name);
            const isActive = activeMenu === item.name;

              return (
                <div key={item.name}>
                  <li
                    className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors 
                      ${isActive ? "bg-primary text-black font-semibold" : "hover:bg-gray-700"}`}
                    onClick={() => {
                      setActiveMenu(item.name);
                      if (item.children) {
                        toggleMenu(item.name);
                      } else {
                        setActiveMenu(item.path);
                        if (item.onClick) item.onClick();
                        else if (item.path) navigate(item.path);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      {visible && <span className="ml-2 text-sm">{item.name}</span>}
                    </div>
              
                    {item.children && (
                      visible ? (
                        isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                      ) : (
                        isExpanded && <ChevronDown size={16} />
                      )
                    )}
                  </li>
              
                  {item.children && isExpanded && (
                    <ul className={`${visible ? "ml-6" : "ml-2"} mt-1 space-y-1`}>
                      {item.children.map((child) => (
                        <li
                          key={child.name}
                          className={`flex items-center gap-2 text-sm cursor-pointer px-2 py-2 rounded transition-colors 
                            ${location.pathname === child.path
                              ? "bg-yellow-100 text-secondary font-semibold"
                              : "hover:bg-gray-600"}`}
                            onClick={() => {
                              setActiveMenu(child.path);
                              if (child.onClick) {
                                child.onClick();
                              } else {
                                navigate(child.path);
                              }
                            }}
                        >
                         {visible ? (
                            <span>{child.name}</span>
                          ) : (
                            <span className="text-xs font-bold">{child.shortLabel ?? child.icon}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
