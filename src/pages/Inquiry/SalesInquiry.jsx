import { useState } from "react";
import DatePicker from "react-datepicker";
import DropDownBox from "devextreme-react/drop-down-box";
import CustomerDataGrid from "../../Components/DataGrid/CustomerDataGrid";
import ItemDropDownBoxComponent from "../../Components/DropDownBox/ItemDropDownBoxComponent";
import DataGrid, { Column, Paging } from "devextreme-react/data-grid";
import "react-datepicker/dist/react-datepicker.css";

const customerData = [
  { id: 1, Code: "300-001", Name: "abc" },
  { id: 2, Code: "300-002", Name: "abcd" },
  { id: 3, Code: "300-003", Name: "abcde" },
];

const itemData = [
  { id: 1, itemCode: "A100", description: "Widget", uom: "pcs", qty: 10, unitPrice: 5.0 },
  { id: 2, itemCode: "B200", description: "Gadget", uom: "pcs", qty: 5, unitPrice: 12.5 },
  { id: 3, itemCode: "C100", description: "WidgetBox", uom: "pcs", qty: 10, unitPrice: 15.0 },
  { id: 4, itemCode: "D200", description: "GadgetBox", uom: "pcs", qty: 5, unitPrice: 22.5 },
];

const SalesInquiry = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCustomerBoxOpen, setIsCustomerBoxOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const CustomerBoxDisplayExpr = (item) => item && `${item.Code}`;

  return (
    <div className="space-y-6 p-6 bg-white rounded shadow">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-secondary font-medium mb-1">Date Range</label>
          <div className="flex items-center space-x-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="border rounded px-2 py-1 text-secondary"
              dateFormat="dd-MM-yyyy"
            />
            <span className="text-secondary">to</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="border rounded px-2 py-1 text-secondary"
              dateFormat="dd-MM-yyyy"
            />
          </div>
        </div>

        <div className="w-1/2">
          <label className="block text-secondary font-medium mb-1">Customer</label>
          <DropDownBox
            value={selectedCustomer?.id}
            opened={isCustomerBoxOpen}
            onOptionChanged={(e) => {
              if (e.name === 'opened') setIsCustomerBoxOpen(e.value);
            }}
            valueExpr="id"
            displayExpr={CustomerBoxDisplayExpr}
            showClearButton
            placeholder="Select Customer"
            dropDownOptions={{ width: 400 }}
            contentRender={() => (
              <CustomerDataGrid
                value={selectedCustomer}
                dataSource={customerData}
                onSelectionChanged={(customer) => {
                  setSelectedCustomer(customer);
                  setIsCustomerBoxOpen(false);
                }}
              />
            )}
          />
        </div>

        <div className="w-1/2">
          <label className="block text-secondary font-medium mb-1">Product</label>
          <ItemDropDownBoxComponent
            data={itemData}
            value={selectedItemId}
            onValueChanged={setSelectedItemId}
          />
        </div>
      </div>

      <div className="pt-6 flex space-x-4">
        <button className="bg-primary text-white px-6 py-2 rounded">Search</button>
        <button className="bg-primary text-white px-6 py-2 rounded">Preview</button>
        <button className="bg-primary text-white px-6 py-2 rounded">Export</button>
      </div>

      <div className="mt-6">
        <DataGrid
          dataSource={[]}
          showBorders
          columnAutoWidth
          rowAlternationEnabled
        >
          <Paging enabled={false} />
          <Column caption="No" dataField="no" width={50} />
          <Column caption="Date" dataField="date" dataType="date" />
          <Column caption="Doc Type" dataField="docType" />
          <Column caption="Doc No" dataField="docNo" />
          <Column caption="Customer Name" dataField="customerName" />
          <Column caption="Total (RM)" dataField="total" dataType="number" format={{ type: 'fixedPoint', precision: 2 }} />
          <Column caption="Outstanding (RM)" dataField="outstanding" dataType="number" format={{ type: 'fixedPoint', precision: 2 }} />
          <Column caption="Completed" dataField="completed" dataType="boolean" />
        </DataGrid>
      </div>
    </div>
  );
};

export default SalesInquiry;
