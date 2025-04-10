import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { EditCompany, SaveCompany } from "../../apiconfig";
import ConfirmationModal from "../../modals/ConfirmationModal";
import ErrorModal from "../../modals/ErrorModal";
import NotificationModal from "../../modals/NotificationModal";
import { UploadCloud } from "lucide-react";

const CompanyProfile = () => {
  const location = useLocation();
  const company = location.state?.company;


  const [companyAddress, setContact1] = useState("")
  const [contact1, setContact2] = useState("")
  const [contact2, setCompanyAddress] = useState("")
  const [email, setEmail] = useState("")
  const [logoB64, setLogoB64] = useState("")

  const [initialCompany, setInitialCompany] = useState(company);
  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [notificationModal, setNotificationModal] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => {
    setEditData(company);
  }, [company]);

  if (!company) {
    return <div className="p-4 text-center text-red-500">No company data available.</div>;
  }

  const handleEditClick = async () => {
    try {
      const customerId = localStorage.getItem("customerId");
      const userId = localStorage.getItem("userId");
      const locationId = localStorage.getItem("locationId");

      const response = await fetch(EditCompany, {
        method: "POST",
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId: Number(customerId), userId, locationId, id: "" }),
      });

      const data = await response.json();

      if (data.success) {
        setEditData(data.data);
        setIsEditing(true);
      } else {
        throw new Error(data.errorMessage || "Failed to enter edit mode.");
      }
    } catch (error) {
      setErrorModal({ title: "Edit Error", message: error.message });
    }
  };

  const handleCancelEdit = () => {
    setEditData(initialCompany);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setShowConfirm(true);
  };

  const confirmSave = async () => {
    setConfirmLoading(true);
    try {
      const response = await fetch(SaveCompany, {
        method: "POST",
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.errorMessage || "Failed to save company info.");
      }
      setNotificationModal({ isOpen: true, title: "Success", message: "Company info saved successfully." });
      setIsEditing(false);
      setInitialCompany(editData);
    } catch (error) {
      setErrorModal({ title: "Save Error", message: error.message });
    } finally {
      setConfirmLoading(false);
      setShowConfirm(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1]; // remove the prefix
      setLogoB64(base64String);
    };
    reader.readAsDataURL(file);
  };


  return (
    <>
      <div className="p-6 h-full">
        <div className="bg-white rounded h-full ">
          <div className="text-black text-xl p-6">Company Name</div>
          <div className="p-4 grid grid-cols-2 gap-4 text-sm">
            <div className="grid grid-cols-2 gap-4 text-black">
              <div>Business Register No.</div>
              <input
                type="text"
                value="A-0001"
                placeholder="Business Registration No"
                className="bg-gray-300 text-black p-2 rounded w-full"
              />
              <div>TIN No.</div>
              <input
                type="text"
                value="TIN-00001"
                placeholder="TIN Number"
                className="bg-gray-300 text-black p-2 rounded w-full"
              />
              <div>Main Currency</div>
              <input
                type="text"
                value="RM"
                placeholder="Main Currency"
                className="bg-gray-300 text-black p-2 rounded w-full"
              />
              <div>Business Activity</div>
              <input
                type="text"
                value="Optical Retailer"
                placeholder="Business Activity"
                className="bg-gray-300 text-black p-2 rounded w-full"
              />
              <div>Address</div>
              <textarea
                style={{ resize: 'none' }}
                type="Text"
                placeholder="Company Address"
                className="bg-gray-300 text-black p-2 rounded w-full"
                rows={4}
                value={companyAddress}

                onChange={(e) => setCompanyAddress(e.target.value)}
              />
              <div>Contact 1</div>
              <input
                type="tel"
                value={contact1}
                onChange={(e) => setContact1(e.target.value)}
                placeholder="Contact No 1"
                className="bg-gray-300 text-black p-2 rounded w-full"
              />
              <div>Contact 2</div>
              <input
                type="tel"
                value={contact2}
                onChange={(e) => setContact2(e.target.value)}
                placeholder="Contact No 2"
                className="bg-gray-300 text-black p-2 rounded w-full"
              />
              <div>Email</div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Company Email"
                className="bg-gray-300 text-black p-2 rounded w-full"
              />
            </div>
            <div className="bg-black ml-80 w-40 h-40 flex justify-center rounded-full items-center relative overflow-hidden group">
              <img
                src={`data:image/png;base64,${logoB64}`}
                className="w-full h-full rounded-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <UploadCloud className="text-white w-8 h-8" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleLogoChange(e)}
              />
            </div>


          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirm}
        title="Confirm Save"
        message="Are you sure you want to save these changes?"
        onConfirm={confirmSave}
        onCancel={() => setShowConfirm(false)}
        loading={confirmLoading}
      />

      <ErrorModal
        title={errorModal.title}
        message={errorModal.message}
        onClose={() => setErrorModal({ title: "", message: "" })}
      />

      <NotificationModal
        isOpen={notificationModal.isOpen}
        title={notificationModal.title}
        message={notificationModal.message}
        onClose={() => setNotificationModal({ isOpen: false, title: "", message: "" })}
      />
    </>
  );
};

export default CompanyProfile;