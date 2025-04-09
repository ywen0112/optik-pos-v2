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


const initialData = [
    { id: 1, itemCode: 'A100', description: 'Widget', uom: 'pcs', qty: 10, unitPrice: 5.0},
    { id: 2, itemCode: 'B200', description: 'Gadget', uom: 'pcs', qty: 5, unitPrice: 12.5},
    { id: 3, itemCode: 'C100', description: 'WidgetBox', uom: 'pcs', qty: 10, unitPrice: 15.0},
    { id: 4, itemCode: 'D200', description: 'GadgetBox', uom: 'pcs', qty: 5, unitPrice: 22.5},
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

    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState("");


    const intervals = [
        { label: '1 mth', months: 1 },
        { label: '3 mth', months: 3 },
        { label: '6 mth', months: 6 },
        { label: '9 mth', months: 9 },
        { label: '1 yr', months: 12 },
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

    const handleSalesItemChange = (updatedData) =>{
        const totalAmount = updatedData.reduce((sum, item)=>{
            if(item.amount){
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

    const handleEyePowerChange = (tab, field, value) => {
    setEyePowerData(prev => ({
        ...prev,
        [tab]: {
        ...prev[tab],
        [field]: value
        }
    }));
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

      const rounding = Math.round(currentSalesTotal * 0.06 * 100) / 100; // 6% tax for example
        const total = currentSalesTotal + rounding;
        const balance = total - parseFloat(securityDeposit || 0);

    return (
        <>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <div className="grid grid-cols-[auto,1fr] items-center gap-1">
                        <label htmlFor="customer" className="font-medium text-black" >
                            Customer
                        </label>
                        <div className="flex justify-end items-center gap-1">
                            <DropDownBox
                                id="CustomerSelection"
                                className="border rounded p-1 w-1/2"
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

                            <button
                            className="flex justify-center items-center w-3 h-3 text-black hover:bg-grey-500 hover:text-primary"
                            onClick={() => setShowCustomerModal(true)}
                            >
                            ...</button>
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

                    <div className="grid grid-cols-2 items-center gap-1">
                        <label htmlFor="customer" className="font-medium"></label>
                        <textarea
                            id="CustomerName"
                            name="CustomerName"
                            rows={1}
                            className="border rounded p-1 w-full resize-none bg-white text-black"
                            placeholder="Name"
                            onChange={() => { }}
                            value={CustomerGridBoxValue.Name}
                        />
                    </div>

                    <div className="grid grid-cols-2 items-start gap-1">
                        <label htmlFor="remark" className="font-medium text-black">Remark</label>
                        <textarea
                            id="remark"
                            name="remark"
                            rows={3}
                            className="border rounded p-1 w-full resize-none bg-white"
                            placeholder="Enter remarks…"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="grid grid-cols-2 items-center gap-1 text-black">
                        <label htmlFor="date" className="font-medium">Date</label>
                        <DatePicker
                            selected={date}
                            id="SalesDate"
                            name="SalesDate"
                            dateFormat="dd-MM-yyyy"
                            className="border rounded p-1 w-full bg-white"
                            onChange={e => setDate(e.toISOString().slice(0, 10))}
                        />

                    </div>

                    <div className="grid grid-cols-2 items-center gap-1">
                        <label htmlFor="refNo" className="font-medium text-black">Ref No.</label>
                        <input
                            type="text"
                            id="refNo"
                            name="refNo"
                            className="border rounded p-1 w-full bg-white"
                            placeholder="Ref No"
                        />
                    </div>

                    <div className="grid grid-cols-2 items-start gap-1">
                        <label htmlFor="nextVisit" className="font-medium text-black">Next Visit</label>
                        <div className="flex flex-col space-y-1 w-full">
                            <DatePicker
                                selected={nextVisit}
                                id="nextVisit"
                                name="nextVisit"
                                dateFormat="dd-MM-yyyy"
                                placeholderText="dd-MM-yyyy"
                                className="border rounded p-1 w-full bg-white text-black"
                                onChange={e => {
                                    setSelectedInterval(null);
                                    setNextVisit(e);
                                }}
                            />
                            <div className="flex flex-wrap space-x-1">
                                {intervals.map(intv => (
                                    <button
                                        key={intv.months}
                                        type="button"
                                        className={`
                                                text-sm px-2 py-0.5 rounded border
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
                    </div>


                    <div className="grid grid-cols-2 items-center gap-1">
                        <label htmlFor="salesPerson" className="font-medium">Sales Person</label>
                        <DropDownBox
                            id="SalesPersonSelection"
                            className="border rounded p-1 w-full"
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

                    <div className="grid grid-cols-2 items-center gap-1">
                        <label htmlFor="practitioner" className="font-medium">Practitioner</label>
                        <DropDownBox
                            id="PractionerSelection"
                            className="border rounded p-1 w-full"
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
                <SalesOrderItemTable data={SalesItemTableData} onDataChange={handleSalesItemChange}/>
            </div>

            <div className="mt-4 p-2 bg-white shadow rounded w-full">
                <div className="mb-4 flex space-x-4 w-full">
                    {["Prescribed RX", "Actual RX"].map((tab) => (
                    <button
                        key={tab}
                        className={`flex-1 relative text-center px-4 py-2 font-medium border-b-2 ${
                            activeRxTab === tab
                              ? "text-secondary after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b-2 after:border-primary after:bg-white"
                              : "text-gray-500 hover:text-black"
                        }`}
                        onClick={() => setActiveRxTab(tab)}
                    >
                        {tab}
                    </button>
                    ))}
                </div>

                <div className="grid grid-cols-[auto,1fr,auto,1fr,auto,auto] items-center gap-3 w-full">
                    <label className="font-medium text-sm text-secondary">Optical Height</label>
                    <input
                    type="text"
                    className="border rounded px-2 py-1 bg-white text-secondary w-full"
                    placeholder="Enter"
                    value={eyePowerData[activeRxTab].opticalHeight}
                    onChange={(e) =>
                        handleEyePowerChange(activeRxTab, "opticalHeight", e.target.value)
                    }
                    />

                    <label className="font-medium text-sm text-secondary">Segment Height</label>
                    <input
                    type="text"
                    placeholder="Enter"
                    className="border rounded px-2 py-1 bg-white text-secondary w-full"
                    value={eyePowerData[activeRxTab].segmentHeight}
                    onChange={(e) =>
                        handleEyePowerChange(activeRxTab, "segmentHeight", e.target.value)
                    }
                    />

                    <div className="flex items-center space-x-2 col-span-2">
                    <span className="font-medium text-sm text-secondary">Dominant Eye:</span>

                    <label className="inline-flex items-center text-secondary text-xs">
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

                    <label className="inline-flex items-center text-secondary text-xs">
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

                <div className="mt-6 space-y-2">
                    <div className="flex space-x-2">
                        {["Distance", "Reading"].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setActiveRxMode(mode)}
                            className={`px-4 py-1 border rounded text-sm font-medium ${
                            activeRxMode === mode
                                ? "bg-primary text-white"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                        >
                            {mode}
                        </button>
                        ))}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border mt-2 text-sm">
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

            <div className="w-full mt-6 bg-white shadow rounded p-4 mb-4">
                <div className="w-full grid grid-cols-3 gap-6 items-start text-sm text-secondary font-medium">
                    <div className="flex flex-col">
                    <label className="mb-1">Security Deposit</label>
                    <input
                        type="text"
                        className="border rounded px-2 py-1 bg-white text-secondary w-44"
                        value={securityDeposit}
                        onChange={(e) => handleSecurityDepositChange(e.target.value)}
                        placeholder="0.00"
                    />
                    <label className="mb-1 invisible">Payment</label>
                    <button className="bg-primary text-white px-2 py-1 w-20 rounded hover:bg-primary/90 mt-[2px]">
                        Payment
                    </button>
                    </div>

                    <div className="flex flex-col">
                    <label className="mb-1">Status</label>
                    <div className="flex flex-col space-y-1">
                        <label className="text-xs">
                        <input
                            type="checkbox"
                            checked={statusReady}
                            onChange={(e) => setStatusReady(e.target.checked)}
                            className="mr-1 accent-white"
                        />
                        Ready
                        </label>
                        <label className="text-xs">
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

                    <div className="flex flex-col space-y-1 text-xs">
                    {[
                        { label: "Subtotal", value: currentSalesTotal },
                        { label: "Tax Rounding", value: rounding },
                        { label: "Total", value: total },
                        { label: "Balance", value: balance }
                    ].map(({ label, value }) => (
                        <div key={label} className="flex flex-col">
                        <label className="mb-1">{label}</label>
                        <div className="border rounded px-1 py-1 bg-gray-100 min-w-[100px] text-right">
                            {value.toFixed(2)}
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>     
        </>
    )
}

export default SalesOrder;