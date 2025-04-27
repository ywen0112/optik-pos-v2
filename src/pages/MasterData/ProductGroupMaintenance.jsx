import { useState } from "react";
import {Plus} from"lucide-react";
import ErrorModal from "../../modals/ErrorModal";
import NotificationModal from "../../modals/NotificationModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import { DeleteItemGroup, GetItemGroup, NewItemGroup, SaveItemGroup } from "../../api/maintenanceapi";
import ProductGroupDataGrid from "../../Components/DataGrid/Product/ProductGroupDataGrid";
import UpdateProductGroupModal from "../../modals/MasterData/Product/UpdateProductGroupModal";

const ProductGroupMaintenance = () => {
    const companyId = sessionStorage.getItem("companyId");
    const userId = sessionStorage.getItem("userId");

    const [loading, setLoading] = useState(false);
    const [errorModal, setErrorModal] = useState({ title: "", message: "" });
    const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null });

    const [selectedGroup, setSelectedGroup] = useState(null);
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
        add: "Are you sure you want to add this product group?",
        edit: "Are you sure you want to edit this product group?",
        delete: "Are you sure you want to delete this product group?"
    };

    const confirmAction = async ({ action, data }) => {
        setSaving(true);
        setConfirmModal({ isOpen: false, action: null });
        try {
            if (action === "delete") {
                const data = await DeleteItemGroup({ companyId: companyId, userId: userId, id: deleteTarget });
                if (data.success) {
                    setNotifyModal({ isOpen: true, message: "Product Group Deleted successfully!" });
                } else throw new Error(data.errorMessage || "Failed to delete Product Group");
            } else {
                const saveRes = await SaveItemGroup({
                    ...data
                });
                if (saveRes.success) {
                    setNotifyModal({ isOpen: true, message: "Product Group saved successfully!" });
                    setSelectedGroup(null);
                } else throw new Error(data.errorMessage || "Failed to save Product Group");

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
        setSelectedGroup(null);
    }

    const handleEdit = async (group) => {
        setLoading(true);
        try {
            const data = await GetItemGroup({ companyId: companyId, userId: userId, id: group.itemGroupId });
            if (data.success) {
                setSelectedGroup(data.data);
                setAction("edit");
                setIsUpdateModelOpen(true);
            } else throw new Error(data.errorMessage || "Failed to fetch Product Group");
        } catch (error) {
            setErrorModal({ title: "Edit Error", message: error.message });
        } finally {
            setLoading(false);
        }
    }

    const handleNew = async () => {
        setLoading(true);
        try {

            const data = await NewItemGroup({ companyId: companyId, userId: userId, id: userId });
            if (data.success) {
                setSelectedGroup(data.data);
                setAction("add");
                setIsUpdateModelOpen(true);
            } else throw new Error(data.errorMessage || "Failed to create new Product Group");
        } catch (error) {
            setErrorModal({ title: "New Product Group Error", message: error.message });
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

            <UpdateProductGroupModal
                selectedProductGroup={selectedGroup}
                isEdit={action === "edit"}
                isOpen={isUpdateModelOpen}
                onConfirm={confirmAction}
                onError={setErrorModal}
                onClose={handleCloseUpdateModal}
            />

            <div className="mt-2 bg-white h-[72vh] rounded-lg shadow overflow-hidden">
             
                    <ProductGroupDataGrid
                        className={"p-2"}
                        companyId={companyId}
                        onError={setErrorModal}
                        onDelete={handleDeleteCLick}
                        onEdit={handleEdit}
                    >
                    </ProductGroupDataGrid>

                
            </div>
        </div>
    )
}

export default ProductGroupMaintenance;