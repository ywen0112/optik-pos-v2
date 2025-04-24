import { useState, useEffect, useRef, useCallback } from "react";
import DataGrid, {
    Paging,
    Selection,
    Scrolling,
    SearchPanel,
    Pager
} from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import DropDownBox from 'devextreme-react/drop-down-box';
import DatePicker from "react-datepicker";
import SalesOrderItemTable from "../../Components/DataGrid/SalesOrderItemDataGrid";
import { getInfoLookUp } from "../../api/infolookupapi";
import { SaveDebtor, NewDebtor, GetDebtor, GetItem } from "../../api/maintenanceapi";
import { GetSpecificUser } from "../../api/userapi";
import CashSalesItemDataGrid from "../../Components/DataGrid/Transactions/CashSalesItemDataGrid";
import AddExpressCustomerModal from "../../modals/Transactions/AddCustomerModal";

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
    const [date, setDate] = useState(new Date());
    const [CustomerGridBoxValue, setCustomerGridBoxValue] = useState({ id: "", Code: "", Name: "" });
    const [newCustomer, setNewCustomer] = useState({ id: "", Code: "", Name: "" });
    const [isCustomerGridBoxOpened, setIsCustomerGridBoxOpened] = useState(false);
    const [isSalesPersonGridBoxOpened, setIsSalePersonGridBoxOpened] = useState(false);
    const [SalesPersonGridBoxValue, setSalesPersonGridBoxValue] = useState({ id: "", Name: "" });
    const [currentSalesTotal, setCurrentSalesTotal] = useState(0);
    const [rounding, setRounding] = useState("0.00")
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [SalesItemTableData, setSalesItemTableData] = useState([]);



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
                totalCount: loadOptions.skip + res.data.count,
            };
        },
        byKey: async (key) => {
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
                selectedRowKeys={CustomerGridBoxValue.debtorId}
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

    const handleSalesItemChange = (updatedData) => {
        const totalAmount = updatedData.reduce((sum, item) => {
            if (item.amount) {
                return sum + item.amount
            }
            return sum;
        }, 0);
        setCurrentSalesTotal(totalAmount);
    };

    const getNextCustomerCode = async () => {
        const newCusRes = await NewDebtor({
            companyId: companyId,
            userId: userId,
            id: userId,
        });
        setNewCustomer({ id: newCusRes.data.debtorId, Code: newCusRes.data.debtorCode, Name: newCusRes.data.companyName })
    };

    const handleNewCustomerModel = async () => {
        await getNextCustomerCode()
        setShowCustomerModal(true)
    }

    const handleSaveNewCustomer = async () => {
        if (!newCustomer.Name.trim()) return;
        const newCustomerRecord = {
            id: newCustomer.id,
            Code: newCustomer.Code,
            Name: newCustomer.Name,
        };
        const actionData = {
            companyId: companyId,
            userId: userId,
            id: userId,
        };
        const res = await SaveDebtor({
            actionData: actionData,
            debtorId: newCustomer.id,
            debtorCode: newCustomer.Code,
            companyName: newCustomer.Name,
            isActive: true,
        });
        if (res.success) {
            setCustomerGridBoxValue({ id: newCustomerRecord.id, Code: newCustomerRecord.Code, Name: newCustomerRecord.Name });
        }
        setNewCustomer({ id: "", Name: "", Code: "" })
        setShowCustomerModal(false);
    };

    const total = currentSalesTotal + parseFloat(rounding);

    return (
        <>
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
                                    value={CustomerGridBoxValue.id}
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
                        // <AddExpressCustomerModal/>
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                            <div className="bg-white p-6 rounded shadow-md w-96 space-y-4">
                                <h2 className="text-lg font-semibold text-gray-800">Add Customer</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Code</label>
                                        <input
                                            type="text"
                                            value={newCustomer.Code}
                                            readOnly
                                            className="text-sm w-full border rounded px-2 py-1 bg-gray-100 text-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            value={newCustomer.Name}
                                            onChange={(e) => setNewCustomer(prev => ({ ...prev, Name: e.target.value }))}
                                            className="w-full border rounded px-2 py-1 text-sm bg-white text-secondary"
                                            placeholder="Enter name"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        onClick={handleSaveNewCustomer}
                                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setShowCustomerModal(false)}
                                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
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
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-1/2">
                        <label htmlFor="date" className="font-medium text-secondary">Date</label>
                        <DatePicker
                            selected={date}
                            id="SalesDate"
                            name="SalesDate"
                            dateFormat="dd-MM-yyyy"
                            className="border rounded p-1 w-full bg-white h-[34px]"
                            onChange={e => setDate(e.toISOString().slice(0, 10))}
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
                <CashSalesItemDataGrid height={330} dataGridDataSource={SalesItemTableData} onSelectionChange={setSalesItemTableData}/>
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
                    <button className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
                        Payment
                    </button>
                    <button className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
                        Save & Print
                    </button>
                    <button className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]" onClick={() => console.log(CustomerGridBoxValue)}>
                        Save
                    </button>




                </div>
            </div>
        </>
    )
}

export default CashSales;