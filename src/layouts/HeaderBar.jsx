import { FaTools, FaUserCircle } from "react-icons/fa";

const HeaderBar = () => {
  return (
    <div className="w-full h-16 bg-white flex justify-between items-center px-6 shadow-md">
      <div className="flex items-center space-x-4">
        <FaTools className="text-gray-600 text-2xl cursor-pointer" title="Maintenance Mode" />
        <FaUserCircle className="text-gray-600 text-2xl cursor-pointer" title="Profile" />
      </div>
    </div>
  );
};

export default HeaderBar;
