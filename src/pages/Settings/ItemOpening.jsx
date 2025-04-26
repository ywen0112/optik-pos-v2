import { useEffect, useState } from "react";

import ProductOpeningDataGrid from "../../Components/DataGrid/Product/ProductOpeningDataGrid";
import { NewItemOpening, GetItemOpeningRecords, SaveItemOpening } from "../../api/maintenanceapi";

const ItemOpening = () => {
  const companyId = sessionStorage.getItem("companyId");
  const userId = sessionStorage.getItem("userId");
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  

  useEffect(()=>{
    fetchItemOpeningRecords();
  }, [])

  const fetchItemOpeningRecords = async () =>{
    setLoading(true);
    try{
      const res = await GetItemOpeningRecords({companyId: companyId, userId: userId, id: userId});
      if(res.success){
        setRecords(res.data.itemOpeningBalances);
        setTotal(res.totalRecords);
      }else throw new Error(data.errorMessage, "Failed to get Product Opening Records");
    }catch(error){
      setErrorModal({title: "Error", message: error.message})
    }finally{
      setLoading(false);
    }
  }

  const onLookUpSelected = (newValue) =>{
    setRecords(prev => {
      const exists = prev.find(record => record.itemOpeningBalanceId === newValue.itemOpeningBalanceId);
      if(exists){
        return prev.map(record =>
          record.itemOpeningBalanceId === newValue.itemOpeningBalanceId ? { ...record, ...newValue } : record 
        );
      }else{
        return [...prev, newValue];
      }
    })
  }

  return (
    <div className="mt-2 bg-white h-[72vh] rounded-lg shadow overflow-hidden">
       
          <ProductOpeningDataGrid
            className={"p-2"}
            dataRecords={records}
            totalRecords={total}
            onSelect={onLookUpSelected}
          />
        
      </div>

  );
};

export default ItemOpening;