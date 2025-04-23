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
    paymentMenthodType: paymentTypeOptions[0], 
  });

  const [isTypeBoxOpened, setIsTypeBoxOpened] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPaymentData(
        isEdit && selectedPayment
          ? selectedPayment
          : { isActive: true, paymentMethod: "", paymentMenthodType: paymentTypeOptions[0] }
      );
    }
  }, [isOpen, isEdit, selectedPayment]);

  const handleTypeSelection = useCallback((e) => {
    const selected = e.selectedRowsData?.[0];
    if (selected) {
      setPaymentData({ ...paymentData, paymentMenthodType: selected });
      setIsTypeBoxOpened(false);
    }
  }, [paymentData]);

  const PaymentTypeGridRender = useCallback(() => (
    <DataGrid
      dataSource={paymentTypeOptions}
      keyExpr="id"
      showBorders={false}
      hoverStateEnabled
      selectedRowKeys={[paymentData.paymentMenthodType?.id]}
      onSelectionChanged={handleTypeSelection}
      height="100%"
    >
      <Selection mode="single" />
      <Scrolling mode="virtual" />
      <Paging enabled pageSize={5} />
      <SearchPanel visible highlightSearchText />
    </DataGrid>
  ), [paymentData.type, handleTypeSelection]);

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
            <div className="col-span-2 mt-2">
              <div className="flex items-center space-x-2">
                <input
                type="checkbox"
                checked={paymentData.isActive}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, isActive: e.target.checked })
                }
                />
                <label>isActive</label>
              </div>

              {/* Payment Method and DropDown Grid */}
              <div className="col-span-1 mt-2">
                <label className="block mb-2">Payment Method</label>
                <input
                  type="text"
                  value={paymentData.paymentMethod}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, paymentMethod: e.target.value })
                  }
                  placeholder="Payment Method"
                  className="mr-2 border w-1/2 h-[40px] px-2"
                />
              </div>

              <div className="col-span-1 mt-2">
                <label className="block mb-2">Payment Method Type</label>
                <DropDownBox
                  value={paymentData.paymentMenthodType?.name}
                  displayExpr="name"
                  valueExpr="id"
                  opened={isTypeBoxOpened}
                  onOptionChanged={(e) => {
                    if (e.name === "opened") {
                      setIsTypeBoxOpened(e.value);
                    }
                  }}
                  contentRender={PaymentTypeGridRender}
                  className="border rounded px-2 py-1 bg-white w-1/2"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
        <button
                className="bg-red-600 text-white w-36 px-4 py-2 rounded hover:bg-red-700"
                onClick={onClose}
            >
                Close
            </button>
            <button
                className="bg-primary text-white w-36 px-4 py-2 rounded hover:bg-primary/90"
                onClick={() => {
                if (!paymentData.paymentMenthodType.trim()) {    
                    onError({
                    title: "Validation Error",
                    message: "Payment Method Type is required.",
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
