  import { Plus, X } from 'lucide-react';
  import { useEffect, useState } from "react";
  import { GetPaymentMethodRecords } from '../../api/maintenanceapi';
  import{ NewSalesOrderPayment, NewSalesOrderPaymentDetail, SaveSalesOrderPayment } from '../../api/transactionapi';
  import ErrorModal from '../ErrorModal';
  import NotificationModal from '../NotificationModal';

  const SalesOrderPaymentModal = ({ isOpen, onClose, total, companyId, userId, salesOrderId }) => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [errorModal, setErrorModal] = useState({ title: '', message: '' });
    const [selectedPayments, setSelectedPayments] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [activePaymentMethod, setActivePaymentMethod] = useState(null);
    const [salesOrderPaymentData, setSalesOrderPaymentData] = useState(null);
    const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: '' });
    const [paymentDetails, setPaymentDetails] = useState({ refno: '', ccno: '', approvalcode: '', remark: '', amount: '' });
    const [focusedField, setFocusedField] = useState(null);
  
    useEffect(() => {
      if (isOpen) {
        fetchPaymentMethods();
        setSelectedPayments([]);
        createNewSalesOrderPayment();
        setPaymentDetails({refno: '', ccno: '', approvalcode: '', remark: '', amount: ''});
        setActivePaymentMethod(null);
      }
    }, [isOpen]);
  
    const fetchPaymentMethods = async (isLoadMore = false) => {
      try {
        const params = { companyId, keyword: '', offset: isLoadMore ? offset : 0, limit: 10 };
        const response = await GetPaymentMethodRecords(params);
        if (response?.success) {
          const newData = response.data ?? [];
          setPaymentMethods(prev => (isLoadMore ? [...prev, ...newData] : newData));
          setHasMore(newData.length === params.limit);
          setOffset(prev => (isLoadMore ? prev + params.limit : params.limit));
        } else {
          throw new Error(response?.message);
        }
      } catch (error) {
        setPaymentMethods([]);
        setErrorModal({ title: 'Fetch Error', message: error.message });
      }
    };
  
    const createNewSalesOrderPayment = async () => {
      try {
        const response = await NewSalesOrderPayment({ companyId, userId, id: salesOrderId });
        setSalesOrderPaymentData(response.data);
      } catch (error) {
        setErrorModal({ title: 'New Error', message: error.message });
      }
    };
  
    const isSelected = (paymentMethodId) => {
      return selectedPayments.some(item => item.paymentMethodId === paymentMethodId);
    };
    
    const addPaymentMethod = async (method) => {
      const alreadyExists = selectedPayments.some(item => item.paymentMethodId === method.paymentMethodId);
      if (alreadyExists) return;
  
      try {
        const response = await NewSalesOrderPaymentDetail();
        if (response?.success && response.data) {
          setSelectedPayments(prev => [...prev, {
            ...method,
            amount: '0.00',
            salesOrderPaymentDetailId: response.data.salesOrderPaymentDetailId,
            reference: '',
            refno: '',
            ccno: '',
            approvalcode: '',
            remark: ''
          }]);
          setActivePaymentMethod(method);
        } else {
          throw new Error(response?.errorMessage);
        }
      } catch (error) {
        setErrorModal({ title: 'New Payment Detail Error', message: error.message });
      }
    };
  
    const removePaymentMethod = (index) => {
      setSelectedPayments(prev => prev.filter((_, i) => i !== index));
    };
  
    const calculateBalance = () => {
      const totalPayments = selectedPayments.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
      return Math.abs(total - totalPayments).toFixed(2);
    };
  
    const getBalanceLabel = () => {
      const totalPayments = selectedPayments.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
      return totalPayments >= total ? 'Change' : 'Balance';
    };
  
    const handleSave = async () => {
      try {
        const payload = {
          actionData: { companyId, userId, id: salesOrderId },
          salesOrderPaymentId: salesOrderPaymentData?.salesOrderPaymentId,
          salesOrderId,
          docDate: new Date().toISOString(),
          remark: '',
          total: parseFloat(total),
          isVoid: false,
          details: selectedPayments.map(item => ({
            salesOrderPaymentDetailId: item.salesOrderPaymentDetailId,
            paymentMethodId: item.paymentMethodId,
            reference: JSON.stringify({ refNo: item.refno, ccNo: item.ccno, approvalCode: item.approvalcode, remark: item.remark }),
            amount: parseFloat(item.amount) || 0,
          }))
        };
        await SaveSalesOrderPayment(payload);
        setNotifyModal({ isOpen: true, message: 'Payment made successfully!' });
      } catch (error) {
        setErrorModal({ title: 'Save Error', message: error.message });
      }
    };
  
    const handleNotifyModalClose = () => {
      setNotifyModal({ isOpen: false, message: '' });
      onClose();
    };

    const handlePlusClick = () => {
      const selectedIndex = selectedPayments.findIndex(item => item.paymentMethodId === activePaymentMethod.paymentMethodId);
      if (selectedIndex !== -1) {
        const updated = [...selectedPayments];
        updated[selectedIndex] = { ...updated[selectedIndex], ...paymentDetails };
        setSelectedPayments(updated);
        setPaymentDetails({ refno: '', ccno: '', approvalcode: '', remark: '', amount: '' });
        setActivePaymentMethod(null);
      }
    };

    const handleAmountChange = (e) => {
      let value = e.target.value;
    
      if (value === '' || value === '.') {
        setPaymentDetails(prev => ({ ...prev, amount: value }));
        return;
      }
    
      if (value.includes('.')) {
        const [integerPart, decimalPart] = value.split('.');
        if (decimalPart.length > 2) {
          value = `${integerPart}.${decimalPart.slice(0, 2)}`;
        }
      }
    
      if (!/^\d*(\.\d{0,2})?$/.test(value)) return;
    
      setPaymentDetails(prev => ({ ...prev, amount: value }));
    };
  
    const renderCashFields = () => (
      <div className="space-y-4">
        <div className="flex items-center gap-1">
          <span className="w-32 font-medium">Amount</span>
          <input
            type="text"
            placeholder='0.00'
            value={paymentDetails.amount}
            onChange={handleAmountChange}
            onFocus={() => setFocusedField('amount')}
            className="border p-1 h-[40px] flex-1 text-right"
          />
        </div>
        <div className='text-right'>
          <button onClick={handlePlusClick} className="px-3 p-2 bg-primary text-white rounded hover:bg-primary/90">
              <Plus size={20} />
          </button>
        </div>
      </div>
    );

    const fieldKeyMap = {
      'Ref No': 'refno',
      'CC No': 'ccno',
      'Approval Code': 'approvalcode',
      'Remark': 'remark',
    };
  
    const renderCreditCardFields = () => (
      <div className="space-y-2">
        {Object.entries(fieldKeyMap).map(([label, key], idx) => (
          <div key={idx} className="flex items-center gap-1">
            <span className="w-32">{label}</span>
            <input
              type="text"
              value={paymentDetails[label.toLowerCase().replace(' ', '')]}
              onFocus={() => setFocusedField(key)}
              onChange={(e) => setPaymentDetails(prev => ({ ...prev, [label.toLowerCase().replace(' ', '')]: e.target.value }))}

              className="border p-1 h-[40px] flex-1 text-right"
            />
          </div>
        ))}
        <div className="flex items-center gap-1">
          <span className="w-32">Amount</span>
          <input
            type="text"
            placeholder='0.00'
            value={paymentDetails.amount}
            onChange={handleAmountChange}
            onFocus={() => setFocusedField('amount')}
            className="border p-1 h-[40px] flex-1 text-right"
          />
        </div>
        <div className='text-right'>
          <button onClick={handlePlusClick} className="px-3 p-2 bg-primary text-white rounded hover:bg-primary/90">
              <Plus size={20} />
          </button>
        </div>
      </div>
    );
  
    const renderActivePaymentMethodFields = () => {
      if (!activePaymentMethod) return null;
      if (activePaymentMethod.paymentType === 'Cash') {
        return renderCashFields();
      }
      return renderCreditCardFields();
    };
  
    const handleNumberPadInput = (input) => {
      if (!focusedField) return;
    
      setPaymentDetails(prev => {
        let current = prev[focusedField] ?? '';
    
        if (input === 'backspace') {
          return { ...prev, [focusedField]: current.slice(0, -1) };
        }
    
        if (input === '.' && current.includes('.')) return prev;
        if (input === '.' && focusedField !== 'amount') return prev; 
    
        // Restrict to 2 decimal places for 'amount'
        if (focusedField === 'amount') {
          const [intPart, decPart] = current.split('.');
          if (decPart?.length >= 2 && input !== 'backspace') return prev;
        }
    
        const updated = current + input.toString();
        return { ...prev, [focusedField]: updated };
      });
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
                            <div
                              key={item.paymentMethodId}
                              className={`group flex items-center gap-1 border p-2 rounded cursor-pointer 
                                ${activePaymentMethod?.paymentMethodId === item.paymentMethodId 
                                  ? 'border-primary' 
                                  : 'hover:bg-gray-100'}`}
                              onClick={() => {
                                setActivePaymentMethod(item);
                                setPaymentDetails({
                                  refno: item.refno || '',
                                  ccno: item.ccno || '',
                                  approvalcode: item.approvalcode || '',
                                  remark: item.remark || '',
                                  amount: item.amount || ''
                                });
                              }}
                            >
                            <label className="flex-1">{item.paymentMethodCode}</label>
                            <input
                              type="text"
                              value={parseFloat(item.amount || 0).toFixed(2)}
                              readOnly
                              className="p-1 w-24 text-right group-hover:bg-gray-100"
                          />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removePaymentMethod(index);
                              }}
                              className="text-red-500 hover:text-red-700 group-hover:bg-gray-100"
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
                  <div className="border flex-1 overflow-y-auto mb-4 p-2 "
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
                              className={`border p-2 rounded cursor-pointer ${isSelected(method.paymentMethodId) ? 'bg-gray-100 text-secondary cursor-not-allowed' : 'hover:bg-gray-100'}`}
                              onClick={() => {
                                if (!isSelected(method.paymentMethodId)) {
                                  addPaymentMethod(method);
                                }
                              }}
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
                <div className="h-[50%] border p-2">
                  {renderActivePaymentMethodFields()}
                </div>
              
                <div className="flex-1 border mt-4 p-4 flex flex-col justify-center items-center">
                  <div className="grid grid-cols-3 gap-4 w-full max-w-[300px]">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'backspace', 0, '.'].map((value, index) => (
                    <button
                      key={index}
                      className="h-16 text-xl font-semibold border rounded flex items-center justify-center hover:bg-gray-100"
                      onClick={() => handleNumberPadInput(value)}
                    >
                      {value === 'backspace' ? '⌫' : value}
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
