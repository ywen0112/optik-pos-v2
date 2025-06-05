import CustomStore from "devextreme/data/custom_store";
import { useRef, useState } from "react";
import { GetUncollectedOrderData, GetUncollectedOrderReport } from "../../api/reportapi";
import ErrorModal from "../../modals/ErrorModal";
import DatePicker from "react-datepicker";
import CustomInput from "../../Components/input/dateInput";
import UncollectedORderReportDataGrid from "../../Components/DataGrid/Report/UncollectedOrderReportDataGrid";

const UncollectedORderReport = () =>{
    const companyId = sessionStorage.getItem("companyId");
    const userId = sessionStorage.getItem("userId");
    const gridRef = useRef(null);
    const [errorModal, setErrorModal] = useState({ title: "", message: "" });
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date.toISOString().split('T')[0];
    });


    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });
    const [data, setData] = useState(null);

    const handleGetUncollectedOrder = async()=>{
        const uncollectedStore = new CustomStore({
            key:"salesOrderId",
            load: async(loadOptions)=>{
                const { skip, take } = loadOptions;
                const params = {
                    companyId,
                    fromDate: startDate,
                    toDate: endDate,
                    offset: skip || 0,
                    limit: take || 10,
                };
                try{
                    const res = await GetUncollectedOrderData(params);
                    if (!res.success) {
                        throw new Error(res.errorMessage || "Failed to retrieve Daily Closing Summary");
                    }
                     return {
                        data: res.data,
                        totalCount: res.totalRecords,
                    };
                } catch (error){
                     setErrorModal({
                        title: "Report Error",
                        message: error.message || "An unexpected error occurred.",
                    });
                }
            }
        })
        setData(() => uncollectedStore);
    }

    const handleGetReport = async (isDownload) =>{
        try{
            const reportName = "Uncollected Order Report";
            const params = {
                companyId: companyId,
                userId: userId,
                reportName: reportName,
                fromDate: startDate,
                toDate: endDate,
            }
            const res = await GetUncollectedOrderReport(params)
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
        }catch (error) {
            setErrorModal({ title: "Report error", message: error.message });
        }
    }

    return (
        <>
            <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
            <div className="space-y-6 p-6 bg-white rounded shadow">
                <div className="grid grid-cols-1 gap-2 w-1/2">
                    <div className="w-full">
                        <label className="block text-secondary font-medium mb-1">Date Range</label>
                        <div className="flex flex-row gap-2">
                            <DatePicker
                                customInput={<CustomInput width="w-[400px]" />}
                                selected={startDate}
                                onChange={(date) => {
                                    const isoDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
                                    setStartDate(isoDate);
                                }}
                                dateFormat="dd/MM/yyyy"
                            />
                            <span className="text-secondary self-center">to</span>
                            <DatePicker
                                customInput={<CustomInput width="w-[400px]" />}
                                selected={endDate}
                                onChange={(date) => {
                                    const isoDate = date.toISOString().split('T')[0];
                                    setEndDate(isoDate);
                                }}
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>
                    </div>
                </div>
                <div className="pt-6 flex space-x-4">
                    <button
                        onClick={async () => await handleGetUncollectedOrder(false)}
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
                    <UncollectedORderReportDataGrid
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

export default UncollectedORderReport;