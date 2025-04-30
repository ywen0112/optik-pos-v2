import { useState, useCallback } from "react";
import { TrashIcon } from "lucide-react";
import CustomStore from 'devextreme/data/custom_store';
import DataGrid, { Selection, Column, Paging, Editing, Scrolling, SearchPanel } from 'devextreme-react/data-grid';

import StandardDataGridComponent from "../../BaseDataGrid";
import { getInfoLookUp } from "../../../api/infolookupapi";
import { DropDownBox, NumberBox } from "devextreme-react";

const ItemGridColumns = [
    { dataField: "itemCode", caption: "Product Code", width: "30%" },
    { dataField: "description", caption: "Product Name", width: "50%" },
    { dataField: "uom", caption: "UOM", width: "10%" },
    { dataField: "balQty", caption: "Bal Qty", width: "10%" }
];

const TransactionItemWithDiscountDataGrid = ({ className, customStore, gridRef, onSelect, onNew, loading, selectedItem, setSelectedItem }) => {
    const companyId = sessionStorage.getItem("companyId");

    const [currentRow, setCurrentRow] = useState(null);
    const [dropDownBoxOpen, setDropDownBoxOpen] = useState(false);

    const itemStore = new CustomStore({
        key: "itemId",
        load: async (loadOptions) => {
            const filter = loadOptions.filter;
            let keyword = filter?.[2][2] || "";

            const params = {
                keyword: keyword || "",
                offset: loadOptions.skip,
                limit: loadOptions.take,
                type: "item",
                companyId,
            };
            const res = await getInfoLookUp(params);
            return {
                data: res.data,
                totalCount: 1,
            };
        },
        byKey: async (key) => {
            const res = await GetItem({
                companyId,
                userId,
                id: key
            });
            console.log(res.data)
            return res.data;
        },
    });

    const handleItemLookupValueChanged = useCallback((e) => {
        const selected = e.selectedRowsData?.[0];
        if (selected && currentRow) {
            setSelectedItem(selected);
            onSelect(selected, currentRow);
        }
        setDropDownBoxOpen(false);
    }, [currentRow]);

    const handleItemLookupChanged = (e) => {
        if (!e.value) {
            setSelectedItem(null);
        }
    }

    const onItemLookupOpened = useCallback((e) => {
        if (e.name === 'opened') {
            setDropDownBoxOpen(e.value);
        }
    }, []);

    const onItemLookupRender = useCallback(() => {
        return (
            <DataGrid
                dataSource={itemStore}
                columns={ItemGridColumns}
                hoverStateEnabled={true}
                showBorders={true}
                selectedRowKeys={selectedItem?.itemId}
                onSelectionChanged={handleItemLookupValueChanged}
                height={"300px"}
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
        )
    }, [selectedItem, handleItemLookupValueChanged])

    const handleOnCellClick = useCallback((e) => {
        const grid = gridRef.current?.instance;
        if (e.rowType === "data" && grid) {
            setCurrentRow(e.data);
            grid.editCell(e.rowIndex, e.column.dataField); // Start editing cell directly
        }
    }, [])

    return (
        <StandardDataGridComponent
            ref={gridRef}
            height={440}
            keyExpr={customStore.key}
            dataSource={customStore}
            className={className}
            searchPanel={true}
            pager={true}
            columnChooser={false}
            pageSizeSelector={true}
            showBorders={true}
            allowColumnResizing={false}
            allowColumnReordering={false}
            allowEditing={true}
            onCellClick={handleOnCellClick}
            onInitNewRow={async (e) => {
                e.cancel = true
                setSelectedItem(null)
                await onNew();
                const grid = gridRef.current?.instance;
                if (grid) {
                    grid.cancelEditData();
                    setTimeout(() => {
                        const visibleRows = grid.getVisibleRows();
                        const lastRowIndex = visibleRows.length - 1;

                        if (lastRowIndex >= 0) {
                            grid.editCell(lastRowIndex, "itemCode");
                        }
                    }, 100);
                }
            }}
            onLoading={loading}
        >
            <Editing
                mode="cell"
                allowAdding
                allowUpdating
                newRowPosition='last'
                confirmDelete={false}
            />
            <Column
                dataField="itemCode"
                caption="Product Code"
                width={"150px"}
                editCellRender={() => {
                    return (
                        <DropDownBox
                            id="itemOpeningItemLookup"
                            value={selectedItem?.itemId}
                            opened={dropDownBoxOpen}
                            openOnFieldClick={true}
                            valueExpr="itemId"
                            displayExpr="itemCode"
                            placeholder="Select Item"
                            showClearButton={true}
                            onValueChanged={handleItemLookupChanged}
                            onOptionChanged={onItemLookupOpened}
                            contentRender={onItemLookupRender}
                            dataSource={itemStore}
                            dropDownOptions={{
                                width: 500
                            }}
                        />
                    )
                }
                }
            />
            <Column dataField="description" caption="Description" allowEditing={false} />
            <Column dataField="uom" caption="UOM" allowEditing={false} width={"80px"} />
            <Column
                dataField="qty"
                caption="QTY"
                width={"80px"}
                editCellRender={({ data, setValue }) => {
                    return (
                        <NumberBox
                            value={data?.qty}
                            min={0}
                            showSpinButtons={true}
                            inputAttr={{ 'aria-label': 'Quantity' }}
                            onValueChanged={(e) => {
                                setValue(e.value);
                            }}
                        />
                    );
                }}
            />
            <Column
                dataField="price"
                caption="Unit Price"
                width={"80px"}
                editCellRender={({ data, setValue }) => {
                    return (
                        <NumberBox
                            value={data?.price}
                            min={0}
                            showSpinButtons={true}
                            inputAttr={{ 'aria-label': 'Quantity' }}
                            onValueChanged={(e) => {
                                setValue(e.value);
                            }}
                        />
                    );
                }}
            />
            <Column
                value={false}
                dataField="discount"
                caption="Discount %"
                dataType="boolean"
                width={"90px"}

            />
            <Column dataField="discountAmount" caption="Disc Amnt" dataType="number" value={0} width={"80px"} />
            <Column dataField="subTotal" caption="Amount" dataType="number" width={"80px"} />
            <Column
                caption="Action"
                width={"150px"}
                cellRender={(cellData) => {
                    return (
                        <div className="flex flex-row justify-center space-x-2">
                            <div className=" text-red-600 hover:cursor-pointer flex justify-center "
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const rowIndex = cellData.rowIndex;
                                    gridRef.current.instance.deleteRow(rowIndex);
                                }}>
                                <TrashIcon size={20} />
                            </div>
                        </div>

                    );
                }}
            />
        </StandardDataGridComponent>
    );
}

export default TransactionItemWithDiscountDataGrid;



// return (
//     <>
//       <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
//       <div className="grid grid-cols-2 gap-6">
//         <div className="space-y-2">
//           <div className="items-center gap-1">
//             <label htmlFor="supplier" className="font-medium text-secondary" >
//               Supplier
//             </label>
//             <div className="justify-self-start w-full">

//               <div className="flex justify-end gap-2">
//                 <DropDownBox
//                   id="SupplierSelection"
//                   className="border rounded p-1 w-1/2 h-[34px]"
//                   value={CustomerGridBoxValue.id}
//                   opened={isCustomerGridBoxOpened}
//                   openOnFieldClick={true}
//                   valueExpr='id'
//                   displayExpr={CustomerGridBoxDisplayExpr}
//                   placeholder="Select Supplier"
//                   showClearButton={true}
//                   onValueChanged={handleCustomerGridBoxValueChanged}
//                   dataSource={customerData}
//                   onOptionChanged={onCustomerGridBoxOpened}
//                   contentRender={CustomerDataGridRender}
//                 />
//                 <textarea
//                   id="CustomerName"
//                   name="CustomerName"
//                   rows={1}
//                   className="border rounded p-2 w-full resize-none bg-white text-secondary"
//                   placeholder="Name"
//                   onChange={() => { }}
//                   value={CustomerGridBoxValue.Name}
//                 />
//                 <button
//                   className="flex justify-center items-center w-3 h-[34px] text-secondary hover:bg-grey-500 hover:text-primary"
//                   onClick={() => setShowCustomerModal(true)}
//                 >
//                   ...</button>
//               </div>
//             </div>
//           </div>

//           {showCustomerModal && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
//               <div className="bg-white p-6 rounded shadow-md w-96 space-y-4">
//                 <h2 className="text-lg font-semibold text-gray-800">Add Supplier</h2>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700">Code</label>
//                     <input
//                       type="text"
//                       value={getNextCustomerCode()}
//                       readOnly
//                       className="text-sm w-full border rounded px-2 py-1 bg-gray-100 text-gray-600"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700">Name</label>
//                     <input
//                       type="text"
//                       value={newCustomerName}
//                       onChange={(e) => setNewCustomerName(e.target.value)}
//                       className="w-full border rounded px-2 py-1 text-sm bg-white text-secondary"
//                       placeholder="Enter name"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-2 mt-4">
//                   <button
//                     onClick={handleSaveNewCustomer}
//                     className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={() => setShowCustomerModal(false)}
//                     className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}


//           <div className="items-start gap-1">
//             <label htmlFor="remark" className="font-medium text-secondary">Remark</label>
//             <div></div>
//             <textarea
//               id="remark"
//               name="remark"
//               rows={6}
//               className="border rounded p-1 w-full resize-none bg-white justify-self-end"
//               placeholder="Enter remarks…"
//             />
//           </div>
//         </div>
//         <div className="grid grid-cols-2 items-center gap-1">
//           <div className="flex flex-col gap-1">
//             <label htmlFor="refNo" className="font-medium text-secondary">Supplier Ref</label>
//             <input
//               type="text"
//               id="supplierRef"
//               name="supplierRef"
//               className="border rounded p-1 w-full bg-white h-[34px]"
//               placeholder="Supplier Ref"
//             />
//           </div>
//           <div className="flex flex-col gap-1">
//             <label htmlFor="refNo" className="font-medium text-secondary">Ref No.</label>
//             <input
//               type="text"
//               id="refNo"
//               name="refNo"
//               className="border rounded p-1 w-full bg-white h-[34px]"
//               placeholder="Ref No"
//             />
//           </div>
//           <div className="flex flex-col gap-1">
//             <label htmlFor="salesPerson" className="font-medium text-secondary">Purchase Person</label>
//             <DropDownBox
//               id="SalesPersonSelection"
//               className="border rounded w-full"
//               value={SalesPersonGridBoxValue.id}
//               opened={isSalesPersonGridBoxOpened}
//               openOnFieldClick={true}
//               valueExpr='id'
//               displayExpr={SalesPersonGridBoxDisplayExpr}
//               placeholder="Select Purchase Person"
//               showClearButton={true}
//               onValueChanged={handleSalesPersonGridBoxValueChanged}
//               dataSource={customerData}
//               onOptionChanged={onSalesPersonGridBoxOpened}
//               contentRender={SalesPersonDataGridRender}
//             />
//           </div>
//           <div className="flex flex-col gap-1">
//             <label htmlFor="date" className="font-medium text-secondary">Date</label>
//             <DatePicker
//               selected={date}
//               id="SalesDate"
//               name="SalesDate"
//               dateFormat="dd-MM-yyyy"
//               className="border rounded p-1 w-full bg-white h-[34px]"
//               onChange={e => setDate(e.toISOString().slice(0, 10))}
//             />

//           </div>
//           <div className="flex flex-col gap-1 invisible">
//             <label htmlFor="salesPerson" className="font-medium text-secondary">Purchase Person</label>
//             <DropDownBox
//               id="SalesPersonSelection"
//               className="border rounded w-full"
//               value={SalesPersonGridBoxValue.id}
//               opened={isSalesPersonGridBoxOpened}
//               openOnFieldClick={true}
//               valueExpr='id'
//               displayExpr={SalesPersonGridBoxDisplayExpr}
//               placeholder="Select Purchase Person"
//               showClearButton={true}
//               onValueChanged={handleSalesPersonGridBoxValueChanged}
//               dataSource={customerData}
//               onOptionChanged={onSalesPersonGridBoxOpened}
//               contentRender={SalesPersonDataGridRender}
//             />
//           </div>
//           <div className="flex flex-col gap-1 invisible">
//             <label htmlFor="date" className="font-medium text-secondary">Date</label>
//             <DatePicker
//               selected={date}
//               id="SalesDate"
//               name="SalesDate"
//               dateFormat="dd-MM-yyyy"
//               className="border rounded p-1 w-full bg-white h-[34px]"
//               onChange={e => setDate(e.toISOString().slice(0, 10))}
//             />

//           </div>
//           {/* <div className="flex flex-col row-span-2 self-start gap-1 mt-2">
//                         <label htmlFor="nextVisit" className="font-medium text-secondary">Next Visit</label>
//                         <div className="flex flex-col space-y-1 w-full z-30">
//                             <DatePicker
//                                 selected={nextVisit}
//                                 id="nextVisit"
//                                 name="nextVisit"
//                                 dateFormat="dd-MM-yyyy"
//                                 placeholderText="dd-MM-yyyy"
//                                 className="border rounded p-1 w-full bg-white text-secondary h-[34px]"
//                                 onChange={e => {
//                                     setSelectedInterval(null);
//                                     setNextVisit(e);
//                                 }}
//                             >
                                
//                             </DatePicker>
//                         </div>
//                         <div className="ml-3 space-x-1">
//                                     {intervals.map(intv => (
//                                         <button
//                                             key={intv.months}
//                                             type="button"
//                                             className={`
//                                                 text-sm px-1 py-0.5 rounded border w-16 h-10
//                                                 ${selectedInterval === intv.months
//                                                     ? 'bg-slate-700 text-white'
//                                                     : 'bg-white text-gray-700'
//                                                 }
//                                         `}
//                                             onClick={() => pickInterval(intv.months)}
//                                         >
//                                             {intv.label}
//                                         </button>
//                                     ))}
//                                 </div>
//                     </div>
                    
//                     <div className="flex flex-col gap-1">
//                         <label htmlFor="practitioner" className="font-medium text-secondary">Practitioner</label>
//                         <DropDownBox
//                             id="PractionerSelection"
//                             className="border rounded w-full"
//                             value={PractionerGridBoxValue.id}
//                             opened={isPractionerGridBoxOpened}
//                             openOnFieldClick={true}
//                             valueExpr='id'
//                             displayExpr={PractionerGridBoxDisplayExpr}
//                             placeholder="Select Practioner"
//                             showClearButton={true}
//                             onValueChanged={handlePractionerGridBoxValueChanged}
//                             dataSource={customerData}
//                             onOptionChanged={onPractionerGridBoxOpened}
//                             contentRender={PractionerDataGridRender}
//                         />
//                     </div> */}



//         </div>
//       </div>

//       <div className="mt-3 bg-white shadow rounded">
//         <SalesOrderItemTable data={SalesItemTableData} onDataChange={handleSalesItemChange} height={330} />
//       </div>


//       <div className="w-full mt-3 bg-white shadow rounded p-4 mb-4">
//         <div className="w-full grid grid-cols-2 gap-6 items-start text-sm text-secondary font-medium">


//           <div className="flex flex-col">
  
//           </div>

//           <div className="flex flex-col space-y-1">
//             {[
//               { label: "Subtotal", value: currentSalesTotal },
//               { label: "Tax", value: rounding },
//               { label: "Total", value: total }
//             ].map(({ label, value }) => (
//               <div key={label} className="grid grid-cols-[auto,30%] gap-1">
//                 <label className="font-extrabold py-2 px-4 justify-self-end text-[15px]" >{label}</label>
//                 {label === "Tax" ? (
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={rounding}
//                     onChange={(e) => setRounding(e.target.value)}
//                     onBlur={() => {
//                       const parsed = parseFloat(rounding);
//                       setRounding(isNaN(parsed) ? "0.00" : parsed.toFixed(2));
//                     }}
//                     className=" border rounded px-1 py-2 bg-white w-full min-h-5 text-right "
//                   />

//                 ) : (
//                   <div className="border rounded px-5 py-2 bg-gray-100 w-full min-h-5 text-right">
//                     {value.toFixed(2)}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//         </div>


//       </div>
//       <div className="flex flex-row place-content-between">
//         <div className="flex flex-row">
//           <input
//             type="text"
//             placeholder="search"
//             className="p-2 w-44 m-[2px]"
//           />
//           <button className="bg-red-600 flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
//             Clear
//           </button>

//         </div>

//         <div className="w-ful flex flex-row justify-end">
//           <button className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]"
//             onClick={()=> setPurchaseInvoicePayment(true)}>
//               Payment
//           </button>
//           <button className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
//             Save & Print
//           </button>
//           <button className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
//             Save
//           </button>
//         </div>

//         <PurchaseInvoicePaymentModal
//           isOpen={purchaseInvoicePayment}
//           onClose={() => setPurchaseInvoicePayment(false)}
//           total={total}
//           companyId={companyId}
//           userId={userId}
//           purchaseInvoiceId={purchaseInvoiceId}
//           onError={setErrorModal}
//         />
//       </div>
//     </>
//   )