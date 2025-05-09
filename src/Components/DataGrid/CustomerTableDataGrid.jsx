import { useState, useRef } from "react";
import { Eye, Pencil, TrashIcon } from "lucide-react";
import { Column } from "devextreme-react/cjs/data-grid";

import StandardDataGridComponent from "../BaseDataGrid";
import { GetDebtorRecords } from "../../api/maintenanceapi";
import CustomStore from "devextreme/data/custom_store";


const CustomerTableDataGrid = ({ className, companyId, onError, onDelete, onEdit }) => {
    const [loading, setLoading] = useState(false);

    const customerDataGridRef = useRef(null);
    const customerStore = new CustomStore({
        key: "debtorId",
            load: async (loadOptions) => {
              const skip = loadOptions.skip ?? 0;
              const take = loadOptions.take ?? 10;
              const keyword = loadOptions.filter?.[2][2] || "";
        
              try {
                const data = await GetDebtorRecords({ companyId, offset: skip, limit: take, keyword });
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
            ref={customerDataGridRef}
            height={"100%"}
            dataSource={customerStore}
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
                dataField="debtorCode"
                caption="Customer Code"
                allowEditing={false}
                width={"150px"}
            />
            <Column
                dataField="companyName"
                caption="Customer Name"
                
            />
            <Column
                dataField="isActive"
                caption="Active"
                type="boolean"
                width={"100px"}
            />
            <Column
                caption="Action"
                width={"150px"}
                headerCellRender={() => {
                    return (
                        <div className="font-bold text-white">
                            Action
                        </div>
                    )
                }}
                cellRender={(cellData) => {
                    return (

                        <div className="flex flex-row justify-center space-x-2">
                            <div className=" text-blue-400 hover:cursor-pointer flex justify-center "
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent row click event (select)
                                    onEdit(cellData.data, "view");
                                }}>
                                <Eye size={20} />
                            </div>
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
                                    onDelete(cellData.data.debtorId);
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

export default CustomerTableDataGrid;