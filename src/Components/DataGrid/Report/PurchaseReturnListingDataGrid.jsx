import DataGrid, { Column, MasterDetail } from "devextreme-react/cjs/data-grid";
import { TabPanel } from "devextreme-react";
import StandardDataGridComponent from "../../BaseDataGrid";

const DetailTabs = ({ data }) => {
    const details = data.details || [];

    const tab = [{
        title: "Detail",
        component: () => (
            <DataGrid dataSource={details} showBorders={true} columnAutoWidth={true}>
                <Column dataField="itemCode" caption="Item Code" />
                <Column dataField="uom" caption="UOM" />
                <Column dataField="description" caption="Description" />
                <Column dataField="desc2" caption="Description 2" />
                <Column dataField="qty" caption="Quantity" />
                <Column dataField="unitPrice" caption="Unit Price" format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2
                }} />
                <Column dataField="discount" caption="Discount" />
                <Column dataField="discountAmount" caption="Discount Amount" format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2
                }} />
                <Column dataField="subTotal" caption="Subtotal" format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2
                }} />
                <Column dataField="remark" caption="Remark" />
            </DataGrid>
        )
    }];

    return (
        <TabPanel
            items={tab}
            itemTitleRender={(item) => item.title}
            itemComponent={({ data }) => <>{data.component()}</>}
        />
    );
};

const PurchaseListingReportDataGrid = ({ ref, data }) => {
    return (
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
            <Column dataField="purchaseReturnId" caption="Purchase Return ID" />
            <Column dataField="docNo" caption="Document No" />
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
            <Column dataField="creditorCode" caption="Creditor Code" />
            <Column dataField="creditorName" caption="Creditor Name" />
            <Column dataField="remark" caption="Remark" />
            <Column dataField="isDamage" caption="Is Damage" dataType="boolean" />
            <Column dataField="tax" caption="Tax" format={{ 
                type: "currency", 
                currency: "MYR", 
                precision: 2
            }} />
            <Column dataField="total" caption="Total" format={{ 
                type: "currency", 
                currency: "MYR", 
                precision: 2
            }} />
            <Column dataField="isVoid" caption="Is Void" dataType="boolean" />
            <Column dataField="createdUserName" caption="Created By" />
            <Column
                dataField="createdTimeStamp"
                caption="Created Date"
                dataType="date"
                calculateDisplayValue={(rowData) => {
                    const date = new Date(rowData.createdTimeStamp);
                    const dd = String(date.getDate()).padStart(2, '0');
                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                    const yyyy = date.getFullYear();
                    return `${dd}/${mm}/${yyyy}`;
                }}
            />
            <Column dataField="lastModifiedUserName" caption="Last Modified By" />
            <Column
                dataField="lastModifiedTimeStamp"
                caption="Last Modified Date"
                dataType="date"
                calculateDisplayValue={(rowData) => {
                    const date = new Date(rowData.lastModifiedTimeStamp);
                    const dd = String(date.getDate()).padStart(2, '0');
                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                    const yyyy = date.getFullYear();
                    return `${dd}/${mm}/${yyyy}`;
                }}
            />
            <MasterDetail enabled={true} render={DetailTabs} />
        </StandardDataGridComponent>
    );
};

export default PurchaseListingReportDataGrid;