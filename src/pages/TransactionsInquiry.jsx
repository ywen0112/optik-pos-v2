import React, { useState, useEffect } from "react";
import { Eye, EyeOff, FileText, Ban, CheckCircle } from "lucide-react";
import { GetCounterSessionRecords, GetCounterSummaryReport, GetCashTransactionsRecords, VoidCashTransaction} from "../apiconfig";
import ErrorModal from "../modals/ErrorModal";
import ConfirmationModal from "../modals/ConfirmationModal";

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
    "Purchase Invoice": {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
    },
    "Credit Note": {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
    },
  });
  const [errorModal, setErrorModal] = useState({title: "", message: "" });
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, transactionId: null});
  const [loading, setLoading] = useState(false); 
 
  useEffect(() => {
    setTableData([]); 
    setLoading(true);
    if (activeTab === "Counter Session") {
      fetchCounterSessions();
    }
     else if (activeTab === "Cash Transactions") {
    fetchCashTransactions();
  }
    // else if (activeTab === "salesInvoice") {
    //   fetchSalesTransactions();
    // }
    // else if (activeTab === "purchaseInvoice") {
    //   fetchPurchaseTransactions();
    // }
    // else if (activeTab === "creditNote") {
    //   fetchCreditNotes();
    // }
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
        setTableData(data.data);
        setPagination((prev) => ({
          ...prev,
          [activeTab]: { ...prev[activeTab], totalItems: data.data.length },
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
        setTableData(data.data);
        setPagination((prev) => ({
          ...prev,
          [activeTab]: { ...prev[activeTab], totalItems: data.data.length },
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
  

  return (
    <div>
      <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() =>setErrorModal({ title: "", message: "" })}/>
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title="Confirm Void Transaction"
        message="Are you sure you want to void this transaction? This action cannot be undone."
        onConfirm={voidTransaction}
        onCancel={() => setConfirmationModal({ isOpen: false, transactionId: null })}
      />

      <nav className="flex">
        {["Counter Session", "Cash Transactions", "Sales Invoice", "Purchase Invoice", "Credit Note"].map((tab) => ( 
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
      
      {activeTab === "Counter Session" && <CounterSessionTable tableData={tableData} expandedRows={expandedRows} toggleExpandRow={toggleExpandRow} exportReport={exportReport} loading={loading} />}
      {activeTab === "Cash Transactions" && <CashTransactionsTable tableData={tableData} setConfirmationModal={setConfirmationModal} loading={loading} />}

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
            className="px-2 py-1 bg-white border rounded disabled:opacity-50 cursor-not-allowed"
          >
            ←
          </button>
          <button
            onClick={() => handlePageChange(pagination[activeTab].currentPage + 1)}
            disabled={pagination[activeTab].currentPage * pagination[activeTab].itemsPerPage >= pagination[activeTab].totalItems}
            className="px-2 py-1 bg-white border rounded disabled:opacity-50 cursor-not-allowed"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

const CounterSessionTable = ({ tableData, expandedRows, toggleExpandRow, exportReport, loading }) => {
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
                <td className="pl-4 p-2">{index + 1}</td>
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
                  <button className="text-blue-500 bg-transparent" onClick={() => exportReport(row.counterSessionId)}>
                    <FileText size={14} />
                  </button>
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

const CashTransactionsTable = ({ tableData, setConfirmationModal, loading }) => {
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
            <th className="px-1 py-3">IS CASH OUT</th>
            <th className="px-1 py-3">IS VOID</th>
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
              <td className="pl-4 p-2">{index + 1}</td>
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

export default TransactionsInquiry;
