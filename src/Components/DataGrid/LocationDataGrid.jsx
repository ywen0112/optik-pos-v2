import { useEffect, useState, useRef } from "react";
import { Pencil, TrashIcon } from "lucide-react";
import { Column } from "devextreme-react/cjs/data-grid";

import StandardDataGridComponent from "../BaseDataGrid";
import { GetLocationRecords } from "../../apiconfig";


const LocationDataGrid = ({className, customerId, onError, onDelete, onEdit}) => {
    const [location, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skip, setSkip] = useState(0)
    const [take, setTake] = useState(10)

    const locationDataGridRef = useRef(null);

    useEffect(() => {
        fetchLocations()
    }, [skip, take])

    const fetchLocations = async () => {
        setLoading(true);
    
        try {
          const res = await fetch(GetLocationRecords, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId: Number(customerId), keyword: "", Offset: skip, Limit: take })
          });
          const data = await res.json();
          if (data.success) {
          const records = data.data.locationRecords || [];
          const total = data.data.totalRecords || 0;
    
          setLocations(records);
          
          } else throw new Error(data.errorMessage || "Failed to fetch locations.");
        } catch (error) {
            onError({ title: "Fetch Error", message: error.message });
        } finally {
          setLoading(false);
        }
      };
    
    const handlePagerChange = (e) =>{
        if (e.fullName === 'paging.pageSize' || e.fullName === 'paging.pageIndex') {
            const gridInstance = locationDataGridRef.current.instance;
      
            const pageSize = gridInstance.pageSize();
            const pageIndex = gridInstance.pageIndex(); 
            const skip = pageIndex * pageSize;
            const take = pageSize;

            setSkip(skip);
            setTake(take);
          }
    }
    return (
        <StandardDataGridComponent
        ref={locationDataGridRef}
            height={"100%"}
            dataSource={location}
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
                dataField="locationCode"
                allowEditing={false}
                width={"10%"}
            />
            <Column
                dataField="description"
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
                        <div className="  font-bold text-gray-700">
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

export default LocationDataGrid