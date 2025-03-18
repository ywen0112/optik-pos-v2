import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { Trash2 } from "lucide-react";

const SalesInvoice = () => {
  // Options for react-select dropdowns
  const debtorOptions = [
    { value: "Debtor1", label: "Debtor 1" },
    { value: "Debtor2", label: "Debtor 2" }
  ];
  const locationOptions = [
    { value: "Location1", label: "Location 1" },
    { value: "Location2", label: "Location 2" }
  ];
  const paymentTypeOptions = [
    { value: "Cash Payment", label: "Cash Payment" },
    { value: "Credit Card", label: "Credit Card" }
  ];
  const itemOptions = [
    { value: "Item1", label: "Item 1" },
    { value: "Item2", label: "Item 2" }
  ];
  const uomOptions = [
    { value: "Unit", label: "Unit" },
    { value: "Box", label: "Box" }
  ];
  const discountTypeOptions = [
    { value: "Percentage", label: "Percentage" },
    { value: "Amount", label: "Amount" }
  ];

  const [invoiceItems, setInvoiceItems] = useState([
    { 
      itemCode: "", 
      description: "", 
      uom: "", 
      unitPrice: 0, 
      quantity: 1, 
      discountType: "Percentage", 
      discount: 0, 
      subtotal: 0 
    }
  ]);
  const [total, setTotal] = useState(0);
  const [changes, setChanges] = useState(0);
  
  // Header state
  const [selectedDebtor, setSelectedDebtor] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [agent, setAgent] = useState("");

  // Function to calculate totals
  const calculateTotals = (items) => {
    let newTotal = 0;
    items.forEach((item) => {
      const discountAmount =
        item.discountType === "Percentage"
          ? (item.unitPrice * item.quantity * item.discount) / 100
          : item.discount;
      const subtotal = item.unitPrice * item.quantity - discountAmount;
      item.subtotal = subtotal;
      newTotal += subtotal;
    });
    setTotal(newTotal);
  };

  // Handle change in row data; for react-select we extract the option's value
  const handleRowChange = (index, field, value) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index][field] = value;
    calculateTotals(updatedItems);
    setInvoiceItems(updatedItems);
  };

  // Add new row
  const addNewItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      { itemCode: "", description: "", uom: "", unitPrice: 0, quantity: 1, discountType: "Percentage", discount: 0, subtotal: 0 }
    ]);
  };

  // Remove an item
  const removeItem = (index) => {
    const updatedItems = invoiceItems.filter((_, i) => i !== index);
    calculateTotals(updatedItems);
    setInvoiceItems(updatedItems);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #ccc", 
      padding: "1px",
      fontSize: "0.875rem", 
      width: "100%", 
      minHeight: "2.5rem",
    }),
    input: (provided) => ({
      ...provided,
      fontSize: "0.875rem",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "0.875rem",
    }),
  };
  

  return (
    <div>
      <h2 className="text-xl font-bold">Sales Invoice</h2>
      
      {/* Invoice Header */}
      <div className="grid grid-cols-5 gap-2 mt-4">
        <div>
          <label className="block text-sm font-semibold">Debtor Code</label>
          <CreatableSelect
            options={debtorOptions}
            value={selectedDebtor}
            onChange={(option) => setSelectedDebtor(option)}
            placeholder="Select or input debtor"
            styles={customStyles}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Company Name</label>
          <input 
            type="text" 
            className="border border-gray-300 rounded p-2 w-full text-sm" 
            placeholder="Company Name" 
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Location Code</label>
          <CreatableSelect
            options={locationOptions}
            value={selectedLocation}
            onChange={(option) => setSelectedLocation(option)}
            placeholder="Select or input location"
            styles={customStyles}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Agent</label>
          <input 
            type="text" 
            className="border border-gray-300 p-2 w-full text-sm rounded" 
            value={agent} 
            onChange={(e) => setAgent(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Payment Type</label>
          <CreatableSelect
            options={paymentTypeOptions}
            value={selectedPaymentType}
            onChange={(option) => setSelectedPaymentType(option)}
            placeholder="Select payment type"
            styles={customStyles}
          />
        </div>
      </div>

      {/* Invoice Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead className="bg-gray-900 text-white text-left text-xs">
            <tr>
              <th className="p-2 w-48">Item Code</th>
              <th className="p-2 w-48">Description</th>
              <th className="p-2 w-48">UOM</th>
              <th className="p-2 w-24">Unit Price</th>
              <th className="p-2 w-24">Quantity</th>
              <th className="p-2 w-32">Discount</th>
              <th className="p-2 w-32">Discount Amount</th>
              <th className="p-2 w-24">Subtotal</th>
              <th className="p-2 w-12">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoiceItems.map((item, index) => (
              <tr key={index} className="text-sm">
                <td>
                  <CreatableSelect
                    options={itemOptions}
                    value={item.itemCode ? { value: item.itemCode, label: item.itemCode } : null}
                    onChange={(option) => handleRowChange(index, "itemCode", option.value)}
                    placeholder="Select item"
                    styles={customStyles}
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    className="border border-gray-300 p-2 w-full rounded-md" 
                    value={item.description} 
                    onChange={(e) => handleRowChange(index, "description", e.target.value)} 
                  />
                </td>
                <td>
                  <CreatableSelect
                    options={uomOptions}
                    value={item.uom ? { value: item.uom, label: item.uom } : null}
                    onChange={(option) => handleRowChange(index, "uom", option.value)}
                    placeholder="Select UOM"
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    className="border border-gray-300 p-2 w-full rounded-md" 
                    value={item.unitPrice} 
                    onChange={(e) => handleRowChange(index, "unitPrice", parseFloat(e.target.value) || 0)} 
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    className="border border-gray-300 p-2 w-full rounded-md" 
                    value={item.quantity} 
                    onChange={(e) => handleRowChange(index, "quantity", parseInt(e.target.value) || 1)} 
                  />
                </td>
                <td>
                  <CreatableSelect
                    options={discountTypeOptions}
                    value={item.discountType ? { value: item.discountType, label: item.discountType } : null}
                    onChange={(option) => handleRowChange(index, "discountType", option.value)}
                    placeholder="Select Discount Type"
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    className="border border-gray-300 p-2 w-full rounded-md" 
                    value={item.discount} 
                    onChange={(e) => handleRowChange(index, "discount", parseFloat(e.target.value) || 0)} 
                  />
                </td>
                <td className="p-2">{item.subtotal.toFixed(2)}</td>
                <td className="p-2">
                    <button className="p-1 text-red-500 bg-transparent hover:text-red-700 transition duration-200" onClick={() => removeItem(index)} >
                        <Trash2 size={16} strokeWidth={1} />
                    </button>                
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total and Buttons */}
      <div className="flex justify-between mt-4">
        <p className="text-lg font-bold">Total: {total.toFixed(2)}</p>
        <p className="text-lg font-bold">Changes: {changes.toFixed(2)}</p>
      </div>
      
      <div className="mt-4 flex gap-4">
        <button className="bg-green-500 text-white p-2 rounded" onClick={addNewItem}>Add</button>
        <button className="bg-red-500 text-white p-2 rounded">Cancel</button>
      </div>
    </div>
  );
};

export default SalesInvoice;
