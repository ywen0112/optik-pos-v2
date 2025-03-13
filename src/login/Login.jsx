import { useState } from "react";
import ErrorModal from "../modals/ErrorModal";
import logo from "../assets/logo_white.png";
import axios from "axios";
import { GetUserLogins } from "../apiconfig";
import { Eye, EyeOff } from "lucide-react";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${GetUserLogins}`, {
        userEmail: email,
        password: password,
      });
      
      if (response.data.success) {
        onLoginSuccess(response.data.data); 
      } else {
        throw new Error(response.data.errorMessage);
      }
    } catch (error) {
      setErrorModal({ title: "Login Error",  message: error.message });    
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-secondary">
      <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() =>setErrorModal({ title: "", message: "" })}/>

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Company Logo" className="w-40 h-40 object-contain" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-6">
            <label className="block text-sm text-gray-700">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full mt-3 px-3 py-2 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm text-secondary"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">Password:</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full mt-3 px-3 py-2 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm text-secondary"
              />
              <button
                type="button"
                className="absolute right-3 top-4 text-gray-500 bg-gray-100 px-1 py-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button type="submit" className="w-80 bg-secondary text-white py-2 rounded-md hover:bg-gray-700 transition">
             {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-gray-500 text-xs">© 2025 OPTIK POS. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
