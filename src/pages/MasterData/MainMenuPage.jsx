import { FileChartColumn } from "lucide-react";
import { Link } from "react-router-dom";

const MainMenuPage = () => {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-10 shadow rounded">
                <div className="items-center mb-4">
                    <FileChartColumn className="w-10 h-10 text-green-600 mb-2" strokeWidth={1}/>
                    <h3 className="font-bold text-lg text-secondary">General</h3>
                </div>
                <ul className="space-y-3 text-blue-600 text-sm">
                    <li><Link to="/maintenances/location">Location</Link></li>
                    <li><Link to="/maintenances/debtor">Customer</Link></li>
                    <li><Link to="/maintenances/creditor">Supplier</Link></li>
                    <li><Link to="/maintenances/item">Product</Link></li>
                    <li><Link to="#">Numbering Format</Link></li>
                    <li><Link to="#">Payment Method</Link></li>
                </ul>
            </div>
        </div>
      </div>
    );
  };
  
  export default MainMenuPage;
  