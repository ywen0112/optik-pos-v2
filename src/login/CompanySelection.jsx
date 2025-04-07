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
      <div className="w-full max-w-screen-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-xl text-secondary font-bold text-center">Select Company</h2>
        <p className="text-sm text-center text-gray-500">Select a company to proceed</p>
        <div className="grid grid-cols-2 gap-6 mt-6">
          {companies.map((company) => (
            <div key={company.customerId} className="flex max-w-md justify-between items-center bg-gray-50 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 m-5" onClick={() => handleCompanySelect(company)}>
              <div className="flex flex-col">
                <span className="text-gray-700 font-medium">{company.companyName}</span>
                <span className="text-sm text-gray-500">(A-00000)</span>
              </div>
              <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-xl">
                <img
                  src={`data:image/png;base64,${company.logoBase64}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button className="mt-6 w-96 bg-secondary text-white py-2 rounded-md" onClick={handleCancel}>Switch User</button>
        </div>
      </div>
    </div>
  );
};

export default CompanySelection;