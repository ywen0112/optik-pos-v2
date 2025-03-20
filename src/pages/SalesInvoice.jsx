import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { Trash2 } from "lucide-react";
import { GetDebtorRecords, GetLocationRecords, GetUsers } from "../apiconfig";
import ErrorModal from "../modals/ErrorModal";

const SalesInvoice = () => {
  const customerId = localStorage.getItem("customerId");
  const [debtorOptions, setDebtorOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [agentOptions, setAgentOptions] = useState([]);

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
  const [selectedDebtor, setSelectedDebtor] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);

  const [total, setTotal] = useState(0);
  const [changes, setChanges] = useState(0);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  

  useEffect(() => {
    const fetchDebtors = async () => {
      const requestBody = {
        customerId: Number(customerId),
        keyword: "",
        offset: 0,
        limit: 9999
      };

      try {
        const response = await fetch(GetDebtorRecords, {
          method: "POST",
          headers: {
            "Accept": "text/plain",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        if (data.success) {
          const options = data.data.map((debtor) => ({
            value: debtor.debtorId,
            label: `${debtor.debtorCode} - ${debtor.companyName}`
          }));
          setDebtorOptions(options);
        } else {
          throw new Error(data.errorMessage || "Failed to fetch debtor records.");
        }
      } catch (error) {
        setErrorModal({ title: "Fetch Error", message: error.message });
      }
    };

    fetchDebtors();
  }, []);

  const handleDebtorChange = (selectedOption) => {
    setSelectedDebtor(selectedOption);
    const debtor = debtorOptions.find(d => d.value === selectedOption.value);
    if (debtor) {
      const companyNameFromDebtor = debtor.label.split(" - ")[1]; 
      setCompanyName(companyNameFromDebtor);
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      const requestBody = {
        customerId: Number(customerId),
        keyword: "",
        offset: 0,
        limit: 9999
      };

      try {
        const response = await fetch(GetLocationRecords, {
          method: "POST",
          headers: {
            "Accept": "text/plain",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        if (data.success) {
          const options = data.data.map((location) => ({
            value: location.locationId,
            label: `${location.locationCode} - ${location.description}`
          }));
          setLocationOptions(options);
        } else {
          throw new Error(data.errorMessage || "Failed to fetch location records.");
        }
      } catch (error) {
        setErrorModal({ title: "Fetch Error", message: error.message });
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      const requestBody = {
        customerId: Number(customerId),
        keyword: "",
        offset: 0,
        limit: 9999
      };

      try {
        const response = await fetch(GetLocationRecords, {
          method: "POST",
          headers: {
            "Accept": "text/plain",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        if (data.success) {
          const options = data.data.map((location) => ({
            value: location.locationId,
            label: `${location.locationCode} - ${location.description}`
          }));
          setLocationOptions(options);
        } else {
          throw new Error(data.errorMessage || "Failed to fetch location records.");
        }
      } catch (error) {
        setErrorModal({ title: "Fetch Error", message: error.message });
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchAgents = async () => {
      const requestBody = {
        customerId: Number(customerId),
        keyword: "",
        offset: 0,
        limit: 9999
      };

      try {
        const response = await fetch(GetUsers, {
          method: "POST",
          headers: {
            "Accept": "text/plain",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        if (data.success) {
          const options = data.data.map((agent) => ({
            value: agent.userId,
            label: agent.userName
          }));
          setAgentOptions(options);
        } else {
          throw new Error(data.errorMessage || "Failed to fetch agent records.");
        }
      } catch (error) {
        setErrorModal({ title: "Fetch Error", message: error.message });
      }
    };

    fetchAgents();
  }, []);
  

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
    menu: (provided) => ({
      ...provided,
      fontSize: "0.875rem", 
      zIndex: 9999, 
      position: "absolute",  
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999, 
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "0.875rem", 
      padding: "4px 8px", 
      backgroundColor: state.isSelected ? "#f0f0f0" : "#fff",
      color: state.isSelected ? "#333" : "#000",
      "&:hover": {
        backgroundColor: "#e6e6e6",
      },
    }),
  };
  

  return (
    <div>
      <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() =>setErrorModal({ title: "", message: "" })}/>
      <h2 className="text-xl font-bold text-secondary">Sales Invoice</h2>
      <div className="grid grid-cols-5 gap-2">
        <div>
          <label className="block text-xs font-semibold">Debtor Code</label>
          <Select
            options={debtorOptions}
            value={selectedDebtor}
            onChange={handleDebtorChange}
            placeholder="Select debtor"
            styles={customStyles}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold">Company Name</label>
          <input 
            type="text" 
            className="border border-gray-300 rounded p-2 w-full text-sm text-secondary bg-white" 
            placeholder="Company Name" 
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold">Location Code</label>
          <Select
            options={locationOptions}
            value={selectedLocation}
            onChange={(option) => setSelectedLocation(option)}
            placeholder="Select location"
            styles={customStyles}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold">Agent</label>
          <Select
            options={agentOptions}
            value={selectedAgent}
            onChange={(option) => setSelectedAgent(option)}
            placeholder="Select agent"
            styles={customStyles}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold">Payment Type</label>
          <CreatableSelect
            options={paymentTypeOptions}
            value={selectedPaymentType}
            onChange={(option) => setSelectedPaymentType(option)}
            placeholder="Select payment type"
            styles={customStyles}
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto relative">
      <div className="text-right mb-2"><button className="px-6 py-1 bg-secondary text-white rounded-md text-xs" onClick={addNewItem}>Add Item</button></div>
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
                    menuPortalTarget={document.body}
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    className="border border-gray-300 p-2 w-full rounded-md text-secondary bg-white" 
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
                    styles={customStyles}
                    menuPortalTarget={document.body}
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    className="border border-gray-300 p-2 w-full rounded-md text-secondary bg-white" 
                    value={item.unitPrice} 
                    onChange={(e) => handleRowChange(index, "unitPrice", parseFloat(e.target.value) || 0)} 
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    className="border border-gray-300 p-2 w-full rounded-md text-secondary bg-white" 
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
                    styles={customStyles}
                    menuPortalTarget={document.body}
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    className="border border-gray-300 p-2 w-full rounded-md text-secondary bg-white" 
                    value={item.discount} 
                    onChange={(e) => handleRowChange(index, "discount", parseFloat(e.target.value) || 0)} 
                  />
                </td>
                <td>
                <input 
                    className="bg-gray-100 border border-gray-300 p-2 w-full rounded-md text-secondary bg-white" 
                    value={item.subtotal.toFixed(2)}
                    disabled
                  />
                </td>
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

      <div className="flex gap-2 mt-2">
        <p className="text-sm font-bold">Total: {total.toFixed(2)}</p>
        <p className="text-sm font-bold">Changes: {changes.toFixed(2)}</p>
      </div>
      
      <div className="flex justify-between mt-4">
        <button className="px-4 py-2 bg-green-500 text-white rounded-md text-sm">Save</button>
        <button className="px-4 py-2 bg-red-500 text-white rounded-md text-sm">Cancel</button>
      </div>
    </div>
  );
};

export default SalesInvoice;
