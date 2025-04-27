import { useRef, useState } from "react";
import { Column, Toolbar, Item, MasterDetail } from "devextreme-react/data-grid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import StandardDataGridComponent from "../BaseDataGrid";

const SalesHistoryDataGrid = ({ salesHistoryStore, className }) => {
  const salesDataGridRef = useRef(null);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const handleDateChange = () => {
    if (salesDataGridRef.current) {
      salesDataGridRef.current.instance.refresh();
    }
  };

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
      dataSource={{
        ...salesHistoryStore,
        load: (loadOptions) => {
          const skip = loadOptions.skip ?? 0;
          const take = loadOptions.take ?? 10;
          const keyword = loadOptions.filter?.[2]?.[2] || "";

          return salesHistoryStore.load({
            skip,
            take,
            filter: [
              ["fromDate", "=", fromDate ? fromDate.toISOString() : null],
              ["toDate", "=", toDate ? toDate.toISOString() : null],
              ["keyword", "contains", keyword],
            ],
          });
        },
      }}
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

            <div className="overflow-x-auto">
                <table className="w-full text-left border">
                <thead className="bg-gray-100">
                    <tr>
                    <th className="border px-1 py-2">Item Code</th>
                    <th className="border px-1 py-2">Description</th>
                    <th className="border px-1 py-2">Desc2</th>
                    <th className="border px-1 py-2">UOM</th>
                    <th className="border px-1 py-2">Qty</th>
                    <th className="border px-1 py-2">Unit Price</th>
                    <th className="border px-1 py-2">Discount</th>
                    <th className="border px-1 py-2">Discount Amount</th>
                    <th className="border px-1 py-2">SubTotal</th>
                    <th className="border px-1 py-2">Classification</th>
                    </tr>
                </thead>
                <tbody>
                    {(data?.data?.details ?? []).map((detail, idx) => (
                    <tr key={idx} className="hover:bg-gray-100">
                        <td className="border px-1 py-2">{detail.itemCode}</td>
                        <td className="border px-1 py-2">{detail.description}</td>
                        <td className="border px-1 py-2">{detail.desc2}</td>
                        <td className="border px-1 py-2">{detail.uom}</td>
                        <td className="border px-1 py-2">{detail.qty}</td>
                        <td className="border px-1 py-2">{detail.unitPrice}</td>
                        <td className="border px-1 py-2">{detail.discount}</td>
                        <td className="border px-1 py-2">{detail.discountAmount}</td>
                        <td className="border px-1 py-2">{detail.subTotal}</td>
                        <td className="border px-1 py-2">{detail.classification}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        )}
        />
    </StandardDataGridComponent>
    </div>
  );
};

export default SalesHistoryDataGrid;
