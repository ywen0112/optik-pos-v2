import { useEffect, useState } from "react";
import { GetSalesReportType } from "../api/reportapi";

const ReportSelectionModal = ({ isOpen, onCancel, onSelect, companyId, isCashSales }) => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchReports();
            setSelectedReport(null); 
        }
    }, [isOpen]);

    const fetchReports = async () => {
        try {
            const response = await GetSalesReportType({ companyId, isCashSales });
            
            setReports(response.data);
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        }
    };

    const handleOk = () => {
        if (selectedReport) {
            const report = reports.find(r => r.reportType === selectedReport);
            if (report) {
                onSelect(report)
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 z-30">
                <h2 className="text-lg font-semibold text-secondary">Select a Report</h2>
                <p className="text-sm text-gray-600 mt-2">Choose a report from the list below:</p>

                <select
                    className="mt-4 w-full border rounded p-2"
                    value={selectedReport || ""}
                    onChange={(e) => setSelectedReport(e.target.value)}
                >
                    <option value="" disabled>Select a report</option>
                    {reports.map((report) => (
                        <option key={report.reportName} value={report.reportType}>
                            {report.reportName}
                        </option>
                    ))}
                </select>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-black rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleOk}
                        className="px-4 py-2 bg-primary text-white rounded-md"
                        disabled={!selectedReport}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportSelectionModal;
