import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { OpenCounterSession, NewCashTransaction, CheckCounterSession } from "../apiconfig";
import ErrorModal from "../modals/ErrorModal";
import NotificationModal from "../modals/NotificationModal";
import SalesInvoice from "./SalesInvoice";
import PurchasesInvoice from "./PurchasesInvoice";

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

  return (
    <div>
      <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => { if (errorModal.onClose) { errorModal.onClose(); } setErrorModal({ title: "", message: "", onClose: null }); }} />
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
            {["Cash In", "Cash Out", "Sales Invoice", "Purchases Invoice", "Credit Note"].map((tab) => (
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
                    className="px-4 py-2 bg-green-500 text-white rounded-md text-sm"
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
              <div className="w-full h-full bg-white shadow-md p-6 rounded-md mx-auto">
               <SalesInvoice />
              </div>
            ) : activeTab === "Purchases Invoice" ? (
              <div className="w-full h-full bg-white shadow-md p-6 rounded-md mx-auto">
               <PurchasesInvoice />
              </div>
            ) : (
              <p className="text-gray-500">Content for "{activeTab}" will be displayed here.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Transactions;
