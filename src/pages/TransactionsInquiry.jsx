import { useState } from "react";
import { Eye, FileText } from "lucide-react";

const TransactionsInquiry = () => {
  const [activeTab, setActiveTab] = useState("Counter Session");

  const tabs = [
    "Counter Session",
    "Cash Transactions",
    "Sales Invoice",
    "Purchase Invoice",
    "Credit Note",
  ];

  const tableData = [
    {
      no: 1,
      sessionCode: "Session- 6/3/2025 11:09 AM",
      openingBalance: 12,
      closingBalance: 12,
      variance: 0,
      openedBy: "admin",
      closedBy: "admin",
      openTime: "06/03/2025, 11:14:47 am",
      closedTime: "06/03/2025, 11:14:47 am",
    },
    {
      no: 2,
      sessionCode: "Session- 6/3/2025 11:09 AM",
      openingBalance: 12,
      closingBalance: 12,
      variance: 0,
      openedBy: "test",
      closedBy: "-",
      openTime: "06/03/2025, 11:14:47 am",
      closedTime: "06/03/2025, 11:14:47 am",
    },
    {
      no: 3,
      sessionCode: "Session- 6/3/2025 11:09 AM",
      openingBalance: 12,
      closingBalance: 12,
      variance: 0,
      openedBy: "test2",
      closedBy: "-",
      openTime: "06/03/2025, 11:14:47 am",
      closedTime: "06/03/2025, 11:14:47 am",
    },
  ];

  return (
    <div>
      <div>
        <nav className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 text-sm bg-transparent ${
                activeTab === tab ? " text-black border-transparent font-semibold" : "border-transparent text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      {activeTab === "Counter Session" && (
        <div className="mt-4 p-6 bg-white shadow-md rounded-lg">
          <div className="border rounded-lg shadow-sm overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <th className="border p-2">NO</th>
                  <th className="border p-2">SESSION CODE</th>
                  <th className="border p-2">OPENING BALANCE</th>
                  <th className="border p-2">CLOSING BALANCE</th>
                  <th className="border p-2">VARIANCE</th>
                  <th className="border p-2">OPENED BY</th>
                  <th className="border p-2">CLOSED BY</th>
                  <th className="border p-2">OPEN TIME</th>
                  <th className="border p-2">CLOSED TIME</th>
                  <th className="border p-2">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index} className="border">
                    <td className="border p-2">{row.no}</td>
                    <td className="border p-2">{row.sessionCode}</td>
                    <td className="border p-2">{row.openingBalance}</td>
                    <td className="border p-2">{row.closingBalance}</td>
                    <td className="border p-2">{row.variance}</td>
                    <td className="border p-2">{row.openedBy}</td>
                    <td className="border p-2">{row.closedBy}</td>
                    <td className="border p-2">{row.openTime}</td>
                    <td className="border p-2">{row.closedTime}</td>
                    <td className="border p-2 flex justify-center space-x-2">
                      <button className="text-green-500"><Eye size={18} /></button>
                      <button className="text-blue-500"><FileText size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsInquiry;
