import { useState, useEffect, useRef, useCallback } from "react";
import DataGrid, {
  Paging,
  Selection,
  Scrolling,
  SearchPanel
} from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import DropDownBox from 'devextreme-react/drop-down-box';
import DatePicker from "react-datepicker";
import ErrorModal from "../../modals/ErrorModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import NotificationModal from "../../modals/NotificationModal";
import { getInfoLookUp } from "../../api/infolookupapi";
import { GetSpecificUser } from "../../api/userapi";
import TransactionItemWithDiscountDataGrid from "../../Components/DataGrid/Transactions/TransactionItemDataGridWithDisc";
import { SaveCreditor, NewCreditor, GetCreditor, GetItem } from "../../api/maintenanceapi";
import AddSupplierModal from "../../modals/MasterData/Supplier/AddSupplierModal";

import PurchaseInvoicePaymentModal from "../../modals/Transactions/PurcaseInvoicePaymentModal";
import { GetPurchaseInvoice, GetPurchaseInvoiceRecords, NewPurchaseInvoice, NewPurchaseInvoiceDetail, SavePurchaseInvoice } from "../../api/transactionapi";
import CustomInput from "../../Components/input/dateInput";
import { UserPlus } from "lucide-react";

const SupplierGridBoxDisplayExpr = (item) => item && `${item.creditorCode}`;
const PurchasePersonGridBoxDisplayExpr = (item) => item && `${item.userName}`;
const SupplierGridColumns = [
  { dataField: "creditorCode", caption: "Code", width: "30%" },
  { dataField: "companyName", caption: "Name", width: "50%" }
];
const PurchasePersonGridColumns = [
  { dataField: "userName", caption: "Name", width: "100%" }
];
const PurchaseInvoiceGridColumns = [
  { dataField: "docNo", caption: "Doc No", width: "40%" },
  {
    dataField: "docDate", caption: "Doc Date", calculateDisplayValue: (rowData) => {
      const date = new Date(rowData.docDate);
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    },
    width: "40%"
  },
  { dataField: "creditorCode", caption: "Code", width: "30%" },
  { dataField: "creditorName", caption: "Name", width: "50%" }
];

const PurchaseInvoice = () => {
  const companyId = sessionStorage.getItem("companyId");
  const userId = sessionStorage.getItem("userId");
  const [masterData, setMasterData] = useState(null);
  const [purchaseItem, setPurchaseItem] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tax, setTax] = useState("0.00");
  const [currentTotal, setCurrentTotal] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [balance, setBalance] = useState(0);

  const [SupplierGridBoxValue, setSupplierGridBoxValue] = useState({ creditorId: "", creditorCode: "", companyName: "" });
  const [isSupplierGridBoxOpened, setIsSupplierGridBoxOpened] = useState(false);
  const [isPurchasePersonGridBoxOpened, setIsPurchasePersonGridBoxOpened] = useState(false);
  const [PurchasePersonGridBoxValue, setPurchasePersonGridBoxValue] = useState({ id: "", Name: "" });
  const [newSupplier, setNewSupplier] = useState(null);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [selectedPurchaseInvoice, setSelectedPurchaseInvoice] = useState({ purchaseInvoiceId: "", docNo: "" });
  const [isPurchaseInvoiceGridBoxOpened, setIsPurchaseInvoiceGridBoxOpened] = useState(false);

  const [purchaseInvoicePayment, setPurchaseInvoicePayment] = useState(false);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: "", targetData: null });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });

  const gridRef = useRef(null);

  const [total, setTotal] = useState(0);

    useEffect(() => {
        const total = currentTotal + parseFloat(tax);
        setTotal(total);
    }, [currentTotal, tax]);

  useEffect(() => {
    createNewPruchaseInvoice();
  }, []);

  const createNewPruchaseInvoice = async () => {
    try {
      const res = await NewPurchaseInvoice({ companyId, userId, id: "" });
      if (res.success) {
        setMasterData(res.data);
      } else throw new Error(res.errorMessage || "Failed to add new Purchase Records");
    } catch (error) {
      setErrorModal({ title: "Failed to Add", message: error.message });
    }
  };

  const userStore = new CustomStore({
    key: "userId",

    load: async (loadOptions) => {
      const filter = loadOptions.filter;
      let keyword = filter?.[2] || "";

      const params = {
        keyword: keyword || "",
        offset: loadOptions.skip,
        limit: loadOptions.take,
        type: "user",
        companyId,
      };
      const res = await getInfoLookUp(params);
      return {
        data: res.data,
        totalCount: res.totalRecords,
      };
    },
    byKey: async (key) => {
      const res = await GetSpecificUser({
        companyId,
        userId,
        id: key
      });
      return res.data;
    },
  });

  const supplierStore = new CustomStore({
    key: "creditorId",

    load: async (loadOptions) => {
      const filter = loadOptions.filter;
      let keyword = filter?.[2][2] || "";

      const params = {
        keyword: keyword || "",
        offset: loadOptions.skip,
        limit: loadOptions.take,
        type: "creditor",
        companyId,
      };
      const res = await getInfoLookUp(params);
      return {
        data: res.data,
        totalCount: res.totalRecords,
      };
    },
    byKey: async (key) => {
      if (!key) return null;
      const res = await GetCreditor({
        companyId,
        userId,
        id: key
      });
      return res.data;
    },
  })

  const SupplierDataGridOnSelectionChanged = useCallback((e) => {
    const selected = e.selectedRowsData?.[0];
    if (selected) {
      setSupplierGridBoxValue({ creditorId: selected.creditorId, creditorCode: selected.creditorCode, companyName: selected.companyName });
      setIsSupplierGridBoxOpened(false);
    }
  }, []);

  const SupplierDataGridRender = useCallback(
    () => (
      <DataGrid
        dataSource={supplierStore}
        columns={SupplierGridColumns}
        hoverStateEnabled={true}
        showBorders={false}
        selectedRowKeys={SupplierGridBoxValue?.id}
        onSelectionChanged={SupplierDataGridOnSelectionChanged}
        height="300px"
        remoteOperations={{
          paging: true,
          filtering: true,
        }}
      >
        <Selection mode="single" />
        <Paging
          enabled={true}
          pageSize={10}
        />
        <Scrolling mode="infinite" />

        <SearchPanel
          visible={true}
          width="100%"
          highlightSearchText={true}
        />
      </DataGrid>
    ),
    [],
  );

  const handleSupplierGridBoxValueChanged = (e) => {
    if (!e.value) {
      setSupplierGridBoxValue({ creditorId: "", creditorCode: "", companyName: "" });
    }
  };

  const onSupplierGridBoxOpened = useCallback((e) => {
    if (e.name === 'opened') {
      setIsSupplierGridBoxOpened(e.value);
    }
  }, []);

  const PurchasePersonDataGridOnSelectionChanged = useCallback((e) => {
    const selected = e.selectedRowsData?.[0];
    if (selected) {
      setPurchasePersonGridBoxValue({ id: selected.userId, Name: selected.userName });
      setIsPurchasePersonGridBoxOpened(false);
    }
  }, []);

  const PurchasePersonDataGridRender = useCallback(
    () => (
      <DataGrid
        dataSource={userStore}
        columns={PurchasePersonGridColumns}
        hoverStateEnabled={true}
        showBorders={false}
        selectedRowKeys={PurchasePersonGridBoxValue?.id}
        onSelectionChanged={PurchasePersonDataGridOnSelectionChanged}
        height="300px"
        remoteOperations={{
          paging: true,
          filtering: true,
        }}
      >
        <Selection mode="single" />
        <Paging
          enabled={true}
          pageSize={10}
        />
        <Scrolling mode="infinite" />

        <SearchPanel
          visible={true}
          width="100%"
          highlightSearchText={true}
        />
      </DataGrid>
    ),
    [],
  );

  const handlePurchasePersonGridBoxValueChanged = (e) => {
    if (!e.value) {
      setPurchasePersonGridBoxValue({ id: "", Name: "" });
    }
  };

  const onPurchasePersonGridBoxOpened = useCallback((e) => {
    if (e.name === 'opened') {
      setIsPurchasePersonGridBoxOpened(e.value);
    }
  }, []);

  const getNextSupplierCode = async () => {
    const newSupRes = await NewCreditor({
      companyId: companyId,
      userId: userId,
      id: userId,
    });
    setNewSupplier(newSupRes.data);
  };

  const handleNewSupplierModal = async () => {
    await getNextSupplierCode()
    setShowSupplierModal(true)
  }

  const handleCloseUpdateModal = async () => {
    setNewSupplier(null);
    setShowSupplierModal(false);
  }

  const onLookUpSelected = (newValue, rowData) => {
    let data = newValue;
    if (!data.purchaseInvoiceDetailId) {
      data = { ...rowData, ...newValue }
    }
    setPurchaseItem(prev => {
      const exists = prev.find(record => record.purchaseInvoiceDetailId === data.purchaseInvoiceDetailId);

      const updatedData = { ...data };

      const qty = Number(updatedData.qty) || 0;
      const unitPrice = Number(updatedData.price) || 0;
      const isDiscByPercent = updatedData.discount;
      const discAmt = Number(updatedData.discountAmount) || 0;
      const totalAmount = qty * unitPrice;

      updatedData.subTotal = totalAmount - (isDiscByPercent ? totalAmount * (discAmt / 100) : discAmt);

      if (exists) {
        return prev.map(record =>
          record.purchaseInvoiceDetailId === data.purchaseInvoiceDetailId ? { ...record, ...updatedData } : record
        );
      } else {
        return [...prev, updatedData];
      }
    })
  };

  const handleAddNewRow = async () => {
    if (SupplierGridBoxValue?.id === "") {
      setErrorModal({ title: "Failed to Add Item", message: "Please Select a Supplier to proceed" });
      return;
    }
    try {
      const res = await NewPurchaseInvoiceDetail({});
      if (res.success) {
        const newRecords = res.data;
        setPurchaseItem(prev => [...prev, newRecords]);
      } else throw new Error(res.errorMessage || "Failed to add new Purchase Details");
    } catch (error) {
      setErrorModal({ title: "Failed to Add", message: error.message });
    }
  }

  const handleEditRow = async (key, changedData) => {
    setPurchaseItem(prev => {
      return prev.map(record => {
        if (record.purchaseInvoiceDetailId === key) {
          const updatedRecord = { ...record, ...changedData };

          if ('qty' in changedData || 'price' in changedData || 'discount' in changedData || 'discountAmount' in changedData) {
            const qty = Number(updatedRecord.qty) || 0;
            const unitPrice = Number(updatedRecord.price) || 0;
            const isDiscByPercent = updatedRecord.discount;
            const discAmt = Number(updatedRecord.discountAmount || 0)
            const totalAmount = qty * unitPrice;
            updatedRecord.subTotal = totalAmount - (isDiscByPercent ? totalAmount * (discAmt / 100) : discAmt);
          }

          return updatedRecord;
        }
        return record;
      });
    });
  };

  useEffect(() => {
    const total = purchaseItem?.reduce((sum, item) => {
      return sum + (Number(item.subTotal) || 0);
    }, 0);
    const bal = total - paidAmount + parseFloat(tax);
    setBalance(bal);
    setCurrentTotal(total);
  }, [handleEditRow, purchaseItem, paidAmount])

  const handleRemoveRow = async (key) => {
    setPurchaseItem(prev => prev.filter(record => record.purchaseInvoiceDetailId !== key));
  }

  const confirmAction = async () => {
    if (confirmModal?.action === "clear") {
      setConfirmModal({ isOpen: false, action: "", data: null });
      await createNewPruchaseInvoice()
      setSupplierGridBoxValue({ creditorId: "", creditorCode: "", companyName: "" })
      setPurchasePersonGridBoxValue({ id: "", Name: "" })
      setSelectedPurchaseInvoice({ purchaseInvoiceId: "", docNo: "" })
      setPurchaseItem([]);
      setCurrentTotal(0);
      return;
    }
    try {
      const res = await SavePurchaseInvoice({ ...confirmModal.data });
      if (res.success) {
        setNotifyModal({ isOpen: true, message: "Purchase Invoice added successfully!" });
      } else throw new Error(res.errorMessage || "Failed to Add Purchase Invoice");
    } catch (error) {
      setErrorModal({ title: "Error", message: error.message });
      await createNewPruchaseInvoice()
      setSupplierGridBoxValue({ creditorId: "", creditorCode: "", companyName: "" })
      setPurchasePersonGridBoxValue({ id: "", Name: "" })
      setPurchaseItem([]);
      setCurrentTotal(0);
    }
    if (confirmModal.action === "addPrint") {
      console.log("print acknowledgement");
    }
    setConfirmModal({ isOpen: false, action: "", data: null });
    await createNewPruchaseInvoice()
    setSupplierGridBoxValue({ creditorId: "", creditorCode: "", companyName: "" })
    setPurchasePersonGridBoxValue({ id: "", Name: "" })
    setPurchaseItem([]);
    setCurrentTotal(0);
  }

  const handleClear = () => {
    setConfirmModal({
      isOpen: true,
      action: "clear",
    })
  }

  const confirmationTitleMap = {
    add: "Confirm New",
    clear: "Confirm Clear"
  };

  const confirmationMessageMap = {
    add: "Are you sure you want to add Purchase Invoice?",
    clear: "Are you sure you want to clear this page input?"
  };

  const handleSavePrint = () => {
    if (purchaseItem.length <= 0) {
      return;
    }
    const formData = {
      ...masterData,
      isVoid: false,
      creditorId: SupplierGridBoxValue?.id,
      creditorName: SupplierGridBoxValue?.Name,
      purchasePersonUserID: PurchasePersonGridBoxValue.id,
      details: purchaseItem.map((item) => ({
        purchaseInvoiceDetailId: item.purchaseInvoiceDetailId ?? "",
        itemId: item.itemId ?? "",
        itemUOMId: item.itemUOMId ?? "",
        description: item.description ?? "",
        desc2: item.desc2 ?? "",
        qty: item.qty ?? 0,
        unitPrice: item.price ?? 0,
        discount: item.discount ? "percent" : "rate" ?? "rate",
        discountAmount: item.discountAmount ?? 0,
        subTotal: item.subTotal ?? 0
      })),
      tax: tax ?? 0,
      total: currentTotal,
    }
    setConfirmModal({
      isOpen: true,
      action: "addPrint",
      data: formData,
    })
  }

  const handleSave = () => {
    if (purchaseItem.length <= 0) {
      return;
    }
    const formData = {
      ...masterData,
      isVoid: false,
      creditorId: SupplierGridBoxValue?.creditorId,
      creditorName: SupplierGridBoxValue?.companyName,
      purchasePersonUserID: PurchasePersonGridBoxValue.id,
      details: purchaseItem.map((item) => ({
        purchaseInvoiceDetailId: item.purchaseInvoiceDetailId ?? "",
        itemId: item.itemId ?? "",
        itemUOMId: item.itemUOMId ?? "",
        description: item.description ?? "",
        desc2: item.desc2 ?? "",
        qty: item.qty ?? 0,
        unitPrice: item.price ?? 0,
        discount: item.discount ? "percent" : "rate" ?? "rate",
        discountAmount: item.discountAmount ?? 0,
        subTotal: item.subTotal ?? 0
      })),
      tax: tax ?? 0,
      total: currentTotal,
    }
    setConfirmModal({
      isOpen: true,
      action: "add",
      data: formData,
    })
  }

  const handleSaveAfterPayment = async ({ action }) => {
    if (purchaseItem.length <= 0) {
      return;
    }
    const formData = {
      ...masterData,
      isVoid: false,
      creditorId: SupplierGridBoxValue?.creditorId,
      creditorName: SupplierGridBoxValue?.companyName,
      purchasePersonUserID: PurchasePersonGridBoxValue.id,
      details: purchaseItem.map((item) => ({
        purchaseInvoiceDetailId: item.purchaseInvoiceDetailId ?? "",
        itemId: item.itemId ?? "",
        itemUOMId: item.itemUOMId ?? "",
        description: item.description ?? "",
        desc2: item.desc2 ?? "",
        qty: item.qty ?? 0,
        unitPrice: item.price ?? 0,
        discount: item.discount ? "percent" : "rate" ?? "rate",
        discountAmount: item.discountAmount ?? 0,
        subTotal: item.subTotal ?? 0
      })),
      tax: tax ?? 0,
      total: currentTotal,
    }
    const res = await SavePurchaseInvoice(formData);
    if (!res.success) {
      setErrorModal({ title: "Failed to Save", message: res?.errorMessage });
    }
    if (action === "save-print") {
      console.log("print acknowledgement");
    }
    await createNewPruchaseInvoice()
    setSupplierGridBoxValue({ creditorId: "", creditorCode: "", companyName: "" })
    setPurchasePersonGridBoxValue({ id: "", Name: "" })
    setPurchaseItem([]);
    setCurrentTotal(0);
    return;
  }

  const confirmAddSupplierAction = async ({ action, data }) => {
    setConfirmModal({ isOpen: false, action: null });
    try {
      const saveRes = await SaveCreditor({
        actionData: data.actionData,
        creditorId: data.creditorId,
        creditorCode: data.creditorCode,
        companyName: data.companyName,
        isActive: data.isActive,
        registrationNo: data.registrationNo,
        attention: data.attention || null,
        address: data.address,
        remark: data.remark,
        phone1: data.phone1,
        phone2: data.phone2,
        emailAddress: data.emailAddress,
      });
      if (saveRes.success) {
        setShowSupplierModal(false);
        setNotifyModal({ isOpen: true, message: "Customer saved successfully!" });
        setNewSupplier(null);
      } else throw new Error(saveRes.errorMessage || "Failed to save customer.");

    } catch (error) {
      setErrorModal({ title: `Save Error`, message: error.message });
    } finally {
      setShowSupplierModal(false);
    }
  };

  const purchaseItemStore = new CustomStore({
    key: "purchaseInvoiceDetailId",
    load: async () => {
      setSelectedItem(null)
      return {
        data: purchaseItem ?? [],
        totalCount: purchaseItem?.length,
      };
    },
    insert: async () => {
      setSelectedItem(null)
      return {
        data: purchaseItem ?? [],
        totalCount: purchaseItem?.length,
      }
    },
    remove: async (key) => {
      await handleRemoveRow(key)
      return {
        data: purchaseItem ?? [],
        totalCount: purchaseItem?.length,
      }
    },
    update: async (key, data) => {
      await handleEditRow(key, data)
      setSelectedItem(null)
      return {
        data: purchaseItem ?? [],
        totalCount: purchaseItem?.length,
      }
    }
  })

  const handlePurchaseInvoiceGridBoxValueChanged = (e) => {
    if (!e.value) {
      setSelectedPurchaseInvoice({ purchaseInvoiceId: "", docNo: "" });
    }
  }

  const purchaseInvoiceStore = new CustomStore({
    key: "purchaseInvoiceId",
    load: async (loadOptions) => {
      const filter = loadOptions.filter;
      let keyword = filter?.[2][2] || "";

      const res = await GetPurchaseInvoiceRecords({
        keyword: keyword || "",
        offset: loadOptions.skip,
        limit: loadOptions.take,
        companyId,
        fromDate: "1970-01-01T00:00:00",
        toDate: new Date()
      });
      return {
        data: res.data,
        totalCount: res.totalRecords
      }
    },
    byKey: async (key) => {
      const res = await GetPurchaseInvoice({
        companyId,
        userId,
        id: key
      });
      return res.data
    }
  })

  const onPurchaseInvoiceGridBoxOpened = useCallback((e) => {
    if (e.name === 'opened') {
      setIsPurchaseInvoiceGridBoxOpened(e.value);
    }
  }, [])

  const PurchaseInvoiceDataGridOnSelectionChanged = useCallback(async (e) => {
    const selected = e.selectedRowKeys?.[0];
    if (selected) {
      const recordRes = await GetPurchaseInvoice({
        companyId,
        userId,
        id: selected
      })
      setSelectedPurchaseInvoice({ purchaseInvoiceId: selected, docNo: recordRes.data?.docNo })
      setSupplierGridBoxValue({ creditorId: recordRes.data?.creditorId, creditorCode: recordRes.data?.creditorCode, companyName: recordRes.data?.creditorName })
      setPurchasePersonGridBoxValue({ id: recordRes.data?.purchasePersonUserID })
      setMasterData(recordRes.data)
      const details = recordRes?.data?.details ?? [];
      const paidAmount = (recordRes.data?.payments ?? []).reduce((sum, payment) => {
        const detailSum = (payment.details ?? []).reduce((dSum, item) => {
          return dSum + (Number(item.amount) || 0);
        }, 0);
        return sum + detailSum;
      }, 0);
      setPaidAmount(paidAmount);
      const enrichedItems = await Promise.all(
        details.map(async (item) => {
          if (!item.itemCode && !item.uom) {
            try {
              const res = await GetItem({
                companyId,
                userId,
                id: item.itemId
              });
              return {
                ...item,
                itemCode: res.data.itemCode,
                uom: res.data.itemUOM?.uom,

              };
            } catch (error) {
              console.error("Failed to fetch item info:", error);
            }
          }
          return item;
        })
      )
      setPurchaseItem(enrichedItems);
    }
    setIsPurchaseInvoiceGridBoxOpened(false);
  }, []);

  const PurchaseInvoiceDataGridRender = useCallback(
    () => (
      <DataGrid
        key={selectedPurchaseInvoice?.purchaseInvoiceId}
        dataSource={purchaseInvoiceStore}
        columns={PurchaseInvoiceGridColumns}
        hoverStateEnabled={true}
        showBorders={true}
        selectedRowKeys={selectedPurchaseInvoice?.purchaseInvoiceId}
        onSelectionChanged={PurchaseInvoiceDataGridOnSelectionChanged}
        height="300px"
        remoteOperations={{
          paging: true,
          filtering: true,
        }}
      >
        <Selection mode="single" />
        <Paging
          enabled={true}
          pageSize={10}
        />
        <Scrolling mode="infinite" />

        <SearchPanel
          visible={true}
          width="100%"
          highlightSearchText={true}
        />
      </DataGrid>
    ), [selectedPurchaseInvoice, PurchaseInvoiceDataGridOnSelectionChanged]
  )


  return (
    <>
      <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
      <ConfirmationModal isOpen={confirmModal.isOpen} title={confirmationTitleMap[confirmModal.action]} message={confirmationMessageMap[confirmModal.action]} onConfirm={confirmAction} onCancel={() => setConfirmModal({ isOpen: false, type: "", targetUser: null })} />
      <NotificationModal isOpen={notifyModal.isOpen} message={notifyModal.message} onClose={() => setNotifyModal({ isOpen: false, message: "" })} />

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="items-center gap-1">
            <label htmlFor="supplier" className="font-medium text-secondary" >
              Supplier
            </label>
            <div className="justify-self-start w-full">

              <div className="flex justify-end gap-2">
                <DropDownBox
                  id="SupplierSelection"
                  className="border rounded p-1 w-1/2 h-[34px]"
                  value={SupplierGridBoxValue?.creditorId ?? ""}
                  opened={isSupplierGridBoxOpened}
                  openOnFieldClick={true}
                  valueExpr='creditorId'
                  displayExpr={SupplierGridBoxDisplayExpr}
                  placeholder="Select Supplier"
                  showClearButton={true}
                  onValueChanged={handleSupplierGridBoxValueChanged}
                  dataSource={supplierStore}
                  onOptionChanged={onSupplierGridBoxOpened}
                  contentRender={SupplierDataGridRender}
                  dropDownOptions={{
                    width: 400
                  }}
                />
                <textarea
                  id="SupplierName"
                  name="SupplierName"
                  rows={1}
                  className="border rounded p-2 w-full resize-none bg-white text-secondary"
                  placeholder="Name"
                  onChange={(e) => { setSupplierGridBoxValue(prev => ({ ...prev, companyName: e.target.value })) }}
                  value={SupplierGridBoxValue?.companyName}
                />
                <div className="relative group">
                  <button
                    className="items-center h-[34px] text-secondary hover:bg-grey-500 hover:text-primary flex"
                    onClick={handleNewSupplierModal}
                  >
                    <UserPlus />
                  </button>
                  <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    Add New Supplier
                  </span>
                </div>
              </div>
            </div>
          </div>

          {showSupplierModal && (
            <AddSupplierModal
              selectedSupplier={newSupplier}
              isEdit={false}
              isOpen={showSupplierModal}
              onConfirm={confirmAddSupplierAction}
              onError={setErrorModal}
              onClose={handleCloseUpdateModal}
            />
          )}


          <div className="items-start gap-1">
            <label htmlFor="remark" className="font-medium text-secondary">Remark</label>
            <div></div>
            <textarea
              id="remark"
              name="remark"
              rows={6}
              className="border rounded p-1 w-full resize-none bg-white justify-self-end"
              placeholder="Enter remarks…"
              onChange={e => setMasterData(prev => ({ ...prev, remark: e.target.value }))}
              value={masterData?.remark ?? ""}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 mt-[-18px] items-center gap-1">
          <div className="flex flex-col gap-1">
            <label htmlFor="refNo" className="font-medium text-secondary">Supplier Ref</label>
            <input
              type="text"
              id="supplierRef"
              name="supplierRef"
              className="border rounded p-1 w-full bg-white h-[34px]"
              placeholder="Supplier Ref"
              onChange={e => setMasterData(prev => ({ ...prev, supplierRef: e.target.value }))}
              value={masterData?.supplierRef ?? ""}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="refNo" className="font-medium text-secondary">Ref No.</label>
            <input
              type="text"
              id="refNo"
              name="refNo"
              className="border rounded p-1 w-full bg-white h-[34px]"
              placeholder="Ref No"
              onChange={e => setMasterData(prev => ({ ...prev, refNo: e.target.value }))}
              value={masterData?.refNo ?? ""}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="purchasePerson" className="font-medium text-secondary">Purchase Person</label>
            <DropDownBox
              id="PurchasePersonSelection"
              className="border rounded w-full"
              value={PurchasePersonGridBoxValue?.id}
              opened={isPurchasePersonGridBoxOpened}
              openOnFieldClick={true}
              valueExpr='userId'
              displayExpr={PurchasePersonGridBoxDisplayExpr}
              placeholder="Select Purchase Person"
              showClearButton={true}
              onValueChanged={handlePurchasePersonGridBoxValueChanged}
              dataSource={userStore}
              onOptionChanged={onPurchasePersonGridBoxOpened}
              contentRender={PurchasePersonDataGridRender}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="date" className="font-medium text-secondary">Date</label>
            <DatePicker
              customInput={<CustomInput />}
              selected={masterData?.docDate ?? new Date().toISOString().slice(0, 10)}
              id="PurchaseDate"
              name="PurchaseDate"
              dateFormat="dd-MM-yyyy"
              className="border rounded p-1 w-full bg-white h-[34px]"
              onChange={e => setMasterData(prev => ({ ...prev, docDate: e }))}
            />

          </div>
          <div className="flex flex-col gap-1 invisible">

          </div>
          <div className="flex flex-col gap-1 invisible">

          </div>



        </div>
      </div>

      <div className="mt-3 p-3 bg-white shadow rounded">
        <TransactionItemWithDiscountDataGrid
          height={400}
          className={"p-2"}
          customStore={purchaseItemStore}
          gridRef={gridRef}
          onNew={handleAddNewRow}
          onSelect={onLookUpSelected}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      </div>

      <div className="w-full mt-3 bg-white shadow rounded p-4 mb-4 overflow-y-auto">
        <div className="w-full grid grid-cols-3 gap-6 items-start text-sm text-secondary font-medium">


          <div className="flex flex-col">

          </div>

          <div className="flex flex-col space-y-1">
            {[
              { label: "Paid", value: paidAmount },
              { label: "Outstanding", value: balance },
            ].map(({ label, value }) => (
              <div key={label} className="grid grid-cols-[auto,30%] gap-1">
                {label === "Outstanding"
                  ? (<label className="font-extrabold py-2 px-4 justify-self-end text-[15px]" >{value >= 0 ? label : "Change"}</label>)
                  : (<label className="font-extrabold py-2 px-4 justify-self-end text-[15px]" >{label}</label>)
                }
                <div className="border rounded px-5 py-2 bg-gray-100 w-full min-h-5 text-right">
                  {Math.abs(value)?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col space-y-1">
            {[
              { label: "Subtotal", value: currentTotal },
              { label: "Tax", value: tax },
              { label: "Total", value: total }
            ].map(({ label, value }) => (
              <div key={label} className="grid grid-cols-[auto,30%] gap-1">
                <label className="font-extrabold py-2 px-4 justify-self-end text-[15px]" >{label}</label>
                {label === "Tax" ? (
                  <input
                    type="number"
                    step="0.01"
                    value={value}
                    onChange={(e) => setTax(e.target.value)}
                    onBlur={() => {
                      const parsed = parseFloat(tax);
                      setTax(isNaN(parsed) ? "0.00" : parsed.toFixed(2));
                    }}
                    className=" border rounded px-5 py-2 bg-white w-full min-h-5 text-right "
                  />

                ) : (
                  <div className="border rounded px-5 py-2 bg-gray-100 w-full min-h-5 text-right">
                    {value.toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>


      </div>
      <div className="bg-white border-t p-4 sticky bottom-0 flex flex-row place-content-between z-10">
        <div className="flex flex-row">
          <DropDownBox
            id="PurchaseInvoiceSelection"
            className="border rounded w-full"
            value={selectedPurchaseInvoice?.purchaseInvoiceId}
            opened={isPurchaseInvoiceGridBoxOpened}
            openOnFieldClick={true}
            valueExpr={"purchaseInvoiceId"}
            displayExpr={(item) => item && `${item.docNo ?? ""}`}
            placeholder="Search"
            showClearButton={false}
            showDropDownButton={true}
            onValueChanged={handlePurchaseInvoiceGridBoxValueChanged}
            dataSource={purchaseInvoiceStore}
            onOptionChanged={onPurchaseInvoiceGridBoxOpened}
            contentRender={PurchaseInvoiceDataGridRender}
            dropDownOptions={{
              width: 500
            }}
          />
          <button onClick={handleClear} className="bg-red-600 flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
            Clear
          </button>

        </div>

        <div className="w-ful flex flex-row justify-end">
          {/* <button className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]"
            onClick={() => setPurchaseInvoicePayment(true)}>
            Payment
          </button> */}
          <button onClick={handleSavePrint} className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
            Save & Print
          </button>
          <button onClick={handleSave} className="bg-primary flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
            Save
          </button>
        </div>

        <PurchaseInvoicePaymentModal
          isOpen={purchaseInvoicePayment}
          onClose={() => setPurchaseInvoicePayment(false)}
          total={balance}
          companyId={companyId}
          userId={userId}
          purchaseInvoiceId={masterData?.purchaseInvoiceId}
          onError={setErrorModal}
          onSave={handleSaveAfterPayment}
        />
      </div>
    </>
  )
}

export default PurchaseInvoice;