import { useEffect, useState } from 'react';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import { GetSalesOrder } from '../../api/transactionapi';
import ErrorModal from '../ErrorModal';
import StandardDataGridComponent from '../../Components/BaseDataGrid';
import { NewSalesOrderCollect, SaveSalesOrderCollect, NewSalesOrderCollectDetail } from '../../api/collectappi';
import NotificationModal from '../NotificationModal';

const CollectItemModal = ({ isOpen, onClose, salesOrder, companyId, userId, ref }) => {
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: '' });
  const [readyItems, setReadyItems] = useState([]);
  const [collectedItems, setCollectedItems] = useState([]);
  const [selectedQty, setSelectedQty] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [salesOrderCollectId, setSalesOrderCollectId] = useState(null);
  const [salesOrderCollectDetailId, setSalesOrderCollectDetailId] = useState(null);

  useEffect(() => {
  if (isOpen && salesOrder?.documentId) {
    initData();
  }
}, [isOpen, salesOrder?.documentId, companyId, userId]);

  const initData = async () => {
  try {
    const newRes = await NewSalesOrderCollect({
      companyId,
      userId,
      id: salesOrder.documentId,
    });

    if (!newRes.success) throw new Error(newRes.errorMessage || 'Failed to create new collect record');
    setSalesOrderCollectId(newRes.data.salesOrderCollectId);

    const detailRes = await NewSalesOrderCollectDetail();
    if (!detailRes.success) throw new Error(detailRes.errorMessage || 'Failed to create collect detail');
    setSalesOrderCollectDetailId(detailRes.data.salesOrderCollectDetailId);

    const res = await GetSalesOrder({
      companyId,
      userId,
      id: salesOrder.documentId,
    });

    if (!res.success) throw new Error(res.errorMessage || 'Failed to fetch sales order');

    const data = res.data;
    const details = data.details || [];
    const collects = data.collects?.flatMap(c => c.details) || [];

    const collectedQtyMap = collects.reduce((acc, collect) => {
      acc[collect.itemId] = (acc[collect.itemId] || 0) + collect.collectQty;
      return acc;
    }, {});

    const ready = details
      .map(item => {
        const collected = collectedQtyMap[item.itemId] || 0;
        const remainingQty = item.qty - collected;
        return { ...item, remainingQty };
      })
      .filter(item => item.remainingQty > 0);

    const collected = collects.map(collect => {
      const match = details.find(d => d.itemId === collect.itemId);
      return {
        itemCode: match?.itemCode || '',
        description: match?.description || '',
        qty: collect.collectQty,
      };
    });

    setReadyItems(ready);
    setCollectedItems(collected);
  } catch (error) {
    setErrorModal({ title: 'Init Error', message: error.message });
  }
};

  const handleConfirmCollect = () => {
  if (!selectedItem) return;

  // Add to collected items
  setCollectedItems(prev => [
    ...prev,
    {
        itemCode: selectedItem.itemCode,
        description: selectedItem.description,
        collectQty: selectedQty,
        itemId: selectedItem.itemId,
        itemUOMId: selectedItem.itemUOMId,
    }
  ]);

  // Update ready items
  setReadyItems(prev =>
    prev
      .map(item =>
        item.itemId === selectedItem.itemId
          ? { ...item, remainingQty: item.remainingQty - selectedQty }
          : item
      )
      .filter(item => item.remainingQty > 0)
  );

  // Reset selection
  setSelectedItem(null);
  setSelectedQty(1);
};

const handleSaveCollection = async () => {
  if (!salesOrderCollectId || !selectedItem || !salesOrder) return;

  try {
    const payload = {
      actionData: {
        companyId,
        userId,
        id: salesOrderCollectId,
        name: ""
      },
      salesOrderCollectId,
      salesOrderId: salesOrder.documentId,
      docNo: salesOrder.docNo,
      docDate: salesOrder.docDate,
      isVoid: false,
      details: [
        {
          salesOrderCollectDetailId: salesOrderCollectDetailId,
          salesOrderId: salesOrder.documentId,
          salesOrderDetailId: "", 
          itemId: selectedItem.itemId,
          itemUOMId: selectedItem.itemUOMId,
          collectQty: selectedQty,
        }
      ]
    };

    const res = await SaveSalesOrderCollect(payload);

    if (res.success) {
      setNotifyModal({ isOpen: true, message: 'Item collected successfully!' });
      setSelectedItem(null);
      setSelectedQty(1);
    } else {
      setErrorModal({ title: "Save Error", message: res.errorMessage || "Failed to save collection." });
    }
  } catch (err) {
    setErrorModal({ title: "API Error", message: err.message });
  }
};

const handleNotifyModalClose = () => {
  setNotifyModal({ isOpen: false, message: '' });
  initData();
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
    <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
    <NotificationModal isOpen={notifyModal.isOpen} message={notifyModal.message} onClose={handleNotifyModalClose} />
      <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full overflow-y-auto text-secondary flex">
        {/* Left: Tables Section */}
        <div className="w-2/3 flex-grow flex flex-col gap-6 overflow-y-auto pr-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Ready for collection</h2>
            <StandardDataGridComponent
                ref={ref}
                height={280}
                dataSource={readyItems}
                pager={false}
                pageSizeSelector={false}
                showBorders={false}
                remoteOperations={{ paging: false }}
                searchPanel={false}
                columnChooser={false}
            >
              <Column dataField="itemCode" caption="Item Code" />
              <Column dataField="description" caption="Desc" />
              <Column alignment="left" dataField="remainingQty" caption="Qty" />
              <Column
                alignment="center"
                width={"100px"}
                caption="Action"
                cellRender={({ data }) => (
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={() => {
                      setSelectedItem(data);
                      setSelectedQty(1);
                    }}
                  >
                    Collect
                  </button>
                )}
              />
              </StandardDataGridComponent>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Collected</h2>
            <StandardDataGridComponent
                ref={ref}
                height={280}
                dataSource={collectedItems}
                pager={false}
                pageSizeSelector={false}
                showBorders={false}
                remoteOperations={{ paging: false }}
                searchPanel={false}
                columnChooser={false}
            >
              <Column dataField="itemCode" caption="Item Code" />
              <Column dataField="description" caption="Desc" />
              <Column alignment='left' dataField="qty" caption="Qty" />
            </StandardDataGridComponent>
          </div>
        </div>

        {/* Right: Collect Quantity Panel */}
        <div className="w-1/3 flex flex-col justify-center text-center border-l pl-6">
          <div>
            <h3 className="text-md font-semibold mb-4">Collect Quantity</h3>
            {selectedItem ? (
              <div className="flex flex-col items-center gap-3 mb-6">
                <p className="text-sm text-gray-600 mb-2">Item: {selectedItem.description}</p>
                <div className="flex items-center gap-3">
                  <button className="bg-gray-200 px-3 py-1 rounded text-lg" onClick={() => setSelectedQty(prev => Math.max(1, prev - 1))}>
                    -1
                  </button>
                  <div className="text-lg font-bold">{selectedQty}</div>
                  <button
                    className="bg-gray-200 px-3 py-1 rounded text-lg hover:bg-gray-/90"
                    onClick={() => setSelectedQty(prev => Math.min(selectedItem.remainingQty, prev + 1))}
                  >
                    +1
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Select an item to collect</p>
            )}
          </div>
          <div className="flex gap-3 justify-center mt-2">
            <button
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
              disabled={!selectedItem}
              onClick={() => {
                handleSaveCollection();
              }}
            >
              OK
            </button>
            <button
              onClick={() => {
                setSelectedItem(null);
                setSelectedQty(1);
                onClose();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectItemModal;
