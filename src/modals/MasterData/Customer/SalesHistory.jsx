import { useState, useEffect } from "react";
import { Plus } from 'lucide-react';
import SalesHistoryDataGrid from "../../../Components/DataGrid/SalesHistoryDataGrid";

const SalesHistory= ({ salesHistoryStore }) => {
  const [selectedSales, setSelectedSales] = useState(null);

  const handleRowClick = (e) => {
    setSelectedSales(e.data);
  };

  useEffect(() => {
    if (salesHistoryStore) {
      salesHistoryStore.load().then((data) => {
        if (data?.length > 0) {
          setSelectedSales(data[0]);
        }
      });
    }
  }, [salesHistoryStore]);

  return (
    <div className="mt-2 bg-white h-[72vh] rounded-lg shadow overflow-y-auto">
      <div className="w-full h-[72vh] overflow-y-auto">
        <SalesHistoryDataGrid
          salesHistoryStore={salesHistoryStore}
          className="p-2"
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
};

export default SalesHistory;
