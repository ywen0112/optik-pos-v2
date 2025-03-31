import {
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart2,
  ShoppingCart,
  Wallet,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const mockData = {
  totalTransactions: 128900,
  totalSales: 78200,
  totalPurchases: 38400,
  cashIn: 59200,
  cashOut: 43900,
};

const formatCurrency = (value) => {
  return `RM ${value.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`;
};

const Dashboard = () => {
  return (
    <div className="p-6 w-full bg-gray-100 max-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card label="Total Transactions" value={mockData.totalTransactions} icon={<Wallet className="text-blue-500 w-10 h-10" />} color="text-gray-800" />
        <Card label="Total Sales" value={mockData.totalSales} icon={<TrendingUp className="text-green-500 w-10 h-10" />} color="text-green-600" />
        <Card label="Total Purchases" value={mockData.totalPurchases} icon={<TrendingDown className="text-red-500 w-10 h-10" />} color="text-red-600" />
        <Card label="Cash In" value={mockData.cashIn} icon={<ArrowDownCircle className="text-green-500 w-10 h-10" />} color="text-green-600" />
        <Card label="Cash Out" value={mockData.cashOut} icon={<ArrowUpCircle className="text-orange-500 w-10 h-10" />} color="text-orange-600" />
        <Card label="Graphical Insights" value="Coming Soon..." icon={<BarChart2 className="text-gray-400 w-10 h-10 animate-pulse" />} color="text-gray-600" />
      </div>
    </div>
  );
};

const Card = ({ label, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between">
    <div>
      <h2 className="text-sm text-gray-500">{label}</h2>
      <p className={`text-2xl font-semibold ${color}`}>{typeof value === 'number' ? formatCurrency(value) : value}</p>
    </div>
    {icon}
  </div>
);

export default Dashboard;
