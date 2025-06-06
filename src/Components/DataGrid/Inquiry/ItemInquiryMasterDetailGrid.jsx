import StandardDataGridComponent from '../../BaseDataGrid';
import { useState, useEffect, useMemo } from 'react';
import DataGrid, {
    Column,
    Paging,
    Scrolling,
    Pager,
    MasterDetail
} from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import TabPanel from 'devextreme-react/tab-panel';
import CustomStore from 'devextreme/data/custom_store';
import { GetItemHistorys } from '../../../api/inquiryapi'; 

// const DetailTabs = ({ data }) => {
//   const [historyStore, setHistoryStore] = useState(null);

//   useEffect(() => {
//     if (!data) return;

//     const store = new CustomStore({
//       key: 'docNo', // ensure this is a unique field
//       load: async (loadOptions) => {
//         const { skip = 0, take = 20 } = loadOptions;

//         try {
//           const res = await GetItemHistorys({
//             companyId: sessionStorage.getItem('companyId'),
//             id: data?.itemId,
//             fromDate: data?.fromDate,
//             toDate: data?.toDate,
//             offset: skip,
//             limit: take,
//           });

//           const filtered = res.data?.filter(h => h.itemCode === data.itemCode) || [];
//           console.log('Filtered History Data:', filtered);
//           return {
//             data: filtered,
//             totalCount: res.totalRecords || 1000, // if totalRecords is returned, use that
//           };
//         } catch (err) {
//           console.error('Error loading detail history:', err);
//           return {
//             data: [],
//             totalCount: 0,
//           };
//         }
//       },
//     });

//     setHistoryStore(() => store);
//   }, [data]);

//   const tabs = useMemo(() => [
//     {
//       title: 'Item History',
//       component: () =>
//         historyStore ? (
//           <DataGrid
//             dataSource={historyStore}
//             showBorders={true}
//             columnAutoWidth={true}
//             height={250}
//             remoteOperations={{ paging: true }}
//           >
//             <Paging enabled={true} pageSize={20} />
//             <Pager showPageSizeSelector={true} showNavigationButtons={true} showInfo={true} />
//             <Column dataField="docType" caption="Doc Type" width={"100px"}/>
//             <Column dataField="docNo" caption="Doc No" width={"130px"} />
//             <Column
//               width={"130px"}
//               dataField="docDate"
//               caption="Doc Date"
//               dataType="date"
//               calculateDisplayValue={(rowData) => {
//                 const date = new Date(rowData.docDate);
//                 return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
//               }}
//             />
//             <Column dataField="name" caption="Debtor Name" width={"300px"}/>
//             <Column dataField="uom" caption="UOM" width={"70px"}/>
//             <Column dataField="qty" caption="Qty" width={"50px"}/>
//             <Column dataField="unitPrice" caption="Unit Price" format={{ 
//                     type: "currency", 
//                     currency: "MYR", 
//                     precision: 2 // Allows 2 decimal places
//                 }} width={"150px"}/>
//             <Column dataField="discount" caption="Discount" width={"70px"}/>
//             <Column dataField="discountAmount" caption="Discount Amt" format={{ 
//                     type: "currency", 
//                     currency: "MYR", 
//                     precision: 2 // Allows 2 decimal places
//                 }} width={"100px"} />
//             <Column dataField="subTotal" caption="Subtotal" format={{ 
//                     type: "currency", 
//                     currency: "MYR", 
//                     precision: 2 // Allows 2 decimal places
//                 }} width={"150px"}/>
//           </DataGrid>
//         ) : (
//           <div>Loading...</div>
//         ),
//     },
//   ], [historyStore]);

//   return (
//     <TabPanel
//       items={tabs}
//       itemTitleRender={(item) => item.title}
//       itemComponent={({ data }) => <>{data.component()}</>}
//     />
//   );
// };

const ItemInquiryMasterDataDetailGrid = ({ ref, itemData }) => {

  const [formData, setFormData] = useState({
  itemCode: '',
  isActive: false,
  description: '',
  desc2: '',
  itemGroupCode: '',
  itemTypeCode: '',
  remark: '',
  uom: '',
  price: '',
  cost: '',
  barCode: '',
  classification: '',
  balQty: ''
});

  useEffect(() => {
  const loadData = async () => {
    if (itemData && typeof itemData.load === 'function') {
      try {
        const result = await itemData.load();
        if (result?.data?.length > 0) {
          const selected = result.data[0];

          setFormData({
            itemCode: selected.itemCode || '',
            isActive: selected.isActive ?? false,
            description: selected.description || '',
            desc2: selected.desc2 || '',
            itemGroupCode: selected.itemGroupCode || '',
            itemTypeCode: selected.itemTypeCode || '',
            remark: selected.remark || '',
            uom: selected.uom || '',
            price: typeof selected.price === 'number' ? selected.price : 0,
            cost: typeof selected.cost === 'number' ? selected.cost : 0,
            barCode: selected.barCode || '',
            classification: selected.classification || '',
            balQty: typeof selected.balQty === 'number' ? selected.balQty : 0
          });
          const store = new CustomStore({
                  key: 'docNo',
                  load: async (loadOptions) => {
                    const { skip = 0, take = 20 } = loadOptions;
                    const res = await GetItemHistorys({
                      companyId: sessionStorage.getItem('companyId'),
                      id: selected?.itemId,
                      fromDate: selected?.fromDate,
                      toDate: selected?.toDate,
                      offset: skip,
                      limit: take,
                    });
                    const filtered = res.data?.filter(h => h.itemCode === selected.itemCode) || [];
                    return {
                      data: filtered,
                      totalCount: res.totalRecords || filtered.length,
                    };
                  },
                });

                setHistoryStore(() => store);
              }
            } catch (error) {
              console.error('Failed to load item data:', error);
            }
          }
        };

        loadData();
      }, [itemData]);

    const [historyStore, setHistoryStore] = useState(null);

    return (
    <>
    {formData.itemCode && (
      <div className="grid grid-cols-4 gap-4 bg-white p-6 rounded shadow mt-4">
        {[
          { label: 'Item Code', field: 'itemCode' },
          { label: 'Description', field: 'description' },
          { label: 'Desc2', field: 'desc2' },
          { label: 'Item Group Code', field: 'itemGroupCode' },
          { label: 'Item Type Code', field: 'itemTypeCode' },
          { label: 'UOM', field: 'uom' },
          { label: 'Price', field: 'price', isCurrency: true },
          { label: 'Cost', field: 'cost', isCurrency: true },
          { label: 'BarCode', field: 'barCode' },
          { label: 'Classification', field: 'classification' },
          { label: 'BalQty', field: 'balQty', isCurrency: true },
          { label: 'Remark', field: 'remark' }
        ].map(({ label, field, isCurrency }) => (
          <div key={field} className="flex flex-col w-full">
            <label className="mb-1">{label}</label>
            <input
              type={isCurrency ? 'number' : 'text'}
              value={isCurrency
                ? (Number(formData[field]) || 0).toFixed(2)
                : formData[field] || ''}
              readOnly
              className="border px-2 h-[40px] w-full"
            />
          </div>
        ))}
        <div className="flex flex-col w-full">
          <div className="flex items-center h-[40px]">
            <input
              type="checkbox"
              checked={formData.isActive}
              readOnly
              className="w-5 h-5"
            />
            <span className="ml-2 text-lg">Active</span>
          </div>
        </div>
      </div>
      )}

      {/* History DataGrid */}
      {historyStore && (
        <div className="mt-6">
          <StandardDataGridComponent
            ref={ref}
            height={490}
            dataSource={historyStore}
            searchPanel={true}
            pager={true}
            pageSizeSelector={true}
            showBorders={true}
            remoteOperations={{ paging: true }}
          >
            <Column dataField="docType" caption="Doc Type" width={"100px"}/>
            <Column dataField="docNo" caption="Doc No" width={"130px"} />
            <Column
              width={"130px"}
              dataField="docDate"
              caption="Doc Date"
              dataType="date"
              calculateDisplayValue={(rowData) => {
                const date = new Date(rowData.docDate);
                return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
              }}
            />
            <Column dataField="name" caption="Debtor Name" width={"300px"}/>
            <Column dataField="uom" caption="UOM" width={"70px"}/>
            <Column dataField="qty" caption="Qty" width={"50px"}/>
            <Column dataField="unitPrice" caption="Unit Price" format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2 // Allows 2 decimal places
                }} width={"150px"}/>
            <Column dataField="discount" caption="Discount" width={"70px"}/>
            <Column dataField="discountAmount" caption="Discount Amt" format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2 // Allows 2 decimal places
                }} width={"100px"} />
            <Column dataField="subTotal" caption="Subtotal" format={{ 
                    type: "currency", 
                    currency: "MYR", 
                    precision: 2 // Allows 2 decimal places
                }} width={"150px"}/>
          </StandardDataGridComponent>
        </div>
      )}
    </>
  );
};

export default ItemInquiryMasterDataDetailGrid;