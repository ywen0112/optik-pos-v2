import React, { useEffect, useState } from 'react';
import DataGrid, {
  Lookup,
  Paging,
  Editing,
  Column,
  ColumnChooser,
  ColumnFixing,
  Button
} from 'devextreme-react/data-grid';

import ItemDropDownBoxComponent from '../DropDownBox/ItemDropDownBoxComponent';

const initialData = [
  { id: 1, itemCode: 'A100', description: 'Widget', uom: 'pcs', qty: 10, unitPrice: 5.0 },
  { id: 2, itemCode: 'B200', description: 'Gadget', uom: 'pcs', qty: 5, unitPrice: 12.5 },
  { id: 3, itemCode: 'C100', description: 'WidgetBox', uom: 'pcs', qty: 10, unitPrice: 15.0 },
  { id: 4, itemCode: 'D200', description: 'GadgetBox', uom: 'pcs', qty: 5, unitPrice: 22.5 },
];

const SalesOrderItemTable = ({ data, onDataChange }) => {
  const [itemDataGridData, setItemDataGridData] = useState(data);
  const [itemQty, setItemQty] = useState(1);

  useEffect(() => {
    setItemDataGridData(data);
  }, [data]);

  const handleRowChange = (rowKey, updatedRow) => {
    const updatedData = [...itemDataGridData];
    updatedData[rowKey] = updatedRow;
    setItemDataGridData(updatedData);
    onDataChange(updatedData);
  }

  return (
    <DataGrid
      id='SalesOrderItemTable'
      dataSource={itemDataGridData}
      height={245}
      scrolling={{ mode: 'standard', showScrollbar: 'always' }}
      className="p-5"
      showBorders
      showRowLines
      onRowUpdated={(e) => handleRowChange(e.key.__KEY__, e.data)}
      onRowInserted={(e) => handleRowChange(e.key.__KEY__, e.data)}
      onEditorPreparing={e => {
        if (e.parentType === 'dataRow' && (e.dataField === 'qty' || e.dataField === 'unitPrice' || e.dataField === 'isDiscByPercent' || e.dataField === 'discAmt')) {
          // keep a reference to the grid instance & row
          const grid = e.component;
          const rowIndex = e.row.rowIndex;

          // decorate the editorOptions
          e.editorOptions.onValueChanged = args => {
            // pick up the new & existing values
            const newDiscMethod = e.dataField === 'isDiscByPercent' ? args.value : grid.cellValue(rowIndex, 'isDiscByPercent');
            const newDiscAmt = e.dataField === 'discAmt' ? args.value : grid.cellValue(rowIndex, 'discAmt');
            const newQty = e.dataField === 'qty' ? args.value : grid.cellValue(rowIndex, 'qty');
            const newPrice = e.dataField === 'unitPrice' ? args.value : grid.cellValue(rowIndex, 'unitPrice');

            // write straight into the Amount cell
            grid.cellValue(rowIndex, 'qty', newQty)
            grid.cellValue(rowIndex, 'unitPrice', newPrice)
            grid.cellValue(rowIndex, 'isDiscByPercent', newDiscMethod)
            grid.cellValue(rowIndex, 'discAmt', newDiscAmt)
            grid.cellValue(rowIndex, 'amount', (newQty * newPrice) - (newDiscMethod === true ? newDiscAmt / 100 : newDiscAmt));
          };
        }
      }}
    >
      <Paging enabled={false} />

      <Editing
        mode="row"
        allowUpdating
        allowDeleting
        allowAdding
        newRowPosition="bottom"
      />

      <ColumnFixing enabled />
      <ColumnChooser enabled mode="select" title="Choose Columns" />

      <Column
        dataField="itemCode"
        caption="Item Code"
        editCellComponent={(props) => (
          <ItemDropDownBoxComponent
            data={initialData}
            value={props.value}
            onValueChanged={(newValue) => {
              const selectedItem = initialData.find(i => i.id === newValue);
              if (selectedItem) {
                const rowIndex = props.data.rowIndex;
                const grid = props.data.component;
                grid.cellValue(rowIndex, 'id', selectedItem.id);
                grid.cellValue(rowIndex, 'itemCode', selectedItem.itemCode);
                grid.cellValue(rowIndex, 'description', selectedItem.description);
                grid.cellValue(rowIndex, 'uom', selectedItem.uom);
                grid.cellValue(rowIndex, 'unitPrice', selectedItem.unitPrice);
                grid.cellValue(rowIndex, 'discAmt', 0)
                grid.cellValue(rowIndex, 'isDiscByPercent', false)
              }
            }}
          />
        )}
      >
      </Column>
      <Column dataField="id" visible={false} allowExporting={false}
        allowEditing={false}
        showInColumnChooser={false} />
      <Column dataField="description" caption="Description" />
      <Column dataField="uom" caption="UOM" />
      <Column
        dataField="qty"
        caption="Qty"
        dataType="number"
        value={itemQty}
        onValueChanged={(e) => setItemQty(e.target.value)}
      />
      <Column dataField="unitPrice" caption="Unit Price" dataType="number" />
      <Column
        value={false}
        dataField="isDiscByPercent"
        caption="Disc By Percent"
        dataType="boolean"


      />
      <Column dataField="discAmt" caption="Disc Amnt" dataType="number" value={0} />
      <Column dataField="amount"
        caption="Amount"
        dataType="number"
      />

      <Column type="buttons" caption="Action">
        <Button name="edit" />
        <Button name="delete" />
      </Column>
    </DataGrid>
  );
};

export default SalesOrderItemTable;

