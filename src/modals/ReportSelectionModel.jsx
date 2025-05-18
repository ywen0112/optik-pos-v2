import { useEffect, useState } from "react";
import { GetSalesReportType } from "../api/reportapi";

const ReportSelectionModal = ({ isOpen, onCancel, onSelect, companyId, isCashSales }) => {
    const [reports, setReports] = useState([]);
    const [selectedReports, setSelectedReports] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchReports();
        }
    }, [isOpen]);

    const fetchReports = async () => {
        try {
            const response = await GetSalesReportType({ companyId, isCashSales });
            setReports(response.data);
            setSelectedReports(response.data.map((r) => r.reportType));
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        }
    };

    const handleCheckboxChange = (reportType) => {
        setSelectedReports((prevSelected) =>
            prevSelected.includes(reportType)
                ? prevSelected.filter((type) => type !== reportType)
                : [...prevSelected, reportType]
        );
    };

    const handleOk = () => {
        const selected = reports.filter(r => selectedReports.includes(r.reportType));
        onSelect(selected);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 z-30">
                <h2 className="text-lg font-semibold text-secondary">Select Reports</h2>
                <p className="text-sm text-gray-600 mt-2">Choose one or more reports from the list below:</p>

                <div className="mt-4 max-h-60 overflow-y-auto">
                    {reports.map((report) => (
                        <label key={report.reportType} className="block mt-2">
                            <input
                                type="checkbox"
                                checked={selectedReports.includes(report.reportType)}
                                onChange={() => handleCheckboxChange(report.reportType)}
                                className="mr-2"
                            />
                            {report.reportName}
                        </label>
                    ))}
                </div>

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
                        disabled={selectedReports.length === 0}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportSelectionModal;
