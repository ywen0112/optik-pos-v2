import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";

import CustomStore from 'devextreme/data/custom_store';
import ErrorModal from "../../modals/ErrorModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import NotificationModal from "../../modals/NotificationModal";
import { NewStockAdjustment, NewStockAdjustmentDetail, SaveStockAdjustment } from "../../api/transactionapi";
import TransactionItemDataGrid from "../../Components/DataGrid/Transactions/TransactionItemDataGrid";

const StockAdjustment = () => {
  const companyId = sessionStorage.getItem("companyId");
  const userId = sessionStorage.getItem("userId");
  const [masterData, setMasterData] = useState(null);
  const [stockAdjustmentItems, setStockAdjustmentItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentTotal, setCurrentTotal] = useState(0);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: "", targetData: null });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });

  const gridRef = useRef(null)

  useEffect(() => {
    newStockAdjustmentRecords()
  }, [])

  const newStockAdjustmentRecords = async () => {
    try {
      const res = await NewStockAdjustment({ companyId: companyId, userId: userId, id: userId });
      if (res.success) {
        setMasterData(res.data);
      } else throw new Error(res.errorMessage || "Failed to add new Stock Adjustment Records");
    } catch (error) {
      setErrorModal({ title: "Failed to Add", message: error.message });
    }
  }

  const onLookUpSelected = (newValue, rowData) => {
    let data = newValue;
    if (!data.stockAdjustmentDetailId) {
      data = { ...rowData, ...newValue }
    }
    setStockAdjustmentItems(prev => {
      const exists = prev.find(record => record.stockAdjustmentDetailId === data.stockAdjustmentDetailId);
      if (exists) {
        return prev.map(record =>
          record.stockAdjustmentDetailId === data.stockAdjustmentDetailId ? { ...record, ...data } : record
        );
      } else {
        return [...prev, data];
      }
    })
  };

  const handleAddNewRow = async () => {
    try {
      const res = await NewStockAdjustmentDetail({});
      if (res.success) {
        const newRecords = res.data;
        setStockAdjustmentItems(prev => [...prev, newRecords]);
      } else throw new Error(res.errorMessage || "Failed to add new Stock Adjustment Details");
    } catch (error) {
      setErrorModal({ title: "Failed to Add", message: error.message });
    }
  }

  const handleEditRow = async (key, changedData) => {
    setStockAdjustmentItems(prev => {
      return prev.map(record => {
        if (record.stockAdjustmentDetailId === key) {
          const updatedRecord = { ...record, ...changedData };

          if ('qty' in changedData || 'unitCost' in changedData) {
            const qty = Number(updatedRecord.qty) || 0;
            const unitCost = Number(updatedRecord.unitCost) || 0;
            updatedRecord.subTotal = qty * unitCost;
          }

          return updatedRecord;
        }
        return record;
      });
    });
  };

  useEffect(() => {
    const total = stockAdjustmentItems?.reduce((sum, item) => {
      return sum + (Number(item.subTotal) || 0);
    }, 0);

    setCurrentTotal(total);
  }, [handleEditRow])

  const handleRemoveRow = async (key) => {
    setStockAdjustmentItems(prev => prev.filter(record => record.stockAdjustmentDetailId !== key));
  }

  const confirmAction = async () => {
    try {
      const res = await SaveStockAdjustment({ ...confirmModal.data });
      if (res.success) {
        setNotifyModal({ isOpen: true, message: "Stock Adjustment added successfully!" });
      } else throw new Error(res.errorMessage || "Failed to Add Stock Adjustment");
    } catch (error) {
      setErrorModal({ title: "Error", message: error.message });
      await newGoodsTransitRecords()
    }
    if (confirmModal.action === "addPrint") {
      console.log("print acknowledgement");
    }
    setConfirmModal({ isOpen: false, action: "", data: null });
    await newStockAdjustmentRecords()
    setStockAdjustmentItems([]);
    setCurrentTotal(0);
    return;
  }

  const handleSavePrint = () => {
    if (stockAdjustmentItems.length <= 0 || masterData?.description === "") {
      setErrorModal({
        title: "Validation Error",
        message: "Missing Required Information to be Saved",
      });
      return;
    }
    const formData = {
      ...masterData,
      isVoid: false,
      details: stockAdjustmentItems.map((item) => ({
        stockAdjustmentDetailId: item.stockAdjustmentDetailId ?? "",
        itemId: item.itemId ?? "",
        itemUOMId: item.itemUOMId ?? "",
        description: item.description ?? "",
        desc2: item.desc2 ?? "",
        qty: item.qty ?? 0,
        unitCost: item.unitCost ?? 0,
        subTotal: item.subTotal ?? 0,
      })),
      total: currentTotal
    };

    setConfirmModal({
      isOpen: true,
      action: "addPrint",
      data: formData,
    })
  }

  const handleSave = () => {
    if (stockAdjustmentItems.length <= 0 || masterData?.description === "") {
      setErrorModal({
        title: "Validation Error",
        message: "Missing Required Information to be Saved",
      });
      return;
    }
    const formData = {
      ...masterData,
      isVoid: false,
      details: stockAdjustmentItems.map((item) => ({
        stockAdjustmentDetailId: item.stockAdjustmentDetailId ?? "",
        itemId: item.itemId ?? "",
        itemUOMId: item.itemUOMId ?? "",
        description: item.description ?? "",
        desc2: item.desc2 ?? "",
        qty: item.qty ?? 0,
        unitCost: item.unitCost ?? 0,
        subTotal: item.subTotal ?? 0,
      })),
      total: currentTotal
    };
    setConfirmModal({
      isOpen: true,
      action: "add",
      data: formData,
    })
  }

const stockAdjustmentItemStore = new CustomStore({
          key: "stockAdjustmentDetailId",
          load: async () => {
              setSelectedItem(null)
              return {
                  data: stockAdjustmentItems ?? [],
                  totalCount: stockAdjustmentItems?.length,
              };
          },
          insert: async () => {
              setSelectedItem(null)
              return {
                data: stockAdjustmentItems ?? [],
                totalCount: stockAdjustmentItems?.length,
              }
          },
          remove: async (key) => {
              await handleRemoveRow(key)
              return {
                data: stockAdjustmentItems ?? [],
                totalCount: stockAdjustmentItems?.length,
              }
          },
          update: async (key, data) => {
              await handleEditRow(key, data)
              setSelectedItem(null)
              return {
                data: stockAdjustmentItems ?? [],
                totalCount: stockAdjustmentItems?.length,
              }
          }
      });

  return (
    <>
      <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
      <ConfirmationModal isOpen={confirmModal.isOpen} title={"Confirm Add"} message={"Are you sure you want to add Goods Transit?"} onConfirm={confirmAction} onCancel={() => setConfirmModal({ isOpen: false, type: "", targetUser: null })} />
      <NotificationModal isOpen={notifyModal.isOpen} message={notifyModal.message} onClose={() => setNotifyModal({ isOpen: false, message: "" })} />

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="items-center gap-1">
            <label htmlFor="StockAdjustmentDesc" className="font-medium text-secondary" >
              Description
            </label>
            <div className="justify-self-start w-full">

              <div className="flex justify-end gap-2">
                <textarea
                  id="stockAdjustmentDesc"
                  name="stockAdjustmentDesc"
                  rows={1}
                  className="border rounded p-2 w-full resize-none bg-white text-secondary"
                  placeholder="Stock Adjustment Description"
                  onChange={e => setMasterData(prev => ({ ...prev, description: e.target.value }))}
                  value={masterData?.description ?? ""}
                />

              </div>
            </div>
          </div>

          <div className="items-start gap-1">
            <label htmlFor="remark" className="font-medium text-secondary">Remark</label>
            <div></div>
            <textarea
              id="remark"
              name="remark"
              rows={4}
              className="border rounded p-1 w-full resize-none bg-white justify-self-end"
              placeholder="Enter remarks…"
              onChange={e => setMasterData(prev => ({ ...prev, remark: e.target.value }))}
              value={masterData?.remark ?? ""}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 items-center gap-1 justify-items-end content-start">

          <div className="flex flex-col gap-1 w-1/2 ">
            <label htmlFor="date" className="font-medium text-secondary">Date</label>
            <DatePicker
              selected={masterData?.docDate ?? new Date().toISOString().slice(0,10)}
              id="StockAdjustmentDate"
              name="StockAdjustmentDate"
              dateFormat="dd-MM-yyyy"
              className="border rounded p-1 w-full bg-white h-[34px]"
              onChange={e => setMasterData(prev => ({ ...prev, docDate: e.toISOString().slice(0, 10) }))}
            />

          </div>
        </div>
      </div>

      <div className="mt-3 bg-white shadow rounded">
        <TransactionItemDataGrid
            className={"p-2"}
            customStore={stockAdjustmentItemStore}
            gridRef={gridRef}
            onNew={handleAddNewRow}
            onSelect={onLookUpSelected}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
      </div>

      <div className="w-full mt-3 bg-white shadow rounded p-4 mb-4">
        <div className="w-full grid grid-cols-2 gap-6 items-start text-sm text-secondary font-medium">


          <div className="flex flex-col">
            
          </div>

          <div className="flex flex-col space-y-1">
            {[

              { label: "Total", value: currentTotal }
            ].map(({ label, value }) => (
              <div key={label} className="grid grid-cols-[auto,30%] gap-1">
                <label className="font-extrabold py-2 px-4 justify-self-end text-[15px]" >{label}</label>
               
                  <div className="border rounded px-5 py-2 bg-gray-100 w-full min-h-5 text-right">
                    {value.toFixed(2)}
                  </div>
              </div>
            ))}
          </div>

        </div>


      </div>
      <div className="bg-white border-t p-4 sticky bottom-0 flex flex-row place-content-between z-10">
        <div className="flex flex-row">
          <input
            type="text"
            placeholder="search"
            className="p-2 w-44 m-[2px]"
          />
          <button className="bg-red-600 flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
            Clear
          </button>

        </div>

        <div className="w-ful flex flex-row justify-end">
          <button onClick={handleSavePrint} className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
            Save & Print
          </button>
          <button onClick={handleSave} className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
            Save
          </button>
        </div>
      </div>
    </>
  )
}

export default StockAdjustment;