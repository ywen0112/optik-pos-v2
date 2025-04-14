import { useState, useEffect, useRef, useCallback } from "react";
import DataGrid, {
    Column,
    ColumnChooser,
    Paging,
    Editing,
    ColumnFixing,
    Button,
    Selection,
    FilterRow,
    Scrolling,
    SearchPanel
} from 'devextreme-react/data-grid';
import DropDownBox from 'devextreme-react/drop-down-box';
import Switch from 'react-switch';
import DatePicker from "react-datepicker";
import SalesOrderItemTable from "../../Components/DataGrid/SalesOrderItemDataGrid";
import ConfirmationModal from "../../modals/ConfirmationModal";
import { Copy } from "lucide-react";


const initialData = [
    { id: 1, itemCode: 'A100', description: 'Widget', uom: 'pcs', qty: 10, unitPrice: 5.0 },
    { id: 2, itemCode: 'B200', description: 'Gadget', uom: 'pcs', qty: 5, unitPrice: 12.5 },
    { id: 3, itemCode: 'C100', description: 'WidgetBox', uom: 'pcs', qty: 10, unitPrice: 15.0 },
    { id: 4, itemCode: 'D200', description: 'GadgetBox', uom: 'pcs', qty: 5, unitPrice: 22.5 },
];

const customerData = [
    { id: 1, Code: '300-001', Name: 'abc' },
    { id: 2, Code: '300-002', Name: 'abcd' },
    { id: 3, Code: '300-003', Name: 'abcde' },
]

const CustomerGridBoxDisplayExpr = (item) => item && `${item.Code}`;
const SalesPersonGridBoxDisplayExpr = (item) => item && `${item.Name}(${item.Code})`;
const PractionerGridBoxDisplayExpr = (item) => item && `${item.Name}(${item.Code})`;
const CustomerGridColumns = ["Code", "Name"]

const SalesOrder = () => {
    const [date, setDate] = useState(new Date());
    const [nextVisit, setNextVisit] = useState('');
    const [selectedInterval, setSelectedInterval] = useState(null);
    const [CustomerGridBoxValue, setCustomerGridBoxValue] = useState({ id: "", Code: "", Name: "" });
    const [isCustomerGridBoxOpened, setIsCustomerGridBoxOpened] = useState(false);
    const [isSalesPersonGridBoxOpened, setIsSalePersonGridBoxOpened] = useState(false);
    const [SalesPersonGridBoxValue, setSalesPersonGridBoxValue] = useState({ id: "", Code: "", Name: "" });
    const [isPractionerGridBoxOpened, setIsPractionerGridBoxOpened] = useState(false);
    const [PractionerGridBoxValue, setPractionerGridBoxValue] = useState({ id: "", Code: "", Name: "" });
    const [SalesItemTableData, setSalesItemTableData] = useState([]);
    const [currentSalesTotal, setCurrentSalesTotal] = useState(0);

    const [rounding, setRounding] = useState("0.00")

    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState("");


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
        setNextVisit(calcDate(date, months));
    };

    useEffect(() => {
        if (selectedInterval !== null) {
            setNextVisit(calcDate(date, selectedInterval));
        }
    }, [date]);

    const CustomerDataGridOnSelectionChanged = useCallback((e) => {
        const selected = e.selectedRowsData?.[0];
        if (selected) {
            setCustomerGridBoxValue(selected);
            setIsCustomerGridBoxOpened(false);
        }
    }, []);

    const CustomerDataGridRender = useCallback(
        () => (
            <DataGrid
                dataSource={customerData}
                columns={CustomerGridColumns}
                hoverStateEnabled={true}
                showBorders={false}
                selectedRowKeys={CustomerGridBoxValue.id}
                onSelectionChanged={CustomerDataGridOnSelectionChanged}
                height="100%"
            >
                <Selection mode="single" />
                <Scrolling mode="virtual" />
                <Paging
                    enabled={true}
                    pageSize={10}
                />
                <SearchPanel
                    visible={true}
                    onTextChange={(e) => { console.log(e) }}
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
            setSalesPersonGridBoxValue(selected);
            setIsSalePersonGridBoxOpened(false);
        }
    }, []);

    const SalesPersonDataGridRender = useCallback(
        () => (
            <DataGrid
                dataSource={customerData}
                columns={CustomerGridColumns}
                hoverStateEnabled={true}
                showBorders={false}
                selectedRowKeys={SalesPersonGridBoxValue.id}
                onSelectionChanged={SalesPersonDataGridOnSelectionChanged}
                height="100%"
            >
                <Selection mode="single" />
                <Scrolling mode="virtual" />
                <Paging
                    enabled={true}
                    pageSize={10}
                />
                <SearchPanel
                    visible={true}
                    onTextChange={(e) => { console.log(e) }}
                    width="100%"
                    highlightSearchText={true}
                />
            </DataGrid>
        ),
        [SalesPersonGridBoxValue, SalesPersonDataGridOnSelectionChanged],
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
            setPractionerGridBoxValue(selected);
            setIsPractionerGridBoxOpened(false);
        }
    }, []);

    const PractionerDataGridRender = useCallback(
        () => (
            <DataGrid
                dataSource={customerData}
                columns={CustomerGridColumns}
                hoverStateEnabled={true}
                showBorders={false}
                selectedRowKeys={PractionerGridBoxValue.id}
                onSelectionChanged={PractionerDataGridOnSelectionChanged}
                height="100%"
            >
                <Selection mode="single" />
                <Scrolling mode="virtual" />
                <Paging
                    enabled={true}
                    pageSize={10}
                />
                <SearchPanel
                    visible={true}
                    onTextChange={(e) => { console.log(e) }}
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

    const handleSalesItemChange = (updatedData) => {
        const totalAmount = updatedData.reduce((sum, item) => {
            if (item.amount) {
                return sum + item.amount
            }
            return sum;
        }, 0);
        setCurrentSalesTotal(totalAmount);
    };

    const getNextCustomerCode = () => {
        const maxCode = customerData.reduce((max, c) => {
            const num = parseInt(c.Code.split("-")[1]);
            return num > max ? num : max;
        }, 0);
        const nextNum = String(maxCode + 1).padStart(3, "0");
        return `300-${nextNum}`;
    };

    const handleSaveNewCustomer = () => {
        if (!newCustomerName.trim()) return;

        const newCode = getNextCustomerCode();
        const newCustomer = {
            id: customerData.length + 1,
            Code: newCode,
            Name: newCustomerName,
        };

        customerData.push(newCustomer); // If this is static, useState needed for reactivity
        setCustomerGridBoxValue(newCustomer);
        setShowCustomerModal(false);
        setNewCustomerName("");
    };

    //Eye Power
    const [activeRxTab, setActiveRxTab] = useState("Prescribed RX");
    const [eyePowerData, setEyePowerData] = useState({
        "Prescribed RX": { opticalHeight: "", segmentHeight: "", dominantLeft: false, dominantRight: false },
        "Actual RX": { opticalHeight: "", segmentHeight: "", dominantLeft: false, dominantRight: false }
    });
    const [showCopyModal, setShowCopyModal] = useState(false);

    const handleEyePowerChange = (tab, field, value) => {
        setEyePowerData(prev => ({
            ...prev,
            [tab]: {
                ...prev[tab],
                dominantLeft: field === "dominantLeft" ? value : false,
                dominantRight: field === "dominantRight" ? value : false
            }
        }));
    };

    const handleCopyRxData = () => {
        const sourceTab = activeRxTab;
        const targetTab = activeRxTab === "Prescribed RX" ? "Actual RX" : "Prescribed RX";

        setEyePowerData((prev) => ({
            ...prev,
            [targetTab]: { ...prev[sourceTab] }
        }));

        const copiedRx = JSON.parse(JSON.stringify(rxValues[sourceTab]));
        setRxValues((prev) => ({
            ...prev,
            [targetTab]: copiedRx
        }));

        setShowCopyModal(false);
        setActiveRxTab(targetTab);
    };

    //Eye Power RX
    const [activeRxMode, setActiveRxMode] = useState("Distance");
    const rxParams = ["SPH", "CYL", "AXIS", "VA", "PRISM", "BC", "DIA", "ADD", "PD"];
    const [rxValues, setRxValues] = useState({
        "Prescribed RX": {
            Distance: { Left: {}, Right: {} },
            Reading: { Left: {}, Right: {} }
        },
        "Actual RX": {
            Distance: { Left: {}, Right: {} },
            Reading: { Left: {}, Right: {} }
        }
    });

    const handleRxChange = (rxTab, mode, eye, field, value) => {
        if (field === "REMARK") {
            setRxValues((prev) => ({
                ...prev,
                [rxTab]: {
                    ...prev[rxTab],
                    [mode]: {
                        ...prev[rxTab][mode],
                        [eye]: {
                            ...prev[rxTab][mode][eye],
                            [field]: value,
                        },
                    },
                },
            }));
            return;
        }

        if (value === "") {
            setRxValues((prev) => ({
                ...prev,
                [rxTab]: {
                    ...prev[rxTab],
                    [mode]: {
                        ...prev[rxTab][mode],
                        [eye]: {
                            ...prev[rxTab][mode][eye],
                            [field]: "",
                        },
                    },
                },
            }));
            return;
        }

        const regex = /^\d*(\.\d{0,2})?$/;
        if (regex.test(value)) {
            setRxValues((prev) => ({
                ...prev,
                [rxTab]: {
                    ...prev[rxTab],
                    [mode]: {
                        ...prev[rxTab][mode],
                        [eye]: {
                            ...prev[rxTab][mode][eye],
                            [field]: value,
                        },
                    },
                },
            }));
        }
    };

    //Summary
    const [securityDeposit, setSecurityDeposit] = useState("");
    const [statusReady, setStatusReady] = useState(false);
    const [statusCollected, setStatusCollected] = useState(false);

    const handleSecurityDepositChange = (value) => {
        if (value === "") {
            setSecurityDeposit("");
            return;
        }

        const regex = /^\d*(\.\d{0,2})?$/;
        if (regex.test(value)) {
            setSecurityDeposit(value);
        }
    };
    const total = currentSalesTotal + parseFloat(rounding);
    const balance = total - parseFloat(securityDeposit || 0);

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
                                    valueExpr='id'
                                    displayExpr={CustomerGridBoxDisplayExpr}
                                    placeholder="Select Customer"
                                    showClearButton={true}
                                    onValueChanged={handleCustomerGridBoxValueChanged}
                                    dataSource={customerData}
                                    onOptionChanged={onCustomerGridBoxOpened}
                                    contentRender={CustomerDataGridRender}
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
                                    onClick={() => setShowCustomerModal(true)}
                                >
                                    ...</button>
                            </div>
                        </div>
                    </div>

                    {showCustomerModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                            <div className="bg-white p-6 rounded shadow-md w-96 space-y-4">
                                <h2 className="text-lg font-semibold text-gray-800">Add Customer</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Code</label>
                                        <input
                                            type="text"
                                            value={getNextCustomerCode()}
                                            readOnly
                                            className="text-sm w-full border rounded px-2 py-1 bg-gray-100 text-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            value={newCustomerName}
                                            onChange={(e) => setNewCustomerName(e.target.value)}
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
                <div className="grid grid-cols-2 items-center gap-1">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="refNo" className="font-medium text-secondary">Ref No.</label>
                        <input
                            type="text"
                            id="refNo"
                            name="refNo"
                            className="border rounded p-1 w-full bg-white h-[34px]"
                            placeholder="Ref No"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
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
                    <div className="flex flex-col gap-1">
                        <label htmlFor="salesPerson" className="font-medium text-secondary">Sales Person</label>
                        <DropDownBox
                            id="SalesPersonSelection"
                            className="border rounded w-full"
                            value={SalesPersonGridBoxValue.id}
                            opened={isSalesPersonGridBoxOpened}
                            openOnFieldClick={true}
                            valueExpr='id'
                            displayExpr={SalesPersonGridBoxDisplayExpr}
                            placeholder="Select Sales Person"
                            showClearButton={true}
                            onValueChanged={handleSalesPersonGridBoxValueChanged}
                            dataSource={customerData}
                            onOptionChanged={onSalesPersonGridBoxOpened}
                            contentRender={SalesPersonDataGridRender}
                        />
                    </div>
                    <div className="flex flex-col row-span-2 self-start gap-1 mt-2">
                        <label htmlFor="nextVisit" className="font-medium text-secondary">Next Visit</label>
                        <div className="flex flex-col space-y-1 w-full z-30">
                            <DatePicker
                                selected={nextVisit}
                                id="nextVisit"
                                name="nextVisit"
                                dateFormat="dd-MM-yyyy"
                                placeholderText="dd-MM-yyyy"
                                className="border rounded p-1 w-full bg-white text-secondary h-[34px]"
                                onChange={e => {
                                    setSelectedInterval(null);
                                    setNextVisit(e);
                                }}
                            >
                                
                            </DatePicker>
                        </div>
                        <div className="ml-3 space-x-1">
                                    {intervals.map(intv => (
                                        <button
                                            key={intv.months}
                                            type="button"
                                            className={`
                                                text-sm px-1 py-0.5 rounded border w-16 h-10
                                                ${selectedInterval === intv.months
                                                    ? 'bg-slate-700 text-white'
                                                    : 'bg-white text-gray-700'
                                                }
                                        `}
                                            onClick={() => pickInterval(intv.months)}
                                        >
                                            {intv.label}
                                        </button>
                                    ))}
                                </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                        <label htmlFor="practitioner" className="font-medium text-secondary">Practitioner</label>
                        <DropDownBox
                            id="PractionerSelection"
                            className="border rounded w-full"
                            value={PractionerGridBoxValue.id}
                            opened={isPractionerGridBoxOpened}
                            openOnFieldClick={true}
                            valueExpr='id'
                            displayExpr={PractionerGridBoxDisplayExpr}
                            placeholder="Select Practioner"
                            showClearButton={true}
                            onValueChanged={handlePractionerGridBoxValueChanged}
                            dataSource={customerData}
                            onOptionChanged={onPractionerGridBoxOpened}
                            contentRender={PractionerDataGridRender}
                        />
                    </div>



                </div>
            </div>

            <div className="mt-3 bg-white shadow rounded">
                <SalesOrderItemTable data={SalesItemTableData} onDataChange={handleSalesItemChange} />
            </div>

            <div className="mt-3 p-2 bg-white shadow rounded w-full">
                <div className="mb-4 flex space-x-4 w-full">
                    {["Prescribed RX", "Actual RX"].map((tab) => (
                        <div key={tab} className="relative flex-1">
                            <button
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveRxTab(tab);
                                    setShowCopyModal(true);
                                }}
                                title={`Copy ${tab} to ${tab === "Prescribed RX" ? "Actual RX" : "Prescribed RX"}`}
                                className="text-secondary bg-gray-100 absolute top-1/3 right-2 -translate-y-1/2 text-sm px-2 py-1 border rounded hover:text-primary"
                            >
                                <Copy size={20}/>
                            </button>
                        </div>
                    ))}
                </div>

                <ConfirmationModal
                    isOpen={showCopyModal}
                    title="Copy RX Data"
                    message={`This will copy all RX data from "${activeRxTab}" to the other tab. Continue?`}
                    onConfirm={handleCopyRxData}
                    onCancel={() => setShowCopyModal(false)}
                />

                <div className="grid grid-cols-[10%,15%,10%,15%,20%,auto] items-center gap-3 w-full">
                    <label className={activeRxTab === "Prescribed RX" ? "font-medium text-sm text-secondary" : "invisible font-medium text-sm text-secondary" }>Optical Height</label>
                    <input
                        type="text"
                        className={activeRxTab === "Prescribed RX" ? "border rounded px-2 py-1 bg-white text-secondary w-full" : "border rounded px-2 py-1 bg-white text-secondary w-full invisible"}
                        placeholder="Enter"
                        value={eyePowerData[activeRxTab].opticalHeight}
                        onChange={(e) =>
                            handleEyePowerChange(activeRxTab, "opticalHeight", e.target.value)
                        }
                    />

                    <label className={activeRxTab === "Prescribed RX" ? "font-medium text-sm text-secondary" : "invisible font-medium text-sm text-secondary" }>Segment Height</label>
                    <input
                        type="text"
                        placeholder="Enter"
                        className={activeRxTab === "Prescribed RX" ? "border rounded px-2 py-1 bg-white text-secondary w-full" :"border rounded px-2 py-1 bg-white text-secondary w-full invisible"}
                        value={eyePowerData[activeRxTab].segmentHeight}
                        onChange={(e) =>
                            handleEyePowerChange(activeRxTab, "segmentHeight", e.target.value)
                        }
                    />

                    <div className={activeRxTab === "Prescribed RX" ? "flex items-center space-x-2 col-span-2 ": "invisible items-center space-x-2 col-span-2"}>
                        <span className="font-medium text-sm text-secondary">Dominant Eye:</span>

                        <label className="inline-flex items-center text-secondary ">
                            <input
                                type="checkbox"
                                className="mr-1 accent-white bg-white"
                                checked={eyePowerData[activeRxTab].dominantLeft}
                                onChange={(e) =>
                                    handleEyePowerChange(activeRxTab, "dominantLeft", e.target.checked)
                                }
                            />
                            Left
                        </label>

                        <label className="inline-flex items-center text-secondary ">
                            <input
                                type="checkbox"
                                className="mr-1 accent-white bg-white"
                                checked={eyePowerData[activeRxTab].dominantRight}
                                onChange={(e) =>
                                    handleEyePowerChange(activeRxTab, "dominantRight", e.target.checked)
                                }
                            />
                            Right
                        </label>
                    </div>
                </div>

                <div className=" space-y-2">
                    <div className="flex space-x-2">
                        {/* {["Distance", "Reading"].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setActiveRxMode(mode)}
                                className={`px-4 py-1 border rounded text-sm font-medium ${activeRxMode === mode
                                    ? "bg-primary text-white"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                {mode}
                            </button>
                        ))} */}
                    </div>

                    <div className="overflow-x-auto flex flex-row">
                        <div className="px-2 py-4">
                        {["Distance", "Reading"].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setActiveRxMode(mode)}
                                className={`px-4 py-1 border rounded text-sm font-medium ${activeRxMode === mode
                                    ? "bg-primary text-white"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                {mode}
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
                                {["Left", "Right"].map((eye) => (
                                    <tr key={eye}>
                                        <td className="border px-2 py-1 font-medium text-secondary">{eye}</td>
                                        {rxParams.map((field) => (
                                            <td key={field} className="border px-2 py-1 text-left text-secondary bg-white">
                                                <input
                                                    type="number"
                                                    step="0.25"
                                                    className="w-full border rounded px-1 py-0.5 text-left text-secondary bg-white"
                                                    value={rxValues[activeRxTab][activeRxMode][eye][field] || ""}
                                                    onChange={(e) =>
                                                        handleRxChange(activeRxTab, activeRxMode, eye, field, e.target.value)
                                                    }
                                                />
                                            </td>
                                        ))}
                                        <td className="border px-2 py-1 text-left">
                                            <input
                                                type="text"
                                                className="w-28 border rounded px-1 py-0.5 text-left text-secondary bg-white"
                                                value={rxValues[activeRxTab][activeRxMode][eye]["REMARK"] || ""}
                                                onChange={(e) =>
                                                    handleRxChange(activeRxTab, activeRxMode, eye, "REMARK", e.target.value)
                                                }
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
                <div className="w-full grid grid-cols-2 gap-6 items-start text-sm text-secondary font-medium">


                    <div className="flex flex-col">
                        <label className="mb-1 text-xl font-bold">Status</label>
                        <div className="flex flex-col space-y-1">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={statusReady}
                                    onChange={(e) => setStatusReady(e.target.checked)}
                                    className="mr-1 accent-white"
                                />
                                Ready
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={statusCollected}
                                    onChange={(e) => setStatusCollected(e.target.checked)}
                                    className="mr-1 accent-white"
                                />
                                Collected
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-1">
                        {[
                            { label: "Subtotal", value: currentSalesTotal },
                            { label: "Rounding Adj", value: rounding },
                            { label: "Total", value: total },
                            { label: "Balance", value: balance }
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
                    Collection
                </button>
                <button className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
                    Payment
                </button>
                <button className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
                    Save & Print
                </button>
                <button className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
                    Save
                </button>
                
                


            </div>
            </div>
        </>
    )
}

export default SalesOrder;