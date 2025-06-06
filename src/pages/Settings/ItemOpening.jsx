import { useEffect, useState } from "react";

import ErrorModal from "../../modals/ErrorModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import NotificationModal from "../../modals/NotificationModal";
import ProductOpeningDataGrid from "../../Components/DataGrid/Product/ProductOpeningDataGrid";
import { NewItemOpening, GetItemOpeningRecords, SaveItemOpening } from "../../api/maintenanceapi";

const ItemOpening = () => {
  const companyId = sessionStorage.getItem("companyId");
  const userId = sessionStorage.getItem("userId");
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: "", targetUser: null });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });

  useEffect(() => {
    fetchItemOpeningRecords();
  }, [])

  const fetchItemOpeningRecords = async () => {
    setLoading(true);
    try {
      const res = await GetItemOpeningRecords({ companyId: companyId, userId: userId, id: userId });
      if (res.success) {
        setRecords(res.data.itemOpeningBalances);
        setTotal(res.totalRecords);
      } else throw new Error(data.errorMessage, "Failed to get Product Opening Records");
    } catch (error) {
      setErrorModal({ title: "Error", message: error.message })
    } finally {
      setLoading(false);
    }
  }

  const onLookUpSelected = (newValue, rowData) => {
    let data = newValue;
    if (!data.itemOpeningBalanceId) {
      data = { ...rowData, ...newValue }
    }
    setRecords(prev => {
      const exists = prev.find(record => record.itemOpeningBalanceId === data.itemOpeningBalanceId);
      if (exists) {
        return prev.map(record =>
          record.itemOpeningBalanceId === data.itemOpeningBalanceId ? { ...record, ...data } : record
        );
      } else {
        return [...prev, data];
      }
    })
  }

  const handleAddNewRow = async () => {
    try {
      const res = await NewItemOpening({});
      if (res.success) {
        const newRecords = res.data;
        setRecords(prev => [...prev, newRecords]);
        return newRecords;
      } else throw new Error(res.errorMessage || "Failed to add new Product Opening");
    } catch (error) {
      setErrorModal({ title: "Failed to Add", message: error.message });
    }

  }

  const handleEditRow = async (key, changedData) => {
    setRecords(prev => {
      const exists = prev.find(record => record.itemOpeningBalanceId === key);
      if (exists) {
        return prev.map(record =>
          record.itemOpeningBalanceId === key ? { ...record, ...changedData } : record
        );
      } else {
        return [...prev, changedData];
      }
    })
  }

  const handleRemoveRow = async (key) => {
    setRecords(prev => prev.filter(record => record.itemOpeningBalanceId !== key));
  }

  const confirmAction = async () => {
    setConfirmModal({ isOpen: false, type: "", action: null });
    try {
      const actionData = {
        companyId: companyId,
        userId: userId,
        id: userId,
      }
      const res = await SaveItemOpening({ actionData: actionData, itemOpeningBalances: records });
      if (res.success) {
        setNotifyModal({ isOpen: true, message: "Item Opening updated successfully!" });
      } else throw new Error(res.errorMessage || "Failed to Update Item Opening");
    }catch(error){
      setErrorModal({title: "Error", message: error.message});
    }
    
  }

  const confirmationTitleMap = {
    update: "Confirm Update",
    delete: "Confirm Delete",
  };

  const confirmationMessageMap = {
    update: "Are you sure you want to update item opening?",
    delete: "Are you sure you want to delete item opening?",
  };

  return (
    <>
      <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
      <ConfirmationModal isOpen={confirmModal.isOpen} title={confirmationTitleMap[confirmModal.type] || "Confirm Action"} message={confirmationMessageMap[confirmModal.type] || "Are you sure?"} onConfirm={confirmAction} onCancel={() => setConfirmModal({ isOpen: false, type: "", targetUser: null })} />
      <NotificationModal isOpen={notifyModal.isOpen} message={notifyModal.message} onClose={() => setNotifyModal({ isOpen: false, message: "" })} />
      <div className="mt-2 p-2 bg-white h-[72vh] rounded-lg shadow overflow-hidden">

        <ProductOpeningDataGrid
          className={"p-2"}
          dataRecords={records}
          totalRecords={total}
          onNew={handleAddNewRow}
          onEdit={handleEditRow}
          onDelete={handleRemoveRow}
          onSelect={onLookUpSelected}
        />

      </div>

      <div className="absolute bottom-0 right-0 mr-4 mb-10 w-1/2 min-h-[50px]">
        <button className="bg-primary absolute right-0 text-white w-36 px-4 py-2 rounded hover:bg-primary/90"
          onClick={() => {
            setConfirmModal({
              isOpen: true,
              action: "update",
              type: "update",
              data: records,
            });
          }}
        >
          Save
        </button>
      </div>
    </>


  );
};

export default ItemOpening;