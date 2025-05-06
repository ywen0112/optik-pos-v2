import { useRef, useState } from "react";
import { Column, Toolbar, Item } from "devextreme-react/data-grid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import StandardDataGridComponent from "../BaseDataGrid";
import CustomInput from "../input/dateInput";

const CustomerHistoryRXDataGrid = ({ rxHistoryStore, className, onRowClick, fromDate, toDate, setFromDate, setToDate }) => {
  const historyRXDataGridRef = useRef(null);
  const [loading, setLoading] = useState(false);

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
            customInput={<CustomInput/>}
            selected={fromDate}
            onChange={(date) => {
              setFromDate(date);
              handleDateChange();
            }}
            className="border px-1 rounded h-[40px] w-full cursor-pointer"
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <div>
          <label className="mr-1">To</label>
          <DatePicker
          customInput={<CustomInput/>}
            selected={toDate}
            onChange={(date) => {
              setToDate(date);
              handleDateChange();
            }}
            className="border px-1 rounded h-[40px] w-full cursor-pointer"
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </div>

      <StandardDataGridComponent
        ref={historyRXDataGridRef}
        height={"100%"}
        dataSource={rxHistoryStore}
        className={className}
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
          width={"20%"}
        />

        <Column dataField="type" caption="Type" width={"20%"} />
        <Column dataField="itemCode" caption="Item Code" width={"20%"} />
        <Column dataField="uom" caption="UOM" width={"20%"} />
      </StandardDataGridComponent>
    </div>
  );
};

export default CustomerHistoryRXDataGrid;
