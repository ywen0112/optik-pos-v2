import { useEffect, useState, useRef } from "react";
import { Pencil, TrashIcon } from "lucide-react";
import CustomStore from 'devextreme/data/custom_store';
import {
    Editing,
    Column,
} from 'devextreme-react/data-grid';

import StandardDataGridComponent from "../../BaseDataGrid";
import ItemDropDownBoxComponent from "../../DropDownBox/ItemDropDownBoxComponent";
import { getInfoLookUp } from "../../../api/infolookupapi";
import { GetItem, GetItemOpeningRecords } from "../../../api/maintenanceapi";


const ProductOpeningDataGrid = ({ className, dataRecords, totalRecords, onSelect, onDelete, loading }) => {
    const companyId = sessionStorage.getItem("companyId");
    const productOpeningDataGridRef = useRef(null);

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
        load: async (loadOptions) => {
            return {
                data: dataRecords?? [],
                totalCount: totalRecords,
            };
        },
    })

    return (
        <StandardDataGridComponent
            ref={productOpeningDataGridRef}
            height={"100%"}
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
            onLoading={loading}
            // remoteOperations={{ paging: true, filtering: true, sorting: true }}
        >
            <Editing
                mode="cell"
                allowUpdating
                allowAdding
                newRowPosition='last'
                confirmDelete={false}
            />
            <Column
                dataField="itemCode"
                caption="Product Code"
            
            />
            <Column dataField="description" caption="Description" allowEditing={false}/>
            <Column dataField="uom" caption="UOM" allowEditing={false}/>
            <Column dataField="qty" caption="QTY" />
            <Column dataField="unitCost" caption="Unit Cost" />
            <Column
                caption="Action"
                width={"10%"}
                cellRender={(cellData) => {
                    return (
                        <div className="flex flex-row justify-center space-x-2">
                            <div className=" text-green-600 hover:cursor-pointer flex justify-center "
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent row click event (select)
                                    onEdit(cellData.data, "edit");
                                }}>
                                <Pencil size={20} />
                            </div>
                            <div className=" text-red-600 hover:cursor-pointer flex justify-center "
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent row click event (select)
                                    onDelete(cellData.data.id);
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