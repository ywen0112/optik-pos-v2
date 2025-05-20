import { useState, useCallback, useRef, useMemo } from "react";
import DatePicker from "react-datepicker";
import DropDownBox from "devextreme-react/drop-down-box";
import CustomStore from "devextreme/data/custom_store";
import DataGrid, {
  Paging,
  Column,
  Selection,
  Scrolling,
  SearchPanel
} from 'devextreme-react/data-grid';
import "react-datepicker/dist/react-datepicker.css";
import { getInfoLookUp } from "../../api/infolookupapi";
import { GetItem } from "../../api/maintenanceapi";
import { GetItemInquiry, GetItemHistorys } from "../../api/inquiryapi";
import ErrorModal from "../../modals/ErrorModal";
import ItemInquiryMasterDataDetailGrid from "../../Components/DataGrid/Inquiry/ItemInquiryMasterDetailGrid";
import CustomInput from "../../Components/input/dateInput";

const ItemGridBoxDisplayExpr = (item) =>
item ? `${item.itemCode}-${item.description}` : "";

const ItemGridColumns = [
  { dataField: "itemCode", caption: "Code", width: "30%" },
  { dataField: "description", caption: "Name", width: "50%" }
];

const ProductInquiry = () => {
  const companyId = sessionStorage.getItem("companyId");
  const userId = sessionStorage.getItem("userId");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);
    return today;
  });

  const [endDate, setEndDate] = useState(new Date());
  const [selectedItem, setSelectedItem] = useState(null);
  const [isItemBoxOpen, setIsItemBoxOpen] = useState(false);
  const [data, setData] = useState(null);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const gridRef = useRef(null);

  const itemStore = new CustomStore({
    key: "itemId",

    load: async (loadOptions) => {
      const filter = loadOptions.filter;
      let keyword = filter?.[2][2] || "";

      const params = {
        keyword: keyword || "",
        offset: loadOptions.skip,
        limit: loadOptions.take,
        type: "item",
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
      const res = await GetItem({
        companyId,
        userId,
        id: key
      });
      return res.data;
    },
  });
  
  const handleItemGridBoxValueChanged = (e) => {
    if (!e.value) {
      setSelectedItem(null);
    }
  };

  const ItemDataGridOnSelectionChanged = useCallback((e) => {
    const selected = e.selectedRowsData?.[0];
    if (selected) {
      setSelectedItem(selected);
      setIsItemBoxOpen(false);
    }
  }, []);

  const onItemGridBoxOpened = useCallback((e) => {
    if (e.name === 'opened') {
      setIsItemBoxOpen(e.value);
    }
  }, []);

  const ItemDataGridRender = useCallback(
  () => (
    <DataGrid
      dataSource={itemStore}
      columns={ItemGridColumns}
      hoverStateEnabled={true}
      showBorders={true}
      selectedRowKeys={selectedItem?.itemId}
      onSelectionChanged={ItemDataGridOnSelectionChanged}
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
  ),[]);

const handleGetInquiry = useCallback(() => {
  if(selectedItem === null){
    setErrorModal({
          title: "Inquiry Error",
          message: "Please select an item to continue",
        });
        return;
  }
  const store = new CustomStore({
    key: "itemCode",
    load: async (loadOptions) => {
      const { skip, take } = loadOptions;

      const params = {
        companyId,
        id: selectedItem?.itemId,
        fromDate: startDate,
        toDate: endDate,
        offset: skip || 0,
        limit: take || 10,
      };

      // const historyParams = {
      //   companyId,
      //   id: selectedItem?.itemId,
      //   fromDate: startDate,
      //   toDate: endDate,
      //   offset: loadOptions.skip,
      //   limit: loadOptions.take,
      // };

      try {
        const inquiryRes = await GetItemInquiry(params);
        // const historyRes = await GetItemHistorys(historyParams);
        

        const item = inquiryRes.data;
        const enrichedData = [{
          ...item,
          itemId: selectedItem.itemId,
          itemCode: selectedItem.itemCode,
          fromDate: startDate,
          toDate: endDate,
          // history: historyRes.data?.filter(h => h.itemCode === item.itemCode) || [],
        }];

        return {
          data: enrichedData,
          totalCount: 1,
        };

      } catch (error) {
        console.error("Error loading inquiry data:", error);
        setErrorModal({
          title: "Inquiry Error",
          message: error.message || "An unexpected error occurred.",
        });
        return {
          data: [],
          totalCount: 0,
        };
      }
    },
  });

  setData(() => store);
}, [companyId, selectedItem, startDate, endDate]);

  return (
    <>
    <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
      <div className="space-y-6 p-6 bg-white rounded shadow">
        <div className="grid grid-cols-1 gap-2 w-1/2">
          <div className="w-full">
            <label className="block text-secondary font-medium mb-1">Date Range</label>
            <div className="flex flex-row gap-2">
              <DatePicker
                customInput={<CustomInput width="w-[400px]"/>}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
              />
              <span className="text-secondary self-center">to</span>
              <DatePicker
                customInput={<CustomInput width="w-[400px]"/>}
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>

          <div className="w-full">
            <label className="block text-secondary font-medium mb-1">Item</label>
            <DropDownBox
              id="ItemSelection"
              className="border rounded p-1 w-1/2 h-[34px]"
              value={selectedItem?.itemId || null}
              opened={isItemBoxOpen}
              openOnFieldClick={true}
              valueExpr='itemId'
              displayExpr={ItemGridBoxDisplayExpr}
              placeholder="Select Item"
              showClearButton={true}
              onValueChanged={handleItemGridBoxValueChanged}
              dataSource={itemStore}
              onOptionChanged={onItemGridBoxOpened}
              contentRender={ItemDataGridRender}
              dropDownOptions={{
                width: 400
              }}
            />
          </div>
        </div>

        <div className="pt-6 flex space-x-4">
          <button onClick={handleGetInquiry} className="bg-primary text-white px-6 py-2 rounded">Search</button>
        </div>

        <div className="mt-6">
          <ItemInquiryMasterDataDetailGrid
            ref={gridRef}
            itemData={data}
          />
        </div>
      </div>
    </>
  );
};

export default ProductInquiry;