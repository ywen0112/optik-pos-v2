import { Check, Square, Pencil } from "lucide-react";

const paymentMethods = [
  {
    type: "Cash",
    method: "CASH",
    bankAC: "320-0000",
    journalType: "CASH",
    paymentBy: "",
    acceptCheque: false,
    bankChargeAC: "",
    bankChargeRate: "0",
    mergeCharge: true,
  },
  {
    type: "Bank",
    method: "BANK",
    bankAC: "310-1000",
    journalType: "BANK",
    paymentBy: "CHEQUE",
    acceptCheque: true,
    bankChargeAC: "902-0000",
    bankChargeRate: "0",
    mergeCharge: true,
  },
];

const PaymentMethod = () => {
  return (
    <div className="p-6 w-full bg-white">
      <h1 className="text-2xl font-bold text-secondary mb-4">My Payment Method</h1>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full text-xs border border-gray-300">
          <thead className="bg-gray-300 text-secondary text-left">
            <tr>
              <th className="px-4 py-2">Payment Method Type</th>
              <th className="px-4 py-2">Payment Method</th>
              <th className="px-4 py-2">Bank A/C</th>
              <th className="px-4 py-2">Journal Type</th>
              <th className="px-4 py-2">Payment By</th>
              <th className="px-4 py-2">Accept Cheque No.</th>
              <th className="px-4 py-2">Bank Charge A/C</th>
              <th className="px-4 py-2">Bank Charge Rate (%)</th>
              <th className="px-4 py-2">Merge Bank Charge Trans.</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paymentMethods.map((item, idx) => (
              <tr key={idx} className="border-t border-gray-200 text-secondary">
                <td className="px-4 py-2">{item.type}</td>
                <td className="px-4 py-2">{item.method}</td>
                <td className="px-4 py-2">{item.bankAC}</td>
                <td className="px-4 py-2">{item.journalType}</td>
                <td className="px-4 py-2">{item.paymentBy}</td>
                <td className="px-4 py-2 text-center">
                  {item.acceptCheque ? (
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-2">{item.bankChargeAC}</td>
                <td className="px-4 py-2">{item.bankChargeRate}</td>
                <td className="px-4 py-2 text-center">
                  {item.mergeCharge ? (
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer">
                    <Pencil className="w-4 h-4 text-green-600 mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          {[10, 25, 50, 100].map((size) => (
            <button
              key={size}
              className="px-2 py-1 border rounded text-sm hover:bg-green-100"
            >
              {size}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-600">Page 1 of 1 (2 items)</div>
        <div className="flex items-center gap-1">
          <button className="px-2 py-1 bg-green-600 text-white text-sm rounded">1</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
