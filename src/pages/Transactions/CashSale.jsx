import { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import DataGrid, {
    Paging,
    Selection,
    Scrolling,
    SearchPanel
} from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import DropDownBox from 'devextreme-react/drop-down-box';
import DatePicker from "react-datepicker";
import ErrorModal from "../../modals/ErrorModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import NotificationModal from "../../modals/NotificationModal";
import { getInfoLookUp } from "../../api/infolookupapi";
import { GetSpecificUser } from "../../api/userapi";
import TransactionItemWithDiscountDataGrid from "../../Components/DataGrid/Transactions/TransactionItemDataGridWithDisc";
import { SaveDebtor, NewDebtor, GetDebtor, GetItem } from "../../api/maintenanceapi";
import AddCustomerModal from "../../modals/MasterData/Customer/AddCustomerModal";

import CashSalesPaymentModal from "../../modals/Transactions/CashSalesPaymentModal";
import { GetCashSale, GetCashSalesRecords, NewCashSales, NewCashSalesDetail, SaveCashSale } from "../../api/transactionapi";
import CustomInput from "../../Components/input/dateInput";
import { UserPlus } from "lucide-react";
import ReportSelectionModal from "../../modals/ReportSelectionModel";
import { GetSalesDocPaymentReport, GetSalesDocReport } from "../../api/reportapi";

const CustomerGridBoxDisplayExpr = (item) => item && `${item.debtorCode}`;
const SalesPersonGridBoxDisplayExpr = (item) => item && `${item.userName}`;
const CustomerGridColumns = [
    { dataField: "debtorCode", caption: "Code", width: "30%" },
    { dataField: "companyName", caption: "Name", width: "50%" }
];
const SalesPersonGridColumns = [
    { dataField: "userName", caption: "Name", width: "100%" }
];
const CashSalesGridColumns = [
    { dataField: "docNo", caption: "Doc No", width: "40%" },
    {
        dataField: "docDate", caption: "Doc Date", calculateDisplayValue: (rowData) => {
            const date = new Date(rowData.docDate);
            const dd = String(date.getDate()).padStart(2, '0');
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const yyyy = date.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
        },
        width: "30%"
    },
    { dataField: "debtorCode", caption: "Code", width: "30%" },
    { dataField: "debtorName", caption: "Name", width: "50%" }

];

const CashSales = () => {
    const companyId = sessionStorage.getItem("companyId");
    const userId = sessionStorage.getItem("userId");
    const [masterData, setMasterData] = useState(null);
    const [cashSalesItem, setCashSalesItem] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [rounding, setRounding] = useState("0.00")
    const [currentSalesTotal, setCurrentSalesTotal] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);
    const [balance, setBalance] = useState(0);

    const [isCustomerGridBoxOpened, setIsCustomerGridBoxOpened] = useState(false);
    const [CustomerGridBoxValue, setCustomerGridBoxValue] = useState({ debtorId: "", debtorCode: "", companyName: "" });
    const [isSalesPersonGridBoxOpened, setIsSalePersonGridBoxOpened] = useState(false);
    const [SalesPersonGridBoxValue, setSalesPersonGridBoxValue] = useState({ id: "", Name: "" });
    const [newCustomer, setNewCustomer] = useState(null);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [selectedCashSales, setSelectedCashSales] = useState({ cashSalesId: "", docNo: "" });
    const [isCashSalesGridBoxOpened, setIsCashSalesGridBoxOpened] = useState(false);

    const [cashSalesPayment, setCashSalesPayment] = useState(false);
    const [errorModal, setErrorModal] = useState({ title: "", message: "" });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: "", targetData: null });
    const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });

    const [isEdit, setIsEdit] = useState(false);

    const gridRef = useRef(null);

    const [total, setTotal] = useState(0);

    useEffect(() => {
        const total = currentSalesTotal + parseFloat(rounding);
        setTotal(total);
    }, [currentSalesTotal, rounding]);

    useEffect(() => {
        createNewCashSales();
    }, []);

    const createNewCashSales = async () => {
        try {
            const res = await NewCashSales({ companyId, userId, id: userId }); // id is empty
            if (res.success) {
                setMasterData(res.data);
            } else throw new Error(res.errorMessage || "Failed to add new Cash Sales Records");
        } catch (error) {
            setErrorModal({ title: "Failed to Add", message: error.message });
        }
    };

    const userStore = new CustomStore({
        key: "userId",

        load: async (loadOptions) => {
            const filter = loadOptions.filter;
            let keyword = filter?.[2] || "";

            const params = {
                keyword: keyword || "",
                offset: loadOptions.skip,
                limit: loadOptions.take,
                type: "user",
                companyId,
            };
            const res = await getInfoLookUp(params);
            return {
                data: res.data,
                totalCount: res.totalRecords,
            };
        },
        byKey: async (key) => {
            const res = await GetSpecificUser({
                companyId,
                userId,
                id: key
            });
            return res.data;
        },
    });

    const customerStore = new CustomStore({
        key: "debtorId",

        load: async (loadOptions) => {
            const filter = loadOptions.filter;
            let keyword = filter?.[2][2] || "";

            const params = {
                keyword: keyword || "",
                offset: loadOptions.skip,
                limit: loadOptions.take,
                type: "debtor",
                companyId,
            };
            const res = await getInfoLookUp(params);
            return {
                data: res.data,
                totalCount: res.totalRecords,
            };
        },
        byKey: async (key) => {
            if (!key) return null;
            const res = await GetDebtor({
                companyId,
                userId,
                id: key
            });
            return res.data;
        },
    });

    const CustomerDataGridOnSelectionChanged = useCallback((e) => {
        const selected = e.selectedRowsData?.[0];
        if (selected) {
            setCustomerGridBoxValue({ debtorId: selected.debtorId, debtorCode: selected.debtorCode, companyName: selected.companyName });
            setIsCustomerGridBoxOpened(false);
        }
    }, []);

    const CustomerDataGridRender = useCallback(
        () => (
            <DataGrid
                dataSource={customerStore}
                columns={CustomerGridColumns}
                hoverStateEnabled={true}
                showBorders={true}
                selectedRowKeys={CustomerGridBoxValue?.debtorId}
                onSelectionChanged={CustomerDataGridOnSelectionChanged}
                height="300px"
                remoteOperations={{
                    paging: true,
                    filtering: true,
                }}
            >
                <Selection mode="single" />
                <Paging
                    enabled={true}
                    pageSize={10}
                />
                <Scrolling mode="infinite" />

                <SearchPanel
                    visible={true}
                    width="100%"
                    highlightSearchText={true}
                />
            </DataGrid>
        ),
        []);

    const handleCustomerGridBoxValueChanged = (e) => {
        if (!e.value) {
            setCustomerGridBoxValue({ debtorId: "", debtorCode: "", companyName: "" });
        }
    };

    const onCustomerGridBoxOpened = useCallback((e) => {
        if (e.name === 'opened') {
            setIsCustomerGridBoxOpened(e.value);
        }
    }, []);

    const SalesPersonDataGridOnSelectionChanged = useCallback((e) => {
        const selected = e.selectedRowsData?.[0];
        if (selected) {
            setSalesPersonGridBoxValue({ id: selected.userId, Name: selected.userName });
            setIsSalePersonGridBoxOpened(false);
        }
    }, []);

    const SalesPersonDataGridRender = useCallback(
        () => (
            <DataGrid
                dataSource={userStore}
                columns={SalesPersonGridColumns}
                hoverStateEnabled={true}
                showBorders={true}
                selectedRowKeys={SalesPersonGridBoxValue?.id}
                onSelectionChanged={SalesPersonDataGridOnSelectionChanged}
                height="100%"
                remoteOperations={{
                    paging: true,
                    filtering: true,
                }}
            >
                <Selection mode="single" />
                <Paging
                    enabled={true}
                    pageSize={10}
                />
                <Scrolling mode="infinite" />

                <SearchPanel
                    visible={true}
                    width="100%"
                    highlightSearchText={true}
                />
            </DataGrid>
        ), []);

    const handleSalesPersonGridBoxValueChanged = (e) => {
        if (!e.value) {
            setSalesPersonGridBoxValue({ id: "", Name: "" });
        }
    };

    const onSalesPersonGridBoxOpened = useCallback((e) => {
        if (e.name === 'opened') {
            setIsSalePersonGridBoxOpened(e.value);
        }
    }, []);

    const getNextCustomerCode = async () => {
        const newCusRes = await NewDebtor({
            companyId: companyId,
            userId: userId,
            id: userId,
        });
        setNewCustomer(newCusRes.data)
    };

    const handleNewCustomerModel = async () => {
        await getNextCustomerCode()
        setShowCustomerModal(true)
    }

    const handleCloseUpdateModal = async () => {
        setNewCustomer(null);
        setShowCustomerModal(false)
    }

    const onLookUpSelected = (newValue, rowData) => {
        let data = newValue;
        if (!data.cashSalesDetailId) {
            data = { ...rowData, ...newValue }
        }
        setCashSalesItem(prev => {
            const exists = prev.find(record => record.cashSalesDetailId === data.cashSalesDetailId);
            const updatedData = { ...data };

            const qty = Number(updatedData.qty) || 0;
            const unitPrice = Number(updatedData.price) || 0;
            const isDiscByPercent = updatedData.discountType === "Percent";
            let discAmt = Number(updatedData.discountAmount) || 0;
            if (isDiscByPercent) {
                if (discAmt > 100) {
                    setErrorModal({ title: "Discount error", message: "Discount Percentage cannot exceed 100%" });
                    discAmt = 0;
                    updatedData.discountAmount = 0;
                }
            }
            const totalAmount = qty * unitPrice;

            updatedData.subTotal = totalAmount - (isDiscByPercent ? totalAmount * (discAmt / 100) : discAmt);

            if (exists) {
                return prev.map(record =>
                    record.cashSalesDetailId === data.cashSalesDetailId ? { ...record, ...updatedData } : record
                );
            } else {
                return [...prev, updatedData];
            }
        })
    };

    const handleAddNewRow = async () => {
        if (CustomerGridBoxValue?.debtorId === "") {
            setErrorModal({ title: "Failed to Add Item", message: "Please Select a Customer to proceed" });
            return;
        }
        try {
            const res = await NewCashSalesDetail({});
            if (res.success) {
                const newRecords = res.data;
                setCashSalesItem(prev => [...prev, newRecords]);
            } else throw new Error(res.errorMessage || "Failed to add new Cash Sales Details");
        } catch (error) {
            setErrorModal({ title: "Failed to Add", message: error.message });
        }
    }

    const handleEditRow = async (key, changedData) => {
        setCashSalesItem(prev => {
            return prev.map(record => {
                if (record.cashSalesDetailId === key) {
                    const updatedRecord = { ...record, ...changedData };
                    if ('qty' in changedData || 'price' in changedData || 'discountType' in changedData || 'discountAmount' in changedData) {
                        const qty = Number(updatedRecord.qty) || 0;
                        const unitPrice = Number(updatedRecord.price) || 0;
                        const isDiscByPercent = updatedRecord.discountType === "Percent";
                        let discAmt = Number(updatedRecord.discountAmount || 0)
                        if (isDiscByPercent) {
                            if (discAmt > 100) {
                                setErrorModal({ title: "Discount error", message: "Discount Percentage cannot exceed 100%" })
                                discAmt = 0;
                                updatedRecord.discountAmount = 0;
                            }
                        }
                        const totalAmount = qty * unitPrice;
                        updatedRecord.subTotal = totalAmount - (isDiscByPercent ? totalAmount * (discAmt / 100) : discAmt);
                    }

                    return updatedRecord;
                }
                return record;
            });
        });
    };

    useEffect(() => {
        const total = cashSalesItem?.reduce((sum, item) => {
            return sum + (Number(item.subTotal) || 0);
        }, 0);
        const bal = total - paidAmount + parseFloat(rounding);
        setBalance(bal);
        setCurrentSalesTotal(total);
    }, [handleEditRow, cashSalesItem, paidAmount])

    const handleRemoveRow = async (key) => {
        setCashSalesItem(prev => prev.filter(record => record.cashSalesDetailId !== key));
    }

    const clearData = async () => {
        setIsEdit(false);
        await createNewCashSales();
        setCustomerGridBoxValue({ debtorId: "", debtorCode: "", companyName: "" });
        setSalesPersonGridBoxValue({ id: "", Code: "", Name: "" });
        setSelectedCashSales({ cashSalesId: "", docNo: "" })
        setCashSalesItem([]);
        setRounding("0.00");
        setTotal(0);
        setCurrentSalesTotal(0);
        return;
    }

    const confirmAction = async () => {
        if (confirmModal.action === "clear") {
            setConfirmModal({ isOpen: false, action: "", data: null });
            await clearData();
            return;
        }

        try {
            const res = await SaveCashSale({ ...confirmModal.data });
            if (res.success) {
                setNotifyModal({ isOpen: true, message: "Cash Sales added successfully!" });
            } else throw new Error(res.errorMessage || "Failed to Add Cash Sales");
        } catch (error) {
            setErrorModal({ title: "Error", message: error.message });
            await clearData();
            return;
        }

        if (confirmModal.action === "addPrint" || confirmModal.action === "editPrint") {
            setReportSelectionOpenModal({ isOpen: true, docId: confirmModal.data.cashSalesId });
        }

        setConfirmModal({ isOpen: false, action: "", data: null });

        await clearData();
        return;
    };

    const handleSavePrint = () => {
        if (cashSalesItem.length <= 0) {
            return;
        }
        const formData = {
            ...masterData,
            isVoid: false,
            debtorId: CustomerGridBoxValue?.debtorId,
            debtorName: CustomerGridBoxValue?.companyName,
            salesPersonUserID: SalesPersonGridBoxValue.id,
            details: cashSalesItem.map((item) => ({
                cashSalesDetailId: item.cashSalesDetailId ?? "",
                itemId: item.itemId ?? "",
                itemUOMId: item.itemUOMId ?? "",
                description: item.description ?? "",
                desc2: item.desc2 ?? "",
                qty: item.qty ?? 0,
                unitPrice: item.price ?? 0,
                discount: item.discountType,
                discountAmount: item.discountAmount ?? 0,
                subTotal: item.subTotal ?? 0,
                classification: item.classification ?? ""
            })),
            subTotal: currentSalesTotal,
            roundingAdjustment: rounding ?? 0,
            total: total,
        }
        const action = isEdit ? "editPrint" : "addPrint";
        setConfirmModal({
            isOpen: true,
            action: action,
            data: formData,
        })
    }

    const handleClear = () => {
        setConfirmModal({
            isOpen: true,
            action: "clear",
        })
    }

    const handleSave = () => {
        if (cashSalesItem.length <= 0) {
            return;
        }
        const formData = {
            ...masterData,
            isVoid: false,
            debtorId: CustomerGridBoxValue?.debtorId,
            debtorName: CustomerGridBoxValue?.companyName,
            salesPersonUserID: SalesPersonGridBoxValue.id,
            details: cashSalesItem.map((item) => ({
                cashSalesDetailId: item.cashSalesDetailId ?? "",
                itemId: item.itemId ?? "",
                itemUOMId: item.itemUOMId ?? "",
                description: item.description ?? "",
                desc2: item.desc2 ?? "",
                qty: item.qty ?? 0,
                unitPrice: item.price ?? 0,
                discount: item.discountType,
                discountAmount: item.discountAmount ?? 0,
                subTotal: item.subTotal ?? 0,
                classification: item.classification ?? ""
            })),
            subTotal: currentSalesTotal,
            roundingAdjustment: rounding ?? 0,
            total: total,
        }
        const action = isEdit ? "edit" : "add";
        setConfirmModal({
            isOpen: true,
            action: action,
            data: formData,
        })
    }

    const confirmAddCustomerAction = async ({ action, data }) => {
        setConfirmModal({ isOpen: false, action: null });
        try {
            const saveRes = await SaveDebtor({
                actionData: data.actionData,
                debtorId: data.debtorId,
                debtorCode: data.debtorCode,
                companyName: data.companyName,
                isActive: data.isActive,
                identityNo: data.identityNo,
                dob: data.dob || null,
                address: data.address,
                remark: data.remark,
                phone1: data.phone1,
                phone2: data.phone2,
                emailAddress: data.emailAddress,
                medicalIsDiabetes: data.medicalIsDiabetes,
                medicalIsHypertension: data.medicalIsHypertension,
                medicalOthers: data.medicalOthers,
                ocularIsSquint: data.ocularIsSquint,
                ocularIsLazyEye: data.ocularIsLazyEye,
                ocularHasSurgery: data.ocularHasSurgery,
                ocularOthers: data.ocularOthers,
            });
            if (saveRes.success) {
                setShowCustomerModal(false);
                setNotifyModal({ isOpen: true, message: "Customer saved successfully!" });
                setNewCustomer(null);
            } else throw new Error(saveRes.errorMessage || "Failed to save customer.");

        } catch (error) {
            setErrorModal({ title: `Save Error`, message: error.message });
        } finally {
            setShowCustomerModal(false);
        }
    };

    const handleProcessAfterSavePayment = async ({ action }) => {
        if (cashSalesItem.length <= 0) {
            return;
        }
        const formData = {
            ...masterData,
            isVoid: false,
            debtorId: CustomerGridBoxValue?.debtorId,
            debtorName: CustomerGridBoxValue?.companyName,
            salesPersonUserID: SalesPersonGridBoxValue.id,
            details: cashSalesItem.map((item) => ({
                cashSalesDetailId: item.cashSalesDetailId ?? "",
                itemId: item.itemId ?? "",
                itemUOMId: item.itemUOMId ?? "",
                description: item.description ?? "",
                desc2: item.desc2 ?? "",
                qty: item.qty ?? 0,
                unitPrice: item.price ?? 0,
                discount: item.discountType,
                discountAmount: item.discountAmount ?? 0,
                subTotal: item.subTotal ?? 0,
                classification: item.classification ?? ""
            })),
            subTotal: currentSalesTotal,
            roundingAdjustment: rounding ?? 0,
            total: total,
        }
        const res = await SaveCashSale(formData);
        if (!res.success) {
            setErrorModal({ title: "Failed to Save", message: res?.errorMessage });
        };
        if (action === "save-print") {
            setReportSelectionOpenModal({ isOpen: true, docId: masterData.cashSalesId });
        }
        await clearData();
    }


    const cashSalesItemStore = new CustomStore({
        key: "cashSalesDetailId",
        load: async () => {
            setSelectedItem(null)
            return {
                data: cashSalesItem ?? [],
                totalCount: cashSalesItem?.length,
            };
        },
        insert: async () => {
            setSelectedItem(null)
            return {
                data: cashSalesItem ?? [],
                totalCount: cashSalesItem?.length,
            }
        },
        remove: async (key) => {
            await handleRemoveRow(key)
            return {
                data: cashSalesItem ?? [],
                totalCount: cashSalesItem?.length,
            }
        },
        update: async (key, data) => {
            await handleEditRow(key, data)
            setSelectedItem(null)
            return {
                data: cashSalesItem ?? [],
                totalCount: cashSalesItem?.length,
            }
        }
    });


    const confirmationTitleMap = {
        add: "Confirm New",
        clear: "Confirm Clear",
        addPrint: "Confirm New",
        edit: "Confirm Edit",
        editPrint: "Confirm Edit"
    };

    const confirmationMessageMap = {
        add: "Are you sure you want to add Cash Sales?",
        clear: "Are you sure you want to clear this page input?",
        addPrint: "Are you sure you want to add Cash Sales?",
        edit: "Are you sure you want to edit Cash Sales?",
        editPrint: "Are you sure you want to edit Cash Sales?"
    };

    const handleCashSalesGridBoxValueChanged = (e) => {
        if (!e.value) {
            setSelectedCashSales({ cashSalesId: "", docNo: "" });
        }
    }

    const cashSalesStore = new CustomStore({
        key: "cashSalesId",
        load: async (loadOptions) => {
            const filter = loadOptions.filter;
            let keyword = filter?.[2][2] || "";

            const res = await GetCashSalesRecords({
                keyword: keyword || "",
                offset: loadOptions.skip,
                limit: loadOptions.take,
                companyId,
                fromDate: "1970-01-01T00:00:00",
                toDate: new Date()
            });
            return {
                data: res.data,
                totalCount: res.totalRecords
            }
        },
        byKey: async (key) => {
            const res = await GetCashSale({
                companyId,
                userId,
                id: key
            });
            return res.data
        }
    })

    const onCashSalesGridBoxOpened = useCallback((e) => {
        if (e.name === 'opened') {
            setIsCashSalesGridBoxOpened(e.value);
        }
    }, [])

    const CashSalesDataGridOnSelectionChanged = useCallback(async (e) => {
        setIsEdit(true);
        const selected = e.selectedRowKeys?.[0];
        if (selected) {
            const recordRes = await GetCashSale({
                companyId,
                userId,
                id: selected
            })
            setSelectedCashSales({ cashSalesId: selected, docNo: recordRes.data?.docNo })
            setCustomerGridBoxValue({ debtorId: recordRes.data?.debtorId, debtorCode: recordRes.data?.debtorCode, companyName: recordRes.data?.debtorName })
            setSalesPersonGridBoxValue({ id: recordRes.data?.salesPersonUserID })
            setMasterData(recordRes.data)
            const details = recordRes?.data?.details ?? [];
            const paidAmount = (recordRes.data?.payments ?? []).reduce((sum, payment) => {
                const detailSum = (payment.details ?? []).reduce((dSum, item) => {
                    return dSum + (Number(item.amount) || 0);
                }, 0);
                return sum + detailSum;
            }, 0);
            setPaidAmount(paidAmount);
            const enrichedItems = await Promise.all(
                details.map(async (item) => {
                    if (!item.itemCode && !item.uom) {
                        try {
                            const res = await GetItem({
                                companyId,
                                userId,
                                id: item.itemId
                            });
                            return {
                                ...item,
                                itemCode: res.data.itemCode,
                                uom: res.data.itemUOM?.uom,

                            };
                        } catch (error) {
                            console.error("Failed to fetch item info:", error);
                        }
                    }
                    return item;
                })
            )
            setCashSalesItem(enrichedItems);
        }
        setIsCashSalesGridBoxOpened(false);
    }, [])

    const CashSalesDataGridRender = useCallback(
        () => (
            <DataGrid
                key={selectedCashSales?.cashSalesId}
                dataSource={cashSalesStore}
                columns={CashSalesGridColumns}
                hoverStateEnabled={true}
                showBorders={true}
                selectedRowKeys={selectedCashSales?.cashSalesId}
                onSelectionChanged={CashSalesDataGridOnSelectionChanged}
                height="300px"
                remoteOperations={{
                    paging: true,
                    filtering: true,
                }}
            >
                <Selection mode="single" />
                <Paging
                    enabled={true}
                    pageSize={10}
                />
                <Scrolling mode="infinite" />

                <SearchPanel
                    visible={true}
                    width="100%"
                    highlightSearchText={true}
                />
            </DataGrid>
        ), [selectedCashSales, CashSalesDataGridOnSelectionChanged]
    )

    const [reportSelectionModal, setReportSelectionOpenModal] = useState({ isOpen: false, docId: "" });

    const handleSelectedReport = async (selectedReports) => {
        setReportSelectionOpenModal({ isOpen: false });

        for (const report of selectedReports) {
            let res;

            try {
                if (report.reportType === "SalesOrder") {
                    res = await GetSalesDocReport({
                        companyId: companyId,
                        userId: userId,
                        id: reportSelectionModal.docId,
                        name: report.reportName,
                        isCashSales: true,
                    });
                } else if (report.reportType === "SalesOrderPayment") {
                    res = await GetSalesDocPaymentReport({
                        companyId: companyId,
                        userId: userId,
                        id: reportSelectionModal.docId,
                        name: report.reportName,
                        isCashSales: true,
                    });
                }

                if (res?.success) {
                    const reportName = report.reportName;
                    const fileResponse = await fetch(`https://report.absplt.com/reporting/GetReport/${companyId}/${reportName}/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/pdf'
                        }
                    });

                    if (!fileResponse.ok) {
                        throw new Error('File download failed');
                    }

                    const blob = await fileResponse.blob();
                    const url = window.URL.createObjectURL(blob);

                    const popup = window.open('', '_blank', 'width=800,height=600');
                    if (!popup) {
                        throw new Error("Popup blocked. Please allow popups for this site.");
                    }

                    popup.document.write(`
                    <html>
                        <head><title>${reportName}</title></head>
                        <body style="margin:0">
                            <iframe src="${url}" frameborder="0" style="width:100%; height:100%;"></iframe>
                        </body>
                    </html>
                `);
                    popup.document.close();
                }

            } catch (error) {
                setErrorModal({ title: "Download error", message: error.message });
            }
        }

        setReportSelectionOpenModal({ docId: "" });
    };


    return (
        <>
            <ReportSelectionModal
                isOpen={reportSelectionModal.isOpen}
                onCancel={() => setReportSelectionOpenModal(false)}
                onSelect={handleSelectedReport}
                companyId={companyId}
                isCashSales={true}
            />
            <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
            <ConfirmationModal isOpen={confirmModal.isOpen} title={confirmationTitleMap[confirmModal.action]} message={confirmationMessageMap[confirmModal.action]} onConfirm={confirmAction} onCancel={() => setConfirmModal({ isOpen: false, type: "", targetUser: null })} />
            <NotificationModal isOpen={notifyModal.isOpen} message={notifyModal.message} onClose={() => setNotifyModal({ isOpen: false, message: "" })} />

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <div className="items-center gap-1">
                        <label htmlFor="customer" className="font-medium text-secondary" >
                            Customer
                        </label>
                        <div className="justify-self-start w-full">

                            <div className="flex justify-end gap-2">
                                <DropDownBox
                                    id="CustomerSelection"
                                    disabled={isEdit}
                                    className="border rounded p-1 w-1/2 h-[34px]"
                                    value={CustomerGridBoxValue?.debtorId ?? ""}
                                    opened={isCustomerGridBoxOpened}
                                    openOnFieldClick={true}
                                    valueExpr='debtorId'
                                    displayExpr={CustomerGridBoxDisplayExpr}
                                    placeholder="Select Customer"
                                    showClearButton={true}
                                    onValueChanged={handleCustomerGridBoxValueChanged}
                                    dataSource={customerStore}
                                    onOptionChanged={onCustomerGridBoxOpened}
                                    contentRender={CustomerDataGridRender}
                                    dropDownOptions={{
                                        width: 400
                                    }}
                                />
                                <textarea
                                    disabled={isEdit}
                                    id="CustomerName"
                                    name="CustomerName"
                                    rows={1}
                                    className="border rounded p-2 w-full resize-none bg-white text-secondary"
                                    placeholder="Name"
                                    onChange={(e) => { setCustomerGridBoxValue(prev => ({ ...prev, companyName: e.target.value })) }}
                                    value={CustomerGridBoxValue?.companyName ?? ""}
                                />
                                <div className="relative group">
                                    <button
                                        disabled={isEdit}
                                        className="items-center h-[34px] text-secondary hover:bg-grey-500 hover:text-primary flex"
                                        onClick={handleNewCustomerModel}
                                    >
                                        <UserPlus />
                                    </button>
                                    <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                        Add New Customer
                                    </span>
                                </div>


                            </div>
                        </div>
                    </div>

                    {showCustomerModal && (
                        <AddCustomerModal
                            selectedCustomer={newCustomer}
                            isEdit={false}
                            isView={false}
                            isOpen={showCustomerModal}
                            onConfirm={confirmAddCustomerAction}
                            onError={setErrorModal}
                            onClose={handleCloseUpdateModal}
                            companyId={companyId}
                            userId={userId}
                        />
                    )}


                    <div className="items-start gap-1">
                        <label htmlFor="remark" className="font-medium text-secondary">Remark</label>
                        <div></div>
                        <textarea
                            id="remark"
                            name="remark"
                            rows={6}
                            className="border rounded p-1 w-full resize-none bg-white justify-self-end"
                            placeholder="Enter remarks…"
                            onChange={e => setMasterData(prev => ({ ...prev, remark: e.target.value }))}
                            value={masterData?.remark ?? ""}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 items-center gap-1 justify-items-end">
                    <div className="flex flex-col gap-1 w-1/2">
                        <label htmlFor="refNo" className="font-medium text-secondary">Ref No.</label>
                        <input
                            disabled={isEdit}
                            type="text"
                            id="refNo"
                            name="refNo"
                            className="border rounded p-1 w-full bg-white h-[34px]"
                            placeholder="Ref No"
                            onChange={e => setMasterData(prev => ({ ...prev, refNo: e.target.value }))}
                            value={masterData?.refNo ?? ""}
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-1/2">
                        <label htmlFor="date" className="font-medium text-secondary">Date</label>
                        <DatePicker
                            disabled={isEdit}
                            customInput={<CustomInput disabled={isEdit} />}
                            selected={masterData?.docDate ? new Date(masterData.docDate) : new Date()}
                            id="SalesDate"
                            name="SalesDate"
                            dateFormat="dd-MM-yyyy"
                            className="border rounded p-1 w-full bg-white h-[34px]"
                            onChange={e => setMasterData(prev => ({ ...prev, docDate: e }))}
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-1/2">
                        <label htmlFor="salesPerson" className="font-medium text-secondary">Sales Person</label>
                        <DropDownBox
                            disabled={isEdit}
                            id="SalesPersonSelection"
                            className="border rounded w-full"
                            value={SalesPersonGridBoxValue?.id ?? null}
                            opened={isSalesPersonGridBoxOpened}
                            openOnFieldClick={true}
                            valueExpr='userId'
                            displayExpr={SalesPersonGridBoxDisplayExpr}
                            placeholder="Select Sales Person"
                            showClearButton={true}
                            onValueChanged={handleSalesPersonGridBoxValueChanged}
                            dataSource={userStore}
                            onOptionChanged={onSalesPersonGridBoxOpened}
                            contentRender={SalesPersonDataGridRender}
                        />
                    </div>




                </div>
            </div>

            <div className="mt-3 p-3 bg-white shadow rounded">
                <TransactionItemWithDiscountDataGrid
                    disabled={isEdit}
                    height={400}
                    className={"p-2"}
                    customStore={cashSalesItemStore}
                    gridRef={gridRef}
                    onNew={handleAddNewRow}
                    onSelect={onLookUpSelected}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                />
            </div>

            <div className="w-full mt-3 bg-white shadow rounded p-4 mb-4">
                <div className="w-full grid grid-cols-3 gap-6 items-start text-sm text-secondary font-medium">


                    <div className="flex flex-col">

                    </div>
                    <div className="flex flex-col space-y-1">
                        {[
                            { label: "Paid", value: paidAmount },
                            { label: "Outstanding", value: balance },
                        ].map(({ label, value }) => (
                            <div key={label} className="grid grid-cols-[auto,30%] gap-1">
                                {label === "Outstanding"
                                    ? (<label className="font-extrabold py-2 px-4 justify-self-end text-[15px]" >{value >= 0 ? label : "Change"}</label>)
                                    : (<label className="font-extrabold py-2 px-4 justify-self-end text-[15px]" >{label}</label>)
                                }
                                <div className="border rounded px-5 py-2 bg-gray-100 w-full min-h-5 text-right">
                                    {Math.abs(value)?.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col space-y-1">
                        {[
                            { label: "Subtotal", value: currentSalesTotal },
                            { label: "Rounding Adj", value: rounding },
                            { label: "Total", value: total }
                        ].map(({ label, value }) => (
                            <div key={label} className="grid grid-cols-[auto,30%] gap-1">
                                <label className="font-extrabold py-2 px-4 justify-self-end text-[15px]" >{label}</label>
                                {label === "Rounding Adj" ? (
                                    <input
                                        disabled={isEdit}
                                        type="number"
                                        step="0.01"
                                        value={rounding}
                                        onChange={(e) => setRounding(e.target.value)}
                                        onBlur={() => {
                                            const parsed = parseFloat(rounding);
                                            setRounding(isNaN(parsed) ? "0.00" : parsed.toFixed(2));
                                        }}
                                        className=" border rounded px-5 py-2 bg-white w-full min-h-5 text-right "
                                    />

                                ) : (
                                    <div className="border rounded px-5 py-2 bg-gray-100 w-full min-h-5 text-right">
                                        {value.toFixed(2)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                </div>


            </div>

            <div className="bg-white border-t p-4 sticky bottom-0 flex flex-row place-content-between z-10">
                <div className="flex flex-row">
                    <DropDownBox
                        id="CashSalesSelection"
                        className="border rounded w-full"
                        value={selectedCashSales?.cashSalesId}
                        opened={isCashSalesGridBoxOpened}
                        openOnFieldClick={true}
                        valueExpr={"cashSalesId"}
                        displayExpr={(item) => item && `${item.docNo ?? ""}`}
                        placeholder="Search"
                        showClearButton={false}
                        showDropDownButton={true}
                        onValueChanged={handleCashSalesGridBoxValueChanged}
                        dataSource={cashSalesStore}
                        onOptionChanged={onCashSalesGridBoxOpened}
                        contentRender={CashSalesDataGridRender}
                        dropDownOptions={{
                            width: 500
                        }}
                    />
                    <button onClick={handleClear} className="bg-red-600 flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
                        Clear
                    </button>

                </div>

                <div className="w-full flex flex-row justify-end">
                    <button className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]"
                        onClick={() => setCashSalesPayment(true)}>
                        Payment
                    </button>
                    <button onClick={handleSavePrint} className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
                        Save & Print
                    </button>
                    <button onClick={handleSave} className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
                        Save
                    </button>
                </div>

                <CashSalesPaymentModal
                    isOpen={cashSalesPayment}
                    onClose={() => setCashSalesPayment(false)}
                    total={balance}
                    companyId={companyId}
                    userId={userId}
                    cashSalesId={masterData?.cashSalesId}
                    onError={setErrorModal}
                    onSave={handleProcessAfterSavePayment}
                />
            </div>
        </>
    )

}

export default CashSales;