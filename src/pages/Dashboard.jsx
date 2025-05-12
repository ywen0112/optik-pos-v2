import React, { useEffect, useState } from "react";
import { GetDashBoardRecord } from "../api/dashboardapi";
import { DollarSign, TrendingUp, Calendar, PackageOpen } from "lucide-react";
import { PieChart, Pie, Tooltip, Cell,ResponsiveContainer } from "recharts";

const DashboardPage = () => {
  const companyId = sessionStorage.getItem("companyId");
  const today = new Date().toISOString();

  const [dashboardData, setDashboardData] = useState(null);
  const COLORS = ["#1e3a8a", "#60a5fa", "#f87171", "#facc15", "#10b981"];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await GetDashBoardRecord({
          companyId,
          fromDate: today,
          toDate: today,
          keyword: "",
          offset: 0,
          limit: 0,
        });
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      }
    };

    fetchDashboard();
  }, [companyId]);

  if (!dashboardData) return <div className="p-4">Loading...</div>;

  const Box = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-2 bg-white rounded-2xl shadow-md p-4 w-full xl:w-[400px]">
      <Icon className="w-8 h-8 text-primary" />
      <div>
        <div className="text-lg text-gray-500">{label}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );

  const DonutChart = ({ title, data, labelKey }) => (
    <div className="bg-white rounded-2xl shadow-md p-4 w-full">
      <h3 className="text-xl font-medium text-center mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey={labelKey}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={3}
            label={(entry) =>
              `${entry[entry.nameKey || "name"] || "N/A"} (RM${entry.value}, ${entry.qty})`
            }
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length > 0) {
                const item = payload[0].payload;
                const name = item[labelKey] || "N/A";
                const value = item.value;
                const qty = item.qty ?? "-";
                return (
                  <div className="bg-white border rounded px-3 py-2 text-base shadow">
                    <p><strong>{name}</strong></p>
                    <p>RM {value}</p>
                    <p>Qty: {qty}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <>
      <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-3 xl:grid-cols-3">
        <Box
          icon={DollarSign}
          label="Today Total Sales"
          value={`RM ${(+dashboardData.todayTotalSales || 0).toFixed(2)}`}
        />

        <Box
          icon={TrendingUp}
          label="Month Total Sales"
          value={`RM ${(+dashboardData.monthTotalSales || 0).toFixed(2)}`}
        />

        <Box
          icon={Calendar}
          label="Year Total Outstanding"
          value={`RM ${(+dashboardData.yearTotalOutstanding || 0).toFixed(2)}`}
        />

        <Box
          icon={Calendar}
          label="Month Total Outstanding"
          value={`RM ${(+dashboardData.monthTotalOutstanding || 0).toFixed(2)}`}
        />

        <Box
          icon={PackageOpen}
          label="Uncollected Item Qty"
          value={`${(dashboardData.uncollectedItemQty || 0)}`}
        />
      </div>

      <div className="p-4 grid gap-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
        {dashboardData.top5SellingItemTypes?.length > 0 && (
          <DonutChart
            title="Top 5 Selling Item Types"
            data={dashboardData.top5SellingItemTypes}
            labelKey="itemType"
          />
        )}
        {dashboardData.top5SellingItemGroups?.length > 0 && (
          <DonutChart
            title="Top 5 Selling Item Groups"
            data={dashboardData.top5SellingItemGroups}
            labelKey="itemGroup"
          />
        )}
      </div>
    </>
  );
};

export default DashboardPage;
