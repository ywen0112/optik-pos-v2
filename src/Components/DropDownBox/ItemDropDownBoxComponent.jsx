import { useState, useRef, useEffect } from "react";
import { DropDownBox} from "devextreme-react";
import DataGrid, {
    Paging,
    SearchPanel,
    Column,
  } from 'devextreme-react/data-grid';

  const dropDownOptions = { width: 300 };

const ItemDropDownBoxComponent = ({data, value, onValueChanged = () => {} }) => {
    const [items, setItems] = useState(data ? data : []);
    const [currentValue, setCurrentValue] = useState(value || '');
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
    };
  
    return (
      <DropDownBox
        value={currentValue}
        dropDownOptions= {dropDownOptions}
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
  

  const initialData = [
    { id: 1, itemCode: 'A100', description: 'Widget', uom: 'pcs', qty: 10, unitPrice: 5.0 },
    { id: 2, itemCode: 'B200', description: 'Gadget', uom: 'pcs', qty: 5, unitPrice: 12.5 },
    { id: 3, itemCode: 'C100', description: 'WidgetBox', uom: 'pcs', qty: 10, unitPrice: 15.0 },
    { id: 4, itemCode: 'D200', description: 'GadgetBox', uom: 'pcs', qty: 5, unitPrice: 22.5 },
  ];