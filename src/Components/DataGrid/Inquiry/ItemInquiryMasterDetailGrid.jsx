import StandardDataGridComponent from '../../BaseDataGrid';
import DataGrid, {
    Column,
    Paging,
    Scrolling,
    Pager,
    MasterDetail
} from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import TabPanel from 'devextreme-react/tab-panel';

const DetailTabs = ({ data }) => {
    const history = data?.history || [];

    const tabs = [
        {
            title: "Item History",
            component: () => (
            <DataGrid
                dataSource={history}
                showBorders={true}
                columnAutoWidth={true}
            >
                <Column dataField="docType" caption="Doc Type" />
                <Column dataField="docNo" caption="Doc No" />
                <Column
                dataField="docDate"
                caption="Doc Date"
                dataType="date"
                calculateDisplayValue={(rowData) => {
                    const date = new Date(rowData.docDate);
                    const dd = String(date.getDate()).padStart(2, '0');
                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                    const yyyy = date.getFullYear();
                    return `${dd}/${mm}/${yyyy}`;
                }}
                />
                <Column dataField="code" caption="Debtor Code" />
                <Column dataField="name" caption="Debtor Name" />
                <Column dataField="uom" caption="UOM" />
                <Column dataField="qty" caption="Qty" />
                <Column dataField="unitPrice" caption="Unit Price" format={{ type: "currency", currency: "MYR" }} />
                <Column dataField="discount" caption="Discount" />
                <Column dataField="discountAmount" caption="Discount Amt" format={{ type: "currency", currency: "MYR" }} />
                <Column dataField="subTotal" caption="Subtotal" format={{ type: "currency", currency: "MYR" }} />
            </DataGrid>
            )
        }
        ];

        return (
        <TabPanel
            items={tabs}
            itemTitleRender={(item) => item.title}
            itemComponent={({ data }) => <>{data.component()}</>}
        />
        );
    };

const ItemInquiryMasterDataDetailGrid = ({ ref, itemData }) => {

    return(
        <StandardDataGridComponent
            ref={ref}
            height={350}
            dataSource={itemData}
            searchPanel={true}
            pager={true}
            pageSizeSelector={true}
            showBorders={true}
            remoteOperations={{ paging: true }}
        >

        <Column dataField="itemCode" />
        <Column dataField="description" />
        <Column dataField="desc2" />
        <Column dataField="itemGroupCode" />
        <Column dataField="itemTypeCode" />
        <Column dataField="barCode" />
        <Column dataField="uom" />
        <Column dataField="price" format={{ type: "currency", currency: "MYR" }} />
        <Column dataField="rate" />
        <Column dataField="cost" format={{ type: "currency", currency: "MYR" }} />
        <Column dataField="minSalePrice" format={{ type: "currency", currency: "MYR" }} />
        <Column dataField="classification" />
        <Column dataField="balQty" />
        <Column dataField="remark" />
        <Column
            dataField="isActive"
            caption="Active"
            type="boolean"
            width={"100px"}
        />

        <MasterDetail enabled={true} render={DetailTabs} />
    </StandardDataGridComponent>
    );
};

export default ItemInquiryMasterDataDetailGrid;