import { useEffect, useState, useRef } from "react";
import { Pencil, TrashIcon } from "lucide-react";
import { Column } from "devextreme-react/cjs/data-grid";

import StandardDataGridComponent from "../BaseDataGrid";
import { GetCreditorRecords } from "../../api/maintenanceapi";
import { GetUserRecords } from "../../api/userapi";


const UserDataGrid = ({className, companyId, onError, onDelete, onEdit}) => {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skip, setSkip] = useState(0)
    const [take, setTake] = useState(10)
    const [keyword, setKeyword] = useState("")

    const userDataGridRef = useRef(null);

    useEffect(() => {
        fetchUsers();
    }, [skip, take, keyword])

    useEffect(() => {
        fetchUsers();
    }, [onEdit, onDelete ])

    useEffect(() =>{
        setSkip(0)
        setTake(10)
    }, [keyword])

    const fetchUsers = async () => {
        setLoading(true);
    
        try {
          const data = await GetUserRecords({companyId: companyId, keyword: keyword, offset: skip, limit: take});
          if (data.success) {
          const records = data.data || [];
          const total = data.data.totalRecords || 0;
    
          setUser(records);
          
          } else throw new Error(data.errorMessage || "Failed to fetch users.");
        } catch (error) {
            onError({ title: "Fetch Error", message: error.message });
        } finally {
          setLoading(false);
        }
      };
    
    const handlePagerChange = (e) =>{
        if (e.fullName === 'paging.pageSize' || e.fullName === 'paging.pageIndex') {
            const gridInstance = userDataGridRef.current.instance;
      
            const pageSize = gridInstance.pageSize();
            const pageIndex = gridInstance.pageIndex(); 
            const skip = pageIndex * pageSize;
            const take = pageSize;

            setSkip(skip);
            setTake(take);
        }

        if(e.fullName === 'searchPanel.text'){
            const searchText = e.value;
            setKeyword(searchText);
        }
    }
    return (
        <StandardDataGridComponent
            ref={userDataGridRef}
            height={"100%"}
            dataSource={user}
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
            onOptionChanged={handlePagerChange}            
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
                dataField="userRoleId"
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

                                    onDelete(cellData.data.creditorId);
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