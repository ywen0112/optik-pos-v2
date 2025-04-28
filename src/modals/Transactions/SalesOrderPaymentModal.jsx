import { X } from 'lucide-react';
import { useEffect, useState } from "react";
import { GetPaymentMethodRecords } from '../../api/maintenanceapi';
import{ NewSalesOrderPayment, NewSalesOrderPaymentDetail, SaveSalesOrderPayment } from '../../api/transactionapi';
import ErrorModal from '../ErrorModal';
import NotificationModal from '../NotificationModal';

const SalesOrderPaymentModal = ({ isOpen, onClose, total, companyId, userId, salesOrderId }) => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [errorModal, setErrorModal] = useState({ title: "", message: "" });
    const [selectedPayments, setSelectedPayments] = useState([]);
    const [hasMore, setHasMore] = useState(true); 
    const [offset, setOffset] = useState(0);
    const [activePaymentMethod, setActivePaymentMethod] = useState(null);
    const [focusedPaymentIndex, setFocusedPaymentIndex] = useState(null);
    const [inputMode, setInputMode] = useState("manual"); 
    const [salesOrderPaymentData, setSalesOrderPaymentData] = useState(null);
    const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });

    useEffect(() => {
      if (isOpen) {
        fetchPaymentMethods();
        setSelectedPayments([]); 
        createNewSalesOrderPayment();
      }
    }, [isOpen]);
  
    const fetchPaymentMethods = async (isLoadMore = false) => {
        try {
          const params = {
            companyId: companyId,
            keyword: "",
            offset: isLoadMore ? offset : 0,
            limit: 10,
          };
          const response = await GetPaymentMethodRecords(params);
      
          if (response?.success) {
            const newData = response.data ?? [];
            
            setPaymentMethods((prev) => isLoadMore ? [...prev, ...newData] : newData);
            setHasMore(newData.length === params.limit);
            setOffset((prev) => isLoadMore ? prev + params.limit : params.limit);
          } else {
            throw new Error(response?.message || "Failed to fetch payment methods");
          }
        } catch (error) {
          setPaymentMethods([]);
          setErrorModal({ 
            title: "Fetch Error", 
            message: error.message
          });
        }
    };

    const createNewSalesOrderPayment = async () => {
        try {
        const response = await NewSalesOrderPayment({ companyId, userId, id: salesOrderId }); 
        setSalesOrderPaymentData(response.data); 
        } catch (error) {
            setErrorModal({ 
                title: "New Error", 
                message: error.message
            });
        }
    };

    const addPaymentMethod = async (method) => {
        const alreadyExists = selectedPayments.some(
          (item) => item.paymentMethodId === method.paymentMethodId
        );
        if (alreadyExists) {
            setSelectedPayments(prev => [...prev, { ...method, amount: "0.00", refNo: "", ccNo: "", approvalCode: "", remark: "" }]);
            setActivePaymentMethod(method);
            return; 
        }
    
        try {
          const response = await NewSalesOrderPaymentDetail(); 
          if (response?.success && response.data) {
            setSelectedPayments((prev) => [
              ...prev,
              {
                ...method,
                amount: "0.00",
                salesOrderPaymentDetailId: response.data.salesOrderPaymentDetailId,
                reference: "",
              }
            ]);
            setActivePaymentMethod(method);
          } else {
            throw new Error(response?.errorMessage || "Failed to create payment detail");
          }
        } catch (error) {
          setErrorModal({
            title: "New Payment Detail Error",
            message: error.message || "Something went wrong while creating payment detail."
          });
        }
    };
    

    const updatePaymentAmount = (index, value) => {
        const updated = [...selectedPayments];
      
        if (value === "") {
          updated[index].amount = "";
        } else {
          const regex = /^\d+(\.\d{0,2})?$/; 
          if (regex.test(value)) {
            updated[index].amount = value;
          }
        }
        
        setSelectedPayments(updated);
    };
      
    
    const removePaymentMethod = (index) => {
        setSelectedPayments((prev) => prev.filter((_, i) => i !== index));
    };
    
    const calculateBalance = () => {
        const totalPayments = selectedPayments.reduce(
          (sum, item) => sum + parseFloat(item.amount || 0),
          0
        );
        const balance = total - totalPayments;
        return Math.abs(balance).toFixed(2); 
    };
    
    const getBalanceLabel = () => {
        const totalPayments = selectedPayments.reduce(
            (sum, item) => sum + parseFloat(item.amount || 0),
            0
        );
        return totalPayments >= total ? "Change" : "Balance";
    };

    const handleNumberPadClick = (value) => {
        if (focusedPaymentIndex === null) return;
      
        setInputMode("numberpad");
      
        setSelectedPayments(prev => {
          const updated = [...prev];
          let currentAmount = updated[focusedPaymentIndex]?.amount?.toString() || "0";
      
          if (value === "backspace") {
            currentAmount = currentAmount.slice(0, -1) || "0";
          } else if (value === ".") {
            if (!currentAmount.includes(".")) {
              currentAmount += ".";
            }
          } else if (typeof value === "number") {
            if (currentAmount === "0" || currentAmount === "0.00") {
              currentAmount = `${value}`;
            } else {
              currentAmount = `${currentAmount}${value}`;
            }
          }
      
          const regex = /^\d*(\.\d{0,2})?$/;
          if (regex.test(currentAmount)) {
            updated[focusedPaymentIndex].amount = currentAmount;
          }
      
          return updated;
        });
    };    
    
    const handleSave = async () => {
        try {
          const payload = {
            actionData: {
              companyId,
              userId,
              id: salesOrderId
            },
            salesOrderPaymentId: salesOrderPaymentData?.salesOrderPaymentId,
            salesOrderId,
            docDate: new Date().toISOString(),
            remark: "",
            total: parseFloat(total),
            isVoid: false,
            details: selectedPayments.map(item => ({
              salesOrderPaymentDetailId: item.salesOrderPaymentDetailId,
              paymentMethodId: item.paymentMethodId,
              reference: JSON.stringify({
                refNo: item.refNo,
                ccNo: item.ccNo,
                approvalCode: item.approvalCode,
                remark: item.remark
              }),
              amount: parseFloat(item.amount) || 0,
            }))
          };
          await SaveSalesOrderPayment(payload);
          setNotifyModal({ isOpen: true, message: "Payment made successfully!" });
        } catch (error) {
          setErrorModal({ title: "Save Error", message: error.message });
        }
    };
    
    const handleNotifyModalClose = () => {
        setNotifyModal({ isOpen: false, message: "" });
        onClose();
    };

    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
        <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
        <NotificationModal isOpen={notifyModal.isOpen} message={notifyModal.message}  onClose={handleNotifyModalClose} />
        <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full overflow-y-auto text-secondary">
        <div className="flex flex-row justify-between">
            <h3 className="font-semibold mb-4">
                Add Payment
            </h3>
            <div className='col-span-4' onClick={onClose}>
                <X size={20} />
            </div>
        </div>

        <div className="flex flex-row h-[83vh]">
            {/* Left Section */}
            <div className="flex-1 border-r p-4 flex flex-col h-full">
                <div className="border p-4 mb-4">
                    <h3 className="font-semibold mb-2">Total Amount</h3>
                    <label>{total?.toFixed(2) || "0.00"}</label>
                </div>

                <div className="border flex-1 overflow-y-auto mb-4 p-2">
                    <div className="space-y-2">
                    {selectedPayments.length > 0 ? (
                        selectedPayments.map((item, index) => (
                            <div key={item.paymentMethodId} className="flex items-center gap-2 border p-2 rounded">
                            <label className="flex-1">{item.paymentMethodCode}</label>
                            
                            <input
                            type="text"
                            value={item.amount}
                            onClick={() => {
                                setFocusedPaymentIndex(index);
                                setInputMode("manual");
                            }}
                            onChange={(e) => {
                                if (inputMode === "manual") {
                                updatePaymentAmount(index, e.target.value);
                                }
                            }}
                            readOnly={inputMode === "numberpad"} 
                            className="border rounded p-1 w-24 text-right"
                            />

                            <button
                                onClick={() => removePaymentMethod(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X size={18} />
                            </button>
                            </div>
                        ))
                        ) : (
                        <p className="text-gray-500">No payment method selected yet.</p>
                        )}
                    </div>
                </div>

                <div className="border p-4">
                <h3 className="font-semibold mb-2">{getBalanceLabel()}</h3>
                <input
                    type="text"
                    value={calculateBalance()}
                    readOnly
                    className="w-full"
                />
                </div>
            </div>

            {/* Middle Section */}
            <div className="flex-1 border-r p-4 flex flex-col h-[85vh]">
                <div className="p-4 mb-4 border">
                    <h3 className="font-semibold mb-8">Payment Methods</h3>
                </div>
                <div 
                    className="border flex-1 overflow-y-auto mb-4 p-2 "
                    onScroll={(e) => {
                    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
                    if (scrollHeight - scrollTop <= clientHeight + 50) { 
                        if (hasMore) {
                        fetchPaymentMethods(true);
                        }
                    }
                    }}
                >
                    <div className="space-y-2">
                    {paymentMethods.length > 0 ? (
                        paymentMethods.map((method) => (
                        <div
                            key={method.paymentMethodId}
                            className="border p-2 rounded hover:bg-gray-100 cursor-pointer"
                            onClick={() => addPaymentMethod(method)}
                        >
                            {method.paymentMethodCode}
                        </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No payment methods found.</p>
                    )}
                    </div>

                    {hasMore && (
                    <div className="flex justify-center items-center py-2">
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                    </div>
                    )}
                </div>
            </div>

            {/* Right Section */}
            <div className="flex-1 p-4 flex flex-col">
            <div className="h-[40%] border p-4">
                {activePaymentMethod &&
                (activePaymentMethod.paymentType === "Credit Card" || activePaymentMethod.paymentType === "E-Wallet") ? (
                    (() => {
                    const selectedIndex = selectedPayments.findIndex(
                        (item) => item.paymentMethodId === activePaymentMethod.paymentMethodId
                    );

                    const updateSelectedPaymentField = (field, value) => {
                        if (selectedIndex !== -1) {
                        const updated = [...selectedPayments];
                        updated[selectedIndex] = {
                            ...updated[selectedIndex],
                            [field]: value
                        };
                        setSelectedPayments(updated);
                        }
                    };

                    const selectedItem = selectedPayments[selectedIndex] || {};

                    return (
                        <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="w-32 font-medium">Ref No</span>
                            <input
                            type="text"
                            value={selectedItem.refNo || ""}
                            onChange={(e) => updateSelectedPaymentField('refNo', e.target.value)}
                            className="border p-1 h-[40px] flex-1"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-32 font-medium">CC No</span>
                            <input
                            type="text"
                            value={selectedItem.ccNo || ""}
                            onChange={(e) => updateSelectedPaymentField('ccNo', e.target.value)}
                            className="border p-1 h-[40px] flex-1"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-32 font-medium">Approval Code</span>
                            <input
                            type="text"
                            value={selectedItem.approvalCode || ""}
                            onChange={(e) => updateSelectedPaymentField('approvalCode', e.target.value)}
                            className="border p-1 h-[40px] flex-1"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-32 font-medium">Remark</span>
                            <input
                            type="text"
                            value={selectedItem.remark || ""}
                            onChange={(e) => updateSelectedPaymentField('remark', e.target.value)}
                            className="border p-1 h-[40px] flex-1"
                            />
                        </div>
                        </div>
                    );
                    })()
                ) : (
                    <div className="text-gray-400 h-full flex items-center justify-center">
                    No additional details
                    </div>
                )}
                </div>
            
                <div className="flex-1 border mt-4 p-4 flex flex-col justify-center items-center">
                    <div className="grid grid-cols-3 gap-4 w-full max-w-[300px]">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "backspace", 0, "."].map((value, index) => (
                            <button
                                key={index}
                                className="h-16 text-xl font-semibold border rounded flex items-center justify-center hover:bg-gray-100"
                                onClick={() => handleNumberPadClick(value)}
                            >
                                {value === "backspace" ? "⌫" : value}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="absolute bottom-0 right-0 bg-white py-4 pr-6 flex justify-end w-full border-t">
            <div className="flex gap-1">
                <button onClick={onClose} className="bg-red-600 text-white w-36 px-4 py-2 rounded hover:bg-red-700">
                    Cancel
                </button>
                <button onClick={handleSave} className="bg-primary text-white w-36 px-4 py-2 rounded hover:bg-primary/90">
                    Save
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SalesOrderPaymentModal;
