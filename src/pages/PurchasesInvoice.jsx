import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { Trash2 } from "lucide-react";
import { GetCreditorRecords, GetLocationRecords, GetUsers, GetItemRecords, SaveSales } from "../apiconfig";
import ErrorModal from "../modals/ErrorModal";
import ConfirmationModal from "../modals/ConfirmationModal";

const PurchasesInvoice = ({ purchasesId, docNo, purchasesLocationId }) => {
  const customerId = localStorage.getItem("customerId");
  const [creditorOptions, setCreditorOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [agentOptions, setAgentOptions] = useState([]);
  const paymentTypeOptions = [
    { value: "Cash Payment", label: "Cash Payment" },
    { value: "Card Payment", label: "Card Payment" },
    { value: "Bank Transfer", label: "Bank Transfer" },
    { value: "Multi Payment", label: "Multi Payment" }
  ];
  const [itemOptions, setItemOptions] = useState([]);
  const discountTypeOptions = [
    { value: "Percentage", label: "Percentage" },
    { value: "Fixed", label: "Fixed" }
  ];
  const [invoiceItems, setInvoiceItems] = useState([
    { 
      itemCode: "", 
      description: "", 
      uom: "", 
      unitPrice: 0, 
      quantity: 0, 
      discountType: "Percentage", 
      discount: 0, 
      subtotal: 0 
    }
  ]);
  const [selectedCreditor, setSelectedCreditor] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [enteredAmount, setEnteredAmount] = useState("");

  const [isCardPaymentModalOpen, setIsCardPaymentModalOpen] = useState(false);
  const [cardReceiptRef, setCardReceiptRef] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [approvalCode, setApprovalCode] = useState("");

  const [isBankTransferModalOpen, setIsBankTransferModalOpen] = useState(false);
  const [bankReceiptRef, setBankReceiptRef] = useState("");
  const [bankRef, setBankRef] = useState("");

  const [isMultiPaymentModalOpen, setIsMultiPaymentModalOpen] = useState(false);
  const [multiPaymentMethods, setMultiPaymentMethods] = useState([]);

  const [outstandingOrChange, setOutstandingOrChange] = useState(0);
  const [isOutstanding, setIsOutstanding] = useState(false);
  const [total, setTotal] = useState(0);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  

  useEffect(() => {
    const fetchCreditors = async () => {
      const requestBody = {
        customerId: Number(customerId),
        keyword: "",
        offset: 0,
        limit: 9999
      };

      try {
        const response = await fetch(GetCreditorRecords, {
          method: "POST",
          headers: {
            "Accept": "text/plain",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        if (data.success) {
          const options = data.data.map((creditor) => ({
            value: creditor.creditorId,
            label: `${creditor.creditorCode} - ${creditor.companyName}`
          }));
          setCreditorOptions(options);
        } else {
          throw new Error(data.errorMessage || "Failed to fetch creditor records.");
        }
      } catch (error) {
        setErrorModal({ title: "Fetch Error", message: error.message });
      }
    };

    fetchCreditors();
  }, []);

  const handleCreditorChange = (selectedOption) => {
    setSelectedCreditor(selectedOption);
    const creditor = creditorOptions.find(d => d.value === selectedOption.value);
    if (creditor) {
      const companyNameFromDebtor = creditor.label.split(" - ")[1]; 
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
          if (purchasesLocationId) {
            const matchedLocation = options.find(loc => loc.value === purchasesLocationId);
            if (matchedLocation) {
              setSelectedLocation(matchedLocation);
            }
          }
        } else {
          throw new Error(data.errorMessage || "Failed to fetch location records.");
        }
      } catch (error) {
        setErrorModal({ title: "Fetch Error", message: error.message });
      }
    };

    fetchLocations();
  }, [purchasesLocationId]);

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
  

  useEffect(() => {
    const fetchItems = async () => {
      const requestBody = {
        customerId: Number(customerId),
        keyword: "",
        offset: 0,
        limit: 9999
      };

      try {
        const response = await fetch(GetItemRecords, {
          method: "POST",
          headers: {
            "Accept": "text/plain",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        if (data.success) {
          const options = data.data.map((item) => ({
            value: item.itemId,
            label: item.itemCode,
            description: item.description,
            itemUOMs: item.itemUOMs || []
          }));
          setItemOptions(options);
        } else {
          throw new Error(data.errorMessage || "Failed to fetch item records.");
        }
      } catch (error) {
        setErrorModal({ title: "Fetch Error", message: error.message });
      }
    };

    fetchItems();
  }, []);

  const handleItemChange = (index, newValue) => {
    if (!newValue) return;
  
    let selectedItem = itemOptions.find(item => item.value === newValue.value);
  
    if (!selectedItem) {
      selectedItem = {
        value: newValue.value,
        label: newValue.label,
        description: "",
        itemUOMs: [] 
      };
  
      setItemOptions([...itemOptions, selectedItem]); 
    }
  
    const description = selectedItem.description || "";
    const uomOptions = selectedItem.itemUOMs.map(uom => ({
      value: uom.itemUOMId,
      label: uom.uom,
      unitPrice: uom.unitPrice
    }));
  
    const updatedItems = [...invoiceItems];
    updatedItems[index] = {
      ...updatedItems[index],
      itemId: selectedItem.value,
      itemCode: selectedItem.label,
      description: description,
      uomOptions: uomOptions, 
      uom: "",
      unitPrice: 0
    };
  
    setInvoiceItems(updatedItems);
    calculateTotals(updatedItems);
  };  

  const handleUomChange = (index, newValue) => {
    if (!newValue) return;
  
    const updatedItems = [...invoiceItems];
    const selectedItem = updatedItems[index];
  
    let selectedUOM = selectedItem.uomOptions.find(u => u.value === newValue.value);
  
    if (!selectedUOM) {
      selectedUOM = {
        value: newValue.value,
        label: newValue.label,
        unitPrice: 0 
      };
  
      selectedItem.uomOptions = [...selectedItem.uomOptions, selectedUOM]; 
    }
  
    updatedItems[index] = {
      ...selectedItem,
      uom: selectedUOM.label,
      unitPrice: selectedUOM.unitPrice
    };
  
    setInvoiceItems(updatedItems);
    calculateTotals(updatedItems);
  };

  const addNewItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      {
        itemId: "",
        itemCode: "",
        description: "",
        uom: "",
        uomOptions: [],
        unitPrice: 0,
        quantity: 0,
        discountType: "Percentage",
        discount: 0,
        subtotal: 0
      }
    ]);
  };

  const removeItem = (index) => {
    const updatedItems = invoiceItems.filter((_, i) => i !== index);
    calculateTotals(updatedItems);
    setInvoiceItems(updatedItems);
  };

  const handleRowChange = (index, field, value) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index][field] = value;
  
    updatedItems[index].unitPrice = parseFloat(updatedItems[index].unitPrice) || 0;
    updatedItems[index].quantity = parseInt(updatedItems[index].quantity) || 0;
    updatedItems[index].discount = parseFloat(updatedItems[index].discount) || 0;
  
    const discountAmount = updatedItems[index].discountType === "Percentage"
      ? (updatedItems[index].unitPrice * updatedItems[index].quantity * updatedItems[index].discount) / 100
      : updatedItems[index].discount;
  
    updatedItems[index].subtotal = (updatedItems[index].unitPrice * updatedItems[index].quantity) - discountAmount;
  
    setInvoiceItems(updatedItems);
    calculateTotals(updatedItems); 
  };

  const calculateTotals = (items) => {
    let newTotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    setTotal(newTotal);
  };

  const handlePaymentTypeChange = (option) => {
    if (!isPaymentConfirmed) { 
      setSelectedPaymentType(option);
  
      if (option.value === "Cash Payment") {
        setIsPaymentModalOpen(true);
      } else if (option.value === "Card Payment") {
        setIsCardPaymentModalOpen(true);  
      } else if (option.value === "Bank Transfer") {
        setIsBankTransferModalOpen(true);  
      } else if (option.value === "Multi Payment") {
        setIsMultiPaymentModalOpen(true);
      }
    }
  };

  const handleAmountChange = (e) => {
    const amount = parseFloat(e.target.value);
    setEnteredAmount(amount);

    if (amount < total) {
      setIsOutstanding(true);
      setOutstandingOrChange(total - amount);
    } else {
      setIsOutstanding(false);
      setOutstandingOrChange(amount - total);
    }
  };

  const confirmPayment = () => {
    if (enteredAmount < 0) {
      setErrorModal({ title: "Invalid Amount", message: "Amount cannot be negative. Please enter a valid amount." });
      return;
    }

    setIsConfirmationModalOpen(true); 
  };

  const handleConfirmPayment = () => {
    setIsPaymentConfirmed(true);
    setIsCardPaymentModalOpen(false);
    setIsConfirmationModalOpen(false);
    setIsBankTransferModalOpen(false);
    setIsPaymentModalOpen(false);
    setEnteredAmount("");
    setCardNumber("");
    setCardReceiptRef("");
    setApprovalCode("");
    setBankReceiptRef("");
    setBankRef("");
  };


  const closePayment = () => {
    setIsPaymentModalOpen(false);
    setSelectedPaymentType(null);
    setEnteredAmount("");
    setOutstandingOrChange(0);
    setIsCardPaymentModalOpen(false)
    setCardNumber("");
    setCardReceiptRef("");
    setApprovalCode("");
    setIsBankTransferModalOpen(false);
    setBankReceiptRef("");
    setBankRef("");
    setIsMultiPaymentModalOpen(false);
    setMultiPaymentMethods([]);
  }

  const addPaymentMethod = () => {
    setMultiPaymentMethods([
      ...multiPaymentMethods,
      { type: "", amount: "", cardReceiptRef: "", cardNumber: "", approvalCode: "", bankReceiptRef: "", bankRef: "" }
    ]);
  };
  
  const handleMultiPaymentTypeChange = (index, option) => {
    const updatedPayments = [...multiPaymentMethods];
    updatedPayments[index].type = option.value;
    setMultiPaymentMethods(updatedPayments);
  };
  
  const handleMultiPaymentFieldChange = (index, field, value) => {
    const updatedPayments = [...multiPaymentMethods];
    updatedPayments[index][field] = value;
    setMultiPaymentMethods(updatedPayments);
  };
  
  const handleMultiPaymentAmountChange = (index, value) => {
    const updatedPayments = [...multiPaymentMethods];
    updatedPayments[index].amount = parseFloat(value) || 0;
    setMultiPaymentMethods(updatedPayments);
  
    const totalPaid = updatedPayments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
    const newOutstandingOrChange = totalPaid - total;
  
    setOutstandingOrChange(newOutstandingOrChange);
    setIsOutstanding(newOutstandingOrChange < 0);
  };
  
  const removePaymentMethod = (index) => {
    const updatedPayments = multiPaymentMethods.filter((_, i) => i !== index);
    setMultiPaymentMethods(updatedPayments);
  
    const totalPaid = updatedPayments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
    const newOutstandingOrChange = totalPaid - total;
  
    setOutstandingOrChange(newOutstandingOrChange);
    setIsOutstanding(newOutstandingOrChange < 0);
  };
  
  const confirmMultiPayment = () => {
    const totalPaid = multiPaymentMethods.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
    const newOutstandingOrChange = totalPaid - total;
  
    setOutstandingOrChange(newOutstandingOrChange);
    setIsOutstanding(newOutstandingOrChange < 0);

    setIsConfirmationModalOpen(true);
  };

  const handleConfirmMultiPayment = () => {
    setIsPaymentConfirmed(true);
    setIsConfirmationModalOpen(false);
    setIsMultiPaymentModalOpen(false);
    setMultiPaymentMethods([]);
  };
  

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "1px solid #ccc", 
      padding: "1px",
      fontSize: "0.875rem", 
      width: "100%", 
      minHeight: "2.5rem",
      backgroundColor: state.isDisabled ? "#f9f9f9" : "white", 
      cursor: state.isDisabled ? "not-allowed" : "pointer",
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
      <div className="grid grid-cols-5 gap-2 mt-4">
        <div>
          <label className="block text-xs font-semibold text-secondary">Creditor</label>
          <Select
            options={creditorOptions}
            value={selectedCreditor}
            onChange={handleCreditorChange}
            placeholder="Select creditor"
            styles={customStyles}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-secondary">Company Name</label>
          <input 
            type="text" 
            className="border border-gray-300 rounded p-2 w-full text-sm text-secondary bg-white" 
            placeholder="Company Name" 
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-secondary">Location</label>
          <Select
            options={locationOptions}
            value={selectedLocation}
            onChange={(option) => setSelectedLocation(option)}
            placeholder="Select location"
            styles={customStyles}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-secondary">Agent</label>
          <Select
            options={agentOptions}
            value={selectedAgent}
            onChange={(option) => setSelectedAgent(option)}
            placeholder="Select agent"
            styles={customStyles}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-secondary">Payment Type</label>
          <Select
            options={paymentTypeOptions}
            value={selectedPaymentType}
            onChange={handlePaymentTypeChange}
            placeholder="Select payment type"
            styles={customStyles}
            isDisabled={isPaymentConfirmed}
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
                    value={item.itemId ? { value: item.itemId, label: item.itemCode } : null}
                    onChange={(option) => handleItemChange(index, option)}
                    placeholder="Select item"
                    styles={customStyles}
                    menuPortalTarget={document.body}
                    isDisabled={isPaymentConfirmed}
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    className="border border-gray-300 p-2 w-full rounded-md text-secondary bg-white" 
                    value={item.description} 
                    onChange={(e) => handleRowChange(index, "description", e.target.value)}
                    disabled={isPaymentConfirmed}
                  />
                </td>
                <td>
                  <CreatableSelect
                    options={item.uomOptions}
                    value={item.uom ? { value: item.uom, label: item.uom } : null}
                    onChange={(option) => handleUomChange(index, option)}
                    placeholder="Select UOM"
                    styles={customStyles}
                    menuPortalTarget={document.body}
                    isDisabled={isPaymentConfirmed}
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    min={0}
                    className="border border-gray-300 p-2 w-full rounded-md text-secondary bg-white" 
                    value={item.unitPrice} 
                    onChange={(e) => handleRowChange(index, "unitPrice", parseFloat(e.target.value) || 0)} 
                    disabled={isPaymentConfirmed}
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    min={0}
                    className="border border-gray-300 p-2 w-full rounded-md text-secondary bg-white" 
                    value={item.quantity} 
                    onChange={(e) => handleRowChange(index, "quantity", parseInt(e.target.value) || 0)} 
                    disabled={isPaymentConfirmed}
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
                    isDisabled={isPaymentConfirmed}
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    min={0}
                    className="border border-gray-300 p-2 w-full rounded-md text-secondary bg-white" 
                    value={item.discount} 
                    onChange={(e) => handleRowChange(index, "discount", parseFloat(e.target.value) || 0)} 
                    disabled={isPaymentConfirmed}
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
                    <button className="p-1 text-red-500 bg-transparent hover:text-red-700 transition duration-200" onClick={() => removeItem(index)} disabled={isPaymentConfirmed}>
                        <Trash2 size={16} strokeWidth={1} />
                    </button>                
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationModal 
        isOpen={isConfirmationModalOpen}
        title="Confirm Payment"
        message="Are you sure you want to proceed with this payment?"
        onConfirm={handleConfirmPayment}
        onCancel={() => setIsConfirmationModalOpen(false)}
      />

      {isPaymentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-semibold text-secondary">Cash Payment</h2>
            <p className="text-sm mt-2 text-secondary">
              <strong>Total:</strong> {total.toFixed(2)}
            </p>
            <p className="mt-2 text-sm font-semibold text-secondary">
              {isOutstanding ? `Outstanding Balance: ${outstandingOrChange.toFixed(2)}` : `Change: ${outstandingOrChange.toFixed(2)}`}
            </p>
            <input
              type="number"
              placeholder="Enter Amount"
              className="w-full mt-2 p-2 border rounded-md bg-white text-secondary text-xs"
              min={0}
              value={enteredAmount}
              onChange={handleAmountChange}
            />  
            <div className="flex justify-between mt-4">
              <button onClick={confirmPayment} className="px-4 py-2 bg-green-500 text-white rounded-md text-sm">
                Confirm Payment
              </button>
              <button onClick={closePayment} className="px-4 py-2 bg-red-500 text-white rounded-md text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isCardPaymentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-md w-fit">
            <h2 className="text-lg font-semibold text-secondary">Card Payment</h2>
            
            <p className="text-sm mt-2 text-secondary">
              <strong>Total:</strong> {total.toFixed(2)}
            </p>
            <p className="mt-2 text-sm font-semibold text-secondary">
              {isOutstanding ? `Outstanding Balance: ${outstandingOrChange.toFixed(2)}` : `Change: ${outstandingOrChange.toFixed(2)}`}
            </p>

            <input
              type="text"
              placeholder="Enter Receipt Reference"
              className="p-2 w-full border rounded-md bg-white text-secondary text-xs mt-2"
              value={cardReceiptRef}
              onChange={(e) => setCardReceiptRef(e.target.value)}
            />
           
           <div className="grid grid-cols-3 gap-2 mt-2">
              <input
                type="text"
                placeholder="Card Number"
                className="p-2 border rounded-md bg-white text-secondary text-xs"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
              <input
                type="text"
                placeholder="Approval Code"
                className="p-2 border rounded-md bg-white text-secondary text-xs"
                value={approvalCode}
                onChange={(e) => setApprovalCode(e.target.value)}
              />

              <input
                type="number"
                placeholder="Enter Amount"
                min={0}
                className="p-2 border rounded-md bg-white text-secondary text-xs"
                value={enteredAmount}
                onChange={handleAmountChange}
              />
            </div>

            <div className="flex justify-between mt-4">
              <button onClick={confirmPayment} className="px-4 py-2 bg-green-500 text-white rounded-md text-sm">
                Confirm Payment
              </button>
              <button onClick={closePayment} className="px-4 py-2 bg-red-500 text-white rounded-md text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isBankTransferModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-md w-fit">
            <h2 className="text-lg font-semibold text-secondary">Bank Transfer</h2>
            
            <p className="text-sm mt-2 text-secondary">
              <strong>Total:</strong> {total.toFixed(2)}
            </p>
            <p className="mt-2 text-sm font-semibold text-secondary">
              {isOutstanding ? `Outstanding Balance: ${outstandingOrChange.toFixed(2)}` : `Change: ${outstandingOrChange.toFixed(2)}`}
            </p>

            <input
              type="text"
              placeholder="Enter Receipt Reference"
              className="p-2 mt-2 w-full border rounded-md bg-white text-secondary text-xs"
              value={bankReceiptRef}
              onChange={(e) => setBankReceiptRef(e.target.value)}
            />
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input
                type="text"
                placeholder="Bank Reference No"
                className="p-2 border rounded-md bg-white text-secondary text-xs"
                value={bankRef}
                onChange={(e) => setBankRef(e.target.value)}
              />

              <input
                type="number"
                placeholder="Enter Amount"
                className="p-2 border rounded-md bg-white text-secondary text-xs"
                min={0}
                value={enteredAmount}
                onChange={handleAmountChange}
              />
            </div>

            <div className="flex justify-between mt-4">
              <button onClick={confirmPayment} className="px-4 py-2 bg-green-500 text-white rounded-md text-sm">
                Confirm Payment
              </button>
              <button onClick={closePayment} className="px-4 py-2 bg-red-500 text-white rounded-md text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isMultiPaymentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
            <h2 className="text-lg font-semibold text-secondary">Multi Payment</h2>
            
            <p className="text-sm mt-2 text-secondary">
              <strong>Total:</strong> {total.toFixed(2)}
            </p>
            <p className="mt-2 text-sm font-semibold text-secondary">
              {isOutstanding ? `Outstanding Balance: ${Math.abs(outstandingOrChange).toFixed(2)}` : `Change: ${outstandingOrChange.toFixed(2)}`}
            </p>

            <div className="text-right">
              <button 
                onClick={addPaymentMethod} 
                className="p-1 bg-primary text-white rounded-md text-xs w-1/4 mt-1"
              >
                Add Payment
              </button>
            </div>

            <ConfirmationModal 
              isOpen={isConfirmationModalOpen}
              title="Confirm Payment"
              message="Are you sure you want to proceed with this payment?"
              onConfirm={handleConfirmMultiPayment}
              onCancel={() => setIsConfirmationModalOpen(false)}
            />

            {multiPaymentMethods.map((payment, index) => (
              <div key={index} className="border p-1 mt-2 rounded-md">
                <Select
                  options={paymentTypeOptions.filter(opt => opt.value !== "Multi Payment")}
                  value={payment.type ? { value: payment.type, label: payment.type } : null}
                  onChange={(option) => handleMultiPaymentTypeChange(index, option)}
                  placeholder="Select Payment Method"
                  styles={customStyles}
                />

                {payment.type === "Cash Payment" && (
                  <input
                    type="number"
                    placeholder="Enter Amount"
                    className="w-full mt-2 p-2 border rounded-md bg-white text-secondary text-xs"
                    min={0}
                    value={payment.amount}
                    onChange={(e) => handleMultiPaymentAmountChange(index, e.target.value)}
                  />
                )}

                {payment.type === "Card Payment" && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Enter Receipt Reference"
                      className="p-2 border rounded-md bg-white text-secondary text-xs"
                      value={payment.cardReceiptRef}
                      onChange={(e) => handleMultiPaymentFieldChange(index, "cardReceiptRef", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="p-2 border rounded-md bg-white text-secondary text-xs"
                      value={payment.cardNumber}
                      onChange={(e) => handleMultiPaymentFieldChange(index, "cardNumber", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Approval Code"
                      className="p-2 border rounded-md bg-white text-secondary text-xs"
                      value={payment.approvalCode}
                      onChange={(e) => handleMultiPaymentFieldChange(index, "approvalCode", e.target.value)}
                    />
                    
                    <input
                      type="number"
                      placeholder="Enter Amount"
                      className="p-2 border rounded-md bg-white text-secondary text-xs"
                      min={0}
                      value={payment.amount}
                      onChange={(e) => handleMultiPaymentAmountChange(index, e.target.value)}
                    />
                  </div>
                )}

                {payment.type === "Bank Transfer" && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Receipt Reference"
                      className="p-2 border rounded-md bg-white text-secondary text-xs"
                      value={payment.bankReceiptRef}
                      onChange={(e) => handleMultiPaymentFieldChange(index, "bankReceiptRef", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Bank Reference No"
                      className="p-2 border rounded-md bg-white text-secondary text-xs"
                      value={payment.bankRef}
                      onChange={(e) => handleMultiPaymentFieldChange(index, "bankRef", e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Enter Amount"
                      className="p-2 border rounded-md bg-white text-secondary text-xs"
                      min={0}
                      value={payment.amount}
                      onChange={(e) => handleMultiPaymentAmountChange(index, e.target.value)}
                    />
                  </div>
                )}

                <button 
                  onClick={() => removePaymentMethod(index)} 
                  className="px-3 py-1 bg-red-500 text-white rounded-md text-xs mt-2"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="flex justify-between mt-4">
              <button onClick={confirmMultiPayment} className="px-4 py-2 bg-green-500 text-white rounded-md text-sm">
                Confirm Payment
              </button>
              <button onClick={closePayment} className="px-4 py-2 bg-red-500 text-white rounded-md text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-2">
        <p className="text-sm font-bold text-secondary">Total: {total.toFixed(2)}</p>
        <p className="text-sm font-bold text-secondary">
          {isOutstanding ? `Outstanding Balance: ${outstandingOrChange.toFixed(2)}` : `Change: ${outstandingOrChange.toFixed(2)}`}
        </p>
      </div>
      
      <div className="flex justify-between mt-4">
        <button className="px-4 py-2 bg-green-500 text-white rounded-md text-sm">Save</button>
        <button className="px-4 py-2 bg-red-500 text-white rounded-md text-sm">Cancel</button>
      </div>
    </div>
  );
};

export default PurchasesInvoice;
