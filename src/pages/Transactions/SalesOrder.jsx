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
    Scrolling
} from 'devextreme-react/data-grid';
import DropDownBox from 'devextreme-react/drop-down-box';
import Switch from 'react-switch';


const initialData = [
    { id: 1, itemCode: 'A100', description: 'Widget', uom: 'pcs', qty: 10, unitPrice: 5.0, discAmt: 0.1},
    { id: 2, itemCode: 'B200', description: 'Gadget', uom: 'pcs', qty: 5, unitPrice: 12.5, discAmt: 0.05},
    { id: 3, itemCode: 'C100', description: 'Widget', uom: 'pcs', qty: 10, unitPrice: 5.0, discAmt: 0.1},
    { id: 4, itemCode: 'D200', description: 'Gadget', uom: 'pcs', qty: 5, unitPrice: 12.5, discAmt: 0.05},
];

const customerData = [
    {id:1, Code:'300-001', Name:'abc'},
    {id:2, Code:'300-002', Name:'abcd'},
    {id:3, Code:'300-003', Name:'abcde'},
]

const gridBoxDisplayExpr = (item) => item && `${item.Code}`;

const gridColumns = ["Code", "Name"]

const SalesOrder = () => {
    const ItemDataGridRef = useRef(null)
    const [date, setDate] = useState(() =>
        new Date().toISOString().slice(0, 10)
    );
    const [data, setData] = useState(initialData);
    const [nextVisit, setNextVisit] = useState('');
    const [selectedInterval, setSelectedInterval] = useState(null);

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

    const onRowRemoving = (rowKey) => {
        const dataGrid = ItemDataGridRef.current.instance;
        const rowIndex = dataGrid.getRowIndexByKey(rowKey);
        if (rowIndex !== -1) {
        dataGrid.deleteRow(rowIndex);
        }
    };

    useEffect(() => {
        if (selectedInterval !== null) {
            setNextVisit(calcDate(date, selectedInterval));
        }
    }, [date]);

    const onEditorPreparing = (e) => {
        if (e.parentType === 'dataRow' && e.dataField === 'itemCode') {
            // Configure as dropdown
            e.editorOptions.dataSource = initialData;
            e.editorOptions.valueExpr = 'id';
            e.editorOptions.displayExpr = 'itemCode';
    
            // Preserve the default onValueChanged handler
            const defaultOnValueChanged = e.editorOptions.onValueChanged;
    
            // When user picks one, fill the other fields
            e.editorOptions.onValueChanged = (args) => {
                // Call the default handler to ensure the DataGrid is notified of the change
                defaultOnValueChanged && defaultOnValueChanged(args);
    
                const item = initialData.find(i => i.id === args.value);
                if (item) {
                    const grid = e.component;
                    const rowIndex = e.row.rowIndex;
    
                    // Update other fields in the row
                    grid.cellValue(rowIndex, 'description', item.description);
                    grid.cellValue(rowIndex, 'uom', item.uom);
                    grid.cellValue(rowIndex, 'unitPrice', item.unitPrice);
                    grid.cellValue(rowIndex, 'discAmt', item.discAmt);
                }
            };
        }
    };

    const [gridBoxValue, setGridBoxValue] = useState([3]);
    const [isGridBoxOpened, setIsGridBoxOpened] = useState(false);
    
  
    
    const dataGridOnSelectionChanged = useCallback((e) => {
      setGridBoxValue(e.selectedRowKeys);
      setIsGridBoxOpened(false);
    }, []);
  
  
  
    
  
    const dataGridRender = useCallback(
      () => (
        <DataGrid
          dataSource={customerData}
          columns={gridColumns}
          hoverStateEnabled={true}
          showBorders={true}
          selectedRowKeys={gridBoxValue}
          onSelectionChanged={dataGridOnSelectionChanged}
          height="100%"
        >
          <Selection mode="single" />
          <Scrolling mode="virtual" />
          <Paging
            enabled={true}
            pageSize={10}
          />
          <FilterRow visible={true} />
        </DataGrid>
      ),
      [gridBoxValue, dataGridOnSelectionChanged],
    );
  
    
  
    const syncDataGridSelection = useCallback((e) => {
        console.log(e.value[0].Code)
      setGridBoxValue(e.value);
    }, []);
  
    const onGridBoxOpened = useCallback((e) => {
      if (e.name === 'opened') {
        setIsGridBoxOpened(e.value);
      }
    }, []);
  

    return (
        <>
            <div className="grid grid-cols-2 gap-6">
                {/* ——— Left column ——— */}
                <div className="space-y-2">
                    {/* Customer */}
                    <div className="grid grid-cols-[auto,1fr] items-center gap-1">
                        <label htmlFor="customer" className="font-medium">
                            Customer
                        </label>
                        <div className="flex justify-end items-center gap-1">
                            <DropDownBox
                            className="border rounded p-1 w-1/2"
                                value={gridBoxValue}
                                opened={isGridBoxOpened}
                                valueExpr='id'
                                deferRendering={false}
                                displayExpr={gridBoxDisplayExpr}
                                placeholder="Select Customer"
                                showClearButton={true}
                                dataSource={customerData}
                                onValueChanged={syncDataGridSelection}
                                contentRender={dataGridRender}
                            />
                            
                            <button className="flex justify-center items-center w-3 h-3">...</button>
                        </div>
                    </div>

                    {/* Customer Name*/}
                    <div className="grid grid-cols-2 items-center gap-1">
                        <label htmlFor="customer" className="font-medium"></label>
                        <textarea
                            id="CustomerName"
                            name="CustomerName"
                            rows={1}
                            className="border rounded p-1 w-full resize-none"
                            placeholder="Name"
                        />
                    </div>

                    {/* Remark */}
                    <div className="grid grid-cols-2 items-start gap-1">
                        <label htmlFor="remark" className="font-medium">Remark</label>
                        <textarea
                            id="remark"
                            name="remark"
                            rows={3}
                            className="border rounded p-1 w-full resize-none"
                            placeholder="Enter remarks…"
                        />
                    </div>
                </div>

                {/* ——— Right column ——— */}
                <div className="space-y-2">
                    {/* Date */}
                    <div className="grid grid-cols-2 items-center gap-1">
                        <label htmlFor="date" className="font-medium">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            className="border rounded p-1 w-full"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                        />
                    </div>

                    {/* Ref No. */}
                    <div className="grid grid-cols-2 items-center gap-1">
                        <label htmlFor="refNo" className="font-medium">Ref No.</label>
                        <input
                            type="text"
                            id="refNo"
                            name="refNo"
                            className="border rounded p-1 w-full"
                            placeholder="Ref No"
                        />
                    </div>

                    {/* Next Visit */}
                    <div className="grid grid-cols-2 items-start gap-1">
                        <label htmlFor="nextVisit" className="font-medium">Next Visit</label>
                        <div className="flex flex-col space-y-1 w-full">
                            <input
                                type="date"
                                id="nextVisit"
                                name="nextVisit"
                                className="border rounded p-1 w-full"
                                value={nextVisit}
                                onChange={e => {
                                    setSelectedInterval(null);
                                    setNextVisit(e.target.value);
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
                        <select
                            id="SalesPerson"
                            name="SalesPerson"
                            className="border rounded p-1 w-full"
                            defaultValue=""
                        >
                            <option value="" disabled>Select Sales Person</option>
                        </select>
                    </div>

                    {/* Practitioner */}
                    <div className="grid grid-cols-2 items-center gap-1">
                        <label htmlFor="practitioner" className="font-medium">Practitioner</label>
                        <select
                            id="practioner"
                            name="practioner"
                            className="border rounded p-1 w-full"
                            defaultValue=""
                        >
                            <option value="" disabled>Select Practioner</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* DataGrid */}
            <div className="mt-3 bg-white shadow rounded">
                <DataGrid
                    ref={ItemDataGridRef}
                    height={245}
                    scrolling={{ mode: 'standard', showScrollbar: 'always' }}
                    className="p-5"
                    dataSource={[]}
                    showBorders
                    showRowLines
                    onRowRemoving={onRowRemoving}
                    onEditorPreparing={onEditorPreparing}
                >
                    <Paging enabled={false} />

                    {/* allow editing, deleting, and keep a “new” row always at bottom */}
                    <Editing
                        mode="row"
                        allowUpdating
                        allowDeleting
                        allowAdding
                        newRowPosition="bottom"
                    />

                    <ColumnFixing enabled />
                    <ColumnChooser enabled mode="select" title="Choose Columns" />
                    <Column
                        dataField="itemCode"
                        caption="Item Code"
                        lookup={{
                            dataSource: initialData,
                            valueExpr: 'id',
                            displayExpr: 'itemCode',
                        }}                        
                    />
                    <Column dataField="description" caption="Description" />
                    <Column dataField="uom" caption="UOM" />
                    <Column dataField="qty" caption="Qty" dataType="number" />
                    <Column dataField="unitPrice" caption="Unit Price" dataType="number" />
                    <Column
                        dataField="isDiscByPercent"
                        caption="Disc By Percent"
                        dataType="boolean"
                        width={150}
                        cellRender={(cellData) => (
                            <Switch
                                checked={cellData.value}
                                onChange={() =>{}}
                                uncheckedIcon={<div style={{ padding: 2, fontSize: 12, color: "white", justifyContent: "center" }}>RM</div>}
                                checkedIcon={<div style={{ padding: 2, fontSize: 12, color: "white", justifyContent: "center"}}>%</div>}
                                draggable={false}
                            />
                        )}
                    />
                    <Column dataField="discAmt" caption="Disc Amnt" dataType="number" />
                    <Column dataField="amount" caption="Amount" dataType="number" />

                    <Column type="buttons" caption="Action">
                        <Button name="delete" />
                    </Column>
                </DataGrid>
            </div>

            {/* Additional Section */}
            
        </>
    )
}

export default SalesOrder;