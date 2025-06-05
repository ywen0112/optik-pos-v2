import Column from "devextreme-react/cjs/data-grid";
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
                <Column dataField="remark" />
                <Column dataField="refNo" />
                <Column dataField="salesPerson" />
                <Column dataField="subTotal" format={{
                    type: "currency",
                    currency: "MYR",
                    precision: 2 // Allows 2 decimal places
                }}/>
                <Column dataField="roundingAdjustment" format={{
                    type: "currency",
                    currency: "MYR",
                    precision: 2 // Allows 2 decimal places
                }} />
                <Column dataField="total" format={{
                    type: "currency",
                    currency: "MYR",
                    precision: 2 // Allows 2 decimal places
                }} />
                <Column dataField="isVoid" />
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