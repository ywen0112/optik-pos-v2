import React, { useState } from 'react';
import DataGrid, {
    Column,
    Paging,
    Scrolling,
    Pager,
    MasterDetail
} from 'devextreme-react/data-grid';
import TabPanel from 'devextreme-react/tab-panel';
import 'devextreme/dist/css/dx.light.css';
import StandardDataGridComponent from './BaseDataGrid';

const DetailTabs = ({ data }) => {
    const details = data.details || [];
    const payments = data.payments || [];

    const tabs = [
        {
            title: "Details",
            component: () => (
                <DataGrid dataSource={details} showBorders={true} columnAutoWidth={true}>
                    <Column dataField="itemCode" caption="Item Code" />
                    <Column dataField="uom" caption="UOM" />
                    <Column dataField="description" />
                    <Column dataField="qty" caption="Qty" />
                    <Column dataField="unitPrice" caption="Unit Price" format={{ type: "currency", currency: "MYR" }} />
                    <Column dataField="discount" />
                    <Column dataField="discountAmount" caption="Discount Amt" format={{ type: "currency", currency: "MYR" }} />
                    <Column dataField="subTotal" caption="Subtotal" format={{ type: "currency", currency: "MYR" }} />
                </DataGrid>
            ),
        },
        {
            title: "Payments",
            component: () => (
                <DataGrid dataSource={payments} showBorders={true} columnAutoWidth={true}>
                    <Column dataField="docNo" caption="Doc No" />
                    <Column dataField="docDate" caption="Date" dataType="date" />
                    <Column dataField="cashAmount" format={{ type: "currency", currency: "MYR" }} />
                    <Column dataField="creditCardAmount" format={{ type: "currency", currency: "MYR" }} />
                    <Column dataField="eWalletAmount" format={{ type: "currency", currency: "MYR" }} />
                    <Column dataField="total" format={{ type: "currency", currency: "MYR" }} />
                    <Column dataField="isVoid" caption="Is Void" dataType="boolean" />
                </DataGrid>
            ),
        },
    ];

    return (
        <TabPanel
            items={tabs}
            itemTitleRender={(item) => item.title}
            itemComponent={({ data }) => <>{data.component()}</>}
        />
    );
};


const SalesInquiryMasterDetailGrid = ({ salesData }) => {
    return (
        <StandardDataGridComponent
            height={480}
            dataSource={salesData}
            // className={className}
            searchPanel={true}
            pager={true}
            pageSizeSelector={true}
            showBorders={true}
            remoteOperations={{ paging: true }}
            >


            <Column dataField="docType" />
            <Column dataField="docNo" />
            <Column dataField="docDate" dataType="date" />
            <Column dataField="debtorCode" />
            <Column dataField="debtorName" />
            <Column dataField="salesPerson" />
            <Column dataField="total" format={{ type: "currency", currency: "MYR" }} />

            <MasterDetail enabled={true} render={DetailTabs} />
        </StandardDataGridComponent>
    );
};


export default SalesInquiryMasterDetailGrid;
