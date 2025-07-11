import { useState, useEffect, useRef, useCallback } from "react";
import DataGrid, {
    Paging,
    Selection,
    Scrolling,
    SearchPanel
} from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import DropDownBox from 'devextreme-react/drop-down-box';
import DatePicker from "react-datepicker";
import { Copy, UserPlus } from "lucide-react";
import ErrorModal from "../../modals/ErrorModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import NotificationModal from "../../modals/NotificationModal";
import SalesOrderPaymentModal from "../../modals/Transactions/SalesOrderPaymentModal";
import { GetSalesOrder, GetSalesOrderRecords, NewSalesOrder, NewSalesOrderDetail, SaveSalesOrder } from "../../api/transactionapi";
import { getInfoLookUp } from "../../api/infolookupapi";
import { GetSpecificUser } from "../../api/userapi";
import TransactionItemWithDiscountDataGrid from "../../Components/DataGrid/Transactions/TransactionItemDataGridWithDisc";
import { SaveDebtor, NewDebtor, GetDebtor, GetItem, GetItemGroup, GetLatestDebtorSpectacles, GetLatestDebtorContactLens } from "../../api/maintenanceapi";
import AddCustomerModal from "../../modals/MasterData/Customer/AddCustomerModal";
import { NewSpectacles, NewContactLens, SaveContactLensProfile, SaveSpectacles } from "../../api/eyepowerapi";
import CustomInput from "../../Components/input/dateInput";
import { GetJobSheetForm, GetSalesDocPaymentReport, GetSalesDocReport } from "../../api/reportapi";
import ReportSelectionModal from "../../modals/ReportSelectionModel";
import CollectItemModal from "../../modals/Transactions/CollectItemModal";

const CustomerGridBoxDisplayExpr = (item) => item && `${item.debtorCode}`;
const SalesPersonGridBoxDisplayExpr = (item) => item && `${item.userName}`;
const PractitionerGridBoxDisplatExpr = (item) => item && `${item.userName}`;
const CustomerGridColumns = [
    { dataField: "debtorCode", caption: "Code", width: "30%" },
    { dataField: "companyName", caption: "Name", width: "50%" }
];
const SalesPersonGridColumns = [
    { dataField: "userName", caption: "Name", width: "100%" }
];
const PractitionerGridColumns = [
    { dataField: "userName", caption: "Name", width: "100%" }
];
const SalesOrderGridColumns = [
    { dataField: "docNo", caption: "Doc No", width: "20%" },
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
    { dataField: "debtorCode", caption: "Code", width: "20%" },
    { dataField: "debtorName", caption: "Name", width: "30%" },
    { dataField: "identityNo", caption: "Identity No", width: "20%" },
    { dataField: "Phone1", caption: "Phone No", width: "25%" }
];

const SalesOrder = () => {
    const companyId = sessionStorage.getItem("companyId");
    const userId = sessionStorage.getItem("userId");
    const [masterData, setMasterData] = useState(null);
    const [salesItem, setSalesItem] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [rounding, setRounding] = useState("0.00")
    const [currentTotal, setCurrentTotal] = useState(0)
    const [paidAmount, setPaidAmount] = useState(0)
    const [balance, setBalance] = useState(0)

    const [selectedInterval, setSelectedInterval] = useState(null);
    const [CustomerGridBoxValue, setCustomerGridBoxValue] = useState({ debtorId: "", debtorCode: "", companyName: "" });
    const [isCustomerGridBoxOpened, setIsCustomerGridBoxOpened] = useState(false);
    const [isSalesPersonGridBoxOpened, setIsSalePersonGridBoxOpened] = useState(false);
    const [SalesPersonGridBoxValue, setSalesPersonGridBoxValue] = useState({ id: "", Code: "", Name: "" });
    const [isPractionerGridBoxOpened, setIsPractionerGridBoxOpened] = useState(false);
    const [PractionerGridBoxValue, setPractionerGridBoxValue] = useState({ id: "", Code: "", Name: "" });
    const [isSalesOrderGridBoxOpened, setIsSalesOrderGridBoxOpened] = useState(false);
    const [selectedSalesOrder, setSelectedSalesOrder] = useState({ salesOrderId: "", docNo: "" });

    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [newCustomer, setNewCustomer] = useState(null);
    const [errorModal, setErrorModal] = useState({ title: "", message: "" });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: "", targetData: null });
    const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });

    const [isNormalItem, setIsNormalItem] = useState(true);
    const [currentActiveRow, setCurrentActiveRow] = useState(null);
    const [eyePowerSpectaclesFormData, setEyePowerSpectaclesFormData] = useState([]);
    const [eyePowerContactLensFormData, setEyePowerContactLensFormData] = useState([]);

    const [salesOrderPayment, setSalesOrderPayment] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const decimalRegex = /^-?\d*(\.\d{0,2})?$/;

    const roundUpToQuarter = (val) => Math.ceil(val * 4) / 4;

    const gridRef = useRef(null);

    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (currentActiveRow?.isContactLens) {
            setActiveRxMode("ContactLens");
        } else {
            setActiveRxMode("Distance");
        }
    }, [currentActiveRow?.isContactLens]);

    useEffect(() => {
        const total = currentTotal + parseFloat(rounding);
        setTotal(total);
    }, [currentTotal, rounding]);

    const [actualRX, setActualRX] = useState({
        dominantEye: "",
        opticalHeight: 0,
        segmentHeight: 0,
    });

    const [prescribedRX, setPrescribedRX] = useState({
        dominantEye: "",
        opticalHeight: 0,
        segmentHeight: 0,
    })

    const [prescribedReadingData, setPrescribedReadingData] = useState({
        l_R_ADD: null,
        l_R_AXIS: null,
        l_R_CYL: null,
        l_R_PD: null,
        l_R_PRISM: null,
        l_R_Remark: "",
        l_R_SPH: null,
        l_R_VA: null,
        r_R_ADD: null,
        r_R_AXIS: null,
        r_R_CYL: null,
        r_R_PRISM: null,
        r_R_Remark: "",
        r_R_SPH: null,
        r_R_VA: null,
    });

    const [prescribedDistanceData, setPrescribedDistanceData] = useState({
        l_D_ADD: null,
        l_D_AXIS: null,
        l_D_CYL: null,
        l_D_PD: null,
        l_D_PRISM: null,
        l_D_Remark: "",
        l_D_SPH: null,
        l_D_VA: null,
        r_D_ADD: null,
        r_D_AXIS: null,
        r_D_CYL: null,
        r_D_PRISM: null,
        r_D_Remark: "",
        r_D_SPH: null,
        r_D_VA: null,
    });

    const [actualReadingData, setActualReadingData] = useState({
        l_R_ADD: null,
        l_R_AXIS: null,
        l_R_CYL: null,
        l_R_PD: null,
        l_R_PRISM: null,
        l_R_Remark: "",
        l_R_SPH: null,
        l_R_VA: null,
        r_R_ADD: null,
        r_R_AXIS: null,
        r_R_CYL: null,
        r_R_PRISM: null,
        r_R_Remark: "",
        r_R_SPH: null,
        r_R_VA: null,
    });

    const [actualDistanceData, setActualDistanceData] = useState({
        l_D_ADD: null,
        l_D_AXIS: null,
        l_D_CYL: null,
        l_D_PD: null,
        l_D_PRISM: null,
        l_D_Remark: "",
        l_D_SPH: null,
        l_D_VA: null,
        r_D_ADD: null,
        r_D_AXIS: null,
        r_D_CYL: null,
        r_D_PRISM: null,
        r_D_Remark: "",
        r_D_SPH: null,
        r_D_VA: null,
    });

    const [oldSpecRX, setOldSpecRX] = useState(null);
    const [oldLensRX, setOldLensRX] = useState(null);
    const [isSpecNew, setIsSpecNew] = useState(false);
    const [isLensNew, setIsLensNew] = useState(false);

    useEffect(() => {
        createNewSalesOrder();
    }, []);

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
            if (!key || key === "") return null;
            const res = await GetDebtor({
                companyId,
                userId,
                id: key
            });
            return res.data;
        },
    });

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
            if (!key || key === "") return null;
            const res = await GetSpecificUser({
                companyId,
                userId,
                id: key
            });
            return res.data;
        },
    });

    const practitionerStore = new CustomStore({
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
            if (!key || key === "") return null;
            const res = await GetSpecificUser({
                companyId,
                userId,
                id: key
            });
            return res.data;
        },
    });

    const createNewSalesOrder = async () => {
        try {
            const response = await NewSalesOrder({ companyId, userId, id: userId });
            setMasterData(response.data)
        } catch (error) {
            setErrorModal({
                title: "Fetch Error",
                message: error.message
            });
        }
    };

    const intervals = [
        { label: '1 mth', months: 1 },
        { label: '3 mth', months: 3 },
        { label: '6 mth', months: 6 },
        { label: '9 mth', months: 9 },
        { label: '1 yr.', months: 12 },
    ];

    const calcDate = (base, addMonths) => {
        const d = base ? new Date(base) : new Date();
        d.setMonth(d.getMonth() + addMonths);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const pickInterval = (months) => {
        setSelectedInterval(months);
        setMasterData(prev => ({ ...prev, nextVisitDate: calcDate(masterData?.docDate, months) }));
    };

    useEffect(() => {
        if (selectedInterval !== null) {
            setMasterData(prev => ({ ...prev, nextVisitDate: calcDate(masterData?.docDate, selectedInterval) }));
        }
    }, [masterData?.docDate]);


    const handleCustomerGridBoxValueChanged = (e) => {
        if (!e.value) {
            setCustomerGridBoxValue({ debtorId: "", debtorCode: "", companyName: "" });
        }
    };

    const CustomerDataGridOnSelectionChanged = useCallback(async (e) => {
        const selected = e.selectedRowsData?.[0];
        if (selected) {
            if (salesItem.length >= 1) {
                await clearData();
            }
            setCustomerGridBoxValue({ debtorId: selected.debtorId, debtorCode: selected.debtorCode, companyName: selected.companyName });
            const spec_res = await GetLatestDebtorSpectacles({ companyId, userId, id: selected.debtorId });
            const lens_res = await GetLatestDebtorContactLens({ companyId, userId, id: selected.debtorId });
            setOldSpecRX(spec_res.data);
            setOldLensRX(lens_res.data);
            setIsSpecNew(spec_res.data.isNew);
            setIsLensNew(lens_res.data.isNew);
            setIsCustomerGridBoxOpened(false);
        }
    }, []);

    const onCustomerGridBoxOpened = useCallback((e) => {
        if (e.name === 'opened') {
            setIsCustomerGridBoxOpened(e.value);
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
                showBorders={false}
                selectedRowKeys={SalesPersonGridBoxValue?.id ?? null}
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
        ),
        [],
    );

    const handleSalesPersonGridBoxValueChanged = (e) => {
        if (!e.value) {
            setSalesPersonGridBoxValue({ id: "", Code: "", Name: "" });
        }
    };

    const onSalesPersonGridBoxOpened = useCallback((e) => {
        if (e.name === 'opened') {
            setIsSalePersonGridBoxOpened(e.value);
        }
    }, []);

    const PractionerDataGridOnSelectionChanged = useCallback((e) => {
        const selected = e.selectedRowsData?.[0];
        if (selected) {
            setPractionerGridBoxValue({ id: selected.userId, Name: selected.userName });
            setIsPractionerGridBoxOpened(false);
        }
    }, []);

    const PractionerDataGridRender = useCallback(
        () => (
            <DataGrid
                dataSource={practitionerStore}
                columns={PractitionerGridColumns}
                hoverStateEnabled={true}
                showBorders={false}
                selectedRowKeys={PractionerGridBoxValue?.id}
                onSelectionChanged={PractionerDataGridOnSelectionChanged}
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
        ),
        [PractionerGridBoxValue, PractionerDataGridOnSelectionChanged],
    );

    const handlePractionerGridBoxValueChanged = (e) => {
        if (!e.value) {
            setPractionerGridBoxValue({ id: "", Code: "", Name: "" });
        }
    };

    const onPractionerGridBoxOpened = useCallback((e) => {
        if (e.name === 'opened') {
            setIsPractionerGridBoxOpened(e.value);
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
                setCustomerGridBoxValue({ debtorId: newCustomer.debtorId, companyName: data.companyName })
                setNewCustomer(null);
            } else throw new Error(saveRes.errorMessage || "Failed to save customer.");

        } catch (error) {
            setErrorModal({ title: `Save Error`, message: error.message });
        } finally {
            setShowCustomerModal(false);
        }
    };

    const onLookUpSelected = async (newValue, rowData) => {

        let data = newValue;
        if (!data.salesOrderDetailId) {
            data = { ...rowData, ...newValue }
        }
        if (!data.isNormalItem) {
            setIsNormalItem(false)
            let res;
            if (data.isSpectacles) {
                res = await NewSpectacles({ companyId, userId, id: CustomerGridBoxValue.debtorId });
                const updatedRes = {
                    ...res.data,
                    debtorId: CustomerGridBoxValue.debtorId,
                    salesOrderId: masterData.salesOrderId,
                    salesOrderDetailId: rowData.salesOrderDetailId,
                    docDate: masterData.docDate,
                }

                setEyePowerSpectaclesFormData(prev => {
                    const exists = prev.find(record => record.salesOrderDetailId === data.salesOrderDetailId);
                    if (exists) {
                        return prev.map(record =>
                            record.salesOrderDetailId === rowData.salesOrderDetailId ? { ...updatedRes, ...record } : record
                        );
                    } else {
                        return [...prev, updatedRes];
                    }
                })
            } else if (data.isContactLens) {
                res = await NewContactLens({ companyId, userId, id: CustomerGridBoxValue.debtorId });
                const updatedRes = {
                    ...res.data,
                    debtorId: CustomerGridBoxValue.debtorId,
                    salesOrderId: masterData.salesOrderId,
                    salesOrderDetailId: rowData.salesOrderDetailId,
                    docDate: masterData.docDate,
                }
                setEyePowerContactLensFormData(prev => {
                    const exists = prev.find(record => record.salesOrderDetailId === data.salesOrderDetailId);
                    if (exists) {
                        return prev.map(record =>
                            record.salesOrderDetailId === rowData.salesOrderDetailId ? { ...updatedRes, ...record } : record
                        );
                    } else {
                        return [...prev, updatedRes];
                    }
                })
            }

        }
        setSalesItem(prev => {
            const exists = prev.find(record => record.salesOrderDetailId === data.salesOrderDetailId);

            const updatedData = { ...data };

            const qty = Number(updatedData.qty) || 0;
            const unitPrice = Number(updatedData.price) || 0;
            const isDiscByPercent = updatedData.discountType === "Percent";
            let discAmt = Number(updatedData.discountAmount) || 0;
            if (isDiscByPercent) {
                if (discAmt > 100) {
                    setErrorModal({ title: "Discount error", message: "Discount Percentage cannot exceed 100%" })
                    discAmt = 0;
                    updatedData.discountAmount = 0;
                }
            }
            const totalAmount = qty * unitPrice;

            updatedData.subTotal = totalAmount - (isDiscByPercent ? totalAmount * (discAmt / 100) : discAmt);

            if (exists) {
                setCurrentActiveRow({ ...exists, ...updatedData });

                return prev.map(record =>
                    record.salesOrderDetailId === data.salesOrderDetailId
                        ? { ...record, ...updatedData }
                        : record
                );
            } else {
                return [...prev, updatedData];
            }
        });

    };

    const handleAddNewRow = async () => {
        if (CustomerGridBoxValue?.debtorId === "") {
            setErrorModal({ title: "Failed to Add Item", message: "Please Select a Customer to proceed" });
            return;
        }
        try {
            const res = await NewSalesOrderDetail({});
            if (res.success) {
                const newRecords = res.data;
                setIsNormalItem(true);
                setSalesItem(prev => [...prev, newRecords]);
                return newRecords;
            } else throw new Error(res.errorMessage || "Failed to add new Sales Order Details");
        } catch (error) {
            setErrorModal({ title: "Failed to Add", message: error.message });
        }
    }

    const handleEditRow = async (key, changedData) => {
        setSalesItem(prev => {
            return prev.map(record => {
                if (record.salesOrderDetailId === key) {
                    const updatedRecord = { ...record, ...changedData };
                    if ('qty' in changedData || 'price' in changedData || 'discountType' in changedData || 'discountAmount' in changedData) {
                        const qty = Number(updatedRecord.qty) || 0;
                        const unitPrice = Number(updatedRecord.price) || 0;
                        const isDiscByPercent = updatedRecord.discountType === "Percent";
                        let discAmt = Number(updatedRecord.discountAmount || 0)
                        if (isDiscByPercent) {
                            if (discAmt > 100) {
                                setErrorModal({ title: "Discount error", message: "Discount Percentage cannot exceed 100%" });
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

    const clearData = async () => {
        await createNewSalesOrder();
        setCustomerGridBoxValue({ debtorId: "", debtorCode: "", companyName: "" });
        setSalesPersonGridBoxValue({ id: "", Code: "", Name: "" });
        setPractionerGridBoxValue({ id: "", Code: "", Name: "" });
        setEyePowerContactLensFormData([]);
        setEyePowerSpectaclesFormData([]);
        setSalesItem([]);
        setCurrentTotal(0);
        setRounding("0.00")
        setBalance(0);
        setPaidAmount(0);
        setIsNormalItem(true);
        setSelectedSalesOrder({ salesOrderId: "", docNo: "" })
        setActualDistanceData({
            l_D_ADD: null,
            l_D_AXIS: null,
            l_D_CYL: null,
            l_D_PD: null,
            l_D_PRISM: null,
            l_D_Remark: "",
            l_D_SPH: null,
            l_D_VA: null,
            r_D_ADD: null,
            r_D_AXIS: null,
            r_D_CYL: null,
            r_D_PRISM: null,
            r_D_Remark: "",
            r_D_SPH: null,
            r_D_VA: null,
        })
        setPrescribedDistanceData({
            l_D_ADD: null,
            l_D_AXIS: null,
            l_D_CYL: null,
            l_D_PD: null,
            l_D_PRISM: null,
            l_D_Remark: "",
            l_D_SPH: null,
            l_D_VA: null,
            r_D_ADD: null,
            r_D_AXIS: null,
            r_D_CYL: null,
            r_D_PRISM: null,
            r_D_Remark: "",
            r_D_SPH: null,
            r_D_VA: null,
        })
        setActualReadingData({
            l_R_ADD: null,
            l_R_AXIS: null,
            l_R_CYL: null,
            l_R_PD: null,
            l_R_PRISM: null,
            l_R_Remark: "",
            l_R_SPH: null,
            l_R_VA: null,
            r_R_ADD: null,
            r_R_AXIS: null,
            r_R_CYL: null,
            r_R_PRISM: null,
            r_R_Remark: "",
            r_R_SPH: null,
            r_R_VA: null,
        })
        setPrescribedReadingData({
            l_R_ADD: null,
            l_R_AXIS: null,
            l_R_CYL: null,
            l_R_PD: null,
            l_R_PRISM: null,
            l_R_Remark: "",
            l_R_SPH: null,
            l_R_VA: null,
            r_R_ADD: null,
            r_R_AXIS: null,
            r_R_CYL: null,
            r_R_PRISM: null,
            r_R_Remark: "",
            r_R_SPH: null,
            r_R_VA: null,
        })
        setActualRX({
            dominantEye: "",
            opticalHeight: 0,
            segmentHeight: 0,
        })
        setPrescribedRX({
            dominantEye: "",
            opticalHeight: 0,
            segmentHeight: 0,
        })
    }

    useEffect(() => {
        const total = salesItem?.reduce((sum, item) => {
            return sum + (Number(item?.subTotal) || 0);
        }, 0);

        const bal = total - paidAmount + parseFloat(rounding);
        setBalance(bal);
        setCurrentTotal(total);
    }, [handleEditRow, salesItem, paidAmount])

    const confirmAction = async () => {
        if (confirmModal.action === "clear") {
            setConfirmModal({ isOpen: false, action: "", data: null });
            await clearData();
            setIsEdit(false);
            return;
        }
        try {
            const res = await SaveSalesOrder({ ...confirmModal.data });
            if (res.success) {
                if (eyePowerContactLensFormData.length > 0) {
                    eyePowerContactLensFormData.forEach(async eyePower => await SaveContactLensProfile({ ...eyePower }));
                }
                if (eyePowerSpectaclesFormData.length > 0) {
                    eyePowerSpectaclesFormData.forEach(async eyePower => await SaveSpectacles({ ...eyePower }));
                }
                if (isLensNew) {
                    console.log(oldLensRX);
                }
                if (isSpecNew) {
                    console.log(oldSpecRX);
                }
                setNotifyModal({ isOpen: true, message: "Sales Order added successfully!" });
                if (confirmModal.action === "addPrint" || confirmModal.action === "editPrint") {
                    setReportSelectionOpenModal({ isOpen: true, docId: confirmModal.data.salesOrderId });
                }
            } else throw new Error(res.errorMessage || "Failed to Add Sales Order");
        } catch (error) {
            setErrorModal({ title: "Error", message: error.message });
            await clearData()
            return;
        }

        setConfirmModal({ isOpen: false, action: "", data: null });
        await clearData();
        return;
    }

    // const handleSavePrint = () => {
    //     if (salesItem.length <= 0) {
    //         return;
    //     }
    //     const formData = {
    //         ...masterData,
    //         isVoid: false,
    //         debtorId: CustomerGridBoxValue?.debtorId,
    //         debtorName: CustomerGridBoxValue?.companyName,
    //         salesPersonUserID: SalesPersonGridBoxValue?.id,
    //         practitionerUserID: PractionerGridBoxValue?.id,
    //         details: salesItem.map((item) => ({
    //             salesOrderDetailId: item.salesOrderDetailId ?? "",
    //             itemId: item.itemId ?? "",
    //             itemUOMId: item.itemUOMId ?? "",
    //             description: item.description ?? "",
    //             desc2: item.desc2 ?? "",
    //             qty: item.qty ?? 0,
    //             unitPrice: item.price ?? 0,
    //             discount: item.discountType,
    //             discountAmount: item.discountAmount ?? 0,
    //             subTotal: item.subTotal ?? 0,
    //             classification: item.classification ?? ""
    //         })),
    //         subTotal: currentTotal,
    //         roundingAdjustment: rounding ?? 0,
    //         total: total,
    //     }
    //     const action = isEdit ? "editPrint" : "addPrint";
    //     setConfirmModal({
    //         isOpen: true,
    //         action: action,
    //         data: formData,
    //     })
    // }

    // const handleSave = () => {
    //     if (salesItem.length <= 0) {
    //         return;
    //     }
    //     const formData = {
    //         ...masterData,
    //         isVoid: false,
    //         debtorId: CustomerGridBoxValue?.debtorId,
    //         debtorName: CustomerGridBoxValue?.companyName,
    //         salesPersonUserID: SalesPersonGridBoxValue?.id,
    //         practitionerUserID: PractionerGridBoxValue?.id,
    //         details: salesItem.map((item) => ({
    //             salesOrderDetailId: item.salesOrderDetailId ?? "",
    //             itemId: item.itemId ?? "",
    //             itemUOMId: item.itemUOMId ?? "",
    //             description: item.description ?? "",
    //             desc2: item.desc2 ?? "",
    //             qty: item.qty ?? 0,
    //             unitPrice: item.price ?? 0,
    //             discount: item.discountType,
    //             discountAmount: item.discountAmount ?? 0,
    //             subTotal: item.subTotal ?? 0,
    //             classification: item.classification ?? ""
    //         })),
    //         subTotal: currentTotal,
    //         roundingAdjustment: rounding ?? 0,
    //         total: total,
    //     }
    //     const action = isEdit ? "edit" : "add";
    //     setConfirmModal({
    //         isOpen: true,
    //         action: action,
    //         data: formData,
    //     })
    // }

    const handleSaveAfterPayment = async ({ action }) => {
        if (salesItem.length <= 0) {
            return;
        }
        const formData = {
            ...masterData,
            isVoid: false,
            debtorId: CustomerGridBoxValue?.debtorId,
            debtorName: CustomerGridBoxValue?.companyName,
            salesPersonUserID: SalesPersonGridBoxValue?.id,
            practitionerUserID: PractionerGridBoxValue?.id,
            details: salesItem.map((item) => ({
                salesOrderDetailId: item.salesOrderDetailId ?? "",
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
            subTotal: currentTotal,
            roundingAdjustment: rounding ?? 0,
            total: total,
        }

        const res = await SaveSalesOrder(formData);
        if (!res.success) {
            setErrorModal({ title: "Failed to Save", message: res?.errorMessage });
        };
        if (eyePowerContactLensFormData.length > 0) {
            eyePowerContactLensFormData.forEach(async eyePower => await SaveContactLensProfile({ ...eyePower }));
        }
        if (eyePowerSpectaclesFormData.length > 0) {
            eyePowerSpectaclesFormData.forEach(async eyePower => await SaveSpectacles({ ...eyePower }));
        }
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (isLensNew) {
            setOldLensRX(prev => ({
                ...prev,
                docDate: yesterday
            }));
            await SaveContactLensProfile({ ...oldLensRX });
        }
        if (isSpecNew) {
            setOldSpecRX(prev => ({
                ...prev,
                docDate: yesterday
            }));
            await SaveSpectacles({ ...oldSpecRX });
        }
        if (action === "save-print") {
            setReportSelectionOpenModal({ isOpen: true, docId: masterData.salesOrderId });
        }
        await clearData();
    }

    const salesItemStore = new CustomStore({
        key: "salesOrderDetailId",
        load: async () => {
            setSelectedItem(null)
            return {
                data: salesItem ?? [],
                totalCount: salesItem?.length,
            };
        },
        insert: async () => {
            setSelectedItem(null)
            return {
                data: salesItem ?? [],
                totalCount: salesItem?.length,
            }
        },
        remove: async (key) => {
            await handleRemoveRow(key)
            return {
                data: salesItem ?? [],
                totalCount: salesItem?.length,
            }
        },
        update: async (key, data) => {
            await handleEditRow(key, data)
            setSelectedItem(null)
            return {
                data: salesItem ?? [],
                totalCount: salesItem?.length,
            }
        }
    });

    useEffect(() => { }, [setIsNormalItem])

    const handleSalesOrderGridBoxValueChanged = (e) => {
        if (!e.value) {
            setSelectedSalesOrder({ salesOrderId: "", docNo: "" });
        }
    }

    const salesOrderStore = new CustomStore({
        key: "salesOrderId",
        load: async (loadOptions) => {
            const filter = loadOptions.filter;
            let keyword = filter?.[2][2] || "";

            const res = await GetSalesOrderRecords({
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
            const res = await GetSalesOrder({
                companyId,
                userId,
                id: key
            });
            return res.data
        }
    })
    const onSalesOrderGridBoxOpened = useCallback((e) => {
        if (e.name === 'opened') {
            setIsSalesOrderGridBoxOpened(e.value);
        }
    }, [])

    const SalesOrderDataGridOnSelectionChanged = useCallback(async (e) => {
        const selected = e.selectedRowKeys?.[0];
        if (selected) {
            const recordRes = await GetSalesOrder({
                companyId,
                userId,
                id: selected
            })
            if(!recordRes.success){
               return;
            }
            setIsEdit(true)
            setSelectedSalesOrder({ salesOrderId: selected, docNo: recordRes.data?.docNo })
            setCustomerGridBoxValue({ debtorId: recordRes.data?.debtorId, debtorCode: recordRes.data?.debtorCode, companyName: recordRes.data?.debtorName })
            setSalesPersonGridBoxValue({ id: recordRes.data?.salesPersonUserID })
            setPractionerGridBoxValue({ id: recordRes.data?.practitionerUserID })
            setMasterData(recordRes.data)
            const details = recordRes?.data?.details ?? [];
            const paidAmount = (recordRes.data?.payments ?? []).reduce((sum, payment) => {
                const detailSum = (payment.details ?? []).reduce((dSum, item) => {
                    return dSum + (Number(item.amount) || 0);
                }, 0);
                return sum + detailSum;
            }, 0);

            setPaidAmount(paidAmount);
            setEyePowerContactLensFormData([])
            setEyePowerSpectaclesFormData([])
            const enrichedItems = await Promise.all(
                details.map(async (item) => {
                    setEyePowerContactLensFormData(prev => [...prev, item?.contactLens])
                    setEyePowerSpectaclesFormData(prev => [...prev, item?.spectacles])
                    if (!item.itemCode && !item.uom) {
                        try {
                            const res = await GetItem({
                                companyId,
                                userId,
                                id: item.itemId
                            });
                            const groupRes = await GetItemGroup({
                                companyId,
                                userId,
                                id: res.data?.itemGroupId
                            })
                            return {
                                ...item,
                                itemCode: res.data.itemCode,
                                uom: res.data.itemUOM?.uom,
                                isSpectacles: groupRes.data?.isSpectacles,
                                isContactLens: groupRes.data?.isContactLens,
                                isNormalItem: groupRes.data?.isNormalItem

                            };
                        } catch (error) {
                            console.error("Failed to fetch item info:", error);
                        }
                    }
                    return item;
                })
            )
            setSalesItem(enrichedItems)
        }
        setIsSalesOrderGridBoxOpened(false)
    }, [])

    const SalesOrderDataGridRender = useCallback(
        () => (
            <DataGrid
                // key={selectedSalesOrder?.salesOrderId}
                dataSource={salesOrderStore}
                columns={SalesOrderGridColumns}
                hoverStateEnabled={true}
                showBorders={true}
                selectedRowKeys={selectedSalesOrder?.salesOrderId}
                onSelectionChanged={SalesOrderDataGridOnSelectionChanged}
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
        ), [selectedSalesOrder, SalesOrderDataGridOnSelectionChanged]
    )

    //Eye Power


    const [activeRxTab, setActiveRxTab] = useState("Old RX");
    const [activeRxMode, setActiveRxMode] = useState("Distance");

    const [showCopyModal, setShowCopyModal] = useState(false);

    const rxParams = ["SPH", "CYL", "AXIS", "VA", "PRISM", "BC", "DIA", "ADD", "PD"];
    const dataFieldMapping = {
        Distance: "D",
        Reading: "R",
        ContactLens: "D"
    }

    const handleCopyRxdata = () => {
        const sourceTab = activeRxTab;
        let targetTab = activeRxTab === "Prescribed RX" ? "Actual RX" : "Prescribed RX";
        if (activeRxTab === "Old RX") {
            targetTab = "Actual RX";
            if (currentActiveRow?.isSpectacles) {
                setActualRX({
                    dominantEye: oldSpecRX?.actualRXSpectacles?.dominantEye,
                    opticalHeight: oldSpecRX?.actualRXSpectacles?.opticalHeight,
                    segmentHeight: oldSpecRX?.actualRXSpectacles?.segmentHeight
                });
                setActualDistanceData({
                    l_D_ADD: oldSpecRX.actualRXSpectacles.l_D_ADD ?? null,
                    l_D_AXIS: oldSpecRX.actualRXSpectacles.l_D_AXIS ?? null,
                    l_D_CYL: oldSpecRX.actualRXSpectacles.l_D_CYL ?? null,
                    l_D_PD: oldSpecRX.actualRXSpectacles.l_D_PD ?? null,
                    l_D_PRISM: oldSpecRX.actualRXSpectacles.l_D_PRISM ?? null,
                    l_D_Remark: oldSpecRX.actualRXSpectacles.l_D_Remark ?? "",
                    l_D_SPH: oldSpecRX.actualRXSpectacles.l_D_SPH ?? null,
                    l_D_VA: oldSpecRX.actualRXSpectacles.l_D_VA ?? null,
                    r_D_ADD: oldSpecRX.actualRXSpectacles.r_D_ADD ?? null,
                    r_D_AXIS: oldSpecRX.actualRXSpectacles.r_D_AXIS ?? null,
                    r_D_CYL: oldSpecRX.actualRXSpectacles.r_D_CYL ?? null,
                    r_D_PRISM: oldSpecRX.actualRXSpectacles.r_D_PRISM ?? null,
                    r_D_Remark: oldSpecRX.actualRXSpectacles.r_D_Remark ?? "",
                    r_D_SPH: oldSpecRX.actualRXSpectacles.r_D_SPH ?? null,
                    r_D_VA: oldSpecRX.actualRXSpectacles.r_D_VA ?? null
                });
                setActualReadingData({
                    l_R_ADD: oldSpecRX.actualRXSpectacles.l_R_ADD ?? null,
                    l_R_AXIS: oldSpecRX.actualRXSpectacles.l_R_AXIS ?? null,
                    l_R_CYL: oldSpecRX.actualRXSpectacles.l_R_CYL ?? null,
                    l_R_PD: oldSpecRX.actualRXSpectacles.l_R_PD ?? null,
                    l_R_PRISM: oldSpecRX.actualRXSpectacles.l_R_PRISM ?? null,
                    l_R_Remark: oldSpecRX.actualRXSpectacles.l_R_Remark ?? "",
                    l_R_SPH: oldSpecRX.actualRXSpectacles.l_R_SPH ?? null,
                    l_R_VA: oldSpecRX.actualRXSpectacles.l_R_VA ?? null,
                    r_R_ADD: oldSpecRX.actualRXSpectacles.r_R_ADD ?? null,
                    r_R_AXIS: oldSpecRX.actualRXSpectacles.r_R_AXIS ?? null,
                    r_R_CYL: oldSpecRX.actualRXSpectacles.r_R_CYL ?? null,
                    r_R_PRISM: oldSpecRX.actualRXSpectacles.r_R_PRISM ?? null,
                    r_R_Remark: oldSpecRX.actualRXSpectacles.r_R_Remark ?? "",
                    r_R_SPH: oldSpecRX.actualRXSpectacles.r_R_SPH ?? null,
                    r_R_VA: oldSpecRX.actualRXSpectacles.r_R_VA ?? null
                });
            }
            if (currentActiveRow?.isContactLens) {
                setActualRX({
                    dominantEye: oldLensRX?.actualRXContactLens?.dominantEye,
                    opticalHeight: oldLensRX?.actualRXContactLens?.opticalHeight,
                    segmentHeight: oldLensRX?.actualRXContactLens?.segmentHeight
                });
                setActualDistanceData({
                    l_D_ADD: oldLensRX.actualRXContactLens.l_D_ADD ?? null,
                    l_D_AXIS: oldLensRX.actualRXContactLens.l_D_AXIS ?? null,
                    l_D_CYL: oldLensRX.actualRXContactLens.l_D_CYL ?? null,
                    l_D_PD: oldLensRX.actualRXContactLens.l_D_PD ?? null,
                    l_D_PRISM: oldLensRX.actualRXContactLens.l_D_PRISM ?? null,
                    l_D_Remark: oldLensRX.actualRXContactLens.l_D_Remark ?? "",
                    l_D_SPH: oldLensRX.actualRXContactLens.l_D_SPH ?? null,
                    l_D_VA: oldLensRX.actualRXContactLens.l_D_VA ?? null,
                    r_D_ADD: oldLensRX.actualRXContactLens.r_D_ADD ?? null,
                    r_D_AXIS: oldLensRX.actualRXContactLens.r_D_AXIS ?? null,
                    r_D_CYL: oldLensRX.actualRXContactLens.r_D_CYL ?? null,
                    r_D_PRISM: oldLensRX.actualRXContactLens.r_D_PRISM ?? null,
                    r_D_Remark: oldLensRX.actualRXContactLens.r_D_Remark ?? "",
                    r_D_SPH: oldLensRX.actualRXContactLens.r_D_SPH ?? null,
                    r_D_VA: oldLensRX.actualRXContactLens.r_D_VA ?? null
                });
                setActualReadingData({
                    l_R_ADD: oldLensRX.actualRXContactLens.l_R_ADD ?? null,
                    l_R_AXIS: oldLensRX.actualRXContactLens.l_R_AXIS ?? null,
                    l_R_CYL: oldLensRX.actualRXContactLens.l_R_CYL ?? null,
                    l_R_PD: oldLensRX.actualRXContactLens.l_R_PD ?? null,
                    l_R_PRISM: oldLensRX.actualRXContactLens.l_R_PRISM ?? null,
                    l_R_Remark: oldLensRX.actualRXContactLens.l_R_Remark ?? "",
                    l_R_SPH: oldLensRX.actualRXContactLens.l_R_SPH ?? null,
                    l_R_VA: oldLensRX.actualRXContactLens.l_R_VA ?? null,
                    r_R_ADD: oldLensRX.actualRXContactLens.r_R_ADD ?? null,
                    r_R_AXIS: oldLensRX.actualRXContactLens.r_R_AXIS ?? null,
                    r_R_CYL: oldLensRX.actualRXContactLens.r_R_CYL ?? null,
                    r_R_PRISM: oldLensRX.actualRXContactLens.r_R_PRISM ?? null,
                    r_R_Remark: oldLensRX.actualRXContactLens.r_R_Remark ?? "",
                    r_R_SPH: oldLensRX.actualRXContactLens.r_R_SPH ?? null,
                    r_R_VA: oldLensRX.actualRXContactLens.r_R_VA ?? null
                });
            }
            setShowCopyModal(false);
            setActiveRxTab(targetTab);
            return;
        }

        if (sourceTab === "Prescribed RX") {
            setActualRX({ ...prescribedRX });
            setActualReadingData({ ...prescribedReadingData });
            setActualDistanceData({ ...prescribedDistanceData });
        } else {
            setPrescribedRX({ ...actualRX });
            setPrescribedReadingData({ ...actualReadingData });
            setPrescribedDistanceData({ ...actualDistanceData });
        }

        setShowCopyModal(false);
        setActiveRxTab(targetTab);
    };

    useEffect(() => {
        if (!currentActiveRow) return;

        let currentItemEyePower;
        let prescribedRX = {};
        let actualRX = {};

        if (currentActiveRow?.isSpectacles) {
            currentItemEyePower = eyePowerSpectaclesFormData.find(
                item => item?.salesOrderDetailId === currentActiveRow?.salesOrderDetailId
            );
            prescribedRX = currentItemEyePower?.prescribedRXSpectacles ?? {};
            actualRX = currentItemEyePower?.actualRXSpectacles ?? {};
        } else if (currentActiveRow?.isContactLens) {
            currentItemEyePower = eyePowerContactLensFormData.find(
                item => item?.salesOrderDetailId === currentActiveRow?.salesOrderDetailId
            );
            prescribedRX = currentItemEyePower?.prescribedRXContactLens ?? {};
            actualRX = currentItemEyePower?.actualRXContactLens ?? {};
        }

        setPrescribedRX({
            dominantEye: prescribedRX?.dominantEye ?? "",
            opticalHeight: Number(prescribedRX?.opticalHeight ?? 0),
            segmentHeight: Number(prescribedRX?.segmentHeight ?? 0),
        });

        setActualRX({
            dominantEye: actualRX?.dominantEye ?? "",
            opticalHeight: Number(actualRX?.opticalHeight ?? 0),
            segmentHeight: Number(actualRX?.segmentHeight ?? 0),
        });

        setPrescribedDistanceData({
            l_D_ADD: prescribedRX?.l_D_ADD ?? null,
            l_D_AXIS: prescribedRX?.l_D_AXIS ?? null,
            l_D_CYL: prescribedRX?.l_D_CYL ?? null,
            l_D_PD: prescribedRX?.l_D_PD ?? null,
            l_D_PRISM: prescribedRX?.l_D_PRISM ?? null,
            l_D_Remark: prescribedRX?.l_D_Remark ?? "",
            l_D_SPH: prescribedRX?.l_D_SPH ?? null,
            l_D_VA: prescribedRX?.l_D_VA ?? null,
            r_D_ADD: prescribedRX?.r_D_ADD ?? null,
            r_D_AXIS: prescribedRX?.r_D_AXIS ?? null,
            r_D_CYL: prescribedRX?.r_D_CYL ?? null,
            r_D_PRISM: prescribedRX?.r_D_PRISM ?? null,
            r_D_Remark: prescribedRX?.r_D_Remark ?? "",
            r_D_SPH: prescribedRX?.r_D_SPH ?? null,
            r_D_VA: prescribedRX?.r_D_VA ?? null,
        });

        setActualDistanceData({
            l_D_ADD: actualRX?.l_D_ADD ?? null,
            l_D_AXIS: actualRX?.l_D_AXIS ?? null,
            l_D_CYL: actualRX?.l_D_CYL ?? null,
            l_D_PD: actualRX?.l_D_PD ?? null,
            l_D_PRISM: actualRX?.l_D_PRISM ?? null,
            l_D_Remark: actualRX?.l_D_Remark ?? "",
            l_D_SPH: actualRX?.l_D_SPH ?? null,
            l_D_VA: actualRX?.l_D_VA ?? null,
            r_D_ADD: actualRX?.r_D_ADD ?? null,
            r_D_AXIS: actualRX?.r_D_AXIS ?? null,
            r_D_CYL: actualRX?.r_D_CYL ?? null,
            r_D_PRISM: actualRX?.r_D_PRISM ?? null,
            r_D_Remark: actualRX?.r_D_Remark ?? "",
            r_D_SPH: actualRX?.r_D_SPH ?? null,
            r_D_VA: actualRX?.r_D_VA ?? null,
        });

        setPrescribedReadingData({
            l_R_ADD: prescribedRX?.l_R_ADD ?? null,
            l_R_AXIS: prescribedRX?.l_R_AXIS ?? null,
            l_R_CYL: prescribedRX?.l_R_CYL ?? null,
            l_R_PD: prescribedRX?.l_R_PD ?? null,
            l_R_PRISM: prescribedRX?.l_R_PRISM ?? null,
            l_R_Remark: prescribedRX?.l_R_Remark ?? "",
            l_R_SPH: prescribedRX?.l_R_SPH ?? null,
            l_R_VA: prescribedRX?.l_R_VA ?? null,
            r_R_ADD: prescribedRX?.r_R_ADD ?? null,
            r_R_AXIS: prescribedRX?.r_R_AXIS ?? null,
            r_R_CYL: prescribedRX?.r_R_CYL ?? null,
            r_R_PRISM: prescribedRX?.r_R_PRISM ?? null,
            r_R_Remark: prescribedRX?.r_R_Remark ?? "",
            r_R_SPH: prescribedRX?.r_R_SPH ?? null,
            r_R_VA: prescribedRX?.r_R_VA ?? null,
        });

        setActualReadingData({
            l_R_ADD: actualRX?.l_R_ADD ?? null,
            l_R_AXIS: actualRX?.l_R_AXIS ?? null,
            l_R_CYL: actualRX?.l_R_CYL ?? null,
            l_R_PD: actualRX?.l_R_PD ?? null,
            l_R_PRISM: actualRX?.l_R_PRISM ?? null,
            l_R_Remark: actualRX?.l_R_Remark ?? "",
            l_R_SPH: actualRX?.l_R_SPH ?? null,
            l_R_VA: actualRX?.l_R_VA ?? null,
            r_R_ADD: actualRX?.r_R_ADD ?? null,
            r_R_AXIS: actualRX?.r_R_AXIS ?? null,
            r_R_CYL: actualRX?.r_R_CYL ?? null,
            r_R_PRISM: actualRX?.r_R_PRISM ?? null,
            r_R_Remark: actualRX?.r_R_Remark ?? "",
            r_R_SPH: actualRX?.r_R_SPH ?? null,
            r_R_VA: actualRX?.r_R_VA ?? null,
        });

    }, [currentActiveRow]);


    useEffect(() => {
        let mergedData = {}
        if (currentActiveRow?.isSpectacles) {
            mergedData = {
                prescribedRXSpectacles: {
                    ...prescribedRX,
                    ...prescribedReadingData,
                    ...prescribedDistanceData,
                },
                actualRXSpectacles: {
                    ...actualRX,
                    ...actualReadingData,
                    ...actualDistanceData,
                }
            }
            setEyePowerSpectaclesFormData(prev => {
                const exists = prev.find(record => record?.salesOrderDetailId === currentActiveRow?.salesOrderDetailId);
                if (exists) {
                    return prev.map(record =>
                        record?.salesOrderDetailId === currentActiveRow?.salesOrderDetailId ? { ...record, ...mergedData } : record
                    );
                } else {
                    return [...prev, mergedData];
                }
            })
        } else if (currentActiveRow?.isContactLens) {
            mergedData = {
                prescribedRXContactLens: {
                    ...prescribedRX,
                    ...prescribedReadingData,
                    ...prescribedDistanceData,
                },
                actualRXContactLens: {
                    ...actualRX,
                    ...actualReadingData,
                    ...actualDistanceData,
                }
            }
            setEyePowerContactLensFormData(prev => {
                const exists = prev.find(record => record?.salesOrderDetailId === currentActiveRow?.salesOrderDetailId);
                if (exists) {
                    return prev.map(record =>
                        record?.salesOrderDetailId === currentActiveRow?.salesOrderDetailId ? { ...record, ...mergedData } : record
                    );
                } else {
                    return [...prev, mergedData];
                }
            })
        }

    }, [
        actualRX,
        prescribedRX,
        prescribedReadingData,
        prescribedDistanceData,
        actualReadingData,
        actualDistanceData,
    ]);


    const handleClear = () => {
        setConfirmModal({
            isOpen: true,
            action: "clear",
        })
    }

    const getRxData = () => {
        if (activeRxTab === "Prescribed RX" && activeRxMode === "Reading") return prescribedReadingData;
        if (activeRxTab === "Prescribed RX" && activeRxMode === "Distance") return prescribedDistanceData;
        if (activeRxTab === "Actual RX" && activeRxMode === "Reading") return actualReadingData;
        if (activeRxTab === "Actual RX" && activeRxMode === "Distance") return actualDistanceData;
        if (activeRxTab === "Old RX" && currentActiveRow?.isSpectacles) return oldSpecRX;
        if (activeRxTab === "Old RX" && currentActiveRow?.isContactLens) return oldLensRX?.actualRXContactLens;
    };

    const getRxSetter = () => {
        if (activeRxTab === "Prescribed RX" && activeRxMode === "Reading") return setPrescribedReadingData;
        if (activeRxTab === "Prescribed RX" && activeRxMode === "Distance") return setPrescribedDistanceData;
        if (activeRxTab === "Actual RX" && activeRxMode === "Reading") return setActualReadingData;
        if (activeRxTab === "Actual RX" && activeRxMode === "Distance") return setActualDistanceData;
        if (activeRxTab === "Old RX" && currentActiveRow?.isSpectacles) return setOldSpecRX;
        if (activeRxTab === "Old RX" && currentActiveRow?.isContactLens) return setOldLensRX;
    };

    const handleRxChange = (eye, mode, field, value) => {
        const setter = getRxSetter();
        if (activeRxTab === "Old RX" && currentActiveRow?.isSpectacles) {
            setter(prev => ({
                ...prev,
                actualRXSpectacles: {
                    ...oldSpecRX.actualRXSpectacles,
                    [`${eye}_${mode}_${field}`]: value
                }
            }));
            return;
        }
        if (activeRxTab === "Old RX" && currentActiveRow?.isContactLens) {
            setter(prev => ({
                ...prev,
                actualRXContactLens: {
                    ...oldLensRX.actualRXContactLens,
                    [`${eye}_${mode}_${field}`]: value
                }
            }));
            return;
        }
        setter(prev => ({
            ...prev,
            [`${eye}_${mode}_${field}`]: value
        }));
    };

    const handleRemoveRow = async (key) => {
        setSalesItem(prev => prev.filter(record => record.salesOrderDetailId !== key));
        setEyePowerSpectaclesFormData(prev => prev.filter(record => record.salesOrderDetailId !== key));
        setEyePowerContactLensFormData(prev => prev.filter(record => record.salesOrderDetailId !== key));
        setActualRX({
            dominantEye: "",
            opticalHeight: 0,
            segmentHeight: 0,
        });
        setPrescribedRX({
            dominantEye: "",
            opticalHeight: 0,
            segmentHeight: 0,
        });
        setPrescribedDistanceData({
            l_D_ADD: null,
            l_D_AXIS: null,
            l_D_CYL: null,
            l_D_PD: null,
            l_D_PRISM: null,
            l_D_Remark: "",
            l_D_SPH: null,
            l_D_VA: null,
            r_D_ADD: null,
            r_D_AXIS: null,
            r_D_CYL: null,
            r_D_PRISM: null,
            r_D_Remark: "",
            r_D_SPH: null,
            r_D_VA: null,
        });
        setPrescribedReadingData({
            l_R_ADD: null,
            l_R_AXIS: null,
            l_R_CYL: null,
            l_R_PD: null,
            l_R_PRISM: null,
            l_R_Remark: "",
            l_R_SPH: null,
            l_R_VA: null,
            r_R_ADD: null,
            r_R_AXIS: null,
            r_R_CYL: null,
            r_R_PRISM: null,
            r_R_Remark: "",
            r_R_SPH: null,
            r_R_VA: null,
        });
        setActualDistanceData({
            l_D_ADD: null,
            l_D_AXIS: null,
            l_D_CYL: null,
            l_D_PD: null,
            l_D_PRISM: null,
            l_D_Remark: "",
            l_D_SPH: null,
            l_D_VA: null,
            r_D_ADD: null,
            r_D_AXIS: null,
            r_D_CYL: null,
            r_D_PRISM: null,
            r_D_Remark: "",
            r_D_SPH: null,
            r_D_VA: null,
        });
        setActualReadingData({
            l_R_ADD: null,
            l_R_AXIS: null,
            l_R_CYL: null,
            l_R_PD: null,
            l_R_PRISM: null,
            l_R_Remark: "",
            l_R_SPH: null,
            l_R_VA: null,
            r_R_ADD: null,
            r_R_AXIS: null,
            r_R_CYL: null,
            r_R_PRISM: null,
            r_R_Remark: "",
            r_R_SPH: null,
            r_R_VA: null,
        });
    }

    const confirmationTitleMap = {
        add: "Confirm New",
        clear: "Confirm Clear",
        addPrint: "Confirm New",
        edit: "Confirm Edit",
        editPrint: "Confirm Edit"
    };

    const confirmationMessageMap = {
        add: "Are you sure you want to add Sales Order?",
        clear: "Are you sure you want to clear this page input?",
        addPrint: "Are you sure you want to add Sales Order?",
        edit: "Are you sure you want to edit Sales Order?",
        editPrint: "Are you sure you want to edit Sales Order?"
    };

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
                        isCashSales: false,
                    });
                } else if (report.reportType === "SalesOrderPayment") {
                    res = await GetSalesDocPaymentReport({
                        companyId: companyId,
                        userId: userId,
                        id: reportSelectionModal.docId,
                        name: report.reportName,
                        isCashSales: false,
                    });
                } else if (report.reportType === "JobSheetForm") {
                    res = await GetJobSheetForm({ companyId: companyId, userId: userId, id: reportSelectionModal.docId, name: report.reportName });
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

    const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);

    return (
        <>
            <ReportSelectionModal
                isOpen={reportSelectionModal.isOpen}
                onCancel={() => setReportSelectionOpenModal(false)}
                onSelect={handleSelectedReport}
                companyId={companyId}
                isCashSales={false}
            />
            <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
            <ConfirmationModal isOpen={confirmModal.isOpen} title={confirmationTitleMap[confirmModal.action]} message={confirmationMessageMap[confirmModal.action]} onConfirm={confirmAction} onCancel={() => setConfirmModal({ isOpen: false, type: "", targetUser: null })} />
            <NotificationModal isOpen={notifyModal.isOpen} message={notifyModal.message} onClose={() => setNotifyModal({ isOpen: false, message: "" })} />
            <ConfirmationModal
                isOpen={showCopyModal}
                title="Copy RX Data"
                message={`This will copy all RX data from "${activeRxTab}" to the other tab. Continue?`}
                onConfirm={handleCopyRxdata}
                onCancel={() => setShowCopyModal(false)}
            />

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
            <div className="space-y-6">
                {/* First row */}
                <div className="grid grid-cols-12 gap-4 items-end">
                    {/* Customer: spans 6 columns */}
                    <div className="col-span-6 space-y-2">
                        <label htmlFor="customer" className="font-medium text-secondary">Customer</label>
                        <div className="flex gap-2">
                            <DropDownBox
                                disabled={isEdit}
                                id="CustomerSelection"
                                className="border rounded p-1 w-1/2 h-[34px]"
                                value={CustomerGridBoxValue?.debtorId}
                                opened={isCustomerGridBoxOpened}
                                openOnFieldClick={true}
                                valueExpr="debtorId"
                                displayExpr={CustomerGridBoxDisplayExpr}
                                placeholder="Select Customer"
                                showClearButton={true}
                                onValueChanged={handleCustomerGridBoxValueChanged}
                                dataSource={customerStore}
                                onOptionChanged={onCustomerGridBoxOpened}
                                contentRender={CustomerDataGridRender}
                                dropDownOptions={{ width: 400 }}
                            />
                            <textarea
                                id="CustomerName"
                                name="CustomerName"
                                disabled={isEdit}
                                rows={1}
                                className="border rounded p-2 w-full resize-none bg-white text-secondary"
                                placeholder="Name"
                                onChange={(e) => {
                                    setCustomerGridBoxValue(prev => ({ ...prev, companyName: e.target.value }))
                                }}
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

                    {/* Ref No: spans 3 columns */}
                    <div className="col-span-3 flex flex-col">
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

                    {/* Doc No: spans 3 columns */}
                    <div className="col-span-3 flex flex-col">
                        <label htmlFor="docNo" className="font-medium text-secondary">Doc No.</label>
                        <input
                            disabled={isEdit}
                            type="text"
                            id="docNo"
                            name="docNo"
                            className="border rounded p-1 w-full bg-white h-[34px]"
                            placeholder="Doc No"
                            onChange={e => setMasterData(prev => ({ ...prev, docNo: e.target.value }))}
                            value={masterData?.docNo ?? ""}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-end mb-5">
                    <div className="col-span-2 flex flex-col">
                        <label htmlFor="salesPerson" className="font-medium text-secondary">Sales Person</label>
                        <DropDownBox
                            disabled={isEdit}
                            id="SalesPersonSelection"
                            className="border rounded w-full"
                            value={SalesPersonGridBoxValue?.id ?? ""}
                            opened={isSalesPersonGridBoxOpened}
                            openOnFieldClick={true}
                            valueExpr="userId"
                            displayExpr={SalesPersonGridBoxDisplayExpr}
                            placeholder="Select Sales Person"
                            showClearButton={true}
                            onValueChanged={handleSalesPersonGridBoxValueChanged}
                            dataSource={userStore}
                            onOptionChanged={onSalesPersonGridBoxOpened}
                            contentRender={SalesPersonDataGridRender}
                            dropDownOptions={{
                                        width: 400
                                    }}
                        />
                    </div>

                    <div className="col-span-2 flex flex-col">
                        <label htmlFor="practitioner" className="font-medium text-secondary">Practitioner</label>
                        <DropDownBox
                            disabled={isEdit}
                            id="PractionerSelection"
                            className="border rounded w-full"
                            value={PractionerGridBoxValue?.id ?? ""}
                            opened={isPractionerGridBoxOpened}
                            openOnFieldClick={true}
                            valueExpr="userId"
                            displayExpr={PractitionerGridBoxDisplatExpr}
                            placeholder="Select Practitioner"
                            showClearButton={true}
                            onValueChanged={handlePractionerGridBoxValueChanged}
                            dataSource={practitionerStore}
                            onOptionChanged={onPractionerGridBoxOpened}
                            contentRender={PractionerDataGridRender}
                            dropDownOptions={{ width: 400 }}
                        />
                    </div>

                    <div className="col-span-2 flex flex-col">
                        <label htmlFor="nextVisit" className="font-medium text-secondary">Next Visit</label>
                        <DatePicker
                            disabled={isEdit}
                            customInput={<CustomInput disabled={isEdit} />}
                            selected={masterData?.nextVisitDate ? new Date(masterData.nextVisitDate) : new Date()}
                            id="nextVisit"
                            name="nextVisit"
                            dateFormat="dd-MM-yyyy"
                            placeholderText="dd-MM-yyyy"
                            className="border rounded p-1 w-full bg-white text-secondary h-[34px]"
                            onChange={e => {
                                setSelectedInterval(null);
                                setMasterData(prev => ({ ...prev, nextVisitDate: e }));
                            }}
                        />
                    </div>

                    <div className="col-span-3 flex flex-col">
                        <label className="font-medium text-secondary mb-1">Interval</label>
                        <div className="flex flex-wrap gap-2">
                            {intervals.map(intv => (
                                <button
                                    disabled={isEdit}
                                    key={intv.months}
                                    type="button"
                                    className={`text-sm px-1 py-0.5 rounded border w-16 h-10 ${selectedInterval === intv.months ? 'bg-slate-700 text-white' : 'bg-white text-gray-700'}`}
                                    onClick={() => pickInterval(intv.months)}
                                >
                                    {intv.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date: 2 columns */}
                    <div className="col-span-2 flex flex-col">
                        <label htmlFor="date" className="font-medium text-secondary">Date</label>
                        <DatePicker
                            disabled={isEdit}
                            customInput={<CustomInput disabled={isEdit} />}
                            selected={masterData?.docDate ? new Date(masterData.docDate) : new Date()}
                            id="SalesDate"
                            name="SalesDate"
                            dateFormat="dd-MM-yyyy"
                            className="border rounded p-1 w-full bg-white text-secondary h-[34px]"
                            onChange={e => setMasterData(prev => ({ ...prev, docDate: e }))}
                        />
                    </div>
                </div>

            </div>


            <div className="p-3 mt-5 bg-white shadow rounded">
                <TransactionItemWithDiscountDataGrid
                    disabled={isEdit}
                    height={220}
                    className={"p-2"}
                    customStore={salesItemStore}
                    gridRef={gridRef}
                    onNew={handleAddNewRow}
                    onSelect={onLookUpSelected}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    setItemGroup={setIsNormalItem}
                    setActiveItem={setCurrentActiveRow}
                />
            </div>

            <div className={isNormalItem ? "mt-3 p-2 bg-white shadow rounded w-full opacity-30" : "mt-3 p-2 bg-white shadow rounded w-full"}>
                <div className="mb-4 flex space-x-4 w-full">
                    {["Old RX", "Prescribed RX", "Actual RX"].map((tab) => (
                        <div key={tab} className="relative flex-1">
                            <button
                                disabled={isNormalItem}
                                className={`w-full flex justify-center items-center gap-1 px-4 py-2 font-medium border-b-2 text-center relative ${activeRxTab === tab
                                    ? "text-secondary after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b-2 after:border-primary after:bg-white"
                                    : "text-gray-500 hover:text-secondary"
                                    }`}
                                onClick={() => {
                                    setActiveRxTab(tab);
                                    setActiveRxMode("Distance");
                                }}
                            >
                                {tab}
                            </button>

                            <button
                                disabled={isNormalItem}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveRxTab(tab);
                                    setShowCopyModal(true);
                                }}
                                title={`Copy ${tab} to ${tab === "Prescribed RX" ? "Actual RX" : "Prescribed RX"}`}
                                className="text-secondary bg-gray-100 absolute top-1/3 right-2 -translate-y-1/2 text-sm px-2 py-1 border rounded hover:text-primary"
                            >
                                <Copy size={20} />
                            </button>
                        </div>
                    ))}
                </div>



                <div className="grid grid-cols-[7%,15%,7%,15%,20%,auto] items-center gap-3 w-full">
                    <label className={(activeRxTab === "Prescribed RX" || (activeRxTab === "Old RX" && currentActiveRow?.isSpectacles)) ? "font-medium text-sm text-secondary" : "invisible font-medium text-sm text-secondary"}>Optical Height</label>
                    <input
                        disabled={activeRxTab === "Old RX" ? (currentActiveRow?.isSpectacles ? !isSpecNew : isNormalItem ? isNormalItem : !isLensNew) : isNormalItem}
                        type="text"
                        className={(activeRxTab === "Prescribed RX" || (activeRxTab === "Old RX" && currentActiveRow?.isSpectacles)) ? "border rounded px-2 py-1 bg-white text-secondary w-full" : "border rounded px-2 py-1 bg-white text-secondary w-full invisible"}
                        placeholder="Enter"
                        value={(activeRxTab === "Old RX" && currentActiveRow?.isSpectacles) ? oldSpecRX?.actualRXSpectacles?.opticalHeight : activeRxTab === "Prescribed RX" ? prescribedRX?.opticalHeight : actualRX?.opticalHeight}
                        onChange={(e) =>
                            (activeRxTab === "Old RX" && currentActiveRow?.isSpectacles)
                                ? setOldSpecRX({
                                    ...oldSpecRX,
                                    actualRXSpectacles: {
                                        ...oldSpecRX.actualRXSpectacles,
                                        opticalHeight: e.target.value
                                    }
                                })
                                : activeRxTab === "Prescribed RX"
                                    ? setPrescribedRX({ ...prescribedRX, opticalHeight: e.target.value })
                                    : setActualRX({ ...actualRX, opticalHeight: e.target.value })
                        }
                    />

                    <label className={(activeRxTab === "Prescribed RX" || (activeRxTab === "Old RX" && currentActiveRow?.isSpectacles)) ? "font-medium text-sm text-secondary" : "invisible font-medium text-sm text-secondary"}>Segment Height</label>
                    <input
                        disabled={activeRxTab === "Old RX" ? (currentActiveRow?.isSpectacles ? !isSpecNew : isNormalItem ? isNormalItem : !isLensNew) : isNormalItem}
                        type="text"
                        placeholder="Enter"
                        className={(activeRxTab === "Prescribed RX" || (activeRxTab === "Old RX" && currentActiveRow?.isSpectacles)) ? "border rounded px-2 py-1 bg-white text-secondary w-full" : "border rounded px-2 py-1 bg-white text-secondary w-full invisible"}
                        value={(activeRxTab === "Old RX" && currentActiveRow?.isSpectacles) ? oldSpecRX?.actualRXSpectacles?.segmentHeight : activeRxTab === "Prescribed RX" ? prescribedRX?.segmentHeight : actualRX?.segmentHeight}
                        onChange={(e) =>
                            (activeRxTab === "Old RX" && currentActiveRow?.isSpectacles)
                                ? setOldSpecRX({
                                    ...oldSpecRX,
                                    actualRXSpectacles: {
                                        ...oldSpecRX.actualRXSpectacles,
                                        segmentHeight: e.target.value
                                    }
                                })
                                : activeRxTab === "Prescribed RX"
                                    ? setPrescribedRX({ ...prescribedRX, segmentHeight: e.target.value })
                                    : setActualRX({ ...actualRX, segmentHeight: e.target.value })
                        }
                    />

                    <div className={(activeRxTab === "Prescribed RX" || (activeRxTab === "Old RX" && currentActiveRow?.isSpectacles)) ? "flex items-center space-x-2 col-span-2 " : "invisible items-center space-x-2 col-span-2"}>
                        <span className="font-medium text-sm text-secondary">Dominant Eye:</span>

                        <label className="inline-flex items-center text-secondary ">
                            <input
                                disabled={activeRxTab === "Old RX" ? (currentActiveRow?.isSpectacles ? !isSpecNew : isNormalItem ? isNormalItem : !isLensNew) : isNormalItem}
                                type="checkbox"
                                className="mr-1 accent-white bg-white"
                                checked={(activeRxTab === "Old RX" && currentActiveRow?.isSpectacles) ? oldSpecRX?.actualRXSpectacles?.dominantEye === "left" : activeRxTab === "Prescribed RX" ? prescribedRX?.dominantEye === "left" : actualRX?.dominantEye === "left"}
                                onChange={(e) =>
                                    (activeRxTab === "Old RX" && currentActiveRow?.isSpectacles)
                                        ? setOldSpecRX({
                                            ...oldSpecRX,
                                            actualRXSpectacles: {
                                                ...oldSpecRX.actualRXSpectacles,
                                                dominantEye: e.target.checked ? "left" : ""
                                            }
                                        })
                                        : activeRxTab === "Prescribed RX"
                                            ? setPrescribedRX({ ...prescribedRX, dominantEye: e.target.checked ? "left" : "" })
                                            : setActualRX({ ...actualRX, dominantEye: e.target.checked ? "left" : "" })
                                }
                            />
                            Left
                        </label>

                        <label className="inline-flex items-center text-secondary ">
                            <input
                                disabled={activeRxTab === "Old RX" ? (currentActiveRow?.isSpectacles ? !isSpecNew : isNormalItem ? isNormalItem : !isLensNew) : isNormalItem}
                                type="checkbox"
                                className="mr-1 accent-white bg-white"
                                checked={(activeRxTab === "Old RX" && currentActiveRow?.isSpectacles) ? oldSpecRX?.actualRXSpectacles?.dominantEye === "right" : activeRxTab === "Prescribed RX" ? prescribedRX?.dominantEye === "right" : actualRX?.dominantEye === "right"}
                                onChange={(e) =>
                                    (activeRxTab === "Old RX" && currentActiveRow?.isSpectacles)
                                        ? setOldSpecRX({
                                            ...oldSpecRX,
                                            actualRXSpectacles: {
                                                ...oldSpecRX.actualRXSpectacles,
                                                dominantEye: e.target.checked ? "right" : ""
                                            }
                                        })
                                        : activeRxTab === "Prescribed RX"
                                            ? setPrescribedRX({ ...prescribedRX, dominantEye: e.target.checked ? "right" : "" })
                                            : setActualRX({ ...actualRX, dominantEye: e.target.checked ? "right" : "" })
                                }
                            />
                            Right
                        </label>
                    </div>
                </div>

                <div className="space-y-2">


                    <div className="overflow-x-auto flex flex-row">
                        <div className="px-2 py-4">
                            {(currentActiveRow?.isContactLens ? ["ContactLens"] : ["Distance", "Reading"])
                                .map((mode) => (
                                    <button
                                        disabled={activeRxTab === "Old RX" ? (currentActiveRow?.isSpectacles ? !isSpecNew : isNormalItem ? isNormalItem : !isLensNew) : isNormalItem}
                                        key={mode}
                                        onClick={() => setActiveRxMode(mode)}
                                        className={`px-1 py-1 border rounded text-sm w-full font-medium ${activeRxMode === mode
                                            ? "bg-primary text-white"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        {mode === "ContactLens" ? "Contact Lens" : mode}
                                    </button>
                                ))}

                        </div>
                        <table className="min-w-[80%] border mt-2 text-sm">
                            <thead className="bg-gray-100 text-secondary">
                                <tr>
                                    <th className="border px-2 py-1 text-left w-20">Eye</th>
                                    {rxParams.map((field) => (
                                        <th key={field} className="border px-2 py-1 text-left">{field}</th>
                                    ))}
                                    <th className="border px-2 py-1 text-center">Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {["Right", "Left"].map((eye) => (
                                    <tr key={eye}>
                                        <td className="border px-2 py-1 font-medium text-secondary">{eye}</td>
                                        {rxParams.map((field) => {
                                            const key = `${eye === "Left" ? "l" : "r"}_${dataFieldMapping[activeRxMode]}_${field}`;
                                            return (
                                                <td key={field} className="border px-2 py-1 text-left text-secondary bg-white">
                                                    <input
                                                        disabled={activeRxTab === "Old RX" ? (currentActiveRow?.isSpectacles ? !isSpecNew : isNormalItem ? isNormalItem : !isLensNew) : isNormalItem}
                                                        type="number"
                                                        step={field === "AXIS" ? "1" : "0.25"}
                                                        className="w-full border rounded px-1 py-0.5 text-left text-secondary bg-white"
                                                        value={(activeRxTab === "Old RX" && currentActiveRow?.isSpectacles) ? getRxData()?.actualRXSpectacles?.[key] || "" : getRxData()?.[key] || ""}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (val === "" || decimalRegex.test(val)) {
                                                                handleRxChange(
                                                                    eye === "Left" ? "l" : "r",
                                                                    dataFieldMapping[activeRxMode],
                                                                    field,
                                                                    val
                                                                );
                                                            }
                                                        }}
                                                        onBlur={(e) => {
                                                            const raw = parseFloat(e.target.value);
                                                            if (!isNaN(raw)) {
                                                                const isPD = field === "PD";
                                                                const isAxis = field === "AXIS";
                                                                const newVal = isAxis
                                                                    ? Math.round(raw).toString()
                                                                    : isPD
                                                                        ? raw.toFixed(2)
                                                                        : roundUpToQuarter(raw).toFixed(2);
                                                                handleRxChange(
                                                                    eye === "Left" ? "l" : "r",
                                                                    dataFieldMapping[activeRxMode],
                                                                    field,
                                                                    newVal
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </td>
                                            );
                                        })}
                                        <td className="border px-2 py-1 text-left">
                                            <input
                                                disabled={isNormalItem}
                                                type="text"
                                                className="w-28 border rounded px-1 py-0.5 text-left text-secondary bg-white"
                                                value={getRxData()?.[`${eye === "Left" ? "l" : "r"}_${dataFieldMapping[activeRxMode]}_Remark`] || ""}
                                                onChange={(e) => {
                                                    const remarkKey = `${eye === "Left" ? "l" : "r"}_${dataFieldMapping[activeRxMode]}_Remark`;
                                                    const setter = getRxSetter();
                                                    setter((prev) => ({
                                                        ...prev,
                                                        [remarkKey]: e.target.value
                                                    }));
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="w-full mt-3 bg-white shadow rounded p-4 mb-4">
                <label htmlFor="remark" className="font-medium text-secondary">Remark</label>
                <div></div>
                <textarea
                    id="remark"
                    name="remark"
                    rows={2}
                    className="border rounded p-1 w-full resize-none bg-white justify-self-end"
                    placeholder="Enter remarks…"
                    onChange={e => setMasterData(prev => ({ ...prev, remark: e.target.value }))}
                    value={masterData?.remark ?? ""}
                />
            </div>

            <div className="w-full mt-3 bg-white shadow rounded p-4 mb-4">
                <div className="w-full grid grid-cols-3 gap-6 items-start text-sm text-secondary font-medium">


                    <div className="flex flex-col">
                        <label className="mb-1 text-xl font-bold">Status</label>
                        <div className="flex flex-col space-y-1">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={masterData?.isReady}
                                    onChange={(e) => setMasterData(prev => ({ ...prev, isReady: e.target.checked }))}
                                    className="mr-1 accent-white"
                                />
                                Ready
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={masterData?.isCollected}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setMasterData(prev => ({ ...prev, isReady: e.target.checked }))
                                        }
                                        setMasterData(prev => ({ ...prev, isCollected: e.target.checked }))
                                    }}
                                    className="mr-1 accent-white"
                                />
                                Collected
                            </label>
                        </div>
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
                            { label: "Subtotal", value: currentTotal },
                            { label: "Rounding Adj", value: rounding },
                            { label: "Total", value: total },
                            // { label: "Balance", value: balance }
                        ].map(({ label, value }) => (
                            <div key={label} className="grid grid-cols-[auto,30%] gap-1">
                                <label className="font-extrabold py-2 px-4 justify-self-end text-[15px]" >{label}</label>
                                {label === "Rounding Adj" ? (
                                    <input
                                        disabled={isEdit}
                                        type="number"
                                        step="0.01"
                                        value={rounding}
                                        onChange={(e) => { setRounding(e.target.value) }}
                                        onBlur={() => {
                                            const parsed = parseFloat(rounding);
                                            setRounding(isNaN(parsed) ? "0.00" : parsed.toFixed(2));
                                        }}
                                        className=" border rounded px-5 py-2 bg-white w-full min-h-5 text-right "
                                    />

                                ) : (
                                    <div className="border rounded px-5 py-2 bg-gray-100 w-full min-h-5 text-right">
                                        {value?.toFixed(2)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                </div>


            </div>
            <div className="bg-white border-t p-4 sticky bottom-0 flex flex-row place-content-between z-10">
                <div className="flex flex-row gap-1">
                    <DropDownBox
                        id="SalesOrderSelection"
                        className="border rounded w-full"
                        value={selectedSalesOrder?.salesOrderId}
                        opened={isSalesOrderGridBoxOpened}
                        openOnFieldClick={true}
                        valueExpr={"salesOrderId"}
                        displayExpr={(item) => item && `${item.docNo ?? ""}`}
                        placeholder="Search"
                        showClearButton={false}
                        showDropDownButton={true}
                        onValueChanged={handleSalesOrderGridBoxValueChanged}
                        dataSource={salesOrderStore}
                        onOptionChanged={onSalesOrderGridBoxOpened}
                        contentRender={SalesOrderDataGridRender}
                        dropDownOptions={{
                            width: 900
                        }}
                    />
                    <button onClick={handleClear} className="bg-red-600 flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
                        Clear
                    </button>
                </div>

                <div className="w-full flex flex-row justify-end">

                    <button className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]"
                        onClick={() => {
                            if (selectedSalesOrder.salesOrderId === "" || selectedSalesOrder.salesOrderId === null) {
                                setErrorModal({ title: "Collection Error", message: "Please Save current Sales Order first and select select a Sales Order to proceed" });
                                return;
                            }
                            setIsCollectModalOpen(true)
                        }}>
                        Collection
                    </button>
                    <button className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]"
                        onClick={() => setSalesOrderPayment(true)}>
                        Payment
                    </button>
                    {/* <button onClick={handleSavePrint} className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
                        Save & Print
                    </button>
                    <button onClick={handleSave} className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
                        Save
                    </button> */}
                </div>

                <SalesOrderPaymentModal
                    isOpen={salesOrderPayment}
                    onClose={() => setSalesOrderPayment(false)}
                    total={balance}
                    companyId={companyId}
                    userId={userId}
                    salesOrderId={masterData?.salesOrderId}
                    onError={setErrorModal}
                    onSave={handleSaveAfterPayment}
                />

                <CollectItemModal
                    isOpen={isCollectModalOpen}
                    onClose={() => setIsCollectModalOpen(false)}
                    salesOrder={masterData}
                    companyId={companyId}
                    userId={userId}
                    ref={gridRef}
                />
            </div>
        </>
    )
}

export default SalesOrder;