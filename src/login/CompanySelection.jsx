import { TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import CompanySelectionDataGrid from "../Components/DataGrid/CompanySelectionDataGrid"

const CompanySelection = ({ companies, onCancel }) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    onCancel();
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen w-screen items-center justify-end bg-secondary">
      <div>

        <div className="flex items-center justify-center mb-4">
          <span className="text-yellow-500 font-bold text-5xl mt-2">OPTIK</span>
          <span className="text-white font-bold text-5xl mt-2">POS</span>
        </div>
      </div>
      <div className="w-full h-[90%] max-w-screen-lg bg-white p-8 rounded-lg shadow-lg flex flex-col">
        <div className="flex justify-end">
          <label
            className="text-blue-400 underline underline-offset-1 hover:cursor-pointer"
            onClick={handleCancel}
          >
            Switch Account
          </label>
        </div>

        <div className="text-center">
          <h2 className="text-xl text-secondary font-bold">Select Company</h2>
          <p className="text-sm text-gray-500">Select a company to proceed</p>
        </div>

        <div className="flex-1 overflow-hidden mt-6">
          <CompanySelectionDataGrid companies={companies} />
        </div>
      </div>

    </div>
  );
};

export default CompanySelection;