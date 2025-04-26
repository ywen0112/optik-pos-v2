import { useEffect, useState, useRef } from "react";
import { Pencil, TrashIcon } from "lucide-react";
import { Column } from "devextreme-react/cjs/data-grid";
import StandardDataGridComponent from "../BaseDataGrid";
import { GetDocNoRecords } from "../../api/maintenanceapi";


const NumberingFormatDataGrid = ({ className, onError, onDelete, onEdit }) => {
  const companyId = sessionStorage.getItem("companyId");
  const userId = sessionStorage.getItem("userId");
  const [format, setFormat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);

  const formatDataGridRef = useRef(null);

  useEffect(() => {
    loadFormats();
  }, []);

  const loadFormats = async () => {
    setLoading(true);
    const data = await GetDocNoRecords({companyId: companyId, userId: userId, id: userId});
    setFormat(data.data.docNoFormats);
    setLoading(false);
  };

  const handlePagerChange = (e) => {
    if (e.fullName === "paging.pageSize" || e.fullName === "paging.pageIndex") {
      const gridInstance = formatDataGridRef.current.instance;

      const pageSize = gridInstance.pageSize();
      const pageIndex = gridInstance.pageIndex();
      const skip = pageIndex * pageSize;
      const take = pageSize;

      setSkip(skip);
      setTake(take);
    }
  };

  return (
    <StandardDataGridComponent
      ref={formatDataGridRef}
      height={"100%"}
      dataSource={format}
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
      <Column dataField="docType" caption="Doc Type" allowEditing={false} width={"20%"} />
      <Column dataField="name" caption="Name" width={"20%"} />
      <Column dataField="nextNo" caption="Next No" width={"20%"} />
      <Column dataField="numberingFormat" caption="Format" width={"20%"} />
      <Column dataField="oneMonthOneSet" caption="One Month One Set" dataType="boolean" width={"20%"} />
      <Column dataField="sample" caption="Sample" width={"20%"} />
      <Column
        caption="Action"
        width={"15%"}
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
            
          </div>
        )}
      />
    </StandardDataGridComponent>
  );
};

export default NumberingFormatDataGrid;
