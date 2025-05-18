import { useState, useCallback } from "react";
import { TrashIcon } from "lucide-react";
import CustomStore from 'devextreme/data/custom_store';
import DataGrid, { Selection, Column, Paging, Editing, Scrolling, SearchPanel, Item } from 'devextreme-react/data-grid';

import StandardDataGridComponent from "../../BaseDataGrid";
import { getInfoLookUp } from "../../../api/infolookupapi";
import { DropDownBox, NumberBox, Toolbar } from "devextreme-react";

const ItemGridColumns = [
    { dataField: "itemCode", caption: "Product Code", width: "30%" },
    { dataField: "description", caption: "Product Name", width: "50%" },
    { dataField: "uom", caption: "UOM", width: "10%" },
    { dataField: "balQty", caption: "Bal Qty", width: "10%" }
];

const TransactionItemDataGrid = ({ disabled, height, className, customStore, gridRef, onSelect, onNew, loading, selectedItem, setSelectedItem }) => {
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
            console.log(key)
            const res = await GetItem({
                companyId,
                userId,
                id: key
            });
            return res.data;
        },
    });

    const handleItemLookupValueChanged = useCallback((e) => {
        const selected = e.selectedRowsData?.[0];
        if (selected && currentRow) {
            setSelectedItem(selected);
            onSelect(selected, currentRow);
            const grid = gridRef.current?.instance;
            if (grid) {
                grid.cancelEditData();
            }
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
            if (disabled) {
                grid.cancelEditData();
                return;
            }
            setCurrentRow(e.data);
            grid.editCell(e.rowIndex, e.column.dataField); // Start editing cell directly
            setDropDownBoxOpen(true)
        }
    }, [disabled])

    return (
        <StandardDataGridComponent
            ref={gridRef}
            onToolbarPreparing={(e) => {
                const items = e.toolbarOptions.items;

                // Find the index of the addRowButton
                const addButtonIndex = items.findIndex(item => item.name === 'addRowButton');

                if (addButtonIndex !== -1) {
                    // Change its location to 'before'
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
                    if(disabled) return;
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
            <Column allowEditing={!disabled} dataField="uom" caption="UOM" width={"80px"} />
            <Column
                allowEditing={!disabled}
                dataField="qty"
                caption="QTY"
                width={"80px"}

            />
            <Column
                allowEditing={!disabled}
                dataField="unitCost"
                caption="Unit Cost"
                width={"80px"}

            />
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

export default TransactionItemDataGrid;