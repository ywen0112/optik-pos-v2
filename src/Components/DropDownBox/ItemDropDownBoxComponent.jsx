import { useState, useRef, useEffect } from "react";
import { DropDownBox} from "devextreme-react";
import DataGrid, {
    Paging,
    SearchPanel,
    Column,
    Scrolling,
  } from 'devextreme-react/data-grid';

  const dropDownOptions = { width: 500 };

const ItemDropDownBoxComponent = ({data, value, onValueChanged = () => {} }) => {
   
    const [currentValue, setCurrentValue] = useState(value || '');
    const gridRef = useRef(null);
  
 
   
  
    const handleValueChange = (selectedItems) => {
      const selected = selectedItems?.[0];
      if (!selected) return;
  
      setCurrentValue(selected.itemCode);
      if (typeof onValueChanged === 'function') {
        onValueChanged(selected); // ← clean call
      }
    };
  
    return (
      <DropDownBox
        value={currentValue}
        dropDownOptions= {dropDownOptions}
        displayExpr="itemCode"
        valueExpr="id"
        showClearButton
        contentRender={() => (
          <DataGrid
            dataSource={data}
            height={250}
            showBorders
            focusedRowEnabled
            keyExpr="itemId"
            onRowClick={(e) => handleValueChange([e.data])}
            ref={gridRef}
            remoteOperations={{
              paging: true,
              filtering: true,         
            }}
          >
            <Scrolling mode="infinite"/>
            <SearchPanel visible={true} highlightSearchText={true}/>
            <Paging enabled pageSize={10} />
            <Column dataField="itemCode" caption="Code" width={"30%"}/>
            <Column dataField="description" caption="Description" width={"50%"} />
          </DataGrid>
        )}
      />
    );
  };

  export default ItemDropDownBoxComponent;