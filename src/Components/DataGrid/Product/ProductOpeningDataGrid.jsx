import { useState, useRef, useCallback } from "react";
import { TrashIcon } from "lucide-react";
import CustomStore from 'devextreme/data/custom_store';
import DataGrid, { Selection, Column, Paging, Editing, Scrolling, SearchPanel } from 'devextreme-react/data-grid';

import StandardDataGridComponent from "../../BaseDataGrid";
import { getInfoLookUp } from "../../../api/infolookupapi";
import { DropDownBox } from "devextreme-react";

const itemGridBoxDisplayExpr = (item) => item && `${item.itemCode}`;
const ItemGridColumns = [
    { dataField: "itemCode", caption: "Product Code", width: "30%" },
    { dataField: "description", caption: "Product Name", width: "50%" },
    { dataField: "uom", caption: "UOM", width: "10%" },
    { dataField: "balQty", caption: "Bal Qty", width: "10%" }
];

const ProductOpeningDataGrid = ({ className, dataRecords, totalRecords, onSelect, currentRow, onNew, onDelete, loading, onCellClick, onEdit }) => {
    const companyId = sessionStorage.getItem("companyId");
    const productOpeningDataGridRef = useRef(null);
    const [selectedItem, setSelectedItem] = useState(null);
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

    const itemOpeningStore = new CustomStore({
        key: "itemOpeningBalanceId",
        load: async () => {
            setSelectedItem(null)

            return {
                data: dataRecords ?? [],
                totalCount: totalRecords,
            };
        },
        insert: async () => {
            setSelectedItem(null)
            return {
                data: dataRecords ?? [],
                totalCount: totalRecords,
            }
        },
        remove: async (key) => {
            await onDelete(key)
            return {
                data: dataRecords ?? [],
                totalCount: totalRecords,
            }
        },
        update: async (key, data) => {
            await onEdit(key, data)
            setSelectedItem(null)
            return {
                data: dataRecords ?? [],
                totalCount: totalRecords,
            }
        }

    })

    const handleItemOpeningItemLookupValueChanged = useCallback((e) => {
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
                onSelectionChanged={handleItemOpeningItemLookupValueChanged}
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
    }, [selectedItem, handleItemOpeningItemLookupValueChanged])

    return (
        <StandardDataGridComponent
            ref={productOpeningDataGridRef}
            height={"100%"}
            keyExpr="itemOpeningBalanceId"
            dataSource={itemOpeningStore}
            className={className}
            searchPanel={true}
            pager={true}
            columnChooser={false}
            pageSizeSelector={true}
            showBorders={true}
            allowColumnResizing={false}
            allowColumnReordering={false}
            allowEditing={true}
            onCellClick={onCellClick}
            onInitNewRow={async (e) => {
                e.cancel = true
                setSelectedItem(null)
                await onNew();
                const grid = productOpeningDataGridRef.current?.instance;
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
            <Column dataField="uom" caption="UOM" allowEditing={false}  width={"80px"}/>
            <Column dataField="qty" caption="QTY" width={"80px"} />
            <Column dataField="unitCost" caption="Unit Cost" width={"80px"} />
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
                                    productOpeningDataGridRef.current.instance.deleteRow(rowIndex);
                                }}>
                                <TrashIcon size={20} />
                            </div>
                        </div>

                    );
                }}
            />
        </StandardDataGridComponent>
    )
}

export default ProductOpeningDataGrid;