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

    return (
        <>
            <div className="grid grid-cols-2 gap-6">
                {/* ——— Left column ——— */}
                <div className="space-y-2">
                    {/* Customer */}
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

                            <button className="flex justify-center items-center w-3 h-3 text-black hover:bg-secondary hover:text-primary">...</button>
                        </div>
                    </div>

                    {/* Customer Name*/}
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

                    {/* Remark */}
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

                {/* ——— Right column ——— */}
                <div className="space-y-2">
                    {/* Date */}
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

                    {/* Ref No. */}
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

                    {/* Next Visit */}
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


                    {/* Sales Person */}
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

                    {/* Practitioner */}
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

            {/* DataGrid */}
            <div className="mt-3 bg-white shadow rounded">
                <SalesOrderItemTable data={SalesItemTableData} onDataChange={handleSalesItemChange}/>
            </div>

            {/* Eye Power Section */}
            
        </>
    )
}

export default SalesOrder;