import React, { useState } from 'react';
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


const SalesOrderItemTable = ({ data, itemSource, onDataChange, height = 245, handleCellClick  }) => {
  const [itemDataGridData, setItemDataGridData] = useState([]);
  const [itemQty, setItemQty] = useState();

  // useEffect(() => {
  //   setItemDataGridData(data);
  // }, [data]);

  const handleRowChange = (rowKey, updatedRow) => {
    console.log(itemDataGridData)

  }

  return (
    <DataGrid
      id='SalesOrderItemTable'
      dataSource={itemDataGridData}
      keyExpr={itemDataGridData.length > 0 ? "itemId" : null}
      height={height}
      scrolling={{ mode: 'standard', showScrollbar: 'always' }}
      className="p-5"
      showBorders
      showRowLines
      onRowUpdated={(e) => handleRowChange(e.key.__KEY__, e)}
      onRowInserted={(e) => handleRowChange(e.key.__KEY__, e)}
      onCellClick = {(e) => handleCellClick(e.row.data)}

    >
      <Paging enabled={false} />

      <Editing
        mode="cell"
        allowUpdating
        allowDeleting
        allowAdding
        newRowPosition='last'
        confirmDelete={false}
      />


      <ColumnFixing enabled />
      <ColumnChooser enabled mode="select" title="Choose Columns" />

      <Column
        dataField="itemCode"
        caption="Item Code"
        width={"100px"}
        editCellComponent={(props) => (
          <ItemDropDownBoxComponent
            data={itemSource}
            value={props.value}
            onValueChanged={(newValue) => {
              setItemDataGridData(prev => {
                const updated = [...prev];
                updated.push(newValue);
                return updated;
              });
              handleCellClick(newValue)
            }}
          />
        )}
      >
      </Column>
      <Column dataField="id" visible={false} allowExporting={false}
        allowEditing={false}
        showInColumnChooser={false} />
      <Column dataField="description" caption="Description" />
      <Column dataField="uom" caption="UOM" width={"80px"} />
      <Column
        dataField="qty"
        caption="Qty"
        dataType="number"
        value={itemQty}
        onValueChanged={(e) => setItemQty(e.target.value)}
        width={"50px"}
      />
      <Column dataField="price" width={"80px"} caption="Unit Price" dataType="number" />
      <Column
        value={false}
        dataField="isDiscByPercent"
        caption="Discount %"
        dataType="boolean"
        width={"90px"}

      />
      <Column dataField="discAmt" caption="Disc Amnt" dataType="number" value={0} width={"80px"}/>
      <Column dataField="amount"
        caption="Amount"
        dataType="number"
        width={"80px"}
      />

      <Column type="buttons" width={"80px"} caption="Action">
        <Button name="delete" />
      </Column>
    </DataGrid>
  );
};

export default SalesOrderItemTable;

