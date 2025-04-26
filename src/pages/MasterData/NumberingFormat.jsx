import { useState } from "react";
import ErrorModal from "../../modals/ErrorModal";
import NotificationModal from "../../modals/NotificationModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import AddSupplierModal from "../../modals/MasterData/Supplier/AddSupplierModal";
import NumberingFormatDataGrid from "../../Components/DataGrid/NumberingFormatDataGrid";
import AddNumberingFormatModal from "../../modals/MasterData/NumberingFormat/AddNumberingFormatModal";

const NumberingFormat = () => {
  const [formats, setFormats] = useState([]);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null });
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [formAction, setFormAction] = useState(null);
  const [isUpdateModelOpen, setIsUpdateModelOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleOpenModal = (format, mode) => {
    setSelectedFormat(format);
    setFormAction(mode);
    setIsUpdateModelOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
    setConfirmModal({ isOpen: true, action: "delete" });
  };

  const confirmAction = () => {
    const action = confirmModal.action;
    setSaving(true);
    setConfirmModal({ isOpen: false, action: null });

    setTimeout(() => {
      if (action === "delete") {
        setFormats((prev) => prev.filter((f) => f.formatId !== deleteTarget));
        setNotifyModal({ isOpen: true, message: "Numbering format deleted successfully!" });
      } else {
        if (formAction === "edit") {
          setFormats((prev) =>
            prev.map((f) =>
                f.formatId === selectedFormat.formatId ? selectedFormat : f
            )
          );
          setNotifyModal({ isOpen: true, message: "Numbering format updated successfully!" });
        } 
        setSelectedFormat(null);
        setIsUpdateModelOpen(false);
      }
      setSaving(false);
    }, 500);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModelOpen(false);
    setSelectedFormat(null);
  };

  const confirmationTitleMap = {
    add: "Confirm Add",
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
   
      <div className="mt-2 bg-white h-[50vh] rounded-lg shadow overflow-hidden">
        <NumberingFormatDataGrid
          numberingFormatRecords={formats}
          className="p-2"
          onError={setErrorModal}
          onDelete={handleDeleteClick}
          onEdit={handleOpenModal}
        />
      </div>
    </div>
  );
};

export default NumberingFormat;
