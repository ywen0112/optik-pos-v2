import DataGrid, { Column, MasterDetail } from "devextreme-react/cjs/data-grid";
import StandardDataGridComponent from "../../BaseDataGrid";
import { components } from "react-select";
import { TabPanel } from "devextreme-react";

const DetailTabs = ({ data }) => {
    const details = [{
        createdUserName: data.createdUserName,
        createdTimeStamp: data.createdTimeStamp,
        lastModifiedUserName: data.lastModifiedUserName,
        lastModifiedTimeStamp: data.lastModifiedTimeStamp,
        cashAmount: data.cashAmount,
        creditCardAmount: data.creditCardAmount,
        eWalletAmount: data.eWalletAmount
    }];

    const tab = [{
        title: "Detail",
        component: () => (
            <DataGrid dataSource={details} showBorders={true} columnAutoWidth={true}>
                <Column dataField="cashAmount" caption="Cash Received" format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2 // Allows 2 decimal places
                }}/>
                <Column dataField="creditCardAmount" caption="Credit Card Received" format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2 // Allows 2 decimal places
                }} />
                <Column dataField="eWalletAmount" caption="E-Wallet Received" format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2 // Allows 2 decimal places
                }} />
                <Column dataField="createdUserName" caption="Created By" />
                <Column dataField="createdTimeStamp" caption="Created On" />
                <Column dataField="lastModifiedUserName" caption="Modified by" />
                <Column dataField="lastModifiedTimeStamp" caption="Modified On" />
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
const DailyClosingSummaryDataGrid = ({ ref, data }) => {
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
                <Column dataField="total" format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2 // Allows 2 decimal places
                }} />
                <Column
                    dataField="outstandingAmount"
                    caption="Outstanding"
                    format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2 // Allows 2 decimal places
                }}
                />
                <MasterDetail enabled={true} render={DetailTabs} />
            </StandardDataGridComponent>
        </>
    )
}

export default DailyClosingSummaryDataGrid;