import { useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import DropDownBox from "devextreme-react/drop-down-box";
import CustomerDataGrid from "../../Components/DataGrid/CustomerDataGrid";
import ItemDropDownBoxComponent from "../../Components/DropDownBox/ItemDropDownBoxComponent";
import CustomStore from "devextreme/data/custom_store";
import DataGrid, {
  Column,
  Paging,
  Selection,
  Scrolling,
  SearchPanel
} from 'devextreme-react/data-grid';
import "react-datepicker/dist/react-datepicker.css";
import { getInfoLookUp } from "../../api/infolookupapi";
import { GetDebtor } from "../../api/maintenanceapi";
import SalesInquiryMasterDetailGrid from "../../Components/SalesInquiry";
import { GetSalesInquiry } from "../../api/inquiryapi";
import CustomInput from "../../Components/input/dateInput";

const CustomerGridBoxDisplayExpr = (item) =>
  item ? `${item.debtorCode}-${item.companyName}` : "";

const CustomerGridColumns = [
  { dataField: "debtorCode", caption: "Code", width: "30%" },
  { dataField: "companyName", caption: "Name", width: "50%" }
];

const SalesInquiry = () => {
  const companyId = sessionStorage.getItem("companyId");
  const userId = sessionStorage.getItem("userId");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);
    return today;
  });
  
  const [endDate, setEndDate] = useState(new Date());
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCustomerBoxOpen, setIsCustomerBoxOpen] = useState(false);
  const [data, setData] = useState(null);
  // const [dataStoreKey, setDataStoreKey] = useState(0);
  // const [selectedItemId, setSelectedItemId] = useState(null);

  // const CustomerBoxDisplayExpr = (item) => item && `${item.Code}`;

  const customerStore = new CustomStore({
    key: "debtorId",

    load: async (loadOptions) => {
      const filter = loadOptions.filter;
      let keyword = filter?.[2][2] || "";

      const params = {
        keyword: keyword || "",
        offset: loadOptions.skip,
        limit: loadOptions.take,
        type: "debtor",
        companyId,
      };
      const res = await getInfoLookUp(params);
      return {
        data: res.data,
        totalCount: res.totalRecords,
      };
    },
    byKey: async (key) => {
      if (!key) return null;
      const res = await GetDebtor({
        companyId,
        userId,
        id: key
      });
      return res.data;
    },
  });

  const handleCustomerGridBoxValueChanged = (e) => {
    if (!e.value) {
      setSelectedCustomer(null);
    }
  };

  const CustomerDataGridOnSelectionChanged = useCallback((e) => {
    const selected = e.selectedRowsData?.[0];
    if (selected) {
      setSelectedCustomer(selected);
      setIsCustomerBoxOpen(false);
    }

  }, []);

  const onCustomerGridBoxOpened = useCallback((e) => {
    if (e.name === 'opened') {
      setIsCustomerBoxOpen(e.value);
    }
  }, []);

  const CustomerDataGridRender = useCallback(
    () => (
      <DataGrid
        dataSource={customerStore}
        columns={CustomerGridColumns}
        hoverStateEnabled={true}
        showBorders={true}
        selectedRowKeys={selectedCustomer?.debtorId}
        onSelectionChanged={CustomerDataGridOnSelectionChanged}
        height="300px"
        remoteOperations={{
          paging: true,
          filtering: true,
        }}
      >
        <Selection mode="single" />
        <Paging
          enabled={true}
          pageSize={10}
        />
        <Scrolling mode="infinite" />

        <SearchPanel
          visible={true}
          width="100%"
          highlightSearchText={true}
        />
      </DataGrid>
    ),
    [selectedCustomer, CustomerDataGridOnSelectionChanged],
  );

  const handleGetInquiry = async () => {
    const store = new CustomStore({
      key: "docNo",
      load: async (loadOptions) => {
        const { skip, take } = loadOptions;

        const params = {
          companyId,
          id: selectedCustomer?.debtorId,
          fromDate: startDate,
          toDate: endDate,
          offset: skip || 0,
          limit: take || 10,
        };

        if (selectedCustomer?.debtorId) {
          params.debtorId = selectedCustomer.debtorId;
        }

        const res = await GetSalesInquiry(params);
        const enrichedSalesData = res.data?.map(sale => {
          if (!sale.payments) return { ...sale, outstanding: sale.total }; // handle cases where payments are missing
          const paymentsTotal = sale.payments.reduce((sum, p) => sum + (p.total || 0), 0);
          const outstanding = sale.total - paymentsTotal;
          return { ...sale, outstanding: outstanding };
        });
  
        return {
          data: enrichedSalesData,
          totalCount: res.totalRecords,
        };
      }
    });

    setData(() => store);
    // setDataStoreKey(prev => prev + 1); // force re-binding
  };


  return (
    <div className="space-y-6 p-6 bg-white rounded shadow">
      <div className="grid grid-cols-1 gap-2 w-1/2">
        <div className="w-full">
          <label className="block text-secondary font-medium mb-1">Date Range</label>
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2">
            <DatePicker
              customInput={<CustomInput/>}
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="border rounded px-2 py-1 text-secondary w-full"
              dateFormat="dd/MM/yyyy"
            />
            <span className="text-secondary self-center">to</span>
            <DatePicker
              customInput={<CustomInput/>}
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="border rounded px-2 py-1 text-secondary w-full"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>

        <div className="w-full">
          <label className="block text-secondary font-medium mb-1">Customer</label>
          <DropDownBox
            id="CustomerSelection"
            className="border rounded p-1 w-1/2 h-[34px]"
            value={selectedCustomer?.debtorId || null}
            opened={isCustomerBoxOpen}
            openOnFieldClick={true}
            valueExpr='debtorId'
            displayExpr={CustomerGridBoxDisplayExpr}
            placeholder="Select Customer"
            showClearButton={true}
            onValueChanged={handleCustomerGridBoxValueChanged}
            dataSource={customerStore}
            onOptionChanged={onCustomerGridBoxOpened}
            contentRender={CustomerDataGridRender}
            dropDownOptions={{
              width: 400
            }}
          />
        </div>

        {/* <div className="w-full">
          <label className="block text-secondary font-medium mb-1">Product</label>
          <ItemDropDownBoxComponent
            data={itemData}
            value={selectedItemId}
            onValueChanged={setSelectedItemId}
          />
        </div> */}
      </div>

      <div className="pt-6 flex space-x-4">
        <button onClick={handleGetInquiry} className="bg-primary text-white px-6 py-2 rounded">Search</button>
        {/* <button className="bg-primary text-white px-6 py-2 rounded">Preview</button>
        <button className="bg-primary text-white px-6 py-2 rounded">Export</button> */}
      </div>

      <div className="mt-6">
        <SalesInquiryMasterDetailGrid
          // key={dataStoreKey}
          salesData={data}
        />
      </div>
    </div>
  );
};

export default SalesInquiry;
