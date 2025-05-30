import { useState } from "react";
import { useLocation } from "react-router-dom";
import ConfirmationModal from "../../modals/ConfirmationModal";
import ErrorModal from "../../modals/ErrorModal";
import NotificationModal from "../../modals/NotificationModal";
import { UploadCloud } from "lucide-react";

import company_icon from "../../assets/company_icon.svg";
import { SaveCompany } from "../../api/companyapi";

const CompanyProfile = () => {
  const location = useLocation();
  const company = location.state?.company;
  const [companyLogo, setCompanyLogo] = useState(company.companyLogo)
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [notificationModal, setNotificationModal] = useState({ isOpen: false, title: "", message: "" });

  if (!company) {
    return <div className="p-4 text-center text-red-500">No company data available.</div>;
  }

  const handleSave = () => {
    setShowConfirm(true);
  };

  const confirmSave = async () => {
    setConfirmLoading(true);
    try {
      const data = await SaveCompany({
        actionData: company.actionData,
        companyLogo: companyLogo,
      });
      if (!data.success) {
        throw new Error(data.errorMessage || "Failed to save company info.");
      }
      setNotificationModal({ isOpen: true, title: "Success", message: "Company info saved successfully." });
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
      const base64String = reader.result.split(",")[1];

      setCompanyLogo(base64String)

    };
    reader.readAsDataURL(file);
  };


  return (
    <>
      <div className="p-6 h-full">
        <div className="bg-white rounded h-full">
          <div className="flex flex-row place-content-between">
            <div className="text-black text-xl p-6">{company.companyName}</div>
            <div className="col-end-5 p-6">
              <button className="bg-green-600 w-full text-white" onClick={handleSave}>Save</button>
            </div>
          </div>

          <div className="p-4 grid grid-cols-2 gap-4 text-sm">
            <div className="grid grid-cols-2 gap-4 text-black">
              <div>Business Register No.</div>
              <input
                disabled={true}
                readOnly={true}
                type="text"
                value={company.registrationNo}
                placeholder="Business Registration No"
                className="bg-gray-300 text-black p-2 rounded w-full"
              />
              <div>TIN No.</div>
              <input
                disabled={true}
                readOnly={true}
                type="text"
                value={company.fullTIN}
                placeholder="TIN Number"
                className="bg-gray-300 text-black p-2 rounded w-full"
              />
              <div>Main Currency</div>
              <input
                disabled={true}
                readOnly={true}
                type="text"
                value={company.homeCurrency}
                placeholder="Main Currency"
                className="bg-gray-300 text-black p-2 rounded w-full"
              />
              <div>Business Activity</div>
              <input
                disabled={true}
                readOnly={true}
                type="text"
                value={company.businessActivityDesc}
                placeholder="Business Activity"
                className="bg-gray-300 text-black p-2 rounded w-full"
              />
              <div>Address</div>
              <textarea
                disabled={true}
                readOnly={true}
                style={{ resize: 'none' }}
                type="Text"
                placeholder="Company Address"
                className="bg-gray-300 text-black p-2 rounded w-full"
                rows={4}
                value={company.address}
              />
              <div>Contact 1</div>
              <input
                disabled={true}
                readOnly={true}
                type="tel"
                value={company.phone1}
                placeholder="Contact No 1"
                className="bg-gray-300 text-black p-2 rounded w-full"
              />
              <div>Contact 2</div>
              <input
                disabled={true}
                readOnly={true}
                type="tel"
                value={company.phone2}
                placeholder="Contact No 2"
                className="bg-gray-300 text-black p-2 rounded w-full"
              />
              <div>Email</div>
              <input
                disabled={true}
                readOnly={true}
                type="text"
                value={company.emailAddress}
                placeholder="Company Email"
                className="bg-gray-300 text-black p-2 rounded w-full"
              />
            </div>
            <div className="bg-gray-600 ml-80 w-40 h-40 flex justify-center rounded-full items-center relative overflow-hidden group">
              <img
                src={companyLogo ? `data:image/png;base64,${companyLogo}` : company_icon}
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