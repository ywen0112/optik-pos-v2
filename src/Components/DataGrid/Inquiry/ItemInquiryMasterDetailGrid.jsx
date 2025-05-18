import StandardDataGridComponent from '../../BaseDataGrid';
import { useState, useEffect, useMemo } from 'react';
import DataGrid, {
    Column,
    Paging,
    Scrolling,
    Pager,
    MasterDetail
} from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import TabPanel from 'devextreme-react/tab-panel';
import CustomStore from 'devextreme/data/custom_store';
import { GetItemHistorys } from '../../../api/inquiryapi'; 

const DetailTabs = ({ data }) => {
  const [historyStore, setHistoryStore] = useState(null);

  useEffect(() => {
    if (!data) return;

    const store = new CustomStore({
      key: 'docNo', // or whatever is unique
      load: async (loadOptions) => {
        const { skip = 0, take = 20 } = loadOptions;

        try {
          const res = await GetItemHistorys({
            companyId: sessionStorage.getItem('companyId'),
            id: data?.itemId,
            fromDate: data?.fromDate,
            toDate: data?.toDate,
            offset: skip,
            limit: take,
          });

          const filtered = res.data?.filter(h => h.itemCode === data.itemCode) || [];

          return {
            data: filtered,
            totalCount: res.totalRecords || 1000, // default to large number if unknown
          };
        } catch (err) {
          console.error('Error loading detail history:', err);
          return {
            data: [],
            totalCount: 0,
          };
        }
      },
    });

    setHistoryStore(() => store);
  }, [data]);

  const tabs = useMemo(() => [
    {
      title: 'Item History',
      component: () =>
        historyStore ? (
          <DataGrid
            dataSource={historyStore}
            showBorders={true}
            columnAutoWidth={true}
            height={300}
          >
            <Paging enabled={true} pageSize={20} />
            <Scrolling mode="infinite" />
            <Column dataField="docType" caption="Doc Type" />
            <Column dataField="docNo" caption="Doc No" />
            <Column
              dataField="docDate"
              caption="Doc Date"
              dataType="date"
              calculateDisplayValue={(rowData) => {
                const date = new Date(rowData.docDate);
                return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
              }}
            />
            <Column dataField="name" caption="Debtor Name" />
            <Column dataField="uom" caption="UOM" />
            <Column dataField="qty" caption="Qty" />
            <Column dataField="unitPrice" caption="Unit Price" format={{ type: 'currency', currency: 'MYR' }} />
            <Column dataField="discount" caption="Discount" />
            <Column dataField="discountAmount" caption="Discount Amt" format={{ type: 'currency', currency: 'MYR' }} />
            <Column dataField="subTotal" caption="Subtotal" format={{ type: 'currency', currency: 'MYR' }} />
          </DataGrid>
        ) : (
          <div>Loading...</div>
        ),
    },
  ], [historyStore]);

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
            height={490}
            dataSource={itemData}
            searchPanel={true}
            pager={true}
            pageSizeSelector={true}
            showBorders={true}
            remoteOperations={{ paging: true }}
        >

        <Column dataField="itemCode" />
        <Column dataField="description" />
        {/* <Column dataField="desc2" /> */}
        <Column dataField="itemGroupCode" />
        <Column dataField="itemTypeCode" />
        {/* <Column dataField="barCode" /> */}
        <Column dataField="uom" />
        <Column dataField="price" format={{ type: "currency", currency: "MYR" }} />
        {/* <Column dataField="rate" /> */}
        <Column dataField="cost" format={{ type: "currency", currency: "MYR" }} />
        {/* <Column dataField="minSalePrice" format={{ type: "currency", currency: "MYR" }} /> */}
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