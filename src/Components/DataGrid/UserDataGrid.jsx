import { useEffect, useState, useRef } from "react";
import { Pencil, TrashIcon } from "lucide-react";
import { Column } from "devextreme-react/cjs/data-grid";

import StandardDataGridComponent from "../BaseDataGrid";
import { GetCreditorRecords } from "../../api/maintenanceapi";
import { GetUserRecords } from "../../api/userapi";
import CustomStore from "devextreme/data/custom_store";


const UserDataGrid = ({className, companyId, onError, onDelete, onEdit}) => {
    const [loading, setLoading] = useState(false);

    const userDataGridRef = useRef(null);

    const userStore = new CustomStore({
        key: "userId",
            load: async (loadOptions) => {
              const skip = loadOptions.skip ?? 0;
              const take = loadOptions.take ?? 10;
              const keyword = loadOptions.searchValue || "";
        
              try {
                const data = await GetUserRecords({ companyId, offset: skip, limit: take, keyword });
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
            ref={userDataGridRef}
            height={"100%"}
            dataSource={userStore}
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
                dataField="userName"
                caption="Username"
                allowEditing={false}
                width={"20%"}
            />
            <Column
                dataField="userEmailAddress"
                caption="Email"
                width={"50%"}
            />
            <Column
                dataField="userRoleCode"
                caption="User Role"
                width={"30%"}
            />
            <Column
                caption="Action"
                width={"10%"}
                headerCellRender={() => {
                    return (
                        <div className="font-bold text-white">
                            Action
                        </div>
                    )
                }}
                cellRender={(cellData) => {
                    if(cellData.data.userRoleCode === "SUPER ADMIN") return null;                    
                    return (
                        <div className="flex flex-row justify-center space-x-2">
                            <div className=" text-green-600 hover:cursor-pointer flex justify-center "
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent row click event (select)
                                    onEdit(cellData.data, "edit");
                                    fetchUsers();
                                }}>
                                <Pencil size={20} />
                            </div>
                            <div className=" text-red-600 hover:cursor-pointer flex justify-center "
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent row click event (select)
                                    onDelete(cellData.data.creditorId);
                                    fetchUsers();
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

export default UserDataGrid;