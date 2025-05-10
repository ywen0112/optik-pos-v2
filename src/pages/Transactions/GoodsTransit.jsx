import { useEffect, useState, useRef, useCallback } from "react";
import DatePicker from "react-datepicker";
import CustomStore from 'devextreme/data/custom_store';
import ErrorModal from "../../modals/ErrorModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import NotificationModal from "../../modals/NotificationModal";
import { GetGoodsTransitRecords, GetGoodsTransit, NewGoodsTransit, NewGoodsTransitDetail, SaveGoodsTransit } from "../../api/transactionapi";
import TransactionItemDataGrid from "../../Components/DataGrid/Transactions/TransactionItemDataGrid";
import CustomInput from "../../Components/input/dateInput";
import { DropDownBox } from "devextreme-react";
import DataGrid, {
  Paging,
  Selection,
  Scrolling,
  SearchPanel
} from 'devextreme-react/data-grid';
import { GetItem } from "../../api/maintenanceapi";

const GoodsTransit = () => {
  const companyId = sessionStorage.getItem("companyId");
  const userId = sessionStorage.getItem("userId");
  const [masterData, setMasterData] = useState(null);
  const [goodsTransitItems, setGoodsTransitItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentTotalCost, setCurrentTotalCost] = useState(0);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: "", targetData: null });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });

  const [selectedGoodsTransit, setSelectedGoodsTransit] = useState({ goodsTransitId: "", description: "" })
  const [isGoodsTransitGridBoxOpened, setIsGoodsTransitGridBoxOpened] = useState(false)

  const gridRef = useRef(null)

  useEffect(() => {
    newGoodsTransitRecords()
  }, []);

  const handleGoodsTransitGridBoxValueChanged = (e) => {
    if (!e.value) {
      setSelectedGoodsTransit({ goodsTransitId: "", description: "" })
    }
  }

  const GoodsTransitDataGridOnSelectionChanged = useCallback(async (e) => {
    const selected = e.selectedRowKeys?.[0];
    if (selected) {
      const recordRes = await GetGoodsTransit({
        companyId,
        userId,
        id: selected
      });

      setSelectedGoodsTransit({ goodsTransitId: selected, description: recordRes.data?.description });

      const details = recordRes?.data?.details ?? [];

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
                uom: res.data.itemUOM?.uom
              };
            } catch (error) {
              console.error("Failed to fetch item info:", error);
            }
          }
          return item;
        })
      );
      setMasterData(recordRes.data);
      setGoodsTransitItems(enrichedItems);
      setIsGoodsTransitGridBoxOpened(false);
    }
  }, []);

  const onGoodsTransitGridBoxOpened = useCallback((e) => {
    if (e.name === 'opened') {
      setIsGoodsTransitGridBoxOpened(e.value);
    }
  }, []);

  const goodsTransitStore = new CustomStore({
    key: "goodsTransitId",
    load: async (loadOptions) => {
      const filter = loadOptions.filter;
      let keyword = filter?.[2] || "";

      const res = await GetGoodsTransitRecords({
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
      const res = await GetGoodsTransit({
        companyId,
        userId,
        id: key
      });
      return res.data
    }
  })

  const goodsTransitGridColumns = [
    { dataField: "docNo", caption: "Doc No" },
    {
      dataField: "docDate", caption: "Doc Date", calculateDisplayValue: (rowData) => {
        const date = new Date(rowData.docDate);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
      }
    }
  ];

  const GoodsTransitDataGridRender = useCallback(
    () => (
      <DataGrid
        dataSource={goodsTransitStore}
        columns={goodsTransitGridColumns}
        hoverStateEnabled={true}
        showBorders={true}
        selectedRowKey={selectedGoodsTransit?.goodsTransitId}
        onSelectionChanged={GoodsTransitDataGridOnSelectionChanged}
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
    ), [selectedGoodsTransit, GoodsTransitDataGridOnSelectionChanged]
  );

  const newGoodsTransitRecords = async () => {
    try {
      const res = await NewGoodsTransit({ companyId: companyId, userId: userId, id: userId });
      if (res.success) {
        setMasterData(res.data);
      } else throw new Error(res.errorMessage || "Failed to add new Goods Transit Records");
    } catch (error) {
      setErrorModal({ title: "Failed to Add", message: error.message });
    }
  }

  const onLookUpSelected = (newValue, rowData) => {
    let data = newValue;
    if (!data.goodsTransitDetailId) {
      data = { ...rowData, ...newValue }
    }
    setGoodsTransitItems(prev => {
      const exists = prev.find(record => record.goodsTransitDetailId === data.goodsTransitDetailId);
      if (exists) {
        const updatedData = { ...data };
        const qty = Number(updatedData.qty) || 0;
        const unitCost = Number(updatedData.unitCost) || 0;
        updatedData.subTotal = qty * unitCost;
        return prev.map(record =>
          record.goodsTransitDetailId === data.goodsTransitDetailId ? { ...record, ...updatedData } : record
        );
      } else {
        return [...prev, updatedData];
      }
    })
  };

  const handleAddNewRow = async () => {
    try {
      const res = await NewGoodsTransitDetail({});
      if (res.success) {
        const newRecords = res.data;
        setGoodsTransitItems(prev => [...prev, newRecords]);
        return newRecords;
      } else throw new Error(res.errorMessage || "Failed to add new Goods Transit Details");
    } catch (error) {
      setErrorModal({ title: "Failed to Add", message: error.message });
    }
  }

  const handleEditRow = async (key, changedData) => {
    setGoodsTransitItems(prev => {
      return prev.map(record => {
        if (record.goodsTransitDetailId === key) {
          // Merge updated data with existing record
          const updatedRecord = { ...record, ...changedData };

          // If qty or unitCost was changed, recalculate subTotal
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
    const total = goodsTransitItems?.reduce((sum, item) => {
      return sum + (Number(item.subTotal) || 0);
    }, 0);

    setCurrentTotalCost(total);
  }, [handleEditRow])


  const handleRemoveRow = async (key) => {
    setGoodsTransitItems(prev => prev.filter(record => record.goodsTransitDetailId !== key));
  }

  const confirmAction = async () => {
    if (confirmModal.action === "clear") {
      setConfirmModal({ isOpen: false, action: "", data: null });
      await newGoodsTransitRecords();
      setGoodsTransitItems([]);
      setCurrentTotalCost(0);
      setSelectedGoodsTransit({ goodsTransitId: "", description: "" });
      return; // ✅ prevent the rest of the function from running
    }

    try {
      const res = await SaveGoodsTransit({ ...confirmModal.data });
      if (res.success) {
        setNotifyModal({ isOpen: true, message: "Goods Transit added successfully!" });
      } else {
        throw new Error(res.errorMessage || "Failed to Add Goods Transit");
      }
    } catch (error) {
      setErrorModal({ title: "Error", message: error.message });
      await newGoodsTransitRecords(); // Optional: maybe remove this too depending on your needs
    }

    if (confirmModal.action === "addPrint") {
      console.log("print acknowledgement");
    }

    setConfirmModal({ isOpen: false, action: "", data: null });

    await newGoodsTransitRecords();
    setGoodsTransitItems([]);
    setCurrentTotalCost(0);
  };


  const handleClear = () => {
    setConfirmModal({
      isOpen: true,
      action: "clear",
    })
  }

  const handleSavePrint = () => {
    if (goodsTransitItems.length <= 0 || masterData?.description === "" || masterData?.fromLocation === "" || masterData?.toLocation === "") {
      setErrorModal({
        title: "Validation Error",
        message: "Missing Required Information to be Saved",
      });
      return;
    }
    const formData = {
      ...masterData,
      isVoid: false,
      details: goodsTransitItems.map((item) => ({
        goodsTransitDetailId: item.goodsTransitDetailId ?? "",
        itemId: item.itemId ?? "",
        itemUOMId: item.itemUOMId ?? "",
        description: item.description ?? "",
        desc2: item.desc2 ?? "",
        qty: item.qty ?? 0,
        unitCost: item.unitCost ?? 0,
        subTotal: item.subTotal ?? 0,
      })),
      total: currentTotalCost
    }

    setConfirmModal({
      isOpen: true,
      action: "addPrint",
      data: formData,
    });
  }

  const handleSave = async () => {
    if (goodsTransitItems.length <= 0 || masterData?.description === "" || masterData?.fromLocation === "" || masterData?.toLocation === "") {
      setErrorModal({
        title: "Validation Error",
        message: "Missing Required Information to be Saved",
      });
      return;
    }
    const formData = {
      ...masterData,
      isVoid: false,
      details: goodsTransitItems.map((item) => ({
        goodsTransitDetailId: item.goodsTransitDetailId ?? "",
        itemId: item.itemId ?? "",
        itemUOMId: item.itemUOMId ?? "",
        description: item.description ?? "",
        desc2: item.desc2 ?? "",
        qty: item.qty ?? 0,
        unitCost: item.unitCost ?? 0,
        subTotal: item.subTotal ?? 0,
      })),
      total: currentTotalCost
    }

    setConfirmModal({
      isOpen: true,
      action: "add",
      data: formData,
    });
  }

  const goodsTransitItemStore = new CustomStore({
    key: "goodsTransitDetailId",
    load: async () => {
      setSelectedItem(null)
      return {
        data: goodsTransitItems ?? [],
        totalCount: goodsTransitItems?.length,
      };
    },
    insert: async () => {
      setSelectedItem(null)
      return {
        data: goodsTransitItems ?? [],
        totalCount: goodsTransitItems?.length,
      }
    },
    remove: async (key) => {
      await handleRemoveRow(key)
      return {
        data: goodsTransitItems ?? [],
        totalCount: goodsTransitItems?.length,
      }
    },
    update: async (key, data) => {
      await handleEditRow(key, data)
      setSelectedItem(null)
      return {
        data: goodsTransitItems ?? [],
        totalCount: goodsTransitItems?.length,
      }
    }
  });

  const confirmationTitleMap = {
    add: "Confirm New",
    clear: "Confirm Clear"
  };

  const confirmationMessageMap = {
    add: "Are you sure you want to add Good Transit?",
    clear: "Are you sure you want to clear this page input?"
  };

  return (
    <>
      <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
      <ConfirmationModal isOpen={confirmModal.isOpen} title={confirmationTitleMap[confirmModal.action]} message={confirmationMessageMap[confirmModal.action]} onConfirm={confirmAction} onCancel={() => setConfirmModal({ isOpen: false, type: "", targetUser: null })} />
      <NotificationModal isOpen={notifyModal.isOpen} message={notifyModal.message} onClose={() => setNotifyModal({ isOpen: false, message: "" })} />
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="items-center gap-1">
            <label htmlFor="goodsTransitDesc" className="font-medium text-secondary" >
              Description
            </label>
            <div className="justify-self-start w-full">

              <div className="flex justify-end gap-2">
                <textarea
                  id="goodsTransitDesc"
                  name="goodsTransitDesc"
                  rows={1}
                  className="border rounded p-2 w-full resize-none bg-white text-secondary"
                  placeholder="Goods Transit Description"
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
              customInput={<CustomInput />}
              selected={masterData?.docDate ?? new Date().toISOString().slice(0, 10)}
              id="docDate"
              name="docDate"
              dateFormat="dd-MM-yyyy"
              className="border rounded p-1 w-full bg-white h-[34px]"
              onChange={e => setMasterData(prev => ({ ...prev, docDate: e }))}
            />

          </div>

          <div className="items-center gap-1 w-1/2">
            <label htmlFor="fromLocation" className="font-medium text-secondary" >
              From
            </label>
            <div className="justify-self-start w-full">

              <div className="flex justify-end gap-2">
                <textarea
                  id="fromLocation"
                  name="fromLocation"
                  rows={1}
                  className="border rounded p-2 w-full resize-none bg-white text-secondary"
                  placeholder="From"
                  onChange={e => setMasterData(prev => ({ ...prev, fromLocation: e.target.value }))}
                  value={masterData?.fromLocation ?? ""}
                />

              </div>
            </div>
          </div>

          <div className="items-center gap-1 w-1/2">
            <label htmlFor="toLocation" className="font-medium text-secondary" >
              To
            </label>
            <div className="justify-self-start w-full">

              <div className="flex justify-end gap-2">
                <textarea
                  id="toLocation"
                  name="toLocation"
                  rows={1}
                  className="border rounded p-2 w-full resize-none bg-white text-secondary"
                  placeholder="To"
                  onChange={e => setMasterData(prev => ({ ...prev, toLocation: e.target.value }))}
                  value={masterData?.toLocation ?? ""}
                />

              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 p-3 bg-white shadow rounded">
        <TransactionItemDataGrid
          height={500}
          className={"p-2"}
          customStore={goodsTransitItemStore}
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
            <div className="grid grid-cols-[auto,30%] gap-1">
              <label className="font-extrabold py-2 px-4 justify-self-end text-[15px]" >Total</label>

              <div className="border rounded px-5 py-2 bg-gray-100 w-full min-h-5 text-right">
                {currentTotalCost?.toFixed(2)}
              </div>
            </div>
          </div>

        </div>


      </div>
      <div className="bg-white border-t p-4 sticky bottom-0 flex flex-row place-content-between z-10">
        <div className="flex flex-row">
          <DropDownBox
            id="GoodsTransitSelection"
            className="border rounded w-full"
            value={selectedGoodsTransit?.goodsTransitId}
            opened={isGoodsTransitGridBoxOpened}
            openOnFieldClick={true}
            valueExpr="goodsTransitId"
            displayExpr={(item) => item && `${item.description}`}
            placeholder="Search"
            showClearButton={false}
            showDropDownButton={true}
            onValueChanged={handleGoodsTransitGridBoxValueChanged}
            dataSource={goodsTransitStore}
            onOptionChanged={onGoodsTransitGridBoxOpened}
            contentRender={GoodsTransitDataGridRender}
            dropDownOptions={{
              width: 400
            }}
          />
          <button onClick={handleClear} className="bg-red-600 flex justify-center justify-self-end text-white w-44 px-2 py-1 text-xl rounded hover:bg-primary/90 m-[2px]">
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

export default GoodsTransit;