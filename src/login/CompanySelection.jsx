import { useNavigate } from "react-router-dom";

const CompanySelection = ({ companies, onCancel }) => {
  const navigate = useNavigate();

  const handleCompanySelect = (company) => {
    localStorage.setItem("userId", company.userId);
    localStorage.setItem("customerId", company.customerId);
    localStorage.setItem("locationId", company.locationId);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("accessRights", JSON.stringify(company.accessRight));
    localStorage.setItem("selectedCompany", JSON.stringify(company));
    
    navigate("/dashboard");
  };

  const handleCancel = () => {
    onCancel();
    navigate("/"); 
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-secondary">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-xl text-secondary font-bold text-center">Select Company</h2>
        <p className="text-sm text-center text-gray-500">Select a company to proceed</p>
        <div className="grid grid-cols-2 gap-4 mt-6">
          {companies.map((company) => (
            <div key={company.customerId} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-200" onClick={() => handleCompanySelect(company)}>
              <span className="text-gray-700">{company.companyName}</span>
              <span className="w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center">📦</span>
            </div>
          ))}
        </div>
        <button className="mt-6 w-full bg-secondary text-white py-2 rounded-md" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default CompanySelection;