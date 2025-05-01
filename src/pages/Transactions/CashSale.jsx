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
import ErrorModal from "../../modals/ErrorModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import NotificationModal from "../../modals/NotificationModal";
import { getInfoLookUp } from "../../api/infolookupapi";
import { GetSpecificUser } from "../../api/userapi";
import TransactionItemWithDiscountDataGrid from "../../Components/DataGrid/Transactions/TransactionItemDataGridWithDisc";
import { SaveDebtor, NewDebtor, GetDebtor } from "../../api/maintenanceapi";
import AddCustomerModal from "../../modals/MasterData/Customer/AddCustomerModal";

import CashSalesPaymentModal from "../../modals/Transactions/CashSalesPaymentModal";
import { NewCashSales, NewCashSalesDetail, SaveCashSale } from "../../api/transactionapi";

const CustomerGridBoxDisplayExpr = (item) => item && `${item.debtorCode}`;
const SalesPersonGridBoxDisplayExpr = (item) => item && `${item.userName}`;
const CustomerGridColumns = [
    { dataField: "debtorCode", caption: "Code", width: "30%" },
    { dataField: "companyName", caption: "Name", width: "50%" }
];
const SalesPersonGridColumns = [
    { dataField: "userName", caption: "Name", width: "100%" }
];

const CashSales = () => {
    const companyId = sessionStorage.getItem("companyId");
    const userId = sessionStorage.getItem("userId");
    const [masterData, setMasterData] = useState(null);
    const [cashSalesItem, setCashSalesItem] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [rounding, setRounding] = useState("0.00")
    const [currentSalesTotal, setCurrentSalesTotal] = useState(0);

    const [isCustomerGridBoxOpened, setIsCustomerGridBoxOpened] = useState(false);
    const [CustomerGridBoxValue, setCustomerGridBoxValue] = useState({ id: "", Code: "", Name: "" });
    const [isSalesPersonGridBoxOpened, setIsSalePersonGridBoxOpened] = useState(false);
    const [SalesPersonGridBoxValue, setSalesPersonGridBoxValue] = useState({ id: "", Name: "" });
    const [newCustomer, setNewCustomer] = useState(null);
    const [showCustomerModal, setShowCustomerModal] = useState(false);

    const [cashSalesPayment, setCashSalesPayment] = useState(false);
    const [errorModal, setErrorModal] = useState({ title: "", message: "" });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: "", targetData: null });
    const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });

    const gridRef = useRef(null);

    const total = currentSalesTotal + parseFloat(rounding);

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
                totalCount: loadOptions.skip + res.data.count,
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
            setCustomerGridBoxValue({ id: selected.debtorId, Code: selected.debtorCode, Name: selected.companyName });
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
        [CustomerGridBoxValue, CustomerDataGridOnSelectionChanged],
    );

    const handleCustomerGridBoxValueChanged = (e) => {
        if (!e.value) {
            setCustomerGridBoxValue({ id: "", Code: "", Name: "" });
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
                selectedRowKeys={SalesPersonGridBoxValue.id}
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
        [SalesPersonGridBoxValue, SalesPersonDataGridOnSelectionChanged],
    );

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
            if (exists) {
                return prev.map(record =>
                    record.cashSalesDetailId === data.cashSalesDetailId ? { ...record, ...data } : record
                );
            } else {
                return [...prev, data];
            }
        })
    };

    const handleAddNewRow = async () => {
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

                    if ('qty' in changedData || 'unitCost' in changedData || 'discount' in changedData || 'discountAmount' in changedData) {
                        const qty = Number(updatedRecord.qty) || 0;
                        const unitPrice = Number(updatedRecord.price) || 0;
                        const isDiscByPercent = updatedRecord.discount;
                        const discAmt = Number(updatedRecord.discountAmount || 0)
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

        setCurrentSalesTotal(total);
    }, [handleEditRow])

    const handleRemoveRow = async (key) => {
        setCashSalesItem(prev => prev.filter(record => record.cashSalesDetailId !== key));
    }

    const confirmAction = async () => {
        try {
            const res = await SaveCashSale({ ...confirmModal.data });
            if (res.success) {
                setNotifyModal({ isOpen: true, message: "Cash Sales added successfully!" });
            } else throw new Error(res.errorMessage || "Failed to Add Cash Sales");
        } catch (error) {
            setErrorModal({ title: "Error", message: error.message });
            await createNewCashSales()
            setCustomerGridBoxValue({ id: "", Code: "", Name: "" })
            setSalesPersonGridBoxValue({ id: "", Code: "", Name: "" })
            setCashSalesItem([]);
            setCurrentSalesTotal(0);
        }
        if (confirmModal.action === "addPrint") {
            console.log("print acknowledgement");
        }
        setConfirmModal({ isOpen: false, action: "", data: null });
        await createNewCashSales()
        setCustomerGridBoxValue({ id: "", Code: "", Name: "" })
        setSalesPersonGridBoxValue({ id: "", Code: "", Name: "" })
        setCashSalesItem([]);
        setCurrentSalesTotal(0);
        return;
    }

    const handleSavePrint = () => {
        if (cashSalesItem.length <= 0) {
            return;
        }
        const formData = {
            ...masterData,
            isVoid: false,
            debtorId: CustomerGridBoxValue?.id,
            debtorName: CustomerGridBoxValue?.Name,
            salesPersonUserID: SalesPersonGridBoxValue.id,
            details: cashSalesItem.map((item) => ({
                cashSalesDetailId: item.cashSalesDetailId ?? "",
                itemId: item.itemId ?? "",
                itemUOMId: item.itemUOMId ?? "",
                description: item.description ?? "",
                desc2: item.desc2 ?? "",
                qty: item.qty ?? 0,
                unitPrice: item.unitPrice ?? 0,
                discount: item.discount ? "percent" : "rate" ?? "rate",
                discountAmount: item.discountAmount ?? 0,
                subTotal: item.subTotal ?? 0,
                classification: item.classification ?? ""
            })),
            roundingAdjustment: rounding ?? 0,
            total: total,
        }
        setConfirmModal({
            isOpen: true,
            action: "addPrint",
            data: formData,
        })
    }

    const handleSave = () => {
        if (cashSalesItem.length <= 0) {
            return;
        }
        const formData = {
            ...masterData,
            isVoid: false,
            debtorId: CustomerGridBoxValue?.id,
            debtorName: CustomerGridBoxValue?.Name,
            salesPersonUserID: SalesPersonGridBoxValue.id,
            details: cashSalesItem.map((item) => ({
                cashSalesDetailId: item.cashSalesDetailId ?? "",
                itemId: item.itemId ?? "",
                itemUOMId: item.itemUOMId ?? "",
                description: item.description ?? "",
                desc2: item.desc2 ?? "",
                qty: item.qty ?? 0,
                unitPrice: item.price ?? 0,
                discount: item.discount ? "percent" : "rate" ?? "rate",
                discountAmount: item.discountAmount ?? 0,
                subTotal: item.subTotal ?? 0,
                classification: item.classification ?? ""
            })),
            roundingAdjustment: rounding ?? 0,
            total: total,
        }
        setConfirmModal({
            isOpen: true,
            action: "add",
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
                setNotifyModal({ isOpen: true, message: "Customer saved successfully!" });
                setNewCustomer(null);
            } else throw new Error(saveRes.errorMessage || "Failed to save customer.");

        } catch (error) {
            setErrorModal({ title: `Save Error`, message: error.message });
        } finally {
            showCustomerModal(false);
        }
    };


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

    return (
        <>
            <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
            <ConfirmationModal isOpen={confirmModal.isOpen} title={"Confirm Add"} message={"Are you sure you want to add Goods Transit?"} onConfirm={confirmAction} onCancel={() => setConfirmModal({ isOpen: false, type: "", targetUser: null })} />
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
                                    className="border rounded p-1 w-1/2 h-[34px]"
                                    value={CustomerGridBoxValue?.id || null}
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
                                    id="CustomerName"
                                    name="CustomerName"
                                    rows={1}
                                    className="border rounded p-2 w-full resize-none bg-white text-secondary"
                                    placeholder="Name"
                                    onChange={() => { }}
                                    value={CustomerGridBoxValue.Name}
                                />
                                <button
                                    className="flex justify-center items-center w-3 h-[34px] text-secondary hover:bg-grey-500 hover:text-primary"
                                    onClick={() => {
                                        handleNewCustomerModel()
                                    }}
                                >
                                    ...</button>
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
                            selected={masterData?.docDate ?? new Date().toISOString().slice(0, 10)}
                            id="SalesDate"
                            name="SalesDate"
                            dateFormat="dd-MM-yyyy"
                            className="border rounded p-1 w-full bg-white h-[34px]"
                            onChange={e => setMasterData(prev => ({ ...prev, docDate: e.toISOString().slice(0, 10) }))}
                        />

                    </div>
                    <div className="flex flex-col gap-1 w-1/2">
                        <label htmlFor="salesPerson" className="font-medium text-secondary">Sales Person</label>
                        <DropDownBox
                            id="SalesPersonSelection"
                            className="border rounded w-full"
                            value={SalesPersonGridBoxValue.id}
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

            <div className="mt-3 bg-white shadow rounded">
                {/* <SalesOrderItemTable data={SalesItemTableData} onDataChange={handleSalesItemChange} height={330} itemSource={itemStore} /> */}
                <TransactionItemWithDiscountDataGrid
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
                <div className="w-full grid grid-cols-2 gap-6 items-start text-sm text-secondary font-medium">


                    <div className="flex flex-col">

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
                                        type="number"
                                        step="0.01"
                                        value={rounding}
                                        onChange={(e) => setRounding(e.target.value)}
                                        onBlur={() => {
                                            const parsed = parseFloat(rounding);
                                            setRounding(isNaN(parsed) ? "0.00" : parsed.toFixed(2));
                                        }}
                                        className=" border rounded px-1 py-2 bg-white w-full min-h-5 text-right "
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
            <div className="flex flex-row place-content-between">
                <div className="flex flex-row">
                    <input
                        type="text"
                        placeholder="search"
                        className="p-2 w-44 m-[2px]"
                    />
                    <button className="bg-red-600 flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
                        Clear
                    </button>

                </div>

                <div className="w-ful flex flex-row justify-end">
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
                    total={total}
                    companyId={companyId}
                    userId={userId}
                    salesOrderId={masterData?.cashSalesId}
                    onError={setErrorModal}
                />
            </div>
        </>
    )

}

export default CashSales;