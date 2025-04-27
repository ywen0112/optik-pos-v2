import { useState, useRef } from "react";
import { Pencil, TrashIcon } from "lucide-react";
import { Column } from "devextreme-react/cjs/data-grid";
import StandardDataGridComponent from "../BaseDataGrid";
import { GetPaymentMethodRecords } from "../../api/maintenanceapi";
import CustomStore from "devextreme/data/custom_store";

const PaymentMethodDataGrid = ({ className, onError, onDelete, onEdit }) => {
  const companyId = sessionStorage.getItem("companyId");

  const [loading, setLoading] = useState(false);

  const methodDataGridRef = useRef(null);

  const methodStore = new CustomStore({
    key: "paymentMethodId",
    load: async (loadOptions) => {
      const skip = loadOptions.skip ?? 0;
      const take = loadOptions.take ?? 10;
      const keyword = loadOptions.filter?.[2][2] || "";

      try {
        const data = await GetPaymentMethodRecords({ companyId, offset: skip, limit: take, keyword });
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
      ref={methodDataGridRef}
      height={"100%"}
      dataSource={methodStore}
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
      remoteOperations={{ paging: true, filtering: true, sorting: true }}
    >
      <Column dataField="paymentMethodCode" caption="Payment Method" allowEditing={false} width={"200px"} />
      <Column dataField="paymentType" caption="Payment Method Type" />
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
                loadPaymentMethodData();
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
