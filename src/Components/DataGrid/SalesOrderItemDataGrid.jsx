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


const SalesOrderItemTable = ({ data, itemSource, onDataChange, height = 245, setSelectedItemTypeTitle  }) => {
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

    >
      <Paging enabled={false} />

      <Editing
        mode="cell" // instead of "row"
        allowUpdating
        allowDeleting
        allowAdding
        newRowPosition='last'
      />


      <ColumnFixing enabled />
      <ColumnChooser enabled mode="select" title="Choose Columns" />

      <Column
        dataField="itemCode"
        caption="Item Code"
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
            
              if (newValue) {
                let title = "";
                if (newValue.isNormalItem) title = "Normal Item";
                if (newValue.isSpectacles) title = "Spectacles";
                if (newValue.isContactLenses) title = "Contact Lens";
            
                setSelectedItemTypeTitle(title);
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
      <Column dataField="price" caption="Unit Price" dataType="number" />
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
        <Button name="delete" />
      </Column>
    </DataGrid>
  );
};

export default SalesOrderItemTable;

