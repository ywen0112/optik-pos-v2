import { FileChartColumn } from "lucide-react";
import { Link } from "react-router-dom";

const MainMenuPage = () => {
    return (
      <div className="p-6 h-full">
        <div className="grid grid-cols-1 gap-4 h-max">
            <div className="bg-white p-10 shadow rounded w-full">
                <div className="mb-4">
                    <FileChartColumn className="w-10 h-10 text-primary mb-2" strokeWidth={1}/>
                    <h3 className="font-bold text-lg text-secondary">General</h3>
                </div>
                <ul className="space-y-3 text-blue-600 text-sm">
                    <li><Link to="/location">Location</Link></li>
                    <li><Link to="/customer">Customer</Link></li>
                    <li><Link to="/supplier">Supplier</Link></li>
                    <li><Link to="/product">Product</Link></li>
                    <li><Link to="#">Numbering Format</Link></li>
                    <li><Link to="#">Payment Method</Link></li>
                </ul>
            </div>
        </div>
      </div>
    );
  };
  
  export default MainMenuPage;
  