import { useState } from "react";
import { Plus } from "lucide-react";
import ErrorModal from "../../modals/ErrorModal";
import NotificationModal from "../../modals/NotificationModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import NumberingFormatDataGrid from "../../Components/DataGrid/NumberingFormatDataGrid";
import AddNumberingFormatModal from "../../modals/MasterData/NumberingFormat/AddNumberingFormatModal";
import { GetDocNoRecord, SaveDocNoFormat } from "../../api/maintenanceapi";

const NumberingFormat = () => {
  const companyId = sessionStorage.getItem("companyId");
  const userId = sessionStorage.getItem("userId");
  const [formats, setFormats] = useState([]);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null });
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [formAction, setFormAction] = useState(null);
  const [isUpdateModelOpen, setIsUpdateModelOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleOpenModal = async (format, mode) => {
    const data = await GetDocNoRecord({ companyId: companyId, userId: userId, id: format.docType })
    setSelectedFormat(data.data);
    setFormAction(mode);
    setIsUpdateModelOpen(true);
  };

  const confirmAction = async ({isOpen, action, data}) => {
    setSaving(true);
    setConfirmModal({ isOpen: false, action: null });

    if (action === "edit") {
      try{
        const res = await SaveDocNoFormat({...data})
        if (res.success){
          setNotifyModal({ isOpen: true, message: "Numbering format updated successfully!" });
        }else throw new Error(data.errorMessage || "Failed to edit doc number format");
      }catch(error){
        setErrorModal({title:"Edit Error", message: error.message });
      }finally{
        setSaving(false);
      }
      
    }
    setSelectedFormat(null);
    setIsUpdateModelOpen(false);

    setSaving(false);

  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModelOpen(false);
    setSelectedFormat(null);
  };

  const confirmationTitleMap = {
    add: "Confirm New",
    edit: "Confirm Edit",
    delete: "Confirm Delete",
  };

  const confirmationMessageMap = {
    add: "Are you sure you want to add this numbering format?",
    edit: "Are you sure you want to edit this numbering format?",
    delete: "Are you sure you want to delete this numbering format?",
  };

  return (
    <div>
      <ErrorModal
        title={errorModal.title}
        message={errorModal.message}
        onClose={() => setErrorModal({ title: "", message: "" })}
      />
      <NotificationModal
        isOpen={notifyModal.isOpen}
        message={notifyModal.message}
        onClose={() => setNotifyModal({ isOpen: false, message: "" })}
      />
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmationTitleMap[confirmModal.action]}
        message={confirmationMessageMap[confirmModal.action]}
        loading={saving}
        onConfirm={confirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, action: null })}
      />
      <AddNumberingFormatModal
        selectedFormat={selectedFormat}
        isEdit={formAction === "edit"}
        isOpen={isUpdateModelOpen}
        onConfirm={confirmAction}
        onError={setErrorModal}
        onClose={handleCloseUpdateModal}
      />

      <div className="mt-2 bg-white h-[72vh] rounded-lg shadow overflow-hidden">
        <NumberingFormatDataGrid
          className="p-2"
          onError={setErrorModal}
          onEdit={handleOpenModal}
        />
      </div>
    </div>
  );
};

export default NumberingFormat;
