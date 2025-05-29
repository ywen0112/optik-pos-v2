import DataGrid, { Column, MasterDetail } from "devextreme-react/cjs/data-grid";
import StandardDataGridComponent from "../../BaseDataGrid";
import { TabPanel } from "devextreme-react";

const DetailTabs = ({ data }) => {
    const details = data.details || [];

    const tab = [{
        title: "Detail",
        component: () => (
            <DataGrid dataSource={details} showBorders={true} columnAutoWidth={true}>
                <Column dataField="itemCode" caption="Item Code" />
                <Column dataField="uom" caption="UOM" />
                <Column dataField="description" />
                <Column dataField="qty" caption="Qty" />
                <Column dataField="unitPrice" caption="Unit Price" format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2 // Allows 2 decimal places
                }} />
                <Column dataField="discount" />
                <Column dataField="discountAmount" caption="Discount Amt" format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2 // Allows 2 decimal places
                }} />
                <Column dataField="subTotal" caption="Subtotal" format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2 // Allows 2 decimal places
                }} />
                <Column dataField="classification" />
                <Column dataField="commissionType" caption="Commission Type"/>
                <Column dataField="value" caption="Comm Value"/>
                <Column dataField="commissionAmount" caption="Comm Amount"/>
            </DataGrid>

        )
    }]

    return (
        <TabPanel
            items={tab}
            itemTitleRender={(item) => item.title}
            itemComponent={({ data }) => <>{data.component()}</>}
        />
    )

}

const CommissionReportDataGrid = ({ ref, data }) => {
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
                // onLoading={loading}
                remoteOperations={{ paging: true }}
            >
                <Column dataField="docType" />
                <Column dataField="docNo" />
                <Column dataField="refNo" />
                <Column
                    dataField="docDate"
                    dataType="date"
                    calculateDisplayValue={(rowData) => {
                        const date = new Date(rowData.docDate);
                        const dd = String(date.getDate()).padStart(2, '0');
                        const mm = String(date.getMonth() + 1).padStart(2, '0');
                        const yyyy = date.getFullYear();
                        return `${dd}/${mm}/${yyyy}`;
                    }}
                />
                <Column dataField="debtorCode" />
                <Column dataField="debtorName" />
                <Column dataField="isVoid" />
                <Column dataField="total" format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2 // Allows 2 decimal places
                }} />
                <Column
                    dataField="totalCommissionAmount"
                    caption="Total Commission"
                    format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2 // Allows 2 decimal places
                }}
                />
                <Column dataField="salesPerson" caption="Sales Person" />
                <Column dataField="Remark" />
                <MasterDetail enabled={true} render={DetailTabs} />
            </StandardDataGridComponent>
        </>
    )
}

export default CommissionReportDataGrid;