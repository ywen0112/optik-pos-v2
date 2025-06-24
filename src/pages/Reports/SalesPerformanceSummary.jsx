import CustomStore from "devextreme/data/custom_store";
import { useRef, useState } from "react";
import { GetSalesPerformanceSummaryData, GetSalesPerformanceReport } from "../../api/reportapi";
import ErrorModal from "../../modals/ErrorModal";
import DatePicker from "react-datepicker";
import CustomInput from "../../Components/input/dateInput";
import SalesPerformanceSummaryDataGrid from "../../Components/DataGrid/Report/SalesPerformanceSummaryDataGrid";

const SalesPerformanceSummaryReport = () => {
    const companyId = sessionStorage.getItem("companyId");
    const userId = sessionStorage.getItem("userId");
    const gridRef = useRef(null);
    const [errorModal, setErrorModal] = useState({ title: "", message: "" });
    
    // State for filters
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date;
    });
    const [endDate, setEndDate] = useState(() => new Date());
    
    const [data, setData] = useState(null);

    const handleGetSalesPerformance = async () => {
        const salesPerformanceStore = new CustomStore({
            key: "salesPersonUserID",
            load: async (loadOptions) => {
                const { skip, take } = loadOptions;
                const params = {
                    companyId,
                    fromDate: startDate.toISOString().split('T')[0],
                    toDate: endDate.toISOString().split('T')[0],
                    offset: skip || 0,
                    limit: take || 10,
                };

                try {
                    const res = await GetSalesPerformanceSummaryData(params);
                    if (!res.success) {
                        throw new Error(res.errorMessage || "Failed to retrieve Sales Performance Summary");
                    }
                    return {
                        data: res.data,
                        totalCount: res.totalRecords || res.data.length,
                    };
                } catch (error) {
                    setErrorModal({
                        title: "Report Error",
                        message: error.message || "An unexpected error occurred.",
                    });
                    return { data: [], totalCount: 0 };
                }
            }
        });
        setData(() => salesPerformanceStore);
    }

    const handleGetReport = async (isDownload) => {
        try {
            const reportName = "Sales Performance Summary Report";
            const params = {
                companyId,
                userId,
                reportName,
                fromDate: startDate.toISOString().split('T')[0],
                toDate: endDate.toISOString().split('T')[0],
            };
            
            const res = await GetSalesPerformanceReport(params);
            if (!res.success) {
                throw new Error(res.errorMessage || "Failed to generate report");
            }

            if (isDownload) {
                const fileResponse = await fetch(`https://report.absplt.com/reporting/GetReport/${companyId}/${reportName}/${userId}`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/pdf' }
                });
                
                if (!fileResponse.ok) throw new Error("Failed to download report.");
                
                const blob = await fileResponse.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${reportName}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                window.open(`https://report.absplt.com/reporting/ReportViewer/${companyId}/${reportName}/${userId}`, '_blank');
            }
        } catch (error) {
            setErrorModal({ title: "Report Error", message: error.message });
        }
    }

    return (
        <>
            <ErrorModal 
                title={errorModal.title} 
                message={errorModal.message} 
                onClose={() => setErrorModal({ title: "", message: "" })} 
            />
            
            <div className="space-y-6 p-6 bg-white rounded shadow">
                <div className="grid grid-cols-1 gap-4 w-full">
                    <div className="flex flex-col gap-4">
                        <div className="w-full">
                            <label className="block text-secondary font-medium mb-1">Date Range</label>
                            <div className="flex flex-row gap-2 items-center">
                                <DatePicker
                                    customInput={<CustomInput width="w-[180px]" />}
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                />
                                <span className="text-secondary">to</span>
                                <DatePicker
                                    customInput={<CustomInput width="w-[180px]" />}
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-4 flex space-x-4">
                    <button
                        onClick={handleGetSalesPerformance}
                        className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark"
                    >
                        Search
                    </button>
                    <button
                        onClick={() => handleGetReport(false)}
                        className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark"
                    >
                        Preview
                    </button>
                    {/* <button
                        onClick={() => handleGetReport(true)}
                        className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark"
                    >
                        Export
                    </button> */}
                </div>

                <div className="mt-6">
                    <SalesPerformanceSummaryDataGrid
                        ref={gridRef}
                        data={data}
                    />
                </div>
            </div>
        </>
    );
};

export default SalesPerformanceSummaryReport;