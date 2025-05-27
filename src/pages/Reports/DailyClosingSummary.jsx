import { useRef, useState } from "react";
import ErrorModal from "../../modals/ErrorModal";
import CustomInput from "../../Components/input/dateInput";
import DatePicker from "react-datepicker";
import DailyClosingSummaryDataGrid from "../../Components/DataGrid/Report/DailyClosingSummaryDataGrid";
import { GetDailyClosingReport, GetDailyClosingData } from "../../api/reportapi";
import CustomStore from "devextreme/data/custom_store";

const DailyClosingSummaryReport = () => {
    const companyId = sessionStorage.getItem("companyId");
    const userId = sessionStorage.getItem("userId");
    const gridRef = useRef(null);
    const [errorModal, setErrorModal] = useState({ title: "", message: "" });
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });

    const [data, setData] = useState(null);

    const handleGetDailyClosing = async () => {
        const DailyClosingStore = new CustomStore({
            key: "documentId",
            load: async (loadOptions) => {
                const { skip, take } = loadOptions;

                const params = {
                    companyId,
                    date: startDate,
                    offset: skip || 0,
                    limit: take || 10,
                };

                try {
                    const res = await GetDailyClosingData(params);

                    if (!res.success) {
                        throw new Error(res.errorMessage || "Failed to retrieve Daily Closing Summary");
                    }

                    return {
                        data: res.data,
                        totalCount: res.totalRecords,
                    };
                } catch (error) {
                    setErrorModal({
                        title: "Report Error",
                        message: error.message || "An unexpected error occurred.",
                    });
                }
            }
        });

        setData(() => DailyClosingStore);
    }

    const handleGetReport = async (isDownload) => {
        try {
            const reportName = "Daily Closing Summary Report"
            const params = {
                companyId: companyId,
                userId: userId,
                reportName: reportName,
                date: startDate
            }
            const res = await GetDailyClosingReport(params);
            const success = res.success
            if (success) {
                if (isDownload) {
                    const fileResponse = await fetch(`https://report.absplt.com/reporting/GetReport/${companyId}/${reportName}/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/pdf'
                        }
                    });
                    if (!fileResponse.ok) {
                        throw new Error("Failed to download report.");
                    }

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
                    const reportUrl = `https://report.absplt.com/reporting/ReportViewer/${companyId}/${reportName}/${userId}`
                    window.open(reportUrl, '_blank');
                }
            } else {
                setErrorModal({
                    title: "Report Error",
                    message: "Report is Empty",
                });
            }
        } catch (error) {
            setErrorModal({ title: "Report error", message: error.message });
        }

    }


    return (
        <>
            <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
            <div className="space-y-6 p-6 bg-white rounded shadow">
                <div className="grid grid-cols-1 gap-2 w-1/2">
                    <div className="w-full">
                        <label className="block text-secondary font-medium mb-1">Closing Date</label>
                        <div className="flex flex-row gap-2">
                            <DatePicker
                                customInput={<CustomInput width="w-[400px]" />}
                                selected={startDate}
                                onChange={(date) => {
                                    const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
                                    setStartDate(formattedDate);
                                }}

                                dateFormat="dd/MM/yyyy"
                            />
                        </div>
                    </div>
                </div>
                <div className="pt-6 flex space-x-4">
                    <button
                        onClick={async () => await handleGetDailyClosing(false)}
                        className="bg-primary text-white px-6 py-2 rounded">
                        Search
                    </button>
                    <button
                        onClick={async () => await handleGetReport(false)}
                        className="bg-primary text-white px-6 py-2 rounded">
                        Preview
                    </button>
                    <button
                        onClick={async () => await handleGetReport(true)}
                        className="bg-primary text-white px-6 py-2 rounded">
                        Export
                    </button>
                </div>



                <div className="mt-6">
                    <DailyClosingSummaryDataGrid
                        ref={gridRef}
                        // key={dataStoreKey}
                        data={data}
                    // onPay={handleAddPaymentForSales}
                    />
                </div>
            </div>
        </>
    )
}

export default DailyClosingSummaryReport;