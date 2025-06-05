import DataGrid, { Column, MasterDetail } from "devextreme-react/cjs/data-grid";
import StandardDataGridComponent from "../../BaseDataGrid";
import { TabPanel } from "devextreme-react";

const DetailTabs = ({ data }) => {
    const details = data.details;

    const tab = [{
        title: "Detail",
        component: () => (
            <DataGrid dataSource={details} showBorders={true} paging={{ enabled: false }}>
                <Column dataField="itemCode" caption="Product Code" />
                <Column dataField="uom" caption="UOM" />
                <Column dataField="description" caption="Product Name" />
                <Column dataField="desc2" caption="Description" />
                <Column dataField="qty" caption="QTY" />
                <Column dataField="collectedQty" caption="Collected Qty" />
                <Column dataField="uncollectedQty" caption="Uncollected Qty" />
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

const UncollectedORderReportDataGrid = ({ ref, data }) => {
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
                <MasterDetail enabled={true} render={DetailTabs} />
            </StandardDataGridComponent>
        </>
    )
}

export default UncollectedORderReportDataGrid;