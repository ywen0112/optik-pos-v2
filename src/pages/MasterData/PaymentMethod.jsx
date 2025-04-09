import { Check, Square, Pencil } from "lucide-react";

const paymentMethods = [
  {
    type: "Cash",
    method: "CASH",
  },
  {
    type: "Bank",
    method: "BANK",
  },
];

const PaymentMethod = () => {
  return (
    <div className="p-6 w-full bg-white">
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full text-xs border border-gray-300">
          <thead className="bg-gray-300 text-secondary text-left">
            <tr>
              <th className="px-4 py-2">Payment Method Type</th>
              <th className="px-4 py-2">Payment Method</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paymentMethods.map((item, idx) => (
              <tr key={idx} className="border-t border-gray-200 text-secondary">
                <td className="px-4 py-2">{item.type}</td>
                <td className="px-4 py-2">{item.method}</td>
               
                <td className="px-4 py-2 text-blue-600 hover:underline cursor-pointer">
                    <Pencil className="w-4 h-4 text-green-600 mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center text-black gap-2">
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
