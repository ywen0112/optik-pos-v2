import DataGrid, { Column, Button as DxButton } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { PencilIcon } from "lucide-react";

const ReportManagementDataGrid = ({ reports }) => {

  const handleOpenReport = (reportType, reportName) => {
    const reportUrl = `https://report.absplt.com/reporting/ReportDesigner/system/${reportType}/${encodeURIComponent(reportName)}`;
    window.open(reportUrl, "_blank");
  };

  return (
    <DataGrid
      dataSource={reports}
      showBorders={true}
      columnAutoWidth={true}
      keyExpr="reportName"
    >
      <Column dataField="reportType" caption="Report Type" />
      <Column dataField="reportName" caption="Report Name" />
      <Column
        type="buttons"
        caption="Action"
        width={"10%"}
        cellRender={({ data }) => {
            return (
            <div
                className="text-primary-600 hover:cursor-pointer flex justify-center"
                onClick={() => handleOpenReport(data.reportType, data.reportName)}
                title="Open Report"
            >
                <PencilIcon className="w-5 h-5" />
            </div>
            );
        }}
        />
    </DataGrid>
  );
};

export default ReportManagementDataGrid;
