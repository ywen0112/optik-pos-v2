import { useEffect, useState, useRef } from "react";
import { Pencil, TrashIcon } from "lucide-react";
import { Column } from "devextreme-react/cjs/data-grid";
import StandardDataGridComponent from "../BaseDataGrid";
import { GetDocNoRecords } from "../../api/maintenanceapi";
import CustomStore from "devextreme/data/custom_store";


const NumberingFormatDataGrid = ({ className, onError, onEdit }) => {
  const companyId = sessionStorage.getItem("companyId");

  const [loading, setLoading] = useState(false);

  const formatDataGridRef = useRef(null);

  const formatStore = new CustomStore({
    key: "docType",
    load: async (loadOptions) => {
      const skip = loadOptions.skip ?? 0;
      const take = loadOptions.take ?? 10;
      const keyword = loadOptions.filter?.[2][2] || "";

      try {
        const data = await GetDocNoRecords({ companyId, offset: skip, limit: take, keyword });
        return {
          data: data.data || [],
          totalCount: data.totalRecords || 0
        };
      } catch (error) {
        onError({ title: "Fetch Error", message: error.message });
        return { data: [], totalCount: 0 };
      }
    }
  })

  return (
    <StandardDataGridComponent
      ref={formatDataGridRef}
      height={"100%"}
      dataSource={formatStore}
      className={className}
      searchPanel={true}
      pager={false}
      pageSizeSelector={false}
      columnChooser={true}
      showBorders={true}
      allowColumnResizing={false}
      allowColumnReordering={false}
      allowEditing={true}
      onLoading={loading}
      remoteOperations={{ paging: true, filtering: true, sorting: true }}
    >
      <Column dataField="docType" caption="Doc Type" allowEditing={false} width={"200px"} />
      <Column dataField="nextNumber" caption="Next No" width={"70px"} />
      <Column dataField="format" caption="Format"/>
      <Column dataField="oneMonthOneSet" caption="One Month One Set" dataType="boolean" width={"200px"} />
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

          </div>
        )}
      />
    </StandardDataGridComponent>
  );
};

export default NumberingFormatDataGrid;
