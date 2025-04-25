import { useEffect, useState, useCallback } from "react";
import DropDownBox from "devextreme-react/drop-down-box";
import DataGrid, {
  Selection,
  Paging,
  Scrolling,
  SearchPanel
} from "devextreme-react/data-grid";
import { X } from 'lucide-react';

const paymentTypeOptions = [
  { id: 1, name: "Cash" },
  { id: 2, name: "Card" },
  { id: 3, name: "Bank" },
  { id: 4, name: "Ewallet" }
];

const AddPaymentModal = ({
  isOpen,
  isEdit,
  selectedPayment,
  onConfirm,
  onClose,
  onError
}) => {
  const [paymentData, setPaymentData] = useState({
    isActive: true,
    paymentMethod: "",
    paymentMethodType: paymentTypeOptions[0], 
  });

  const [isTypeBoxOpened, setIsTypeBoxOpened] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log("Incoming selectedPayment:", selectedPayment);
  
      if (isEdit && selectedPayment) {
        const matchingType = paymentTypeOptions.find(
          (option) => option.name === selectedPayment.paymentMethodType
        );
        console.log("Found matching paymentType:", matchingType);
  
        setPaymentData({
          ...selectedPayment,
          paymentMethodType: matchingType || paymentTypeOptions[0],
        });
      } else {
        setPaymentData({
          isActive: true,
          paymentMethod: "",
          paymentMethodType: paymentTypeOptions[0],
        });
      }
    }
  }, [isOpen, isEdit, selectedPayment]);  
  
  const handleTypeSelection = useCallback((e) => {
    const selected = e.selectedRowsData?.[0];
    if (selected) {
      setPaymentData({ ...paymentData, paymentMethodType: selected });
      setIsTypeBoxOpened(false);
    }
  }, [paymentData]);

  const PaymentTypeGridRender = useCallback(() => (
    <DataGrid
      dataSource={paymentTypeOptions}
      keyExpr="id"
      showBorders={false}
      hoverStateEnabled
      selectedRowKeys={[paymentData.paymentMethodType?.id]} 
      onSelectionChanged={handleTypeSelection}
      height="100%"
    >
      <Selection mode="single" />
      <Scrolling mode="virtual" />
      <Paging enabled pageSize={5} />
      <SearchPanel visible highlightSearchText />
    </DataGrid>
  ), [paymentData.paymentMethodType, handleTypeSelection]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-y-auto text-secondary">
      <div className="flex flex-row justify-between">
            <h3 className="font-semibold mb-4">
                {isEdit ? "Edit Payment Method" : "Add Payment Method"}
            </h3>
            <div className='col-span-4' onClick={onClose}>
                <X size={20} />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-1">
          <div className="col-span-2 mt-2 flex items-center space-x-2">
            <input
                type="checkbox"
                checked={paymentData.isActive}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, isActive: e.target.checked })
                }
                />
                <label>isActive</label>
              </div>

              {/* Payment Method */}
              <div className="col-span-1 mt-2">
                <label className="block mb-2">Payment Method</label>
                <input
                  type="text"
                  value={paymentData.paymentMethod}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, paymentMethod: e.target.value })
                  }
                  placeholder="Payment Method"
                  className="mr-2 border w-full h-[40px] px-2" // w-full instead of w-1/2
                />
              </div>

              {/* Payment Method Type */}
              <div className="col-span-1 mt-2">
                <label className="block mb-2">Payment Method Type</label>
                <DropDownBox
                  dataSource={paymentTypeOptions}
                  value={paymentData.paymentMethodType?.id}
                  displayExpr="name"
                  valueExpr="id"
                  opened={isTypeBoxOpened}
                  onOptionChanged={(e) => {
                    if (e.name === "opened") {
                      setIsTypeBoxOpened(e.value);
                    }
                  }}
                  contentRender={PaymentTypeGridRender}
                  className="border rounded px-2 py-1 bg-white w-full" // also w-full
                />
              </div>
            </div>

          <div className="mt-6 flex justify-end space-x-2">
            <button
                className="bg-red-600 text-white w-36 px-4 py-2 rounded hover:bg-red-700"
                onClick={onClose}
            >
                Cancel
            </button>
            <button
                className="bg-primary text-white w-36 px-4 py-2 rounded hover:bg-primary/90"
                onClick={() => {
                if (!paymentData.paymentMethod.trim()) {    
                    onError({
                    title: "Validation Error",
                    message: "Payment Method is required.",
                    });
                    return;
                }
                onConfirm({
                    isOpen: true,
                    action: isEdit ? "edit" : "add",
                    data: paymentData,
                });
                }}
            >
                Save
            </button>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentModal;
