import { useEffect, useState } from "react";
import { GetReportSelectionApi } from "../api/apiconfig";
import { ReportBaseUrl } from "../api/apiconfig";

const ReportSelectionModal = ({ isOpen, onCancel, docId, customerId }) => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchReports();
        }
    }, [isOpen]);

    const fetchReports = async () => {
        try {
            const response = await fetch(`${GetReportSelectionApi}?docId=${docId}`);
            const data = await response.json();
            setReports(data.data);
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
            <div className="bg-white p-6 rounded-lg shadow-lg w-fit z-30">
                <h2 className="text-lg font-semibold text-secondary">Select a Report</h2>
                <p className="text-sm text-gray-600 mt-2">Choose a report from the list below:</p>
                <div className="flex flex-col items-center gap-2 mt-4">
                    {reports.map((reports) => (
                        
                        <button
                            key={reports.fileId}
                            className="px-6 py-2 bg-blue-500 text-white rounded-md w-full"
                            onClick={() => {window.open(`${ReportBaseUrl}reporting/ReportViewer/OptikPOS/${customerId}/${reports.reportName}/${reports.fileId}`)}}
                        >
                            {reports.reportName}
                        </button>
                    ))}
                </div>
                <button onClick={onCancel} className="px-6 py-2 bg-red-500 text-white rounded-md mt-4">Cancel</button>
            </div>
        </div>
    );
};

export default ReportSelectionModal;