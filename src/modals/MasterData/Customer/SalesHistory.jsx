import SalesHistoryDataGrid from "../../../Components/DataGrid/SalesHistoryDataGrid";

const SalesHistory= ({ salesHistoryStore }) => {
  return (
    <div className="mt-2 bg-white h-[72vh] rounded-lg shadow overflow-y-auto">
      <div className="w-full h-[72vh] overflow-y-auto">
        <SalesHistoryDataGrid
          salesHistoryStore={salesHistoryStore}
          className="p-2"
        />
      </div>
    </div>
  );
};

export default SalesHistory;
