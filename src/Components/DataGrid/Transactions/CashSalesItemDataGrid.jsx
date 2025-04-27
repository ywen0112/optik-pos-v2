import React, { useState, useEffect, useRef, useCallback } from 'react';
import DataGrid, { Selection, Column, Paging, Editing, ColumnFixing, ColumnChooser, Button, Scrolling, SearchPanel } from 'devextreme-react/data-grid';
import { DropDownBox } from 'devextreme-react';
import { NumberBox } from 'devextreme-react/number-box';
import CustomStore from 'devextreme/data/custom_store';
import { getInfoLookUp } from '../../../api/infolookupapi';

const itemGridBoxDisplayExpr = (item) => item && `${item.itemCode}`;
const ItemGridColumns = [
    { dataField: "itemCode", caption: "Product Code", width: "30%" },
    { dataField: "description", caption: "Product Name", width: "50%" },
    { dataField: "uom", caption: "UOM", width: "10%" },
    { dataField: "", caption: "Price", width: "10%" }
];

const CashSalesItemDataGrid = ({ dataGridDataSource, onSelectionChange, height }) => {
    const companyId = sessionStorage.getItem("companyId");
    const [selectedItem, setSelectedItem] = useState({ itemId: "" });

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
                totalCount: loadOptions.skip + res.data.count,
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

    useEffect(() => {
    }, [selectedItem, onSelectionChange]);

    const handleItemGridBoxValueChanged = useCallback((e) => {
        const selected = e.selectedRowsData?.[0];

        if (selected) {
            const match = dataGridDataSource.find(item => item.itemId === selected.itemId);
            if (!match) {
                setSelectedItem(selected);
                onSelectionChange(prev => [...prev, selected]);

            }
        }
    }, [dataGridDataSource]);

    const onItemGridBoxRender = useCallback(() => {
        return (
            <DataGrid
                dataSource={itemStore}
                columns={ItemGridColumns}
                hoverStateEnabled={true}
                showBorders={true}
                selectedRowKeys={[selectedItem?.itemId]}
                onRowClick={(e) => {
                    const selected = e.data;
                    const match = dataGridDataSource.find(item => item.itemId === selected.itemId);
                    if (!match) {
                        setSelectedItem(selected);
                        onSelectionChange(prev => [...prev, selected]);
                    }
                }}
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
        );
    }, [selectedItem, handleItemGridBoxValueChanged]);

    return (
        <>
            <DataGrid
                dataSource={dataGridDataSource}
                scrolling={{ mode: 'standard', showScrollbar: 'always' }}
                className="p-5"
                showBorders
                showRowLines
                height={height}
                onRowRemoved={(e) => {
                    const deletedItemId = e.data?.itemId;
                    if (deletedItemId) {
                        console.log(dataGridDataSource)
                        onSelectionChange(prev => prev.filter(item => item.itemId !== deletedItemId));
                        console.log(dataGridDataSource)
                    }
                }}
                onRowUpdating={(e) => {
                    const updated = { ...e.oldData, ...e.newData };
                
                    const updatedQty = updated.qty ?? 1;
                    const price = updated.price ?? 1;
                    const isDiscByPercent = updated.isDiscByPercent ?? false;
                    const discAmtRaw = updated.discAmt ?? 0;
                    const discAmt = isDiscByPercent ? (discAmtRaw / 100 || 0) : discAmtRaw;
                
                    e.newData.amount = (updatedQty * price) - discAmt;
                
                    onSelectionChange(prev =>
                        prev.map(item =>
                            item.itemId === e.oldData.itemId
                                ? {
                                    ...item,
                                    qty: updatedQty,
                                    price,
                                    isDiscByPercent,
                                    discAmt: discAmtRaw,
                                    amount: e.newData.amount
                                }
                                : item
                        )
                    );
                }}
                
                
            >
                <Paging enabled={false} />
                <Editing
                    mode="cell" // instead of "row"
                    allowUpdating
                    allowDeleting
                    allowAdding
                    newRowPosition='last'
                />
                <ColumnFixing enabled />
                <ColumnChooser enabled mode="dragAndDrop" title="Choose Columns" />

                <Column
                    dataField="itemCode"
                    caption="Item Code"
                    width={"10%"}
                    editCellComponent={(props) => (
                        <DropDownBox
                            id="itemSelection"
                            value={selectedItem?.itemId}
                            openOnFieldClick={true}
                            valueExpr='itemId'
                            displayExpr={itemGridBoxDisplayExpr}
                            placeholder="Select Item"
                            showClearButton={true}
                            onValueChanged={handleItemGridBoxValueChanged}
                            contentRender={onItemGridBoxRender}
                            dataSource={itemStore}
                            dropDownOptions={{
                                width: 700
                            }}
                        />
                    )}
                >
                </Column>
                <Column dataField="itemId" visible={false} allowExporting={false}
                    allowEditing={false}
                    showInColumnChooser={false} />
                <Column dataField="description" caption="Description" width={"30%"}/>
                <Column dataField="uom" caption="UOM" width={"6%"}/>
                <Column
                    dataField="qty"
                    caption="Qty"
                    dataType="number"
                    width={"5%"}
                />

                <Column dataField="price" caption="Unit Price" dataType="number" width={"10%"}/>
                <Column
                    value={false}
                    dataField="isDiscByPercent"
                    caption="Disc %"
                    dataType="boolean"
                    width={"10%"}
                />
                <Column dataField="discAmt" caption="Disc Amnt" dataType="number" value={0} width={"9%"} />
                <Column dataField="amount"
                    caption="Amount"
                    dataType="number"
                    width={"10%"}
                />

                <Column type="buttons" caption="Action">
                    <Button name="delete" ></Button>
                </Column>

            </DataGrid>
        </>
    )

};

export default CashSalesItemDataGrid;