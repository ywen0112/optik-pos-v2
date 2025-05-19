import { useState, useCallback } from "react";
import { TrashIcon } from "lucide-react";
import CustomStore from 'devextreme/data/custom_store';
import DataGrid, { Selection, Column, Paging, Editing, Scrolling, SearchPanel } from 'devextreme-react/data-grid';

import StandardDataGridComponent from "../../BaseDataGrid";
import { getInfoLookUp } from "../../../api/infolookupapi";
import { DropDownBox, Lookup, NumberBox } from "devextreme-react";
import { BsJournalMedical } from "react-icons/bs";

const ItemGridColumns = [
    { dataField: "itemCode", caption: "Product Code", width: "30%" },
    { dataField: "description", caption: "Product Name", width: "50%" },
    { dataField: "uom", caption: "UOM", width: "10%" },
    { dataField: "balQty", caption: "Bal Qty", width: "10%" }
];

const TransactionItemWithDiscountDataGrid = ({ disabled, height, className, customStore, gridRef, onSelect, onNew, loading, selectedItem, setSelectedItem, setItemGroup, setActiveItem }) => {
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
            return res.data;
        },
    });

    const handleItemLookupValueChanged = useCallback((e) => {
        if (disabled) return;
        const selected = e.selectedRowsData?.[0];
        if (selected && currentRow) {
            setSelectedItem(selected);
            onSelect(selected, currentRow);
        }
        const grid = gridRef.current?.instance;
        if (grid) {
            grid.cancelEditData();
        }
        setDropDownBoxOpen(false);
    }, [currentRow, disabled]);

    const handleDiscountChanged = useCallback((e) => {
        if (disabled) return;
        const selected = e.selectedRowsData?.[0];
        if (selected && currentRow) {
            onSelect(selected, currentRow);
        }
        const grid = gridRef.current?.instance;
        if (grid) {
            grid.cancelEditData();
        }
        setIsDiscountOpened(false);
    }, [disabled, currentRow]);

    const handleItemLookupChanged = (e) => {
        if (!e.value) {
            setSelectedItem(null);
        }
    }

    const handleDiscountLookupChanged = (e) => {
        if (!e.value) {
        setSelectedDiscount("");
        }
    }

    const onDiscountOpened = useCallback((e) => {
        if (e.name === 'opened') {
            setIsDiscountOpened(e.value);
        }
    }, [])

    const onItemLookupOpened = useCallback((e) => {
        if (e.name === 'opened') {
            setDropDownBoxOpen(e.value);
        }
    }, []);

    const onDiscountRender = useCallback(() => {
        return (
            <DataGrid
                disabled={disabled}
                dataSource={discountStore}
                height={150}
                hoverStateEnabled={true}
                showBorders={true}
                selectedRowKeys={selectedDiscount}
                onSelectionChanged={handleDiscountChanged}
            >
                <Selection mode="single" />
            </DataGrid>
        )

    }, [selectedItem, handleDiscountChanged])

    const onItemLookupRender = useCallback(() => {
        return (
            <DataGrid
                disabled={disabled}
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
            if (disabled) {
                if (setItemGroup) { setItemGroup(e.data.isNormalItem ?? true) }
                if (setActiveItem) { setActiveItem(e.data) };
                setCurrentRow(e.data);
                grid.cancelEditData();
                return;
            }
            if (setItemGroup) { setItemGroup(e.data.isNormalItem ?? true) }
            if (setActiveItem) { setActiveItem(e.data) };
            setCurrentRow(e.data);
            grid.editCell(e.rowIndex, e.column.dataField);
            setDropDownBoxOpen(true)
        }
    }, [disabled])

    const discountStore = new CustomStore({
        key: "discountType",
        load: async () => {
            const res = await getInfoLookUp({ type: "discount" });
            return res.data;
        },
        byKey: async () => {
            return key;
        }
    });

    const [isDiscountOpened, setIsDiscountOpened] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState("");

    return (
        <StandardDataGridComponent
            ref={gridRef}
            onToolbarPreparing={(e) => {
                const items = e.toolbarOptions.items;
                const addButtonIndex = items.findIndex(item => item.name === 'addRowButton');
                if (addButtonIndex !== -1) {
                    items[addButtonIndex].location = 'before';
                }
            }}
            height={height}
            keyExpr={customStore.key}
            dataSource={customStore}
            className={className}
            searchPanel={true}
            pager={false}
            columnChooser={false}
            pageSizeSelector={false}
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
                allowAdding={!disabled}
                allowUpdating={!disabled}
                newRowPosition='last'
                confirmDelete={false}
            />
            <Column
                dataField="itemCode"
                caption="Product Code"
                width={"150px"}
                editCellRender={() => {
                    if (disabled) return;
                    return (
                        <DropDownBox
                            id="itemOpeningItemLookup"
                            disabled={disabled}
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
            <Column allowEditing={!disabled} dataField="description" caption="Description" />
            <Column dataField="uom" allowEditing={!disabled} caption="UOM" width={"80px"} />
            <Column
                allowEditing={!disabled}
                dataField="qty"
                caption="QTY"
                width={"80px"}

            />
            <Column
                allowEditing={!disabled}
                dataField="price"
                caption="Unit Price"
                width={"80px"}

            />
            {/* <Column
                dataField="discountType"
                caption="Discount Type"
                width={"120px"}
                allowEditing={!disabled}
                editCellRender={(cellData) => {
                    return (
                        <DropDownBox
                            value={selectedItem?.discountType}
                            dataSource={discountStore}
                            valueExpr="discountType"
                            openOnFieldClick={true}
                            displayExpr="discountType"
                            opened={isDiscountOpened}
                            onValueChanged={handleDiscountLookupChanged}
                            onOptionChanged={onDiscountOpened}
                            placeholder="Select Discount"
                            showClearButton={true}
                            dropDownOptions={{ width: 200 }}
                            contentRender={onDiscountRender}
                        />
                    );
                }}
            />
            <Column dataField="discountAmount" caption="Disc Amnt" dataType="number" value={0} width={"80px"} /> */}
            <Column allowEditing={false} dataField="subTotal" caption="Amount" dataType="number" width={"80px"} />
            <Column
                caption="Action"
                width={"150px"}
                cellRender={(cellData) => {
                    if (disabled) return null;
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