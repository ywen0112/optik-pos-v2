import { useState, useRef } from "react";
import { Eye, Pencil, TrashIcon } from "lucide-react";
import { Column } from "devextreme-react/cjs/data-grid";

import StandardDataGridComponent from "../../BaseDataGrid";
import { GetUserRoleRecords } from "../../../api/maintenanceapi";
import CustomStore from "devextreme/data/custom_store";


const UserRoleTableDataGrid = ({ className, companyId, onError, onDelete, onEdit }) => {
    const [loading, setLoading] = useState(false);

    const userRoleTableDataGridRef = useRef(null);

    const userRoleStore = new CustomStore({
        key: "userRoleId",
        load: async (loadOptions) => {
            const skip = loadOptions.skip ?? 0;
            const take = loadOptions.take ?? 10;
            const keyword = loadOptions.filter?.[2][2] || "";

            try {
                const data = await GetUserRoleRecords({ companyId, offset: skip, limit: take, keyword });
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
            ref={userRoleTableDataGridRef}
            height={"100%"}
            dataSource={userRoleStore}
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
                dataField="userRoleCode"
                caption="User Role Code"
                allowEditing={false}
                width={"10%"}
            />
            <Column
                dataField="description"
                caption="Name"
                width={"80%"}
            />
            <Column
                caption="Action"
                width={"10%"}
                headerCellRender={() => {
                    return (
                        <div className="  font-bold text-white">
                            Action
                        </div>
                    )
                }}
                cellRender={(cellData) => {
                    if (cellData.data.userRoleCode === "SUPER ADMIN") return (

                        <div className="flex flex-row justify-center space-x-2">
                            <div className=" text-blue-400 hover:cursor-pointer flex justify-center "
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent row click event (select)
                                    onEdit(cellData.data, "view");
                                }}>
                                <Eye size={20} />
                            </div>
                        </div>
                    );
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
                                    onDelete(cellData.data.userRoleId);
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

export default UserRoleTableDataGrid;