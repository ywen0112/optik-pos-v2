import StandardDataGridComponent from "../../BaseDataGrid";
import { Column } from "devextreme-react/cjs/data-grid";
import { TrashIcon, Pencil } from "lucide-react";
import CustomStore from "devextreme/data/custom_store";
import { useRef, useState, useEffect } from "react";
import { GetItemGroupsRecords } from "../../../api/maintenanceapi";

const ProductGroupDataGrid = ({ className, companyId, onError, onDelete, onEdit }) => {
    const [loading, setLoading] = useState(false);

    const productGroupDataGridRef = useRef(null);

    const productGroupStore = new CustomStore({
        key: "itemGroupId",
        load: async (loadOptions) => {
            const skip = loadOptions.skip ?? 0;
            const take = loadOptions.take ?? 10;
            const keyword = loadOptions.searchValue || "";

            try {
                const data = await GetItemGroupsRecords({ companyId, offset: skip, limit: take, keyword });
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
            ref={productGroupDataGridRef}
            height={"100%"}
            dataSource={productGroupStore}
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
                caption="Product Group"
                dataField="itemGroupCode"
                width={"15%"}
            />
            <Column
                caption="Description"
                dataField="description"
            />
            <Column
                caption="Action"
                width={"10%"}
                headerCellRender={() => {
                    return (
                        <div className="font-bold text-white ">
                            Action
                        </div>
                    )
                }}

                cellRender={(cellData) => {
                    return (
                        <div className="flex flex-row justify-center space-x-2">
                            <div className=" text-green-600 hover:cursor-pointer flex justify-center "
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(cellData.data, "edit");
                                }}>
                                <Pencil size={20} />
                            </div>
                            <div className=" text-red-600 hover:cursor-pointer flex justify-center "
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(cellData.data.itemGroupId);
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

export default ProductGroupDataGrid;