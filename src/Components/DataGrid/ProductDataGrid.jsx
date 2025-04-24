import StandardDataGridComponent from "../BaseDataGrid";
import { Column } from "devextreme-react/cjs/data-grid";
import { Eye, TrashIcon, Pencil } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { GetItemsRecords } from "../../api/maintenanceapi";

const ProductDataGrid = ({ className, companyId, onError, onDelete, onEdit }) => {
    const [item, setItem] = useState([]);
    const [loading, setLoading] = useState(false);
    const [skip, setSkip] = useState(0)
    const [take, setTake] = useState(10)
    const [keyword, setKeyword] = useState("")

    const itemDataGridRef = useRef(null);

    useEffect(() => {
        fetchItem();
    }, [skip, take, keyword])

    useEffect(() => {
        fetchItem();
    }, [onEdit, onDelete])

    useEffect(() => {
        setSkip(0)
        setTake(10)
    }, [keyword])

    const fetchItem = async () =>{
        setLoading(true);

        try{
            const data = await GetItemsRecords({companyId:companyId, keyword: keyword, offset:skip, limit:take});
            if(data.success){
                const records = data.data || [];
                const total = data.data.totalRecords || 0;

                setItem(records);
            }else throw new Error(data.errorMessage || "Failed to fetch Products.");
        }catch(error){
            onError({title: "Fetch Error", message: error.message});
        } finally{
            setLoading(false);
        }
    }
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
            ref={itemDataGridRef}
            height={"100%"}
            dataSource={item}
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
                caption="Product Code"
                dataField="itemCode"
                width={"10%"}
            />
            <Column
                caption="Product Name"
                dataField="description"
            />
            <Column
                caption="Description"
                dataField="desc2"
            />
            <Column
                caption="UOM"
                dataField="UOM"
            />
            <Column
                caption="Price"
                dataField="price"
            />
            <Column
                caption="Min Price"
                dataField="minPrice"
            />
            <Column
                caption="Cost"
                dataField="cost"
            />
            <Column
                caption="Barcode"
                dataField="barcode"
            />
            <Column
                caption="Has Commission"
                dataField="hasCommision"
            />
            <Column
                caption="Commission Type"
                dataField="commisionType"
            />
            <Column
                dataField="Commission Value"
                caption="Commission Value"
            />
            <Column
                dataField="productGroup"
                caption="Product Group"
            />

            <Column
                caption="Status"
                dataField="isActive"
                dataType="boolean"
            />
            <Column
                caption="Remark"
                dataField="remark"
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
                    return (
                        <div className="flex flex-row justify-center space-x-2">
                            <div className=" text-green-600 hover:cursor-pointer flex justify-center "
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent row click event (select)
                                    onEdit(cellData.data);
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