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

    const handleDateChange = () => {
        if (historyRXDataGridRef.current) {
            historyRXDataGridRef.current.instance.refresh();
        }
    };

    return (
        <StandardDataGridComponent
            ref={historyRXDataGridRef}
            height={"100%"}
            dataSource={{
                ...rxHistoryStore,
                load: (loadOptions) => {
                    const skip = loadOptions.skip ?? 0;
                    const take = loadOptions.take ?? 10;
                    const keyword = loadOptions.filter?.[2]?.[2] || "";

                    return rxHistoryStore.load({
                        skip,
                        take,
                        filter: [
                            ["fromDate", "=", fromDate ? fromDate.toISOString() : null],
                            ["toDate", "=", toDate ? toDate.toISOString() : null],
                            ["keyword", "contains", keyword]
                        ]
                    });
                }
            }}
            className={className}
            searchPanel={true}
            pager={true}
            pageSizeSelector={true}
            columnChooser={true}
            showBorders={true}
            allowColumnResizing={false}
            allowColumnReordering={false}
            allowEditing={true}
            onLoading={loading}
            remoteOperations={{ paging: true, filtering: true, sorting: true }}
            onRowClick={onRowClick}
        >
            {/* Toolbar Injection */}
            <Toolbar>
                {/* Left Side */}
                <Item location="before">
                    <div className="flex space-x-2  items-center">
                        <label>From</label>
                        <DatePicker
                            selected={fromDate}
                            onChange={(date) => {
                                setFromDate(date);
                                handleDateChange();
                            }}
                            className="border px-1 rounded h-[40px]"
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                </Item>

                <Item location="before">
                    <div className="flex space-x-2 items-center">
                        <label>To</label>
                        <DatePicker
                            selected={toDate}
                            onChange={(date) => {
                                setToDate(date);
                                handleDateChange();
                            }}
                            className="border px-1 rounded h-[40px]"
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                </Item>

                <Item name="searchPanel" location="after" />
            </Toolbar>

            {/* Columns */}
            <Column dataField="docNo" caption="Doc No" allowEditing={false} width={"20%"} />
            <Column dataField="docDate" caption="Doc Date" width={"20%"} />
            <Column dataField="type" caption="Type" width={"20%"} />
            <Column dataField="itemCode" caption="ItemCode" width={"20%"} />
            <Column dataField="uom" caption="UOM" width={"20%"} />
        </StandardDataGridComponent>
    );
};

export default CustomerHistoryRXDataGrid;
