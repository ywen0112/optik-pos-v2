import { useState, useCallback, useRef } from "react";
import DatePicker from "react-datepicker";
import DropDownBox from "devextreme-react/drop-down-box";
import CustomerDataGrid from "../../Components/DataGrid/CustomerDataGrid";
import ItemDropDownBoxComponent from "../../Components/DropDownBox/ItemDropDownBoxComponent";
import CustomStore from "devextreme/data/custom_store";
import DataGrid, {
  Column,
  Paging,
  Selection,
  Scrolling,
  SearchPanel
} from 'devextreme-react/data-grid';
import "react-datepicker/dist/react-datepicker.css";
import { getInfoLookUp } from "../../api/infolookupapi";
import { GetDebtor } from "../../api/maintenanceapi";
import SalesInquiryMasterDetailGrid from "../../Components/DataGrid/Inquiry/SalesInquiryMasterDetailGrid";
import { GetSalesInquiry } from "../../api/inquiryapi";
import CustomInput from "../../Components/input/dateInput";
import CashSalesPaymentModal from "../../modals/Transactions/CashSalesPaymentModal";
import SalesOrderPaymentModal from "../../modals/Transactions/SalesOrderPaymentModal";
import ErrorModal from "../../modals/ErrorModal";
import NotificationModal from "../../modals/NotificationModal";
import ReportSelectionModal from "../../modals/ReportSelectionModel";
import { GetJobSheetForm, GetSalesDocPaymentReport, GetSalesDocReport } from "../../api/reportapi";
import CollectItemModal from "../../modals/Transactions/CollectItemModal";

const CustomerGridBoxDisplayExpr = (item) =>
  item ? `${item.debtorCode}-${item.companyName}` : "";

const CustomerGridColumns = [
  { dataField: "debtorCode", caption: "Code", width: "30%" },
  { dataField: "companyName", caption: "Name", width: "50%" }
];

const SalesInquiry = () => {
  const companyId = sessionStorage.getItem("companyId");
  const userId = sessionStorage.getItem("userId");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const oneMonthBefore = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    return oneMonthBefore;
  });


  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCustomerBoxOpen, setIsCustomerBoxOpen] = useState(false);
  const [data, setData] = useState(null);
  const [reportSelectionModal, setReportSelectionModal] = useState({ isOpen: false, docId: "", docType: "" });
  const gridRef = useRef(null);

  const customerStore = new CustomStore({
    key: "debtorId",

    load: async (loadOptions) => {
      const filter = loadOptions.filter;
      let keyword = filter?.[2][2] || "";

      const params = {
        keyword: keyword || "",
        offset: loadOptions.skip,
        limit: loadOptions.take,
        type: "debtor",
        companyId,
      };
      const res = await getInfoLookUp(params);
      return {
        data: res.data,
        totalCount: res.totalRecords,
      };
    },
    byKey: async (key) => {
      if (!key) return null;
      const res = await GetDebtor({
        companyId,
        userId,
        id: key
      });
      return res.data;
    },
  });

  const handleCustomerGridBoxValueChanged = (e) => {
    if (!e.value) {
      setSelectedCustomer(null);
    }
  };

  const CustomerDataGridOnSelectionChanged = useCallback((e) => {
    const selected = e.selectedRowsData?.[0];
    if (selected) {
      setSelectedCustomer(selected);
      setIsCustomerBoxOpen(false);
    }
  }, []);

  const onCustomerGridBoxOpened = useCallback((e) => {
    if (e.name === 'opened') {
      setIsCustomerBoxOpen(e.value);
    }
  }, []);

  const CustomerDataGridRender = useCallback(
    () => (
      <DataGrid
        dataSource={customerStore}
        columns={CustomerGridColumns}
        hoverStateEnabled={true}
        showBorders={true}
        selectedRowKeys={selectedCustomer?.debtorId}
        onSelectionChanged={CustomerDataGridOnSelectionChanged}
        height="300px"
        remoteOperations={{
          paging: true,
          filtering: true,
        }}
      >
        <Selection mode="single" />
        <Paging
          enabled={true}
          pageSize={10}
        />
        <Scrolling mode="infinite" />

        <SearchPanel
          visible={true}
          width="100%"
          highlightSearchText={true}
        />
      </DataGrid>
    ), []);

  const handleGetInquiry = async () => {
    const store = new CustomStore({
      key: "docNo",
      load: async (loadOptions) => {
        const { skip, take } = loadOptions;

        const params = {
          companyId,
          id: selectedCustomer?.debtorId,
          fromDate: startDate,
          toDate: endDate,
          offset: skip || 0,
          limit: take || 10,
        };

        if (selectedCustomer?.debtorId) {
          params.debtorId = selectedCustomer.debtorId;
        }

        try {
          const res = await GetSalesInquiry(params);

          if (!res.success) {
            throw new Error(res.errorMessage || "Failed to retrieve sales inquiry data.");
          }

          const enrichedSalesData = res.data?.map(sale => {
            if (!sale.payments) return { ...sale, outstanding: sale.total };

            const paymentsTotal = sale.payments.reduce((sum, p) =>
              sum + (p.cashAmount || 0) + (p.creditCardAmount || 0) + (p.eWalletAmount || 0), 0);

            const outstanding = sale.total - paymentsTotal;
            return { ...sale, outstanding };
          });

          return {
            data: enrichedSalesData,
            totalCount: res.totalRecords,
          };
        } catch (error) {
          setErrorModal({
            title: "Inquiry Error",
            message: error.errorMessage || "An unexpected error occurred.",
          });
        }
      }
    });

    setData(() => store);
    // setDataStoreKey(prev => prev + 1); // force re-binding
  };


  const [salesPayment, setSalesPayment] = useState(false);
  const [paymentItem, setPaymentItem] = useState({});
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });

  const handleAddPaymentForSales = (item) => {
    setPaymentItem(item);
    setSalesPayment(true);
  }

  const handleProcessAfterSavePayment = async ({ action }) => {
    if (gridRef.current) {
      gridRef.current.instance.refresh();
    }
    if (action === "save-print") {
      setReportSelectionModal({ isOpen: true, docId: paymentItem?.documentId, docType: paymentItem?.docType })
    }
  }

  const [collectModal, setCollectModal] = useState(false);
  const [collectItem, setCollectItem] = useState({});

  const handleCollectForSales = (item) => {
    setCollectItem(item);
    setCollectModal(true);
  }

  const handlePrintReport = async (item) => {
    setReportSelectionModal({ isOpen: true, docId: item?.documentId, docType: item?.docType })
  }

  const handleSelectedReport = async (selectedReports) => {
    setReportSelectionModal({ isOpen: false });

    for (const report of selectedReports) {
      let res;
      try {
        if (report.reportType === "SalesOrder") {
          res = await GetSalesDocReport({
            companyId: companyId,
            userId: userId,
            id: reportSelectionModal.docId,
            name: report.reportName,
            isCashSales: reportSelectionModal.docType === "Cash Sales",
          });
        } else if (report.reportType === "SalesOrderPayment") {
          res = await GetSalesDocPaymentReport({
            companyId: companyId,
            userId: userId,
            id: reportSelectionModal.docId,
            name: report.reportName,
            isCashSales: reportSelectionModal.docType === "Cash Sales",
          });
        } else if (report.reportType === "JobSheetForm"){
          res = await GetJobSheetForm({
            companyId: companyId,
            userId: userId,
            id: reportSelectionModal.docId,
            name: report.reportName
          });
        }

        if (res?.success) {
          const reportName = report.reportName;
          const fileResponse = await fetch(`https://report.absplt.com/reporting/GetReport/${companyId}/${reportName}/${userId}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/pdf'
            }
          });

          if (!fileResponse.ok) {
            throw new Error('File download failed');
          }

          const blob = await fileResponse.blob();
          const url = window.URL.createObjectURL(blob);

          const popup = window.open('', '_blank', 'width=800,height=600');
          if (!popup) {
            throw new Error("Popup blocked. Please allow popups for this site.");
          }

          popup.document.write(`
                      <html>
                          <head><title>${reportName}</title></head>
                          <body style="margin:0">
                              <iframe src="${url}" frameborder="0" style="width:100%; height:100%;"></iframe>
                          </body>
                      </html>
                  `);
          popup.document.close();
        }

      } catch (error) {
        setErrorModal({ title: "Download error", message: error.message });
      }
    }

    setReportSelectionModal({ docId: "", docType: "" });
  };

  return (
    <>
      <ReportSelectionModal
        isOpen={reportSelectionModal.isOpen}
        onCancel={() => setReportSelectionModal({ isOpen: false, docId: "", docType: "" })}
        onSelect={handleSelectedReport}
        companyId={companyId}
        isCashSales={reportSelectionModal?.docType === "Cash Sales"}
      />
      <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
      <div className="space-y-6 p-6 bg-white rounded shadow">
        <div className="grid grid-cols-1 gap-2 w-1/2">
          <div className="w-full">
            <label className="block text-secondary font-medium mb-1">Date Range</label>
            <div className="flex flex-row gap-2">
              <DatePicker
                customInput={<CustomInput width="w-[400px]" />}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
              />
              <span className="text-secondary self-center">to</span>
              <DatePicker
                customInput={<CustomInput width="w-[400px]" />}
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>

          <div className="w-full">
            <label className="block text-secondary font-medium mb-1">Customer</label>
            <DropDownBox
              id="CustomerSelection"
              className="border rounded p-1 w-1/2 h-[34px]"
              value={selectedCustomer?.debtorId || null}
              opened={isCustomerBoxOpen}
              openOnFieldClick={true}
              valueExpr='debtorId'
              displayExpr={CustomerGridBoxDisplayExpr}
              placeholder="Select Customer"
              showClearButton={true}
              onValueChanged={handleCustomerGridBoxValueChanged}
              dataSource={customerStore}
              onOptionChanged={onCustomerGridBoxOpened}
              contentRender={CustomerDataGridRender}
              dropDownOptions={{
                width: 400
              }}
            />
          </div>

        </div>

        <div className="pt-6 flex space-x-4">
          <button onClick={handleGetInquiry} className="bg-primary text-white px-6 py-2 rounded">Search</button>
        </div>

        <div className="mt-6">
          <SalesInquiryMasterDetailGrid
            ref={gridRef}
            // key={dataStoreKey}
            salesData={data}
            onPay={handleAddPaymentForSales}
            onCollect={handleCollectForSales}
            onPrint={handlePrintReport}
          />
        </div>


      </div>
      {paymentItem && paymentItem?.docType === "Cash Sales" && (
        <CashSalesPaymentModal
          isOpen={salesPayment}
          onClose={() => setSalesPayment(false)}
          total={paymentItem?.outstanding}
          companyId={companyId}
          userId={userId}
          cashSalesId={paymentItem?.documentId}
          onError={setErrorModal}
          onSave={handleProcessAfterSavePayment}
        />
      )}

      {paymentItem && paymentItem?.docType === "Sales Order" && (
        <SalesOrderPaymentModal
          isOpen={salesPayment}
          onClose={() => setSalesPayment(false)}
          total={paymentItem?.outstanding}
          companyId={companyId}
          userId={userId}
          salesOrderId={paymentItem?.documentId}
          onError={setErrorModal}
          onSave={handleProcessAfterSavePayment}
        />
      )}

      <CollectItemModal
        isOpen={collectModal}
        onClose={() => setCollectModal(false)}
        salesOrder={collectItem}
        companyId={companyId}
        userId={userId}
        ref={gridRef}
      />
    </>
  );
};

export default SalesInquiry;
