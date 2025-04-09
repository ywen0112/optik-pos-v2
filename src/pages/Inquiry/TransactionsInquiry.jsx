import React, { useState, useEffect } from "react";
import { Eye, EyeOff, FileText, Ban, CheckCircle, DollarSign } from "lucide-react";
import { GetCounterSessionRecords, GetCounterSummaryReport, GetCashTransactionsRecords, VoidCashTransaction, GetSales, GetPurchases, VoidSales, VoidPurchases} from "../../apiconfig";
import ErrorModal from "../../modals/ErrorModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import PaymentModal from "../../modals/PaymentModal";
import ReportSelectionModal from "../../modals/ReportSelectionModel";

const TransactionsInquiry = () => {
  const [activeTab, setActiveTab] = useState("Counter Session");
  const [tableData, setTableData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const customerId = localStorage.getItem("customerId");
  const userId = localStorage.getItem("userId");
  const locationId = localStorage.getItem("locationId");
  const [pagination, setPagination] = useState({
    "Counter Session": {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
    },
    "Cash Transactions": {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
    },
    "Sales Invoice": {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
    },
    "Purchases Invoice": {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
    },
    "Stock Adjustment": {            
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    },
  });
  const [errorModal, setErrorModal] = useState({title: "", message: "" });
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    transactionId: null,
    type: null,
  });
  const [reportSelectionModal, setReportSelectionModal] = useState({
    isOpen: false,
    docId: null
  })
  const [loading, setLoading] = useState(false); 

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentTab, setPaymentTab] = useState("Cash Payment");      
  const [multiPaymentMethods, setMultiPaymentMethods] = useState([]);                     
 
  useEffect(() => {
    setTableData([]); 
    setLoading(true);
    if (activeTab === "Counter Session") {
      fetchCounterSessions();
    }
     else if (activeTab === "Cash Transactions") {
      fetchCashTransactions();
    }
    else if (activeTab === "Sales Invoice") {
      fetchSalesTransactions();
    }
    else if (activeTab === "Purchases Invoice") {
      fetchPurchaseTransactions();
    }
  }, [activeTab, pagination[activeTab].currentPage]);

  const fetchCounterSessions = async () => {
    const offset = (pagination[activeTab].currentPage - 1) * pagination[activeTab].itemsPerPage;
    const requestBody = {
      customerId: Number(customerId),
      keyword: "",
      offset: offset,
      limit: pagination[activeTab].itemsPerPage,
    };
    
    try {
      const response = await fetch(GetCounterSessionRecords, {
        method: "POST",
        headers: {
          "Accept": "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (data.success) {
        const records = data.data.counterSessionRecords || [];
        const total = data.data.totalRecords || 0;

        setTableData(records);
        setPagination((prev) => ({
          ...prev,
          [activeTab]: { ...prev[activeTab], totalItems: total },
        }));
      } else {
        throw new Error(data.errorMessage || "Failed to fetch counter session records.");
      }
    } catch (error) {
      setErrorModal({ title: "Fetch Error",  message: error.message });
    } finally {
      setLoading(false); 
    }
  };

  const fetchCashTransactions = async () => {
    const offset = (pagination[activeTab].currentPage - 1) * pagination[activeTab].itemsPerPage;
    const requestBody = {
      customerId: Number(customerId),
      keyword: "",
      offset: offset,
      limit: pagination[activeTab].itemsPerPage,
    };
    try {
      const response = await fetch(GetCashTransactionsRecords, {
        method: "POST",
        headers: {
          "Accept": "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (data.success) {
        const records = data.data.cashTransactionsRecords || [];
        const total = data.data.totalRecods || 0;

        setTableData(records);
        setPagination((prev) => ({
          ...prev,
          [activeTab]: { ...prev[activeTab], totalItems: total },
        }));
      } else {
        throw new Error(data.errorMessage || "Failed to fetch cash transactions records.");
      }
    } catch (error) {
      setErrorModal({ title: "Fetch Error", message: error.message });
    } finally {
      setLoading(false); 
    }
  };

  const fetchSalesTransactions = async () => {
    const offset = (pagination[activeTab].currentPage - 1) * pagination[activeTab].itemsPerPage;
    const requestBody = {
      customerId: Number(customerId),
      keyword: "",
      offset: offset,
      limit: pagination[activeTab].itemsPerPage,
    };
  
    try {
      const response = await fetch(GetSales, {
        method: "POST",
        headers: {
          "Accept": "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      if (data.success) {
        const records = data.data.salesRecords || [];
        const total = data.data.totalRecords || 0;
  
        setTableData(records);
        setPagination((prev) => ({
          ...prev,
          [activeTab]: { ...prev[activeTab], totalItems: total },
        }));
      } else {
        throw new Error(data.errorMessage || "Failed to fetch sales transactions.");
      }
    } catch (error) {
      setErrorModal({ title: "Fetch Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPurchaseTransactions = async () => {
    const offset = (pagination[activeTab].currentPage - 1) * pagination[activeTab].itemsPerPage;
    const requestBody = {
      customerId: Number(customerId),
      keyword: "",
      offset: offset,
      limit: pagination[activeTab].itemsPerPage,
    };
  
    try {
      const response = await fetch(GetPurchases, {
        method: "POST",
        headers: {
          "Accept": "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      if (data.success) {
        const records = data.data.purchaseRecords || [];
        const total = data.data.totalRecord || 0;
  
        setTableData(records);
        setPagination((prev) => ({
          ...prev,
          [activeTab]: { ...prev[activeTab], totalItems: total },
        }));
      } else {
        throw new Error(data.errorMessage || "Failed to fetch purchase transactions.");
      }
    } catch (error) {
      setErrorModal({ title: "Fetch Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };  

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(pagination[activeTab].totalItems / pagination[activeTab].itemsPerPage)) {
      setPagination((prev) => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], currentPage: newPage },
      }));
    }
  };

  const toggleExpandRow = (index) => {
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const exportReport = async (counterSessionId) => {
    try {
      const response = await fetch(`${GetCounterSummaryReport}${counterSessionId}`, {
        method: "GET",
        headers: {
          "Accept": "text/plain",
        },
      });
      const data = await response.json();

      if (response.ok && data.success) {
        const byteCharacters = atob(data.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const currentDate = new Date().toISOString().split("T")[0]; 
        const fileName = `CounterSummaryReport_${currentDate}.pdf`;

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        throw new Error(data.errorMessage || "Failed to export the report.");
      }
    } catch (error) {
      setErrorModal({
        title: "Export Report Error",
        message: error.message,
      });
    }
  };

  const voidTransaction = async () => {
    if (!confirmationModal.transactionId) return;

    const requestBody = {
      customerId: Number(customerId),
      userId: userId,
      locationId: locationId,  
      id: confirmationModal.transactionId, 
    };
  
    try {
      const response = await fetch(VoidCashTransaction, {
        method: "POST",
        headers: {
          "Accept": "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      if (data.success) {
        setTableData((prevData) =>
          prevData.map((transaction) =>
            transaction.cashTransactionId === confirmationModal.transactionId
              ? { ...transaction, isVoid: true }
              : transaction
          )
        );
        setConfirmationModal({ isOpen: false, transactionId: null });
      } else {
        throw new Error(data.errorMessage || "Failed to void transaction.");
      }
    } catch (error) {
      setErrorModal({ title: "Void Transaction Error", message: error.message });
    }
  };
  
  const voidSalesTransaction = async () => {
    if (!confirmationModal.transactionId) return;
  
    const requestBody = {
      customerId: Number(customerId),
      userId: userId,
      locationId: locationId,
      id: confirmationModal.transactionId,
    };
  
    try {
      const response = await fetch(VoidSales, {
        method: "POST",
        headers: {
          "Accept": "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      if (data.success) {
        setTableData((prevData) =>
          prevData.map((row) =>
            row.salesId === confirmationModal.transactionId
              ? { ...row, isVoid: true }
              : row
          )
        );
        setConfirmationModal({ isOpen: false, transactionId: null, type: null });
      } else {
        throw new Error(data.errorMessage || "Failed to void sales transaction.");
      }
    } catch (error) {
      setErrorModal({ title: "Void Sales Error", message: error.message });
    }
  };
  
  const voidPurchaseTransaction = async () => {
    if (!confirmationModal.transactionId) return;
  
    const requestBody = {
      customerId: Number(customerId),
      userId: userId,
      locationId: locationId,
      id: confirmationModal.transactionId,
    };
  
    try {
      const response = await fetch(VoidPurchases, {
        method: "POST",
        headers: {
          "Accept": "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      if (data.success) {
        setTableData((prevData) =>
          prevData.map((row) =>
            row.purchaseId === confirmationModal.transactionId
              ? { ...row, isVoid: true }
              : row
          )
        );
        setConfirmationModal({ isOpen: false, transactionId: null, type: null });
      } else {
        throw new Error(data.errorMessage || "Failed to void purchase transaction.");
      }
    } catch (error) {
      setErrorModal({ title: "Void Purchase Error", message: error.message });
    }
  };  

  const openPaymentModal = (invoice) => {
    const type = invoice.salesId ? "Sales" : invoice.purchaseId ? "Purchase" : null;
    const id = invoice.salesId || invoice.purchaseId || null;
  
    setSelectedInvoice({ ...invoice, type, id });
    setPaymentTab("Cash Payment");
    setPaymentModalOpen(true);
  };
  
  const closePaymentModal = () => {
    setSelectedInvoice(null);
    setPaymentModalOpen(false);
  };

  return (
    <div>
      <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() =>setErrorModal({ title: "", message: "" })}/>
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title="Confirm Void Transaction"
        message="Are you sure you want to void this transaction? This action cannot be undone."
        onConfirm={
          confirmationModal.type === "sales"
            ? voidSalesTransaction
            : confirmationModal.type === "purchase"
            ? voidPurchaseTransaction
            : voidTransaction
        }
        onCancel={() => setConfirmationModal({ isOpen: false, transactionId: null, type: null })}
      />
      <ReportSelectionModal 
      isOpen={reportSelectionModal.isOpen} 
      onCancel={() => setReportSelectionModal({isOpen: false, docId: null})}
      docId={reportSelectionModal.docId}
      customerId={customerId} />
                    

      <nav className="flex">
        {["Counter Session", "Sales Invoice", "Purchases Invoice", "Stock Adjustment", "Cash Transactions"].map((tab) => ( 
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative text-sm font-medium bg-transparent border-none ${
              activeTab === tab ? "text-secondary font-semibold after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-primary" : "text-gray-500 hover:text-secondary"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
      
      {activeTab === "Counter Session" && <CounterSessionTable tableData={tableData} expandedRows={expandedRows} toggleExpandRow={toggleExpandRow} exportReport={exportReport} loading={loading} pagination={pagination[activeTab]}/>}
      {activeTab === "Cash Transactions" && <CashTransactionsTable tableData={tableData} setConfirmationModal={setConfirmationModal} loading={loading} pagination={pagination[activeTab]}/>}
      {activeTab === "Sales Invoice" && <SalesInvoiceTable tableData={tableData} setConfirmationModal={setConfirmationModal} setReportSelectionModal={setReportSelectionModal} loading={loading} pagination={pagination[activeTab]}
        openPaymentModal={openPaymentModal}
        closePaymentModal={closePaymentModal}
        paymentModalOpen={paymentModalOpen}
        selectedInvoice={selectedInvoice}
        paymentTab={paymentTab}
        setPaymentTab={setPaymentTab}
      />}
      {activeTab === "Purchases Invoice" && <PurchaseInvoiceTable tableData={tableData} setConfirmationModal={setConfirmationModal} loading={loading} pagination={pagination[activeTab]}
        openPaymentModal={openPaymentModal}
        closePaymentModal={closePaymentModal}
        paymentModalOpen={paymentModalOpen}
        selectedInvoice={selectedInvoice}
        paymentTab={paymentTab}
        setPaymentTab={setPaymentTab}
      />}
      {activeTab === "Stock Adjustment" && (
        <div className="mt-6 p-6 text-center text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg bg-white shadow">
          Stock Adjustment is currently under maintenance.
        </div>
      )}

      <div className="flex justify-between p-4 text-xs text-secondary mt-4">
        <span>
          Showing {(pagination[activeTab].currentPage - 1) * pagination[activeTab].itemsPerPage + 1} to{" "}
          {Math.min(pagination[activeTab].currentPage * pagination[activeTab].itemsPerPage, pagination[activeTab].totalItems)} of{" "}
          {pagination[activeTab].totalItems}
        </span>
        <div className="flex">
        <button
          onClick={() => handlePageChange(pagination[activeTab].currentPage - 1)}
          disabled={pagination[activeTab].currentPage === 1}
          className={`px-2 py-1 bg-white border rounded ${
            pagination[activeTab].currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"
          }`}
        >
          ←
        </button>

        <button
          onClick={() => handlePageChange(pagination[activeTab].currentPage + 1)}
          disabled={pagination[activeTab].currentPage * pagination[activeTab].itemsPerPage >= pagination[activeTab].totalItems}
          className={`px-2 py-1 bg-white border rounded ${
            pagination[activeTab].currentPage * pagination[activeTab].itemsPerPage >= pagination[activeTab].totalItems
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100 cursor-pointer"
          }`}
        >
          →
        </button>
        </div>
      </div>
      {paymentModalOpen && selectedInvoice && (
        <PaymentModal
          selectedInvoice={selectedInvoice}
          closePaymentModal={closePaymentModal}
          paymentTab={paymentTab}
          setPaymentTab={setPaymentTab}
          multiPaymentMethods={multiPaymentMethods}
          setMultiPaymentMethods={setMultiPaymentMethods}
          onPaymentSuccess={() => {
            if (selectedInvoice?.type === "Sales") {
              fetchSalesTransactions();
            } else if (selectedInvoice?.type === "Purchase") {
              fetchPurchaseTransactions();
            }
          }}
        />
      )}
    </div>
  );
};

const CounterSessionTable = ({ tableData, expandedRows, toggleExpandRow, exportReport, loading, pagination }) => {
  return (
    <div className="mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
      {loading ? (
        <p className="text-center py-4 text-gray-500">Loading...</p>
      ) : (
      <table className="w-full border-collapse">
        <thead className="bg-gray-200 border-b-2 border-gray-100 font-bold">
          <tr className="text-left text-xs text-secondary">
            <th className="px-4 py-3">NO</th>
            <th className="px-1 py-3">SESSION CODE</th>
            <th className="px-1 py-3">OPENING BALANCE</th>
            <th className="px-1 py-3">CLOSING BALANCE</th>
            <th className="px-1 py-3">VARIANCE</th>
            <th className="px-1 py-3">OPENED BY</th>
            <th className="px-1 py-3">CLOSED BY</th>
            <th className="px-1 py-3">OPEN TIME</th>
            <th className="px-1 py-3">CLOSED TIME</th>
            <th className="px-1 py-3">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <React.Fragment key={row.counterSessionId || index}>
              <tr className="text-xs border-b-2 border-gray-100 font-medium text-secondary">
                <td className="pl-4 p-2">
                  {(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}
                </td>
                <td className="p-1">{row.sessionCode}</td>
                <td className="p-1">{row.openingBal ?? "-"}</td>
                <td className="p-1">{row.closingBal ?? "-"}</td>
                <td className="p-1">{row.variance ?? "-"}</td>
                <td className="p-1">{row.openBy ?? "-"}</td>
                <td className="p-1">{row.closeBy ?? "-"}</td>
                <td className="p-1">{new Date(row.openTime).toLocaleString()}</td>
                <td className="p-1">{row.closeTime ? new Date(row.closeTime).toLocaleString() : "-"}</td>
                <td className="p-1 flex">
                  <button className="text-green-500 bg-transparent px-0" onClick={() => toggleExpandRow(index)}>
                    {expandedRows[index] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  {/* <button className="text-blue-500 bg-transparent" onClick={() => exportReport(row.counterSessionId)}>
                    <FileText size={14} />
                  </button> */}
                </td>
              </tr>
              {expandedRows[index] && (
                <tr>
                  <td colSpan={6} className="p-2 bg-transparent text-left text-xs text-secondary">
                    <table className="w-full border-collapse border">
                      <thead className="bg-gray-100 border-b">
                        <tr>
                          <th className="p-2 border">Sales Amount</th>
                          <th className="p-2 border">Purchase Amount</th>
                          <th className="p-2 border">Cash In</th>
                          <th className="p-2 border">Cash Out</th>
                          <th className="p-2 border">Expected Closing Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border">{row.salesAmt}</td>
                          <td className="p-2 border">{row.purchaseAmt}</td>
                          <td className="p-2 border">{row.cashInAmt}</td>
                          <td className="p-2 border">{row.cashOutAmt}</td>
                          <td className="p-2 border">{row.expectedClosingBalance}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
              </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
};

const CashTransactionsTable = ({ tableData, setConfirmationModal, loading, pagination }) => {
  return (
    <div className="mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
      {loading ? (
        <p className="text-center py-4 text-gray-500">Loading...</p>
      ) : (
      <table className="w-full border-collapse">
        <thead className="bg-gray-200 border-b-2 border-gray-100 font-bold">
          <tr className="text-left text-xs text-secondary">
            <th className="px-4 py-3">NO</th>
            <th className="px-1 py-3">DOC NO</th>
            <th className="px-1 py-3">AMOUNT</th>
            <th className="px-1 py-3">CASH OUT</th>
            <th className="px-1 py-3">VOID</th>
            <th className="px-1 py-3">REMARK</th>
            <th className="px-1 py-3">CREATED BY</th>
            <th className="px-1 py-3">CREATED TIME</th>
            <th className="px-1 py-3">LAST MODIFIED BY</th>
            <th className="px-1 py-3">LAST MODIFIED TIME</th>
            <th className="px-2 py-3">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={row.cashTransactionId || index} className="text-xs border-b-2 border-gray-100 font-medium text-secondary">
              <td className="pl-4 p-2">
                {(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}  
              </td>
              <td className="p-1">{row.docNo != null ? row.docNo : "-"}</td>
              <td className="p-1">{row.effectedAmount != null ? row.effectedAmount : "-"}</td>
              <td className="p-1">{row.isCashOut ? "Yes" : "No"}</td>
              <td className="p-1">{row.isVoid ? "Yes" : "No"}</td>
              <td className="p-1">{row.remarks != null ? row.remarks : "-"}</td>
              <td className="p-1">{row.createdBy != null ? row.createdBy : "-"}</td>
              <td className="p-1">{row.createdTimeStamp ? new Date(row.createdTimeStamp).toLocaleString() : "-"}</td>
              <td className="p-1">{row.lastModifiedBy != null ? row.lastModifiedBy : "-"}</td>
              <td className="p-1">{row.lastModifiedTimeStamp ? new Date(row.lastModifiedTimeStamp).toLocaleString() : "-"}</td>
              <td className="p-1 text-center">
                {row.isVoid ? (
                  <Ban size={14} className="text-gray-400 bg-transparent cursor-not-allowed inline-block" />
                ) : (
                  <button onClick={() => setConfirmationModal({ isOpen: true, transactionId: row.cashTransactionId })} className="text-red-500 bg-transparent inline-block">
                    <CheckCircle size={14} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
};

const SalesInvoiceTable = ({ tableData, loading, pagination, setConfirmationModal, setReportSelectionModal,openPaymentModal }) => {
  const [expandedRows, setExpandedRows] = useState({});


  const toggleExpandRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  

  return (
    <div className="mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
      {loading ? (
        <p className="text-center py-4 text-gray-500">Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 border-b-2 border-gray-100 font-bold">
            <tr className="text-left text-xs text-secondary">
              <th className="px-4 py-3">NO</th>
              <th className="px-1 py-3">DOC NO</th>
              <th className="px-1 py-3">DOC DATE</th>
              <th className="px-1 py-3">DEBTOR CODE</th>
              <th className="px-1 py-3">LOCATION CODE</th>
              <th className="px-1 py-3">REMARK</th>
              <th className="px-1 py-3">TOTAL</th>
              <th className="px-1 py-3">VOID</th>
              <th className="px-1 py-3">COMPLETE</th>
              <th className="px-1 py-3">OUTSTANDING BAL</th>
              <th className="px-2 py-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <React.Fragment key={row.salesId || index}>
                <tr className="text-xs border-b-2 border-gray-100 font-medium text-secondary">
                  <td className="pl-4 p-2">
                    {(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}
                  </td>
                  <td className="p-1">{row.docNo ?? "-"}</td>
                  <td className="p-1">{row.docDate ? new Date(row.docDate).toLocaleString() : "-"}</td>
                  <td className="p-1">{row.debtorCode ?? "-"}</td>
                  <td className="p-1">{row.locationCode ?? "-"}</td>
                  <td className="p-1">{row.remark ?? "-"}</td>
                  <td className="p-1">{row.total ?? "-"}</td>
                  <td className="p-1">{row.isVoid ? "Yes" : "No"}</td>
                  <td className="p-1">{row.isComplete ? "Yes" : "No"}</td>
                  <td className="p-1">{row.outstandingBal ?? "-"}</td>
                 <td className="p-1 flex gap-1 items-center">
                    <button className="text-green-500 bg-transparent pl-0" onClick={() => toggleExpandRow(index)}>
                      {expandedRows[index] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    {row.isVoid ? (
                      <div className="p-1 flex items-center justify-center">
                        <Ban size={14} className="text-gray-400" />
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          setConfirmationModal({
                            isOpen: true,
                            transactionId: row.salesId,
                            type: "sales",
                          })
                        }
                        className="text-red-500 bg-transparent p-1"
                      >
                        <CheckCircle size={14} />
                      </button>
                    )}
                    {row.hasReport && (
                      <button
                      className="text-blue-500 bg-transparent p-1"
                      onClick={() => setReportSelectionModal({isOpen: true, docId: row.salesId})}
                      >
                        <FileText size={14} />
                      </button>
                    )}
                    
                    {!row.isVoid && !row.isComplete && (
                      <button
                        className="text-blue-500 bg-transparent p-1"
                        onClick={() => openPaymentModal(row)}
                      >
                        <DollarSign size={14} />
                      </button>
                    )}
                  </td>
                </tr>

                {expandedRows[index] && (
                  <tr>
                    <td colSpan={11} className="p-2 text-xs text-secondary">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <table className="w-full border-collapse border text-xs">
                              <thead className="bg-gray-100 border-b">
                                <tr>
                                  <th className="p-1 border">Item Code</th>
                                  <th className="p-1 border">Description</th>
                                  <th className="p-1 border">UOM</th>
                                  <th className="p-1 border">Qty</th>
                                  <th className="p-1 border">Unit Price</th>
                                  <th className="p-1 border">Discount</th>
                                  <th className="p-1 border">Discount Amt</th>
                                  <th className="p-1 border">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {row.details?.map((detail) => (
                                  <tr key={detail.salesDetailId}>
                                    <td className="p-1 border">{detail.itemCode ?? "-"}</td>
                                    <td className="p-1 border">{detail.description ?? "-"}</td>
                                    <td className="p-1 border">{detail.uom ?? "-"}</td>
                                    <td className="p-1 border">{detail.qty ?? "-"}</td>
                                    <td className="p-1 border">{detail.unitPrice ?? "-"}</td>
                                    <td className="p-1 border">{detail.discount ?? "-"}</td>
                                    <td className="p-1 border">{detail.discountAmount ?? "-"}</td>
                                    <td className="p-1 border">{detail.subTotal ?? "-"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {row.paymentHistory && row.paymentHistory.length > 0 && (
                          <div>
                            <table className="w-full border-collapse border text-xs">
                              <thead className="bg-gray-100 border-b">
                                <tr>
                                  <th className="p-1 border">Doc No</th>
                                  <th className="p-1 border">Payment Date</th>
                                  <th className="p-1 border">Remark</th>
                                  <th className="p-1 border">Reference</th>
                                  <th className="p-1 border">Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {row.paymentHistory.map((pay) => (
                                  <tr key={pay.salesPaymentId}>
                                    <td className="p-1 border">{pay.docNo ?? "-"}</td>
                                    <td className="p-1 border">{pay.paymentDate ? new Date(pay.paymentDate).toLocaleString() : "-"}</td>
                                    <td className="p-1 border">{pay.remark ?? "-"}</td>
                                    <td className="p-1 border">{pay.reference ?? "-"}</td>
                                    <td className="p-1 border">{pay.amount ?? "-"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const PurchaseInvoiceTable = ({ tableData, loading, pagination, setConfirmationModal, openPaymentModal }) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleExpandRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
      {loading ? (
        <p className="text-center py-4 text-gray-500">Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 border-b-2 border-gray-100 font-bold">
            <tr className="text-left text-xs text-secondary">
              <th className="px-4 py-3">NO</th>
              <th className="px-1 py-3">DOC NO</th>
              <th className="px-1 py-3">DOC DATE</th>
              <th className="px-1 py-3">CREDITOR CODE</th>
              <th className="px-1 py-3">LOCATION CODE</th>
              <th className="px-1 py-3">REMARK</th>
              <th className="px-1 py-3">TOTAL</th>
              <th className="px-1 py-3">VOID</th>
              <th className="px-1 py-3">COMPLETE</th>
              <th className="px-1 py-3">OUTSTANDING BAL</th>
              <th className="px-2 py-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <React.Fragment key={row.purchaseId || index}>
                <tr className="text-xs border-b-2 border-gray-100 font-medium text-secondary">
                  <td className="pl-4 p-2">
                    {(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}
                  </td>
                  <td className="p-1">{row.docNo ?? "-"}</td>
                  <td className="p-1">{row.docDate ? new Date(row.docDate).toLocaleString() : "-"}</td>
                  <td className="p-1">{row.creditorCode ?? "-"}</td>
                  <td className="p-1">{row.locationCode ?? "-"}</td>
                  <td className="p-1">{row.remark ?? "-"}</td>
                  <td className="p-1">{row.total ?? "-"}</td>
                  <td className="p-1">{row.isVoid ? "Yes" : "No"}</td>
                  <td className="p-1">{row.isComplete ? "Yes" : "No"}</td>
                  <td className="p-1">{row.outstandingBal ?? "-"}</td>
                  <td className="p-1 flex gap-1 items-center">
                    <button className="text-green-500 bg-transparent p-1" onClick={() => toggleExpandRow(index)}>
                      {expandedRows[index] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    {row.isVoid ? (
                      <div className="p-1 flex items-center justify-center">
                        <Ban size={14} className="text-gray-400" />
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          setConfirmationModal({
                            isOpen: true,
                            transactionId: row.purchaseId,
                            type: "purchase",
                          })
                        }
                        className="text-red-500 bg-transparent p-1"
                      >
                        <CheckCircle size={14} />
                      </button>
                    )}
                    {!row.isVoid && !row.isComplete && (
                      <button
                        className="text-blue-500 bg-transparent"
                        onClick={() => openPaymentModal(row)}
                      >
                        <DollarSign size={14} />
                      </button>
                    )}
                  </td>
                </tr>

                {expandedRows[index] && (
                  <tr>
                    <td colSpan={11} className="p-2 text-xs text-secondary">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold mb-1">Purchase Details</p>
                          <table className="w-full border-collapse border text-xs">
                            <thead className="bg-gray-100 border-b">
                              <tr>
                                <th className="p-1 border">Item Code</th>
                                <th className="p-1 border">Description</th>
                                <th className="p-1 border">UOM</th>
                                <th className="p-1 border">Qty</th>
                                <th className="p-1 border">Unit Price</th>
                                <th className="p-1 border">Discount</th>
                                <th className="p-1 border">Discount Amt</th>
                                <th className="p-1 border">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {row.details?.map((detail) => (
                                <tr key={detail.purchaseDetailId}>
                                  <td className="p-1 border">{detail.itemCode ?? "-"}</td>
                                  <td className="p-1 border">{detail.description ?? "-"}</td>
                                  <td className="p-1 border">{detail.uom ?? "-"}</td>
                                  <td className="p-1 border">{detail.qty ?? "-"}</td>
                                  <td className="p-1 border">{detail.unitPrice ?? "-"}</td>
                                  <td className="p-1 border">{detail.discount ?? "-"}</td>
                                  <td className="p-1 border">{detail.discountAmount ?? "-"}</td>
                                  <td className="p-1 border">{detail.subTotal ?? "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {row.paymentHistory && row.paymentHistory.length > 0 && (
                          <div>
                            <p className="font-semibold mb-1">Payment History</p>
                            <table className="w-full border-collapse border text-xs">
                              <thead className="bg-gray-100 border-b">
                                <tr>
                                  <th className="p-1 border">Payment Date</th>
                                  <th className="p-1 border">Remark</th>
                                  <th className="p-1 border">Reference</th>
                                  <th className="p-1 border">Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {row.paymentHistory.map((pay) => (
                                  <tr key={pay.purchasePaymentId}>
                                    <td className="p-1 border">{pay.paymentDate ? new Date(pay.paymentDate).toLocaleString() : "-"}</td>
                                    <td className="p-1 border">{pay.remark ?? "-"}</td>
                                    <td className="p-1 border">{pay.reference ?? "-"}</td>
                                    <td className="p-1 border">{pay.amount ?? "-"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionsInquiry;
