import DataGrid, { Column, MasterDetail } from "devextreme-react/cjs/data-grid";
import StandardDataGridComponent from "../../BaseDataGrid";

const MonthlySalesSummaryDataGrid = ({ ref, data }) => {
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
                <Column 
                    dataField="date" 
                    caption="Date" 
                    dataType="date" 
                    format="dd/MM/yyyy" 
                    width={120}
                />
                <Column 
                    dataField="salesAmount" 
                    caption="Sales Amount" 
                    format={{ 
                        type: "fixedPoint", 
                        precision: 2
                    }}
                />
                <Column 
                    dataField="collectionAmount" 
                    caption="Collection Amount" 
                    format={{ 
                        type: "fixedPoint", 
                        precision: 2
                    }}
                />
                <Column 
                    dataField="cashAmount" 
                    caption="Cash Amount" 
                    format={{ 
                        type: "fixedPoint", 
                        precision: 2
                    }}
                />
                <Column 
                    dataField="creditCardAmount" 
                    caption="Credit Card Amount" 
                    format={{ 
                        type: "fixedPoint", 
                        precision: 2
                    }}
                />
                <Column 
                    dataField="eWalletAmount" 
                    caption="E-Wallet Amount" 
                    format={{ 
                        type: "fixedPoint", 
                        precision: 2
                    }}
                />
            </StandardDataGridComponent>
        </>
    )
}

export default MonthlySalesSummaryDataGrid;