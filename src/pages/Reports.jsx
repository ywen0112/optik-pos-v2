import { Wrench } from "lucide-react";

const Reports = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-secondary from-gray-800 to-gray-900 text-white p-4">
      <div className="flex flex-col items-center space-y-4">
        <Wrench className="w-16 h-16 text-yellow-400 animate-pulse" />
        <h1 className="text-3xl font-bold">This Page Under Maintenance</h1>
        <p className="text-gray-300 text-center max-w-md">
          We're working hard to bring this feature to you soon. Please check back later!
        </p>
      </div>
    </div>
  );
};

export default Reports;