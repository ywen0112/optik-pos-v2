import { useEffect, useState, useRef } from "react";
import { Pencil, TrashIcon } from "lucide-react";
import { Column } from "devextreme-react/cjs/data-grid";
import StandardDataGridComponent from "../BaseDataGrid";

const PaymentMethodDataGrid = ({ className, onError, onDelete, onEdit }) => {
  const [method, setMethod] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  const [keyword, setKeyword] = useState("")

  const methodDataGridRef = useRef(null);

  useEffect(() => {
    loadDummyData();
  }, [skip, take, keyword]);

  useEffect(() => {
    loadDummyData();
}, [onEdit, onDelete ])

  const loadDummyData = () => {
    setLoading(true);

    setTimeout(() => {
      const dummy = [
        {
        methodId: "1",
        isActive: true,
        paymentMethod: "CASH",
        paymentMethodType: "Cash"
        },
        {
        methodId: "2",
        isActive: true,
        paymentMethod: "CARD",
        paymentMethodType: "Card"
        }
      ];
      setMethod(dummy);
      setLoading(false);
    }, 300); // simulate async load
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

    if(e.fullName === 'searchPanel.text'){
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
      <Column dataField="paymentMethod" caption="Payment Method" allowEditing={false} width={"20%"} />
      <Column dataField="paymentMethodType" caption="Payment Method Type" width={"50%"} />
      <Column dataField="isActive" caption="Active" dataType="boolean" width={"20%"} />
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
              }}
            >
              <Pencil size={20} />
            </div>
            <div
              className="text-red-600 hover:cursor-pointer flex justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(cellData.data.id);
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
