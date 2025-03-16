import { User } from "lucide-react";

const HeaderBar = () => {
  return (
    <div className="w-full h-12 bg-white flex justify-between items-center px-8 shadow-md">
      <div className="flex items-center space-x-6 ml-auto">
        <User className="text-secondary w-6 h-6 cursor-pointer" title="Profile" />
      </div>
    </div>
  );
};

export default HeaderBar;
