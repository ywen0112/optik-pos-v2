import { Column } from "devextreme-react/cjs/data-grid";
import StandardDataGridComponent from "../../BaseDataGrid";

const StockBalanceReportDataGrid = ({ ref, data }) => {
    return (
        <>
            <StandardDataGridComponent
                ref={ref}
                height={490}
                dataSource={data}
                pager={true}
                pageSizeSelector={true}
                showBorders={true}
                allowColumnResizing={false}
                allowColumnReordering={false}
                allowEditing={false}
                remoteOperations={{ paging: true }}
            >
                <Column dataField="itemCode" caption="Item Code" />
                <Column dataField="uom" caption="UOM" />
                <Column dataField="isActive" caption="Active" dataType="boolean" />
                <Column dataField="description" caption="Description" />
                <Column dataField="desc2" caption="Description 2" />
                <Column dataField="itemGroupCode" caption="Group Code" />
                <Column dataField="itemGroupDescription" caption="Group Description" />
                <Column dataField="itemTypeCode" caption="Type Code" />
                <Column dataField="itemTypeDescription" caption="Type Description" />
                <Column 
                    dataField="qty" 
                    caption="Quantity" 
                    format={{ 
                        type: "fixedPoint", 
                        precision: 2 
                    }} 
                />
            </StandardDataGridComponent>
        </>
    )
}

export default StockBalanceReportDataGrid;