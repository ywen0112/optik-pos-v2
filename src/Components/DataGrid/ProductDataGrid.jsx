import StandardDataGridComponent from "../BaseDataGrid";
import { Column } from "devextreme-react/cjs/data-grid";
import { Eye, Trash2, Pencil } from "lucide-react";

const ProductDataGrid = ({ ref, productRecords, className, customerId, onPageChange, onError, onDelete, onEdit }) => {
    return (
        <StandardDataGridComponent
            ref={ref}
            dataSource={productRecords}
            className={className}
            searchPanel={true}
            pager={true}
            height={"100%"}
            pageSizeSelector={true}
            columnChooser={true}
            showBorders={true}
            allowColumnReordering={true}
            allowColumnResizing={false}
            allowEditing={true}
            onOptionChanged={onPageChange}
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
                                    onEdit(cellData.data);
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

export default ProductDataGrid