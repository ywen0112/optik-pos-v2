import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Users, ShieldCheck, PackageOpen } from "lucide-react";
import ErrorModal from "./ErrorModal";
import ClipLoader from "react-spinners/ClipLoader";

import { GetCompany } from "../api/companyapi";

const SettingsMenuModal = ({ isOpen, onClose }) => {
const navigate = useNavigate();
const [isLoading, setIsLoading] = useState(false);
const companyId = sessionStorage.getItem("companyId");
const userId = sessionStorage.getItem("userId");
const locationId = sessionStorage.getItem("locationId");
const [errorModal, setErrorModal] = useState({ title: "", message: "" });

const handleCompanyProfileClick = async () => {
setIsLoading(true);


try {
    const data = await GetCompany({
      companyId: companyId,
      userId: userId,
      id: companyId
    });
    if (data.success) {
    navigate("/company-profile", { state: { company: data.data } });
    } else {
    throw new Error(data.errorMessage || "Failed to fetch company profile.");
    }
} catch (error) {
    setErrorModal({ title: "Company Profile Error", message: error.message });
} finally {
    setIsLoading(false);
}
};

  if (!isOpen) return null;

  const menuItems = [
    {
      label: "Company Profile",
      icon: <Building2 className="w-8 h-8 text-primary" />,
      path: "/company-profile",
      onClick: handleCompanyProfileClick,
    },
    {
      label: "User Maintenance",
      icon: <Users className="w-8 h-8 text-primary" />,
      path: "/user",
    },
    {
      label: "User Role Maintenance",
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      path: "/user-role",
    },
    {
      label: "Product Opening",
      icon: <PackageOpen className="w-8 h-8 text-primary" />,
      path: "/item-opening",
    },
  ];

  return (
    <div className="absolute top-16 right-6 z-50 bg-white shadow-lg rounded-lg p-4 w-96 grid grid-cols-2 gap-4">
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

      {menuItems.map((item, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center p-4 hover:bg-gray-100 rounded cursor-pointer"
          onClick={async () => {
            if (item.onClick) {
              await item.onClick(); 
            } else {
              navigate(item.path);  
            }
            onClose();
          }}
        >
          {item.icon}
          <div className="mt-2 text-center text-sm font-medium text-gray-700">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default SettingsMenuModal;
