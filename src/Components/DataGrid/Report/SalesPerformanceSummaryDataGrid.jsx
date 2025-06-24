import { Column } from "devextreme-react/data-grid";
import StandardDataGridComponent from "../../BaseDataGrid";

const SalesPerformanceSummaryDataGrid = ({ ref, data }) => {
    return (
        <StandardDataGridComponent
            ref={ref}
            height={490}
            dataSource={data}
            pager={true}
            pageSizeSelector={true}
            showBorders={true}
            allowColumnResizing={true}
            allowColumnReordering={false}
            allowEditing={false}
            remoteOperations={{ paging: true }}
        >
            <Column dataField="salesPersonName" caption="Sales Person" />
            <Column 
                dataField="totalSalesAmount" 
                caption="Total Sales" 
                format={{ type: "fixedPoint", precision: 2 }} 
            />
            <Column 
                dataField="totalPaymentAmount" 
                caption="Total Payment" 
                format={{ type: "fixedPoint", precision: 2 }} 
            />
        </StandardDataGridComponent>
    );
};

export default SalesPerformanceSummaryDataGrid;
