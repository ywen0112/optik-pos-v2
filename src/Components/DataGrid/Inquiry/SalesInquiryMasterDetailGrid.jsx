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
import StandardDataGridComponent from '../../BaseDataGrid';
import { DollarSign, PackageOpen, Printer } from 'lucide-react';

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
                </DataGrid>
            ),
        },
        {
            title: "Payments",
            component: () => (
                <DataGrid dataSource={payments} showBorders={true} columnAutoWidth={true}>
                    <Column dataField="docNo" caption="Doc No" />
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

                    <Column dataField="cashAmount" format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2 // Allows 2 decimal places
                }} />
                    <Column dataField="creditCardAmount" format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2 // Allows 2 decimal places
                }} />
                    <Column dataField="eWalletAmount" format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2 // Allows 2 decimal places
                }} />
                    <Column dataField="total" format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2 // Allows 2 decimal places
                }} />
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


const SalesInquiryMasterDetailGrid = ({ ref, salesData, onPay, onCollect, onPrint }) => {
    return (
        <StandardDataGridComponent
            ref={ref}
            height={490}
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
            <Column dataField="salesPerson" />
            <Column dataField="total" format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2 // Allows 2 decimal places
                }} />
            <Column
                dataField="outstanding"
                caption="Outstanding"
                format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2 // Allows 2 decimal places
                }}
            />
            <Column
                caption="Action"
                cellRender={(data) => {
                    const item = data.data;
                    return (
                        <div className="flex justify-center gap-2 text-blue-400">
                            <div
                                onClick={(e)=>{
                                    e.stopPropagation();
                                    onPrint(item);
                                }} 
                                className="hover:cursor-pointer"
                            >
                                <Printer size={20}/>
                            </div>
                            {item.docType === "Sales Order" && (
                                <div
                                className="hover:cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCollect(item);
                                }}
                                >
                                <PackageOpen size={20} />
                                </div>
                            )}
                            {item.outstanding > 0 && (
                                <div
                                    className="hover:cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPay(item);
                                    }}
                                >
                                    <DollarSign size={20} />
                                </div>
                            )}
                        </div>
                    );
                }}

            />

            <MasterDetail enabled={true} render={DetailTabs} />
        </StandardDataGridComponent>
    );
};


export default SalesInquiryMasterDetailGrid;
