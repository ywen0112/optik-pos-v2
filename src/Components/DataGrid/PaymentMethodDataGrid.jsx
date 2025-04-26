import { useEffect, useState, useRef } from "react";
import { Pencil, TrashIcon } from "lucide-react";
import { Column } from "devextreme-react/cjs/data-grid";
import StandardDataGridComponent from "../BaseDataGrid";
import { GetPaymentMethodRecords } from "../../api/maintenanceapi";

const PaymentMethodDataGrid = ({ className, onError, onDelete, onEdit }) => {
  const companyId = sessionStorage.getItem("companyId");
  const userId = sessionStorage.getItem("userId");
  const [method, setMethod] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  const [keyword, setKeyword] = useState("");

  const methodDataGridRef = useRef(null);

  useEffect(() => {
    loadPaymentMethodData();
  }, [skip, take, keyword]);

  useEffect(() => {
    loadPaymentMethodData();
  }, [onEdit, onDelete])

  useEffect(() => {
    loadPaymentMethodData();
  }, [onEdit, onDelete]);

  useEffect(() => {
    setSkip(0);
    setTake(10);
  }, [keyword]);

  const loadPaymentMethodData = async () => {
    setLoading(true);
    try {
      const data = await GetPaymentMethodRecords({ companyId: companyId, keyword: keyword, offset: skip, limit: take });
      if (data.success) {
        const records = data.data || [];
        const total = data.data.totalRecords || 0;
        setMethod(records);
      } else throw new Error(data.errorMessage || "Failed to fetch Payment Method.");

    } catch (error) {
      onError({ title: "Fetch Error", message: error.Message });
    } finally {
      setLoading(false);
    }
  };

  const handlePagerChange = (e) => {
    if (e.fullName === "paging.pageSize" || e.fullName === "paging.pageIndex") {
      const gridInstance = methodDataGridRef.current.instance;

      const pageSize = gridInstance.pageSize();
      const pageIndex = gridInstance.pageIndex();
      const skip = pageIndex * pageSize;
      const take = pageSize;

      setSkip(skip);
      setTake(take);
    }

    if (e.fullName === 'searchPanel.text') {
      const searchText = e.value;
      setKeyword(searchText);
    }
  };

  return (
    <StandardDataGridComponent
      ref={methodDataGridRef}
      height={"100%"}
      dataSource={method}
      className={className}
      searchPanel={true}
      pager={true}
      pageSizeSelector={true}
      columnChooser={true}
      showBorders={true}
      allowColumnResizing={false}
      allowColumnReordering={false}
      allowEditing={true}
      onLoading={loading}
      onOptionChanged={handlePagerChange}
    >
      <Column dataField="paymentMethodCode" caption="Payment Method" allowEditing={false} width={"20%"} />
      <Column dataField="paymentType" caption="Payment Method Type" width={"50%"} />
      <Column
        caption="Action"
        width={"150px"}
        headerCellRender={() => (
          <div className="font-bold text-white">Action</div>
        )}
        cellRender={(cellData) => (
          <div className="flex flex-row justify-center space-x-2">
            <div
              className="text-green-600 hover:cursor-pointer flex justify-center"
              onClick={(e) => {
                e.stopPropagation();

                onEdit(cellData.data, "edit");
                loadPaymentMethodData();
              }}
            >
              <Pencil size={20} />
            </div>
            <div
              className="text-red-600 hover:cursor-pointer flex justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(cellData.data.paymentMethodId);
              }}
            >
              <TrashIcon size={20} />
            </div>
          </div>

        )}
      />
    </StandardDataGridComponent>
  );
};

export default PaymentMethodDataGrid;
