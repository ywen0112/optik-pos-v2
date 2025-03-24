import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { RegisterUser } from "./apiconfig"; 
import ErrorModal from "./modals/ErrorModal"; 
import NotificationModal from "./modals/NotificationModal";
import { Eye, EyeOff } from "lucide-react";
import logo from "./assets/logo_white.png";

const UserRegistrationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const customerId = searchParams.get("CustomerId");
  const userEmail = searchParams.get("UserEmail");
  const companyName = searchParams.get("CompanyName") || "";
  const isOwner = searchParams.get("IsOwner")?.toLowerCase() === "true";
  const accessRightId = searchParams.get("AccessRightId");

  const handleRegister = async () => {
    if (!userName || !password) {
      setErrorModal({ title: "Validation Error", message: "Username and password are required." });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customerId: Number(customerId),
        editorUserId: "",
        companyName,
        userName,
        userEmail,
        userPassword: password,
        accessRightId,
        isOwner,
      };

      const response = await fetch(RegisterUser, {
        method: "POST",
        headers: { Accept: "text/plain", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        setNotifyModal({ isOpen: true, message: "Registration successful. You can now login." });
      } else {
        throw new Error(result.errorMessage || "Registration failed.");
      }
    } catch (error) {
      setErrorModal({ title: "Registration Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-secondary">
      <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
      <NotificationModal
        isOpen={notifyModal.isOpen}
        message={notifyModal.message}
        onClose={() => {
          setNotifyModal({ isOpen: false, message: "" });
          navigate("/login");
        }}
      />

      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
            <img src={logo} alt="Company Logo" className="w-40 h-40 object-contain" />
        </div>
        <h2 className="text-xl font-semibold text-center mb-6 text-secondary">Complete Your Registration</h2>
        <div className="mb-4">
          <label className="block text-secondary text-xs mb-1">Email</label>
          <input type="email" value={userEmail} disabled className="w-full p-2 border rounded bg-gray-100 text-secondary" />
        </div>
        <div className="mb-4">
          <label className="block text-secondary text-xs mb-1">Username</label>
          <input type="text" value={userName} placeholder="Enter username" onChange={(e) => setUserName(e.target.value)} className="w-full p-1 border rounded bg-white text-secondary" />
        </div>
        <div className="mb-6">
          <label className="block text-secondary text-xs mb-1">Password</label>
          <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-1 border rounded bg-white text-secondary"
              />
              <button
                type="button"
                className="absolute right-3 top-1 text-gray-500 bg-transparent px-1 py-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
        </div>
        <button onClick={handleRegister} className="w-full bg-secondary text-white py-2 rounded hover:bg-secondary/90 transition" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
};

export default UserRegistrationPage;
