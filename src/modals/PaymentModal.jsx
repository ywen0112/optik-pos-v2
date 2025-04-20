import { useState, useEffect } from "react";
import Select from "react-select";
import { SaveSalesPayment, SavePurchasePayment } from "../api/apiconfig";
import ErrorModal from "./ErrorModal";
import ConfirmationModal from "./ConfirmationModal";

const PaymentModal = ({
  paymentTab,
  setPaymentTab,
  selectedInvoice,
  closePaymentModal,
  multiPaymentMethods,
  setMultiPaymentMethods,
  confirmPayment,
  confirmMultiPayment,
  onPaymentSuccess,
}) => {
  const outstandingBal = (selectedInvoice?.outstandingBal) ?? 0;
  const outstandingBaltoFixed = +outstandingBal.toFixed(2);;

  const [enteredAmount, setEnteredAmount] = useState("");
  const [cardReceiptRef, setCardReceiptRef] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [approvalCode, setApprovalCode] = useState("");
  const [bankReceiptRef, setBankReceiptRef] = useState("");
  const [bankRef, setBankRef] = useState("");

  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isSavingPayment, setIsSavingPayment] = useState(false);

  useEffect(() => {
    if (selectedInvoice) {
      setEnteredAmount("");
      setCardReceiptRef("");
      setCardNumber("");
      setApprovalCode("");
      setBankReceiptRef("");
      setBankRef("");
    }
  }, [selectedInvoice]);

  const addPaymentMethod = () => {
    setMultiPaymentMethods((prev) => [...prev, { type: "", amount: "" }]);
  };

  const removePaymentMethod = (index) => {
    setMultiPaymentMethods((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMultiPaymentTypeChange = (index, option) => {
    const updated = [...multiPaymentMethods];
    updated[index].type = option?.value || "";
    setMultiPaymentMethods(updated);
  };

  const handleMultiPaymentAmountChange = (index, value) => {
    const updated = [...multiPaymentMethods];
    updated[index].amount = value;
    setMultiPaymentMethods(updated);
  };

  const handleMultiPaymentFieldChange = (index, field, value) => {
    const updated = [...multiPaymentMethods];
    updated[index][field] = value;
    setMultiPaymentMethods(updated);
  };

  const getSinglePaymentOutstanding = () => {
    const amount = parseFloat(enteredAmount);
    return isNaN(amount) ? outstandingBal : +(outstandingBal - amount).toFixed(2);
  };
  
  const handleSinglePaymentAmountChange = (value) => {
    handleDecimalInput(value, setEnteredAmount);
  };

  const totalMultiAmount = multiPaymentMethods.reduce((sum, m) => {
    const amount = parseFloat(m.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const handleDecimalInput = (value, callback) => {
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      const formatted = value.replace(/^0+(?=\d)/, ""); 
      callback(formatted);
    }
  };

const selectedPaymentType = { value: paymentTab, label: paymentTab };

confirmPayment = () => {
  const amount = parseFloat(enteredAmount);
  if (isNaN(amount) || amount < 0) {
    setErrorModal({ title: "Invalid Amount", message: "Amount cannot be negative or empty." });
    return;
  }
  setIsConfirmationModalOpen(true);
};

confirmMultiPayment = () => {
  const hasNegative = multiPaymentMethods.some((p) => parseFloat(p.amount) < 0);
  if (hasNegative) {
    setErrorModal({
      title: "Invalid Amount",
      message: "Each payment amount cannot be negative.",
    });
    return;
  }
  setIsConfirmationModalOpen(true);
};

const handleConfirmPayment = async () => {
  setIsSavingPayment(true);

  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localISOTime = new Date(now - offset).toISOString().slice(0, 19);

  const payments = [];

  const isMulti = selectedPaymentType?.value === "Multi Payment";

  if (isMulti) {
    for (const method of multiPaymentMethods) {
      const amount = parseFloat(method.amount);
      if (isNaN(amount) || amount <= 0) continue;

      let reference = "";
      let remark = "";

      if (method.type === "Bank Transfer") {
        remark = "Method: Bank Transfer";
        reference = `bank reference no： ${method.bankRef || ""} ｜ receipt reference： ${method.bankReceiptRef || ""}`;
      } else if (method.type === "Card Payment") {
        const cardEnding = method.cardNumber?.slice(-4) || "";
        remark = `Method: Card ****${cardEnding}`;
        reference = `approval code： ${method.approvalCode || ""} ｜ receipt reference： ${method.cardReceiptRef || ""}`;
      } else {
        remark = `Method: ${method.type}`;
      }

      payments.push({
        remark,
        reference,
        amount: +amount.toFixed(2),
      });
    }

    if (payments.length === 0) {
      setErrorModal({ title: "Missing Payments", message: "Please enter valid payment amounts." });
      setIsSavingPayment(false);
      return;
    }
  } else {
    const amount = parseFloat(enteredAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorModal({ title: "Invalid Amount", message: "Please enter a valid payment amount." });
      setIsSavingPayment(false);
      return;
    }

    let reference = "";
    let remark = "";

    const type = selectedPaymentType?.value;

    if (type === "Bank Transfer") {
      remark = "Method: Bank Transfer";
      reference = `bank reference no： ${bankRef || ""} ｜ receipt reference： ${bankReceiptRef || ""}`;
    } else if (type === "Card Payment") {
      const cardEnding = cardNumber?.slice(-4) || "";
      remark = `Method: Card ****${cardEnding}`;
      reference = `approval code： ${approvalCode || ""} ｜ receipt reference： ${cardReceiptRef || ""}`;
    } else {
      remark = `Method: ${type}`;
    }

    payments.push({
      remark,
      reference,
      amount: +amount.toFixed(2),
    });
  }

  const payload = {
    actionData: {
      customerId: Number(sessionStorage.getItem("customerId")),
      userId: sessionStorage.getItem("userId"),
      locationId: sessionStorage.getItem("locationId"),
      id: "",
    },
    isFirstPayment: true,
    docDate: localISOTime,
    targetDocId: selectedInvoice?.id,
    payment: payments,
  };

  try {
    const response = await fetch(
      selectedInvoice?.type === "Sales" ? SaveSalesPayment : SavePurchasePayment,
      {
        method: "POST",
        headers: {
          "Accept": "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!data.success) {
      if (data.errorMessage === "There is currently no active counter session.") {
        setErrorModal({
          title: "Session Error",
          message: data.errorMessage,
          onClose: () => {
            setErrorModal({ title: "", message: "", onClose: null });
          },
        });
      } else {
        throw new Error(data.errorMessage || "Payment failed.");
      }
      return;
    }

    onPaymentSuccess?.();
    setIsConfirmationModalOpen(false);
    closePaymentModal();

    setEnteredAmount("");
    setCardReceiptRef("");
    setCardNumber("");
    setApprovalCode("");
    setBankReceiptRef("");
    setBankRef("");
    setMultiPaymentMethods([]);
  } catch (err) {
    setErrorModal({ title: "Payment Error", message: err.message || "An unexpected error occurred." });
  } finally {
    setIsSavingPayment(false);
  }
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
      position: "absolute",  maxHeight: "10.5rem",
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      pointerEvents: "auto",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "10.5rem",
      overflowY: "auto", 
      WebkitOverflowScrolling: "touch",
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

  const paymentTypeOptions = [
    { value: "Cash Payment", label: "Cash Payment" },
    { value: "Card Payment", label: "Card Payment" },
    { value: "Bank Transfer", label: "Bank Transfer" },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10">
      <ConfirmationModal 
          isOpen={isConfirmationModalOpen}
          title="Confirm Payment"
          message="Are you sure you want to proceed with this payment?"
          onConfirm={handleConfirmPayment}
          onCancel={() => setIsConfirmationModalOpen(false)}
          confirmButtonDisabled={isSavingPayment}
          confirmButtonText={isSavingPayment ? "Processing..." : "Yes"}
        />
        <ErrorModal
          title={errorModal.title}
          message={errorModal.message}
          onClose={
            typeof errorModal.onClose === "function"
              ? errorModal.onClose
              : () => setErrorModal({ title: "", message: "" })
          }
        />
      <div className="bg-white p-6 rounded-lg shadow-md w-[600px] max-h-[600px] overflow-auto scrollbar-hide">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold text-secondary">Make Payment</h2>
          <button onClick={closePaymentModal} className="text-gray-400 hover:text-red-500">✕</button>
        </div>

        <div className="flex gap-2 text-xs mb-4">
          {["Cash Payment", "Card Payment", "Bank Transfer", "Multi Payment"].map((tab) => (
            <button
              key={tab}
              onClick={() => setPaymentTab(tab)}
              className={`px-3 py-1 rounded ${
                paymentTab === tab ? "bg-primary text-white" : "bg-gray-100 text-secondary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {paymentTab === "Cash Payment" && (
          <>
            <p className="text-xs text-secondary font-semibold mt-1">
              Balance: {outstandingBaltoFixed}
            </p>
            <p className="text-xs text-secondary mt-1 font-semibold">
              Outstanding Balance: {getSinglePaymentOutstanding()}
            </p>
            <input
              type="number"
              placeholder="Enter Amount"
              className="w-full mt-2 p-2 border rounded-md bg-white text-secondary text-xs"
              min={0}
              step="0.01"
              value={enteredAmount}
              onChange={(e) => handleSinglePaymentAmountChange(e.target.value)}
              onBlur={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) setEnteredAmount(val.toFixed(2));
              }}
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={confirmPayment}
                className="px-2 py-1 bg-green-500 text-white rounded-md text-sm"
              >
                Confirm Payment
              </button>
            </div>
          </>
        )}

        {paymentTab === "Card Payment" && (
          <>
            <p className="text-xs text-secondary font-semibold mt-1">
              Balance: {outstandingBaltoFixed}            
            </p>
            <p className="text-xs text-secondary mt-1 font-semibold">
              Outstanding Balance: {getSinglePaymentOutstanding()}
            </p>
            <input
              type="text"
              placeholder="Receipt Ref"
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
                placeholder="Amount"
                min={0}
                step="0.01"
                className="p-2 border rounded-md bg-white text-secondary text-xs"
                value={enteredAmount}
                onChange={(e) => handleSinglePaymentAmountChange(e.target.value)}
                onBlur={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) setEnteredAmount(val.toFixed(2));
                }}
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={confirmPayment}
                className="px-2 py-1 bg-green-500 text-white rounded-md text-sm"
              >
                Confirm Payment
              </button>
            </div>
          </>
        )}

        {paymentTab === "Bank Transfer" && (
          <>
            <p className="text-xs text-secondary font-semibold mt-1">
              Balance: {outstandingBaltoFixed}
            </p>
            <p className="text-xs text-secondary mt-1 font-semibold">
              Outstanding Balance: {getSinglePaymentOutstanding()}
            </p>
            <input
              type="text"
              placeholder="Receipt Ref"
              className="p-2 mt-2 w-full border rounded-md bg-white text-secondary text-xs"
              value={bankReceiptRef}
              onChange={(e) => setBankReceiptRef(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input
                type="text"
                placeholder="Bank Ref No"
                className="p-2 border rounded-md bg-white text-secondary text-xs"
                value={bankRef}
                onChange={(e) => setBankRef(e.target.value)}
              />
              <input
                type="number"
                placeholder="Amount"
                className="p-2 border rounded-md bg-white text-secondary text-xs"
                min={0}
                step="0.01"
                value={enteredAmount}
                onChange={(e) => handleSinglePaymentAmountChange(e.target.value)}
                onBlur={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) setEnteredAmount(val.toFixed(2));
                }}
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={confirmPayment}
                className="px-2 py-1 bg-green-500 text-white rounded-md text-sm"
              >
                Confirm Payment
              </button>
            </div>
          </>
        )}

        {paymentTab === "Multi Payment" && (
          <>
            <p className="text-xs text-secondary font-semibold mt-1">
              Balance: {outstandingBaltoFixed}
            </p>
            <p className="text-xs text-secondary mt-1 font-semibold">
               Outstanding Balance: {(outstandingBal - totalMultiAmount).toFixed(2)}            
            </p>
            <div className="text-right mt-2">
              <button
                onClick={addPaymentMethod}
                className="p-1 bg-primary text-white rounded-md text-xs w-1/4"
              >
                Add Payment
              </button>
            </div>

            {Array.isArray(multiPaymentMethods) &&
              multiPaymentMethods.map((payment, index) => (
                <div key={index} className="border p-2 mt-2 rounded-md">
                  <Select
                    options={paymentTypeOptions.filter(
                      (opt) => opt.value !== "Multi Payment"
                    )}
                    value={
                      payment.type
                        ? { value: payment.type, label: payment.type }
                        : null
                    }
                    onChange={(option) => handleMultiPaymentTypeChange(index, option)}
                    placeholder="Select Payment Method"
                    styles={customStyles}
                    isSearchable={false}
                    isClearable
                    classNames={{ menuList: () => "scrollbar-hide" }}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    tabIndex={0}
                  />

                  {payment.type === "Cash Payment" && (
                    <input
                      type="number"
                      placeholder="Enter Amount"
                      className="w-full mt-2 p-2 border rounded-md bg-white text-secondary text-xs"
                      min={0}
                      step="0.01"
                      value={payment.amount}
                      onChange={(e) =>
                        handleDecimalInput(e.target.value, (val) =>
                          handleMultiPaymentAmountChange(index, val)
                        )
                      }
                      onBlur={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) handleMultiPaymentAmountChange(index, val.toFixed(2));
                      }}
                    />
                  )}

                  {payment.type === "Card Payment" && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Receipt Ref"
                        className="p-2 border rounded-md bg-white text-secondary text-xs"
                        value={payment.cardReceiptRef}
                        onChange={(e) =>
                          handleMultiPaymentFieldChange(
                            index,
                            "cardReceiptRef",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="p-2 border rounded-md bg-white text-secondary text-xs"
                        value={payment.cardNumber}
                        onChange={(e) =>
                          handleMultiPaymentFieldChange(
                            index,
                            "cardNumber",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="text"
                        placeholder="Approval Code"
                        className="p-2 border rounded-md bg-white text-secondary text-xs"
                        value={payment.approvalCode}
                        onChange={(e) =>
                          handleMultiPaymentFieldChange(
                            index,
                            "approvalCode",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        className="p-2 border rounded-md bg-white text-secondary text-xs"
                        min={0}
                        step="0.01"
                        value={payment.amount}
                        onChange={(e) =>
                          handleDecimalInput(e.target.value, (val) =>
                            handleMultiPaymentAmountChange(index, val)
                          )
                        }
                        onBlur={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) handleMultiPaymentAmountChange(index, val.toFixed(2));
                        }}
                      />
                    </div>
                  )}

                  {payment.type === "Bank Transfer" && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Receipt Ref"
                        className="p-2 border rounded-md bg-white text-secondary text-xs"
                        value={payment.bankReceiptRef}
                        onChange={(e) =>
                          handleMultiPaymentFieldChange(
                            index,
                            "bankReceiptRef",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="text"
                        placeholder="Bank Ref No"
                        className="p-2 border rounded-md bg-white text-secondary text-xs"
                        value={payment.bankRef}
                        onChange={(e) =>
                          handleMultiPaymentFieldChange(index, "bankRef", e.target.value)
                        }
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        className="p-2 border rounded-md bg-white text-secondary text-xs"
                        min={0}
                        step="0.01"
                        value={payment.amount}
                        onChange={(e) =>
                          handleDecimalInput(e.target.value, (val) =>
                            handleMultiPaymentAmountChange(index, val)
                          )
                        }
                        onBlur={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) handleMultiPaymentAmountChange(index, val.toFixed(2));
                        }}
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
              <button
                onClick={confirmMultiPayment}
                className="px-2 py-1 bg-green-500 text-white rounded-md text-sm"
              >
                Confirm Payment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;