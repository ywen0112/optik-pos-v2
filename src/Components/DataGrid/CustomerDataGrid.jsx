import React, { useCallback } from "react";
import DataGrid, {
  Selection,
  Paging,
  Scrolling,
  SearchPanel
} from "devextreme-react/data-grid";

const CustomerGridColumns = ["Code", "Name"];

const CustomerDataGrid = ({
  value,
  dataSource,
  onSelectionChanged
}) => {
  const handleSelection = useCallback(
    (e) => {
      const selected = e.selectedRowsData?.[0];
      if (selected) {
        onSelectionChanged(selected);
      }
    },
    [onSelectionChanged]
  );

  return (
    <DataGrid
      dataSource={dataSource}
      columns={CustomerGridColumns}
      hoverStateEnabled={true}
      showBorders={false}
      selectedRowKeys={[value?.id]}
      onSelectionChanged={handleSelection}
      height="100%"
    >
      <Selection mode="single" />
      <Scrolling mode="virtual" />
      <Paging enabled={true} pageSize={10} />
      <SearchPanel
        visible={true}
        width="100%"
        highlightSearchText={true}
      />
    </DataGrid>
  );
};

export default CustomerDataGrid;
