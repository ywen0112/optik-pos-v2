import SalesHistoryDataGrid from "../../../Components/DataGrid/SalesHistoryDataGrid";

const SalesHistory= ({ onError }) => {
  return (
    <div className="mt-2 bg-white h-[72vh] rounded-lg shadow overflow-y-auto">
      <div className="w-full h-[72vh] overflow-y-auto">
        <SalesHistoryDataGrid
          className="p-2"
          onError={onError}
        />
      </div>
    </div>
  );
};

export default SalesHistory;
