import { useState } from "react";
import {Plus} from "lucide-react";
import ErrorModal from "../../modals/ErrorModal";
import NotificationModal from "../../modals/NotificationModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import { DeleteItemType, GetItemType, NewItemType, SaveItemType } from "../../api/maintenanceapi";
import ProductTypeDataGrid from "../../Components/DataGrid/Product/productTypeDataGrid";
import UpdateProductTypeModal from "../../modals/MasterData/Product/UpdateProductTypeModal";

const ProductTypeMaintenance = () => {
    const companyId = sessionStorage.getItem("companyId");
    const userId = sessionStorage.getItem("userId");

    const [loading, setLoading] = useState(false);
    const [errorModal, setErrorModal] = useState({ title: "", message: "" });
    const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null });

    const [selectedType, setSelectedType] = useState(null);
    const [action, setAction] = useState(null);
    const [isUpdateModelOpen, setIsUpdateModelOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [saving, setSaving] = useState(false);

    const confirmationTitleMap = {
        add: "Confirm New",
        edit: "Confirm Edit",
        delete: "Confirm Delete"
    };

    const confirmationMessageMap = {
        add: "Are you sure you want to add this product type?",
        edit: "Are you sure you want to edit this product type?",
        delete: "Are you sure you want to delete this product type?"
    };

    const confirmAction = async ({ action, data }) => {
        setSaving(true);
        setConfirmModal({ isOpen: false, action: null });
        try {
            if (action === "delete") {
                const data = await DeleteItemType({ companyId: companyId, userId: userId, id: deleteTarget });
                if (data.success) {
                    setNotifyModal({ isOpen: true, message: "Product Type Deleted successfully!" });
                } else throw new Error(data.errorMessage || "Failed to delete Product Type");
            } else {
                const saveRes = await SaveItemType({
                    ...data
                });
                if (saveRes.success) {
                    setNotifyModal({ isOpen: true, message: "Product Type saved successfully!" });
                    setSelectedType(null);
                } else throw new Error(data.errorMessage || "Failed to save Product Type");

            }
        } catch (error) {
            setErrorModal({ title: `${action === "delete" ? "Delete" : "Save"} Error`, message: error.message });
        } finally {
            setSaving(false);
            setIsUpdateModelOpen(false);
        }
    };

    const handleDeleteCLick = (id) => {
        setDeleteTarget(id);
        setConfirmModal({ isOpen: true, action: "delete" });
    };

    const handleCloseUpdateModal = () => {
        setIsUpdateModelOpen(false);
        setSelectedType(null);
    }

    const handleEdit = async (type, mode) => {
        setLoading(true);
        try {
            const data = await GetItemType({ companyId: companyId, userId: userId, id: type.itemTypeId });
            if (data.success) {
                setSelectedType(data.data);
                setAction("edit");
                setIsUpdateModelOpen(true);
            } else throw new Error(data.errorMessage || "Failed to fetch Product Type");
        } catch (error) {
            setErrorModal({ title: "Edit Error", message: error.message });
        } finally {
            setLoading(false);
        }
    }

    const handleNew = async () => {
        setLoading(true);
        try {

            const data = await NewItemType({ companyId: companyId, userId: userId, id: userId });
            if (data.success) {
                setSelectedType(data.data);
                setAction("add");
                setIsUpdateModelOpen(true);
            } else throw new Error(data.errorMessage || "Failed to create new Product Type");
        } catch (error) {
            setErrorModal({ title: "New Product Type Error", message: error.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
            <NotificationModal isOpen={notifyModal.isOpen} message={notifyModal.message} onClose={() => setNotifyModal({ isOpen: false, message: "" })} />
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                title={confirmationTitleMap[confirmModal.action]}
                message={confirmationMessageMap[confirmModal.action]}
                loading={saving}
                onConfirm={() => confirmAction({ action: confirmModal.action })}
                onCancel={() => setConfirmModal({ isOpen: false, action: null })}
            />

            <div className="text-right p-2">
            <button className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90 transition mb-2 flex flex-row justify-self-end" onClick={handleNew}>
          <Plus size={20}/> New
        </button>
            </div>

            <UpdateProductTypeModal
                selectedProductType={selectedType}
                isEdit={action === "edit"}
                isOpen={isUpdateModelOpen}
                onConfirm={confirmAction}
                onError={setErrorModal}
                onClose={handleCloseUpdateModal}
            />

            <div className="mt-2 bg-white h-[72vh] rounded-lg shadow overflow-hidden">
                
                    <ProductTypeDataGrid
                        className={"p-2"}
                        companyId={companyId}
                        onError={setErrorModal}
                        onDelete={handleDeleteCLick}
                        onEdit={handleEdit}
                    >
                    </ProductTypeDataGrid>

            </div>
        </div>
    )
}

export default ProductTypeMaintenance;