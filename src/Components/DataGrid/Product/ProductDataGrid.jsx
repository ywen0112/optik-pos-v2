import StandardDataGridComponent from "../../BaseDataGrid";
import { Column } from "devextreme-react/cjs/data-grid";
import { Eye, TrashIcon, Pencil } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { GetItemsRecords } from "../../../api/maintenanceapi";
import CustomStore from "devextreme/data/custom_store";

const ProductDataGrid = ({ className, companyId, onError, onDelete, onEdit }) => {
    const [loading, setLoading] = useState(false);

    const itemDataGridRef = useRef(null);

    const itemStore = new CustomStore({
        key: "itemId",
        load: async (loadOptions) => {
            const skip = loadOptions.skip ?? 0;
            const take = loadOptions.take ?? 10;
            const keyword = loadOptions.searchValue || "";

            try {
                const data = await GetItemsRecords({ companyId, offset: skip, limit: take, keyword });
                return {
                    data: data.data || [],
                    totalCount: data.totalRecords || 0
                };
            } catch (error) {
                onError({ title: "Fetch Error", message: error.message });
                return { data: [], totalCount: 0 };
            }
        }
    })

    return (
        <StandardDataGridComponent
            ref={itemDataGridRef}
            height={"100%"}
            dataSource={itemStore}
            className={className}
            searchPanel={true}
            pager={true}
            pageSizeSelector={true}
            columnChooser={true}
            showBorders={true}
            allowColumnResizing={false}
            allowColumnReordering={false}
            allowEditing={true}
            onLoading={loading}
            remoteOperations={{ paging: true, filtering: true, sorting: true }}
        >
            <Column
                caption="Product Code"
                dataField="itemCode"
                width={"150px"}
            />
            <Column
                caption="Product Name"
                dataField="description"
            />
            {/* <Column
                caption="UOM"
                dataField="UOM"
            /> */}
            <Column
                dataField="itemTypeCode"
                caption="Product Type"
                width={"150px"}
            />
            <Column
                dataField="itemGroupCode"
                caption="Product Group"
                width={"150px"}
            />

            <Column
                caption="Bal Qty"
                dataField="balQty"
                width={"70px"}
            />

            <Column
                caption="Active"
                dataField="isActive"
                dataType="boolean"
                width={"70px"}
            />

            <Column
                caption="Action"
                width={"150px"}
                headerCellRender={() => {
                    return (
                        <div className="  font-bold text-white">
                            Action
                        </div>
                    )
                }}
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
                                    onDelete(cellData.data.itemId);
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

export default ProductDataGrid