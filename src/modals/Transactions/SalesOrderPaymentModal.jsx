import { useEffect, useState } from "react";
import { GetPaymentMethodRecords } from '../../api/maintenanceapi';
import { NewSalesOrderPayment, NewSalesOrderPaymentDetail, SaveSalesOrderPayment } from '../../api/transactionapi';
import NotificationModal from '../NotificationModal';
import { X, Plus } from "lucide-react";
import CustomStore from 'devextreme/data/custom_store';
import { getInfoLookUp } from "../../api/infolookupapi";
import { List } from "devextreme-react";

const SalesOrderPaymentModal = ({ isOpen, onClose, total, companyId, userId, salesOrderId, onError, onSave }) => {
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [activePaymentMethod, setActivePaymentMethod] = useState(null);
  const [salesOrderPaymentData, setSalesOrderPaymentData] = useState(null);
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: '' });
  const [paymentDetails, setPaymentDetails] = useState({ refno: '', ccno: '', approvalcode: '', remark: '', amount: '' });
  const [focusedField, setFocusedField] = useState(null);
  const [rawAmountDigits, setRawAmountDigits] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedPayments([]);
      createNewSalesOrderPayment();
      setActivePaymentMethod(null);
    }
  }, [isOpen]);

  const paymentMethodStore = new CustomStore({
    key: "paymentMethodId",

    load: async (loadOptions) => {
      const filter = loadOptions.filter;
      let keyword = filter?.[2] || "";

      const params = {
        keyword: keyword || "",
        offset: loadOptions.skip,
        limit: loadOptions.take,
        type: "payment_method",
        companyId,
      };
      const res = await getInfoLookUp(params);
      return {
        data: res.data,
        totalCount: res.totalRecords,
      };
    },
  });

  const createNewSalesOrderPayment = async () => {
    try {
      const response = await NewSalesOrderPayment({ companyId, userId, id: salesOrderId });
      setSalesOrderPaymentData(response.data);
      setPaymentDetails({ refno: '', ccno: '', approvalcode: '', remark: '', amount: '' });
      setRawAmountDigits('');
    } catch (error) {
      onError({ title: 'New Error', message: error.message || "Failed to add new Sales Order Payment." });
    }
  };

  const addPaymentMethod = async (method) => {
    try {
      const response = await NewSalesOrderPaymentDetail();
      if (response?.success && response.data) {
        const newEntry = {
          ...method,
          uid: Date.now() + Math.random(),
          amount: '',
          salesOrderPaymentDetailId: response.data.salesOrderPaymentDetailId,
          reference: '',
          refno: '',
          ccno: '',
          approvalcode: '',
          remark: ''
        };
        setSelectedPayments(prev => [...prev, newEntry]);
        setActivePaymentMethod(newEntry);
        setPaymentDetails({ refno: '', ccno: '', approvalcode: '', remark: '', amount: '' });
        setRawAmountDigits('');
        setFocusedField('amount');
      } else {
        throw new Error(response?.errorMessage || "Failed to add new Sales Order Payment Details.");
      }
    } catch (error) {
      onError({ title: 'New Payment Detail Error', message: error.message });
    }
  };

  const removePaymentMethod = (index) => {
    setSelectedPayments(prev => {
      const removed = prev[index];
      const updated = prev.filter((_, i) => i !== index);

      if (activePaymentMethod?.uid === removed.uid) {
        setActivePaymentMethod(null);
        setPaymentDetails({ refno: '', ccno: '', approvalcode: '', remark: '', amount: '' });
        setRawAmountDigits('');
      }

      return updated;
    });
  };

  const calculateBalance = () => {
    const totalPayments = selectedPayments.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    return Math.abs(total - totalPayments).toFixed(2);
  };

  const getBalanceLabel = () => {
    const totalPayments = selectedPayments.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    return totalPayments >= total ? 'Change' : 'Balance';
  };

  const handleSave = async ({ action }) => {
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
          reference: JSON.stringify({ refNo: item.refsqwno, ccNo: item.ccno, approvalCode: item.approvalcode, remark: item.remark }),
          amount: parseFloat(item.amount) || 0,
        }))
      };
      await SaveSalesOrderPayment(payload);
      setFocusedField(null);
      setRawAmountDigits('');
      if(action === "save-print"){
        await onSave({ action: action })
        onClose()
      }else{
        await onSave({ action: action })
        setNotifyModal({ isOpen: true, message: 'Payment made successfully!' });
      }
    } catch (error) {
      onError({ title: 'Save Error', message: error.message || "Failed to save Sales Order Payment." });
    }
  };

  const handleNotifyModalClose = () => {
    setNotifyModal({ isOpen: false, message: '' });
    onClose();
  };

  const handlePlusClick = () => {
    const selectedIndex = selectedPayments.findIndex(item => item.uid === activePaymentMethod.uid);
    if (selectedIndex !== -1) {
      const updated = [...selectedPayments];
      updated[selectedIndex] = { ...updated[selectedIndex], ...paymentDetails };
      const totalPaid = updated.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
      const hasCashPayment = updated.some(item => item.paymentType === "Cash");
      if(!hasCashPayment && totalPaid > total){
        onError({title: 'Payment Error', message: "Amount entered is more than total value"});
        return;
      }
      setSelectedPayments(updated);
      setPaymentDetails({ refno: '', ccno: '', approvalcode: '', remark: '', amount: '' });
      setRawAmountDigits('');
      setActivePaymentMethod(null);
    }
  };

  const formatRawAmount = (digits) => {
    const cleaned = digits.replace(/\D/g, '');
    const num = cleaned.padStart(3, '0');
    const intPart = num.slice(0, -2).replace(/^0+/, '') || '0';
    const decimalPart = num.slice(-2);
    return `${intPart}.${decimalPart}`;
  };

  const handleAmountChange = (e) => {
    const input = e.nativeEvent.data;
    if (!input) return;
    if (!/^\d$/.test(input)) return;

    const updated = rawAmountDigits + input;
    setRawAmountDigits(updated);
    setPaymentDetails(prev => ({ ...prev, amount: formatRawAmount(updated) }));
  };

  const handleAmountKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handlePlusClick();
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      const updated = rawAmountDigits.slice(0, -1);
      setRawAmountDigits(updated);
      setPaymentDetails(prev => ({ ...prev, amount: formatRawAmount(updated) }));
    }
  };

  const renderCashFields = () => (
    <div className="space-y-4 text-lg">
      <div className="flex items-center gap-1">
        <span className="w-32 font-medium">Amount</span>
        <input
          type="text"
          value={formatRawAmount(rawAmountDigits)}
          onChange={handleAmountChange}
          onKeyDown={handleAmountKeyDown}
          onFocus={() => setFocusedField('amount')}
          autoFocus={focusedField === 'amount'}
          className="border-2 p-1 h-[40px] flex-1 text-right"
        />
      </div>
      {/* <div className='text-right'>
          <button onClick={handlePlusClick} className="px-3 p-2 bg-primary text-white rounded hover:bg-primary/90">
              <Plus size={20} />
          </button>
        </div> */}
    </div>
  );

  const fieldKeyMap = {
    'Ref No': 'refno',
    'CC No': 'ccno',
    'Approval Code': 'approvalcode',
    'Remark': 'remark',
  };

  const renderCreditCardFields = () => (
    <div className="space-y-2 text-lg">
      {Object.entries(fieldKeyMap).map(([label, key], idx) => (
        <div key={idx} className="flex items-center gap-1">
          <span className="w-32">{label}</span>
          <input
            type="text"
            value={paymentDetails[label.toLowerCase().replace(' ', '')]}
            onFocus={() => setFocusedField(key)}
            onChange={(e) => setPaymentDetails(prev => ({ ...prev, [label.toLowerCase().replace(' ', '')]: e.target.value }))}

            className="border-2 p-1 h-[40px] flex-1 text-right"
          />
        </div>
      ))}
      <div className="flex items-center gap-1">
        <span className="w-32">Amount</span>
        <input
          type="text"
          value={formatRawAmount(rawAmountDigits)}
          onChange={handleAmountChange}
          onKeyDown={handleAmountKeyDown}
          onFocus={() => setFocusedField('amount')}
          autoFocus={focusedField === 'amount'}
          className="border-2 p-1 h-[40px] flex-1 text-right"
        />
      </div>
      {/* <div className='text-right'>
          <button onClick={handlePlusClick} className="px-3 p-2 bg-primary text-white rounded hover:bg-primary/90">
              <Plus size={20} />
          </button>
        </div> */}
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
    if (focusedField !== 'amount') return;

    if (input === 'backspace') {
      const updated = rawAmountDigits.slice(0, -1);
      setRawAmountDigits(updated);
      setPaymentDetails(prev => ({ ...prev, amount: formatRawAmount(updated) }));
      return;
    }

    if (input === 'clear') {
      setRawAmountDigits('');
      setPaymentDetails(prev => ({ ...prev, amount: '0.00' }));
      return;
    }

    if (!/^\d$/.test(input)) return;

    const updated = rawAmountDigits + input;
    setRawAmountDigits(updated);
    setPaymentDetails(prev => ({ ...prev, amount: formatRawAmount(updated) }));
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <NotificationModal isOpen={notifyModal.isOpen} message={notifyModal.message} onClose={handleNotifyModalClose} />
      <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full overflow-y-auto text-secondary">
        <div className="flex flex-row justify-between">
          <h3 className="font-semibold mb-4">
            Add Payment
          </h3>
          <div className='col-span-4' onClick={onClose}>
            <X size={20} />
          </div>
        </div>

        <div className="flex flex-row h-[82vh]">
          {/* Left Section */}
          <div className="flex-1 border-r p-4 flex flex-col h-full">
            <div className="border-2 grid grid-cols-2 p-4 mb-4">
              <h3 className="font-semibold mb-2">Total Amount</h3>
              <label className="text-2xl font-bold flex flex-row-reverse">{total?.toFixed(2) || "0.00"}</label>
            </div>

            <div className="border-2 flex-1 overflow-y-auto mb-4 p-2">
              <div className="space-y-2 text-lg">
                {selectedPayments.length > 0 ? (
                  selectedPayments.map((item, index) => (
                    <div
                      key={item.uid}
                      className={`group flex items-center gap-1 border-2 p-2 rounded cursor-pointer
                               ${activePaymentMethod?.uid === item.uid ? 'border-primary' : 'hover:bg-gray-100'}`}
                      onClick={() => {
                        setActivePaymentMethod(item);
                        setPaymentDetails({
                          refno: item.refno || '',
                          ccno: item.ccno || '',
                          approvalcode: item.approvalcode || '',
                          remark: item.remark || '',
                          amount: item.amount || ''
                        });
                        setFocusedField('amount');
                        setRawAmountDigits(item.amount.replace('.', '') || '');
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
                        <X size={20} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No payment method selected yet.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 border-2 p-4">
              <h3 className="font-semibold mb-2">{getBalanceLabel()}</h3>
              <input
                type="text"
                value={calculateBalance()}
                readOnly
                className="w-full text-2xl font-bold text-end"
              />
            </div>
          </div>

          {/* Middle Section */}
          <div className="flex-1 border-r p-4 flex flex-col h-[80vh]">
            <div className="p-4 mb-4 border-2">
              <h3 className="font-semibold mb-8">Payment Methods</h3>
            </div>
            <List
              dataSource={paymentMethodStore}
              height="100%"
              repaintChangesOnly={true}
              searchEnabled={false}
              focusStateEnabled={false}
              pageLoadMode="scrollBottom"
              itemRender={(data) => (
                <div
                  className="p-2 cursor-pointer hover:bg-gray-100 text-lg"
                  onClick={() => {
                    addPaymentMethod(data);
                    setFocusedField('amount');
                  }}
                >
                  {data.paymentMethodCode}
                </div>
              )}
              className="border-2 p-2"
            />
          </div>

          {/* Right Section */}
          <div className="flex-1 p-4 flex flex-col">
            <div className="h-[50%] border-2 p-2">
              {renderActivePaymentMethodFields()}
            </div>

            <div className="flex-1 border-2 mt-4 p-4 flex flex-col justify-center items-center">
              <div className="grid grid-cols-[auto_80px] gap-4">
                <div className="grid grid-cols-3 gap-4 w-full max-w-[300px]">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'backspace', 0, 'clear'].map((value, index) => (
                    <button
                      key={index}
                      className={`h-18 text-2xl font-semibold border border-black rounded flex items-center justify-center transition
            ${value === 'clear' ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-gray-100'}`}
                      onClick={() => handleNumberPadInput(value)}
                    >
                      {value === 'backspace' ? '⌫' : value === 'clear' ? 'C' : value}
                    </button>
                  ))}
                </div>
                <button onClick={handlePlusClick} className="bg-green-500 text-white text-xl font-bold rounded p-4 flex items-center justify-center">
                  Enter
                </button>
              </div>
            </div>

          </div>
        </div>

        <div className="absolute bottom-0 right-0 bg-white py-4 pr-6 flex justify-end w-full border-t">
          <div className="flex gap-1">
            <button onClick={onClose} className="bg-red-600 text-white w-36 px-4 py-2 rounded hover:bg-red-700">
              Cancel
            </button>
            <button onClick={() => handleSave({ action: 'save-print' })} className="bg-primary text-white w-36 px-4 py-2 rounded hover:bg-primary/90">
              Save & Print
            </button>
            <button onClick={() => handleSave({ action: 'save' })} className="bg-primary text-white w-36 px-4 py-2 rounded hover:bg-primary/90">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesOrderPaymentModal;
