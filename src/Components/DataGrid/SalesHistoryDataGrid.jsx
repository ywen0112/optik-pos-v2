import { useRef, useState } from "react";
import { Column, Toolbar, Item, MasterDetail } from "devextreme-react/data-grid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomStore from "devextreme/data/custom_store";

import { GetDebtorSalesHistorys } from "../../api/maintenanceapi";

import StandardDataGridComponent from "../BaseDataGrid";

const SalesHistoryDataGrid = ({ className, onError }) => {
  const companyId = sessionStorage.getItem("companyId")
  const userId = sessionStorage.getItem("userId");
  const salesDataGridRef = useRef(null);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const formatDateLocalFrom = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}T00:00:00`;
  };

  const formatDateLocalToTo = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}T23:59:59`;
  };

  const handleDateChange = () => {
    if (salesDataGridRef.current) {
      salesDataGridRef.current.instance.refresh();
    }
  };

  const salesHistoryStore = new CustomStore({
    key: "docNo",
    load: async (loadOptions) => {
        const skip = loadOptions.skip ?? 0;
        const take = loadOptions.take ?? 10;
        const keyword = loadOptions.filter?.[2][2] || "";
        const formatDateLocalFrom = (date) => {
            if (!date) return null;
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            return `${year}-${month}-${day}T00:00:00`;
        };
        const formatDateLocalTo = (date) => {
            if (!date) return null;
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            return `${year}-${month}-${day}T23:59:59`;
        };
        let fromDate = formatDateLocalFrom;
        let toDate = formatDateLocalTo;

        if (Array.isArray(loadOptions.filter)) {
            if (loadOptions.filter[0]?.[0] === "fromDate") {
                fromDate = loadOptions.filter[0]?.[2] || formatDateLocalFrom;
            }
            if (loadOptions.filter[1]?.[0] === "toDate") {
                toDate = loadOptions.filter[1]?.[2] || formatDateLocalTo;
            }
        }

        try {
            const response = await GetDebtorSalesHistorys({
                companyId,
                offset: skip,
                limit: take,
                keyword,
                fromDate,
                toDate
            });

            return {
                data: response?.data || [],
                totalCount: response?.totalRecords || 0
            };
        } catch (error) {
            onError({ title: "Fetch Error", message: error.message });
            return { data: [], totalCount: 0 };
        }
    }
});

  return (
    <div className="flex flex-col h-full">
        <div className="flex items-center gap-4 p-2">
        <div>
            <label className="mr-1">From</label>
            <DatePicker
            selected={fromDate}
            onChange={(date) => {
                setFromDate(date);
                handleDateChange();
            }}
            className="border px-1 rounded h-[40px] w-full cursor-pointer"
            dateFormat="yyyy-MM-dd"
            />
        </div>

        <div>
            <label className="mr-1">To</label>
            <DatePicker
            selected={toDate}
            onChange={(date) => {
                setToDate(date);
                handleDateChange();
            }}
            className="border px-1 rounded h-[40px] w-full cursor-pointer"
            dateFormat="yyyy-MM-dd"
            />
        </div>
        </div>

    <StandardDataGridComponent
      ref={salesDataGridRef}
      height={"100%"}
      dataSource={salesHistoryStore}
      className={className}
      searchPanel={true}
      pager={true}
      pageSizeSelector={true}
      showBorders={true}
      allowColumnResizing={false}
      allowColumnReordering={false}
      allowEditing={true}
      onLoading={loading}
      remoteOperations={{ paging: true, filtering: true, sorting: true }}
      focusStateEnabled={false}
      columnChooser={false}
    >

      <Column dataField="docNo" caption="Doc No" allowEditing={false} width={"15%"} />
      <Column dataField="docDate" caption="Doc Date" width={"15%"} />
      <Column dataField="docType" caption="Doc Type" width={"15%"} />
      <Column dataField="refNo" caption="Ref No" width={"15%"} />
      <Column dataField="salesPerson" caption="Sales Person" width={"15%"} />
      <Column dataField="roundingAdjustment" caption="Rounding Adjustment" width={"15%"} alignment="left"/>
      <Column dataField="total" caption="Total" width={"15%"} alignment="left"/>
      <Column dataField="isVoid" caption="Void" width={"15%"} dataType="boolean" />

      {/* Master-Detail Part */}
      <MasterDetail
        enabled={true}
        component={({ data }) => (
          <div className="px-1 py-2 bg-gray-50 rounded">
            <h5 className="font-semibold mb-2">Sales Details</h5>

            <StandardDataGridComponent
              height="auto"
              dataSource={data?.data?.details || []}
              showBorders={true}
              columnAutoWidth={true}
              allowColumnResizing={true}
              allowColumnReordering={true}
              pager={false}            
              pageSizeSelector={false}
              searchPanel={false}
              remoteOperations={false}
              columnChooser={false}
            >
              <Column dataField="itemCode" caption="Item Code" />
              <Column dataField="description" caption="Description" />
              <Column dataField="desc2" caption="Desc2" />
              <Column dataField="uom" caption="UOM" />
              <Column dataField="qty" caption="Qty" alignment="left" dataType="number" />
              <Column dataField="unitPrice" caption="Unit Price" alignment="left" format="currency" />
              <Column dataField="discount" caption="Discount" alignment="left" />
              <Column dataField="discountAmount" caption="Discount Amount" alignment="left" format="currency" />
              <Column dataField="subTotal" caption="SubTotal" alignment="left" format="currency" />
              <Column dataField="classification" caption="Classification" />
            </StandardDataGridComponent>
          </div>
        )}
      />
    </StandardDataGridComponent>
    </div>
  );
};

export default SalesHistoryDataGrid;
