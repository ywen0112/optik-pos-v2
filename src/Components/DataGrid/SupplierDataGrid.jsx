import { useEffect, useState, useRef } from "react";
import { Pencil, TrashIcon } from "lucide-react";
import { Column } from "devextreme-react/cjs/data-grid";

import StandardDataGridComponent from "../BaseDataGrid";
import { GetCreditorRecords } from "../../api/maintenanceapi";


const SupplierDataGrid = ({className, companyId, onError, onDelete, onEdit}) => {
    const [supplier, setSupplier] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skip, setSkip] = useState(0)
    const [take, setTake] = useState(10)
    const [keyword, setKeyword] = useState("")

    const supplierDataGridRef = useRef(null);

    useEffect(() => {
        fetchSuppliers();
    }, [skip, take, keyword])

    useEffect(() => {
        fetchSuppliers();
    }, [onEdit, onDelete ])

    useEffect(() =>{
        setSkip(0)
        setTake(10)
    }, [keyword])

    const fetchSuppliers = async () => {
        setLoading(true);
    
        try {
          const data = await GetCreditorRecords({companyId: companyId, keyword: keyword, offset: skip, limit: take});
          if (data.success) {
          const records = data.data || [];
          const total = data.data.totalRecords || 0;
    
          setSupplier(records);
          
          } else throw new Error(data.errorMessage || "Failed to fetch suppliers.");
        } catch (error) {
            onError({ title: "Fetch Error", message: error.message });
        } finally {
          setLoading(false);
        }
      };
    
    const handlePagerChange = (e) =>{
        if (e.fullName === 'paging.pageSize' || e.fullName === 'paging.pageIndex') {
            const gridInstance = supplierDataGridRef.current.instance;
      
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
            ref={supplierDataGridRef}
            height={"100%"}
            dataSource={supplier}
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
                dataField="creditorCode"
                caption="Supplier Code"
                allowEditing={false}
                width={"10%"}
            />
            <Column
                dataField="companyName"
                caption="Name"
                width={"80%"}
            />
            <Column
                dataField="isActive"
                caption="Is Active"
                type="boolean"
                width={"10%"}
            />
            <Column
                dataField="isDefault"
                caption="Default"
                type="boolean"
                width={"10%"}
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

export default SupplierDataGrid;