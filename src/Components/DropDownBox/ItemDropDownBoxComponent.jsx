import { useState, useRef, useEffect } from "react";
import { DropDownBox} from "devextreme-react";
import DataGrid, {
    Paging,
    SearchPanel,
    Column,
  } from 'devextreme-react/data-grid';

const ItemDropDownBoxComponent = ({data, value, onValueChanged = () => {} }) => {
    const [items, setItems] = useState(data ? data : []);
    const [currentValue, setCurrentValue] = useState(value || '');
    const [dropDownOpen, setDropDownOpen] = useState(true);
    const gridRef = useRef(null);
  
    useEffect(() => {
    //   fetchData('');
    }, []);
  
    const fetchData = async (keyword) => {
      try {
        const res = await fetch(`/api/items?search=${keyword}`);
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    };
  
    const handleValueChange = (selectedItems) => {
      const selected = selectedItems?.[0];
      if (!selected) return;
  
      setCurrentValue(selected.itemCode);
      if (typeof onValueChanged === 'function') {
        onValueChanged(selected.id); // ← clean call
      }
      setDropDownOpen(false);
    };
  
    return (
      <DropDownBox
        value={currentValue}
        opened={dropDownOpen}
        width={300}
        onOpened={() => setDropDownOpen(true)}
        onClosed={() => setDropDownOpen(false)}
        displayExpr="itemCode"
        valueExpr="id"
        showClearButton
        contentRender={() => (
          <DataGrid
            dataSource={items}
            height={250}
            showBorders
            focusedRowEnabled
            keyExpr="id"
            onRowClick={(e) => handleValueChange([e.data])}
            ref={gridRef}
          >
            <SearchPanel visible={true} onTextChange={(e)=>{console.log(e)}}/>
            <Paging enabled pageSize={5} />
            <Column dataField="itemCode" caption="Code" />
            <Column dataField="description" caption="Description" />
            <Column dataField="qty" caption="Qty" dataType="number" />
          </DataGrid>
        )}
      />
    );
  };

  export default ItemDropDownBoxComponent
  