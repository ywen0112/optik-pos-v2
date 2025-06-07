import { Column } from "devextreme-react/data-grid";
import StandardDataGridComponent from "../../BaseDataGrid";

const OutstandingBalanceDataGrid = ({ ref, data }) => {
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
                <Column dataField="docType" caption="Doc Type"/>
                <Column dataField="docNo" caption="Doc No"/>
                <Column
                    dataField="docDate"
                    dataType="date"
                    caption="Date"
                    calculateDisplayValue={(rowData) => {
                        const date = new Date(rowData.docDate);
                        const dd = String(date.getDate()).padStart(2, '0');
                        const mm = String(date.getMonth() + 1).padStart(2, '0');
                        const yyyy = date.getFullYear();
                        return `${dd}/${mm}/${yyyy}`;
                    }}
                />

                <Column dataField="debtorCode" caption="Customer Code"/>
                <Column dataField="debtorName" caption="Name"/>
                <Column dataField="remark" caption="Remark"/>
                <Column dataField="refNo" caption="Ref No"/>
                <Column dataField="salesPerson" caption="Sales Person"/>
                <Column dataField="subTotal" caption="Sub Total" format={{
                    type: "currency",
                    currency: "MYR",
                    precision: 2 // Allows 2 decimal places
                }}/>
                <Column dataField="roundingAdjustment" caption="Rounding Adj" format={{
                    type: "currency",
                    currency: "MYR",
                    precision: 2 // Allows 2 decimal places
                }} />
                <Column dataField="total" caption="Total" format={{
                    type: "currency",
                    currency: "MYR",
                    precision: 2 // Allows 2 decimal places
                }} />
                <Column dataField="isVoid" caption="Is Void" />
                <Column
                    dataField="paidedAmount"
                    caption="Paid Amount"
                    format={{
                        type: "currency",
                        currency: "MYR",
                        precision: 2 // Allows 2 decimal places
                    }}
                />
                <Column
                    dataField="outstandingAmount"
                    caption="Outstanding"
                    format={{
                        type: "currency",
                        currency: "MYR",
                        precision: 2 // Allows 2 decimal places
                    }}
                />
            </StandardDataGridComponent>
        </>
    )
}

export default OutstandingBalanceDataGrid;