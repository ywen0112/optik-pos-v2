import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { OpenCounterSession, NewCashTransaction, NewSales, NewPurchases, NewCreditNote, NewCloseCounterSession, SaveCloseCounterSession } from "../apiconfig";
import ErrorModal from "../modals/ErrorModal";
import NotificationModal from "../modals/NotificationModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import SalesInvoice from "./SalesInvoice";
import PurchasesInvoice from "./PurchasesInvoice";
// import CreditNote from "./CreditNote";

const Transactions = () => {
  const location = useLocation();
  const { counterSession: initialSession } = location.state || {}; 
  const [counterSession, setCounterSession] = useState(initialSession || { isExist: false });
  const [openingBalance, setOpeningBalance] = useState("");
  const [activeTab, setActiveTab] = useState("Cash In");
  const customerId = localStorage.getItem("customerId");
  const userId = localStorage.getItem("userId");
  const locationId = localStorage.getItem("locationId");
  const [loading, setLoading] = useState(false); 
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [notificationModal, setNotificationModal] = useState({ isOpen: false, title: "", message: "", onClose: null });
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDescription, setTransactionDescription] = useState("");
  const [salesId, setSalesId] = useState(null);
  const [docNo, setDocNo] = useState(null);
  const [purchasesId, setPurchasesId] = useState(null);
  // const [creditNoteId, setCreditNoteId] = useState(null);
  const [closingBalanceModal, setClosingBalanceModal] = useState(false);
  const [sessionDetailsModal, setSessionDetailsModal] = useState(false);
  const [sessionDetails, setSessionDetails] = useState({});
  const [closingBalance, setClosingBalance] = useState("");
  const [newCounterSessionData, setNewCounterSessionData] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  
  useEffect(() => {
    if (!counterSession?.isExist) {
      setOpeningBalance(""); 
      setTransactionAmount("");
      setTransactionDescription("");
    }
  }, [counterSession]);

  useEffect(() => {
    if (activeTab === "Cash In") {
      setTransactionAmount(""); 
      setTransactionDescription("")
    }
    else if (activeTab === "Cash Out") {
      setTransactionAmount(""); 
      setTransactionDescription("")
    }
    else if (activeTab === "Sales Invoice") {
      fetchNewSalesInvoice();
    }
    else if (activeTab === "Purchases Invoice") {
      fetchNewPurchasesInvoice();
    }
    // else if (activeTab === "Credit Note") {
    //   fetchNewCreditNote();
    // }
  }, [activeTab]);

  const openCounter = async () => {
    if (!openingBalance) {
      setErrorModal({ title: "Input Error", message: "Please enter an opening balance." });
      return;
    }
  
    if (Number(openingBalance) < 0) {
      setErrorModal({ title: "Invalid Amount", message: "Opening balance cannot be negative. Please enter a valid amount." });
      return;
    }

    setLoading(true); 
    try {
      const requestBody = {
        actionData: {
          customerId: Number(customerId),
          userId,
          locationId,
          id: ""
        },
        openingBalance: Number(openingBalance)
      };

      const response = await fetch(OpenCounterSession, {
        method: "POST",
        headers: {
          "Accept": "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data.success) {
        if (data.data.isExist) {
          setNotificationModal({
            isOpen: true,
            title: "Counter Session Exists",
            message: `A counter session already exists with an opening balance of ${data.data.openingBal}.`,
            onClose: () => {
              setCounterSession({
                isExist: true,
                counterSessionId: data.data.counterSessionId,
                openingBal: data.data.openingBal,
                openCounterTimeStamp: data.data.openCounterTimeStamp
              });
              setNotificationModal({ isOpen: false });
            }
          });
          return;
        }
        setCounterSession({
          isExist: true,
          counterSessionId: data.data.counterSessionId,
          openingBal: data.data.openingBal,
          openCounterTimeStamp: data.data.openCounterTimeStamp
        });
        setOpeningBalance(""); 
      } else {
        throw new Error(data.errorMessage || "Failed to open counter.");
      }
    } catch (error) {
      setErrorModal({ title: "Open Counter Error", message: error.message });
    } finally {
      setLoading(false); 
    }
  };
  
  const handleAddTransaction = async () => {
    if (!transactionAmount) {
      setErrorModal({ title: "Input Error", message: "Please enter an amount." });
      return;
    }
  
    if (Number(transactionAmount) < 0) {
      setErrorModal({ title: "Invalid Amount", message: "Amount cannot be negative. Please enter a valid amount." });
      return;
    }
  
    setLoading(true);
    try {
      const requestBody = {
        actionData: { customerId: Number(customerId), userId, locationId, id: "" },
        isCashOut: activeTab === "Cash Out",
        remarks: transactionDescription,
        effectedAmount: Number(transactionAmount)
      };
  
      const response = await fetch(NewCashTransaction, {
        method: "POST",
        headers: { "Accept": "text/plain", "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      if (data.success) {
        setNotificationModal({
          isOpen: true,
          title: `${activeTab} Successful`,
          message: `Transaction of ${transactionAmount} has been recorded successfully.`,
          onClose: () => setNotificationModal({ isOpen: false })
        });
        setTransactionAmount("");
        setTransactionDescription("");
      } else {
        if (data.errorMessage === "There is currently no active counter session.") {
          setErrorModal({
            title: "Session Error",
            message: data.errorMessage,
            onClose: () => {
              setCounterSession(null); 
              setErrorModal({ title: "", message: "" });
            }
          });
        } else {
          throw new Error(data.errorMessage || "Failed to process transaction.");
        }
      }
    } catch (error) {
      setErrorModal({ title: "Transaction Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };  

  const handleCancelTransaction = () => {
    setTransactionAmount("");
    setTransactionDescription("");
  };

  const fetchNewSalesInvoice = async () => {
    setLoading(true);
    try {
      const requestBody = {
        customerId: Number(customerId),
        userId,
        locationId,
        id: ""
      };

      const response = await fetch(NewSales, {
        method: "POST",
        headers: { "Accept": "text/plain", "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data.success) {
        setSalesId(data.data.salesId);
        setDocNo(data.data.docNo);
      } else {
        throw new Error(data.errorMessage || "Failed to create new sales invoice.");
      }
    } catch (error) {
      setErrorModal({ title: "Sales Invoice Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchNewPurchasesInvoice = async () => {
    setLoading(true);
    try {
      const requestBody = {
        customerId: Number(customerId),
        userId,
        locationId,
        id: ""
      };

      const response = await fetch(NewPurchases, {
        method: "POST",
        headers: { "Accept": "text/plain", "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data.success) {
        setPurchasesId(data.data.purchaseId);
        setDocNo(data.data.docNo);
      } else {
        throw new Error(data.errorMessage || "Failed to create new purchases invoice.");
      }
    } catch (error) {
      setErrorModal({ title: "Purchases Invoice Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  // const fetchNewCreditNote = async () => {
  //   setLoading(true);
  //   try {
  //     const requestBody = {
  //       customerId: Number(customerId),
  //       userId,
  //       locationId,
  //       id: ""
  //     };

  //     const response = await fetch(NewCreditNote, {
  //       method: "POST",
  //       headers: { "Accept": "text/plain", "Content-Type": "application/json" },
  //       body: JSON.stringify(requestBody),
  //     });

  //     const data = await response.json();
  //     if (data.success) {
  //       setCreditNoteId(data.data.creditNoteId);
  //       setDocNo(data.data.docNo);
  //     } else {
  //       throw new Error(data.errorMessage || "Failed to create new credi note.");
  //     }
  //   } catch (error) {
  //     setErrorModal({ title: "Credit Note Error", message: error.message });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchCloseCounterSessionData = async () => {
  try {
    const requestBody = {
      customerId: Number(customerId),
      userId,
      locationId,
      id: ""
    };

    const response = await fetch(NewCloseCounterSession, {
      method: "POST",
      headers: { "Accept": "text/plain", "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    if (data.success) {
      setNewCounterSessionData(data.data);
      setClosingBalanceModal(true);
    } else {
      if (data.errorMessage === "There is currently no active counter session.") {
        setErrorModal({
          title: "Session Error",
          message: data.errorMessage,
          onClose: () => {
            setCounterSession(null); 
            setErrorModal({ title: "", message: "" });
          }
        });
      } else {
        throw new Error(data.errorMessage || "Failed to close counter.");
      }
    }
  } catch (error) {
    setErrorModal({ title: "Close Counter Session Error", message: error.message });
  }
};

const handleConfirmCloseCounter = async () => {
  setConfirmLoading(true);
  try {
    const requestBody = {
      actionData: {
        customerId: Number(customerId),
        userId,
        locationId,
        id: ""
      },
      systemCashAmount: newCounterSessionData.systemCashAmount || 0,
      systemCardAmount: newCounterSessionData.systemCardAmount || 0,
      systemEWalletAmount: newCounterSessionData.systemEWalletAmount || 0,
      systemCashInAmount: newCounterSessionData.systemCashInAmount || 0,
      systemCashOutAmount: newCounterSessionData.systemCashOutAmount || 0,
      userInputCashAmount: Number(newCounterSessionData.userInputCashAmount || 0),
      userInputCardAmount: Number(newCounterSessionData.userInputCardAmount || 0),
      userInputEWalletAmount: Number(newCounterSessionData.userInputEWalletAmount || 0),
    };

    const response = await fetch(SaveCloseCounterSession, {
      method: "POST",
      headers: { "Accept": "text/plain", "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    if (data.success) {
      setSessionDetails(data.data);
      setSessionDetailsModal(true);
      setClosingBalanceModal(false);
    } else {
      if (data.errorMessage === "There is currently no active counter session.") {
        setErrorModal({
          title: "Session Error",
          message: data.errorMessage,
          onClose: () => {
            setCounterSession(null); 
            setErrorModal({ title: "", message: "" });
          }
        });
      } else {
        throw new Error(data.errorMessage || "Failed to close counter.");
      }
    }
  } catch (error) {
    setErrorModal({ title: "Close Counter Error", message: error.message });
  } finally {
    setConfirmModal(false);
    setConfirmLoading(false);
  }
};

  const handleCloseClosingModal = () => {
    setClosingBalanceModal(false);
    setClosingBalance("");
  }

  const closeSessionDetails = () => {
    setSessionDetailsModal(false);
    setClosingBalanceModal(false)
    setCounterSession(null);
    setClosingBalance("");
  }

  return (
    <div>
    <ErrorModal
      title={errorModal.title}
      message={errorModal.message}
      onClose={() => {
        if (typeof errorModal.onClose === "function") {
          errorModal.onClose();
        } else {
          setErrorModal({ title: "", message: "", onClose: null });
        }
      }}
    /> 
     <NotificationModal isOpen={notificationModal.isOpen} title={notificationModal.title} message={notificationModal.message} onClose={notificationModal.onClose || (() => setNotificationModal({ isOpen: false }))} />

      <style>
        {`
          button:hover {
            border-color: transparent !important;
          }
          button:focus, button:focus-visible {
            outline: none !important;
          }
        `}
      </style>

      {counterSession?.isExist ? (
        <div className="flex items-center gap-2 w-full mt-2">
          <label className="text-sm text-secondary font-semibold whitespace-nowrap">Opening Balance:</label>
          <input
            type="text"
            value={counterSession.openingBal}
            disabled
            className="w-1/3 p-1 text-secondary border rounded bg-gray-200 cursor-not-alloweds text-left"
          />
         <button
          onClick={fetchCloseCounterSessionData}
          className="text-xs p-2 rounded-md bg-red-500 text-white"
        >
          Close Counter
        </button>
        </div>
      ) : (
        <div className="w-1/3 bg-white shadow-md p-4 rounded-md mt-6">
          <label className="text-sm text-secondary font-semibold">Enter Opening Balance:</label>
          <div className="flex items-center gap-2 w-full">
            <input
              type="number"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              className="flex-grow p-2 border rounded bg-white text-secondary "
            />
            <button
              onClick={openCounter}
              disabled={loading}
              className={`text-xs p-2 rounded-md ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white"}`}
            >
              {loading ? "Opening..." : "Open Counter"}
            </button>
          </div>
        </div>
      )}

      {counterSession?.isExist && (
        <div className="mt-4">
          <nav className="flex">
            {["Cash In", "Cash Out", "Sales Invoice", "Purchases Invoice"
            // , "Credit Note"
          ].map((tab) => (
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

          <div className="mt-4">
            {activeTab === "Cash In" || activeTab === "Cash Out" ? (
              <div className="w-1/3 bg-white shadow-md p-6 rounded-md mx-auto">
                <h2 className="text-xl font-semibold mb-4 text-secondary">{activeTab}</h2>
                <input
                  type="number"
                  placeholder="Enter Amount"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  className="w-full p-1 border rounded mb-3 text-sm bg-white text-secondary"
                />
                <textarea
                  placeholder="Enter Description (Optional)"
                  value={transactionDescription}
                  onChange={(e) => setTransactionDescription(e.target.value)}
                  className="w-full p-1 border rounded mb-3 h-20 text-sm bg-white text-secondary"
                />
                <div className="flex justify-between">
                  <button
                    onClick={handleAddTransaction}
                    className="px-2 py-2 bg-green-500 text-white rounded-md text-sm"
                  >
                    Add
                  </button>
                  <button
                    onClick={handleCancelTransaction}
                    className="px-2 py-2 bg-red-500 text-white rounded-md text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : activeTab === "Sales Invoice" ? (
              <div className="w-full h-full bg-white shadow-md p-6 rounded-md mx-auto mb-4">
               <SalesInvoice salesId={salesId} docNo={docNo} counterSession={counterSession} setCounterSession={setCounterSession}/>
              </div>
            ) : activeTab === "Purchases Invoice" ? (
              <div className="w-full h-full bg-white shadow-md p-6 rounded-md mx-auto">
               <PurchasesInvoice purchasesId={purchasesId} docNo={docNo} counterSession={counterSession} setCounterSession={setCounterSession}/>
              </div>
            // ) : activeTab === "Credit Note" ? (
            //   <div className="w-full h-full bg-white shadow-md p-6 rounded-md mx-auto">
            //    <CreditNote creditNoteId={creditNoteId} docNo={docNo} counterSession={counterSession} setCounterSession={setCounterSession}/>
            //   </div>
            ) : (
              <p className="text-gray-500">Content for "{activeTab}" will be displayed here.</p>
            )}
          </div>
        </div>
      )}

      {closingBalanceModal && newCounterSessionData && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-fut">
            <h2 className="text-lg font-semibold mb-4 text-secondary">Close Counter</h2>

            <div className="mb-4 text-secondary">
              <p><strong>System Cash In Amount:</strong> {newCounterSessionData.systemCashInAmount}</p>
              <p><strong>System Cash Out Amount:</strong> {newCounterSessionData.systemCashOutAmount}</p>
            </div>

            <table className="w-full text-sm text-left text-secondary">
              <thead>
                <tr>
                  <th className="px-4"></th>
                  <th className="px-4">Collected</th>
                  <th className="px-4">System Amount</th>
                  <th className="px-4">Variance</th>
                </tr>
              </thead>
              <tbody>
                {["Cash", "Card", "EWallet"].map((method) => {
                  const systemKey = `system${method}Amount`;
                  const userKey = `userInput${method}Amount`;

                  const systemValue = newCounterSessionData[systemKey] || 0;
                  const userValue = newCounterSessionData[userKey] ?? 0;
                  const variance = userValue !== "" ? Number(userValue) - Number(systemValue) : "";

                  return (
                    <tr key={method}>
                      <td className="py-1 px-4">{method} Amount</td>
                      <td className="py-1 px-4">
                        <input
                          type="number"
                          className="w-full p-1 border rounded bg-white text-secondary"
                          value={userValue}
                          onChange={(e) => {
                            const formatted = e.target.value;
                            const limitedDecimal = formatted.includes(".")
                              ? formatted.slice(0, formatted.indexOf(".") + 3)
                              : formatted;
                        
                            setNewCounterSessionData(prev => ({
                              ...prev,
                              [userKey]: limitedDecimal
                            }));
                          }}
                        />
                      </td>
                      <td className="py-1 px-4">{systemValue}</td>
                      <td className="py-1 px-4">{Number(variance).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex mt-4 justify-between">
            <button
                onClick={() => setConfirmModal(true)}
                className="p-2 text-sm bg-green-500 text-white rounded-md mr-2"
              >
                Confirm
              </button>
              <button onClick={handleCloseClosingModal} className="p-2 bg-red-500 text-white rounded-md text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmModal}
        title="Confirm Close Counter"
        message="Are you sure you want to close this counter session?"
        loading={confirmLoading}
        confirmButtonText="Yes"
        onCancel={() => setConfirmModal(false)}
        onConfirm={handleConfirmCloseCounter}
      />

      {sessionDetailsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[500px]">
            <h2 className="text-lg font-semibold mb-4 text-secondary">Counter Session Closed</h2>
            <table className="w-full text-sm text-gray-700">
              <tbody>
                {[
                  "sessionOpenedBy",
                  "sessionOpenTime",
                  "sessionClosedBy",
                  "sessionCloseTime",
                  "initialBalance",
                  "cashCollected",
                  "systemCash",
                  "cashVariance",
                  "cardCollected",
                  "systemCard",
                  "cardVariance",
                  "ewalletCollected",
                  "systemEwallet",
                  "ewalletVariance",
                  "sales",
                  "purchase",
                  "cashIn",
                  "cashOut",
                  "arPayment",
                  "apPayment",
                  "outstanding_SO",
                  "outstanding_PO"
                ].map((key) => (
                  <tr key={key} className="align-top">
                    <td className="py-1 pr-2 font-semibold text-secondary whitespace-nowrap">
                      {key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}:
                    </td>
                    <td className="py-1 text-gray-700">
                      {key.includes("Time") && sessionDetails[key]
                        ? new Date(sessionDetails[key]).toLocaleString()
                        : sessionDetails[key]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <button onClick={closeSessionDetails} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Transactions;
