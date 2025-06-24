import CustomStore from "devextreme/data/custom_store";
import { useRef, useState } from "react";
import { GetStockBalanceData, GetStockBalanceReport } from "../../api/reportapi";
import ErrorModal from "../../modals/ErrorModal";
import DatePicker from "react-datepicker";
import CustomInput from "../../Components/input/dateInput";
import StockBalanceReportDataGrid from "../../Components/DataGrid/Report/StockBalanceReportDataGrid";

const StockBalanceReport = () => {
    const companyId = sessionStorage.getItem("companyId");
    const userId = sessionStorage.getItem("userId");
    const gridRef = useRef(null);
    const [errorModal, setErrorModal] = useState({ title: "", message: "" });

    const [date, setDate] = useState(() => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        return today.toISOString();
    });

    const [includeZeroQty, setIncludeZeroQty] = useState(false);
    const [data, setData] = useState(null);

    const handleGetStockBalance = async () => {
        const StockBalanceStore = new CustomStore({
            key: "itemCode",
            load: async (loadOptions) => {
                const { skip, take } = loadOptions;
                const params = {
                    companyId: companyId,
                    date: date,
                    includeZeroQuantity: includeZeroQty,
                    limit: take || 10,
                    offset: skip || 0,
                    userId,
                    reportName: "Stock Balance Report"
                };

                try {
                    const res = await GetStockBalanceData(params);

                    if (!res.success) {
                        throw new Error(res.errorMessage || "Failed to retrieve Stock Balance");
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

        setData(() => StockBalanceStore);
    };

    const handleGetReport = async (isDownload) => {
    const reportName = "Stock Balance Report";

    const params = {
        companyId,
        userId,
        reportName,
        date,
        includeZeroQuantity: includeZeroQty,
        limit: 10,
        offset: 0,
    };

    try {
        const res = await GetStockBalanceReport(params);

        if (!res.success) {
            setErrorModal({
                title: "Report Error",
                message: "Report is empty or could not be generated.",
            });
            return;
        }

        const baseUrl = "https://report.absplt.com/reporting";
        const reportEndpoint = isDownload 
            ? `${baseUrl}/GetReport/${companyId}/${reportName}/${userId}` 
            : `${baseUrl}/ReportViewer/${companyId}/${reportName}/${userId}`;

        if (isDownload) {
            const fileResponse = await fetch(reportEndpoint, {
                method: 'GET',
                headers: { 'Accept': 'application/pdf' }
            });

            if (!fileResponse.ok) {
                throw new Error("Failed to download the report.");
            }

            const blob = await fileResponse.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${reportName}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            window.open(reportEndpoint, '_blank');
        }

    } catch (error) {
        setErrorModal({
            title: "Report Error",
            message: error.message || "Something went wrong while generating the report.",
        });
    }
};


    return (
        <>
            <ErrorModal
                title={errorModal.title}
                message={errorModal.message}
                onClose={() => setErrorModal({ title: "", message: "" })}
            />
            <div className="space-y-6 p-6 bg-white rounded shadow">
                <div className="grid grid-cols-1 gap-2 w-1/2">
                    <div className="w-full flex items-end gap-4">
                        <div>
                            <label className="block text-secondary font-medium mb-1">Date</label>
                            <DatePicker
                                customInput={<CustomInput width="w-full" />}
                                selected={new Date(date)} 
                                onChange={(selectedDate) => {
                                    const d = new Date(selectedDate);
                                    d.setUTCHours(0, 0, 0, 0);
                                    setDate(d.toISOString()); 
                                }}
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>
                        <div className="flex items-center mb-1">
                            <input
                                type="checkbox"
                                id="includeZeroQty"
                                checked={includeZeroQty}
                                onChange={(e) => setIncludeZeroQty(e.target.checked)}
                                className="h-5 w-5"
                            />
                            <label htmlFor="includeZeroQty" className="ml-2 block text-sm text-gray-900">
                                Include Zero Qty
                            </label>
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex space-x-4">
                    <button
                        onClick={async () => await handleGetStockBalance(false)}
                        className="bg-primary text-white px-6 py-2 rounded"
                    >
                        Search
                    </button>
                    <button
                        onClick={async () => await handleGetReport(false)}
                        className="bg-primary text-white px-6 py-2 rounded"
                    >
                        Preview
                    </button>
                    {/* <button
                        onClick={async () => await handleGetReport(true)}
                        className="bg-primary text-white px-6 py-2 rounded"
                    >
                        Export
                    </button> */}
                </div>

                <div className="mt-6">
                    <StockBalanceReportDataGrid ref={gridRef} data={data} />
                </div>
            </div>
        </>
    );
};

export default StockBalanceReport;
