import { useEffect, useState, useCallback } from "react";
import DropDownBox from "devextreme-react/drop-down-box";
import DataGrid, {
  Selection,
  Paging,
  Scrolling,
  SearchPanel
} from "devextreme-react/data-grid";

const paymentTypeOptions = [
  { id: 1, name: "Cash" },
  { id: 2, name: "Card" },
  { id: 3, name: "Bank" },
  { id: 4, name: "Ewallet" }
];

const SalesPaymentModal = ({
  isOpen,
  isEdit,
  selectedPayment,
  onConfirm,
  onClose,
  onError
}) => {
  const [paymentData, setPaymentData] = useState({
    isActive: true,
    method: "",
    type: paymentTypeOptions[0], // store full object
  });

  const [isTypeBoxOpened, setIsTypeBoxOpened] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPaymentData(
        isEdit && selectedPayment
          ? selectedPayment
          : { isActive: true, method: "", type: paymentTypeOptions[0] }
      );
    }
  }, [isOpen, isEdit, selectedPayment]);

  const handleTypeSelection = useCallback((e) => {
    const selected = e.selectedRowsData?.[0];
    if (selected) {
      setPaymentData({ ...paymentData, type: selected });
      setIsTypeBoxOpened(false);
    }
  }, [paymentData]);

  const PaymentTypeGridRender = useCallback(() => (
    <DataGrid
      dataSource={paymentTypeOptions}
      keyExpr="id"
      showBorders={false}
      hoverStateEnabled
      selectedRowKeys={[paymentData.type?.id]}
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
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto text-secondary text-sm">
        <h3 className="font-semibold mb-4">
          {isEdit ? "Edit Payment" : "Add Payment"}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {/* Active checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={paymentData.isActive}
              onChange={(e) =>
                setPaymentData({ ...paymentData, isActive: e.target.checked })
              }
            />
            <label>Active</label>
          </div>

          {/* Payment Method and DropDown Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Payment Method</label>
              <input
                type="text"
                value={paymentData.method}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, method: e.target.value })
                }
                placeholder="Enter payment method"
                className="border rounded px-2 py-2 w-full"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium">Payment Method Type</label>
              <DropDownBox
                value={paymentData.type?.name}
                displayExpr="name"
                valueExpr="id"
                opened={isTypeBoxOpened}
                onOptionChanged={(e) => {
                  if (e.name === "opened") {
                    setIsTypeBoxOpened(e.value);
                  }
                }}
                contentRender={PaymentTypeGridRender}
                className="border rounded px-2 py-1 bg-white w-full"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            onClick={() => {
              if (!paymentData.method.trim()) {
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
          <button
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesPaymentModal;
