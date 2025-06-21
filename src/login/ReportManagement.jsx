import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReportManagementDataGrid from "../Components/DataGrid/ReportManagementDataGrid";
import { GetReports } from "../api/reportapi";

const ReportManagement = () => {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState([
    { reportType: "Commission", reportName: "Commission Report" },
    { reportType: "DailyClose", reportName: "Daily Closing Summary Report" },
    { reportType: "JobSheetForm", reportName: "Job Sheet Form" },
    { reportType: "MonthlySalesSummary", reportName: "Monthly Sales Summary Report" },
    { reportType: "Outstanding", reportName: "Outstanding Balance Report" },
    { reportType: "SalesOrder", reportName: "Invoice" },
    { reportType: "SalesOrder", reportName: "Invoice-DesignTemplate" },
    { reportType: "SalesPerformanceSummary", reportName: "Sales Performance Summary Report" },
    { reportType: "StockBalance", reportName: "Stock Balance Report" },
    { reportType: "Uncollected", reportName: "Uncollected Order Report" },
     { reportType: "PurchaseReturnListing", reportName: "Purchase Return Listing Report" },
  ]);

  const handleCancel = () => {
    navigate("/company-selection");
  };

  return (
    <div className="flex flex-col h-screen w-screen items-center justify-end bg-secondary">
      <div className="flex items-center justify-center mb-4">
        <span className="text-yellow-500 font-bold text-5xl mt-2">OPTIK</span>
        <span className="text-white font-bold text-5xl mt-2">POS</span>
      </div>

      <div className="w-full h-[90%] max-w-screen-lg bg-white p-8 rounded-lg shadow-lg flex flex-col">
        <div className="flex justify-end">
          <label
            className="text-blue-400 underline underline-offset-1 hover:cursor-pointer"
            onClick={handleCancel}
          >
            Back
          </label>
        </div>

        <div className="text-center">
          <h2 className="text-xl text-secondary font-bold">Report Management</h2>
          <p className="text-sm text-gray-500">Manage system reports here</p>
        </div>

        <div className="flex-1 overflow-hidden mt-6">
          <ReportManagementDataGrid reports={reportData} />
        </div>
      </div>
    </div>
  );
};

export default ReportManagement;
