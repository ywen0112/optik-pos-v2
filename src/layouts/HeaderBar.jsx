import { useState } from "react";
import { User } from "lucide-react";
import Profile from "../pages/Profile";

const HeaderBar = () => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="w-full h-12 bg-white flex justify-between items-center px-8 shadow-md">
      <div className="flex items-center space-x-6 ml-auto">
        <User
          className="text-secondary w-6 h-6 cursor-pointer"
          title="Profile"
          onClick={() => setProfileOpen(true)}
        />
      </div>

      <Profile open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
};

export default HeaderBar;
