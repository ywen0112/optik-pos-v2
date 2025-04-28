import { useRef, useState } from "react";
import { Column, Toolbar, Item } from "devextreme-react/data-grid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import StandardDataGridComponent from "../BaseDataGrid";

const CustomerHistoryRXDataGrid = ({ rxHistoryStore, className, onRowClick }) => {
  const historyRXDataGridRef = useRef(null);
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

  const formatDateLocalTo = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}T23:59:59`;
  };

  const handleDateChange = () => {
    if (historyRXDataGridRef.current) {
      historyRXDataGridRef.current.instance.refresh();
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
        ref={historyRXDataGridRef}
        height={"100%"}
        dataSource={rxHistoryStore}
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
        onRowClick={onRowClick}
        focusStateEnabled={false}
        columnChooser={false}
      >
        <Column dataField="docNo" caption="Doc No" allowEditing={false} width={"20%"} />
        <Column dataField="docDate" caption="Doc Date" width={"20%"} />
        <Column dataField="type" caption="Type" width={"20%"} />
        <Column dataField="itemCode" caption="Item Code" width={"20%"} />
        <Column dataField="uom" caption="UOM" width={"20%"} />
      </StandardDataGridComponent>
    </div>
  );
};

export default CustomerHistoryRXDataGrid;
