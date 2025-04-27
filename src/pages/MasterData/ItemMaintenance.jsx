import { useState } from "react";
import { Plus } from "lucide-react";
import ErrorModal from "../../modals/ErrorModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import NotificationModal from "../../modals/NotificationModal";

import ProductDataGrid from "../../Components/DataGrid/Product/ProductDataGrid"
import UpdateProductModal from "../../modals/MasterData/Product/AddProductModal";
import { GetItem, DeleteItem, SaveItem, NewItem } from "../../api/maintenanceapi";

const ItemMaintenance = () => {
    const companyId = sessionStorage.getItem("companyId");
    const userId = sessionStorage.getItem("userId");

    const [loading, setLoading] = useState(false);
    const [errorModal, setErrorModal] = useState({ title: "", message: "" });
    const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null });

    const [selectedItem, setSelectedItem] = useState(null);
    const [formAction, setFormAction] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModelOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleAddItem = async () => {
        setLoading(true);
        try {
            const data = await NewItem({ companyId: companyId, userId: userId, id: userId });
            if (data.success) {
                setSelectedItem(data.data);
                setFormAction("add");
                setIsUpdateModelOpen(true)
            } else throw new Error(data.errorMessage || "Failed to create new product.");
        } catch (error) {
            setErrorModal({ title: "New Product Error", message: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseUpdateModal = () =>{
        setIsUpdateModelOpen(false);
        setSelectedItem(null);
    }

    const handleOpenModal = async (item, mode) => {
        setLoading(true);
        if (mode === "edit") {
            try {
                const data = await GetItem({ companyId: companyId, userId: userId, id: item.itemId });
                if (data.success) {
                    setSelectedItem(data.data);
                    setFormAction("edit");
                    setIsUpdateModelOpen(true);
                } else {
                    throw new Error(data.errorMessage || "Failed to fetch item.");
                }
            } catch (error) {
                setErrorModal({ title: "Edit Error", message: error.message });
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false)
            setSelectedItem(item);
            setIsUpdateModelOpen(true);
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteTarget(id);
        setConfirmModal({ isOpen: true, action: "delete" });
    }

    const confirmAction = async ({action, data}) => {
        setSaving(true);
        setConfirmModal({ isOpen: false, action: null });

        try {
            if (action === "add" || action === "edit") {
                const actionData = {
                    companyId: companyId,
                    userId: userId,
                    id: action === "add" ? userId : data.itemId
                }
                const resData = await SaveItem({
                    actionData: actionData,
                    itemId: data.itemId,
                    itemCode: data.itemCode,
                    isActive: data.isActive,
                    description: data.description,
                    desc2: data.desc2,
                    itemGroupId: data.itemGroupId,
                    itemTypeId: data.itemTypeId,
                    remark: data.remark,
                    itemUOM: data.itemUOM,
                    itemCommission: data.itemCommission
                });
                if (resData.success) {
                    setNotifyModal({ isOpen: true, message: "Item saved successfully!" });
                    setSelectedItem(null);
                } else {
                    throw new Error(resData.errorMessage || "Failed to save item.");
                }
            } else if (action === "delete") {
                const data = await DeleteItem({ companyId: companyId, userId: userId, id: deleteTarget });
                if (data.success) {
                    setNotifyModal({ isOpen: true, message: "Item deleted successfully!" });
                } else {
                    throw new Error(data.errorMessage || "Failed to delete item.");
                }
            }
        } catch (error) {
            setErrorModal({ title: `${action === "delete" ? "Delete" : "Save"} Error`, message: error.message });
        } finally {
            setSaving(false);
            setIsUpdateModelOpen(false);
        }
    };

    const confirmationTitleMap = {
        add: "Confirm New",
        edit: "Confirm Edit",
        delete: "Confirm Delete"
    };

    const confirmationMessageMap = {
        add: "Are you sure you want to add this item?",
        edit: "Are you sure you want to edit this item?",
        delete: "Are you sure you want to delete this item?"
    };


    return (
        <div>
            <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
            <NotificationModal isOpen={notifyModal.isOpen} message={notifyModal.message} onClose={() => setNotifyModal({ isOpen: false, message: "" })} />
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                title={confirmationTitleMap[confirmModal.action]}
                message={confirmationMessageMap[confirmModal.action]}
                loading={saving}
                onConfirm={() => confirmAction({action: confirmModal.action})}
                onCancel={() => setConfirmModal({ isOpen: false, action: null })}
            />
            <UpdateProductModal
                selectedItem={selectedItem}
                isEdit={formAction === "edit"}
                isOpen={isUpdateModalOpen}
                onConfirm={confirmAction}
                onError={setErrorModal}
                onClose={handleCloseUpdateModal}
            />

            <div className="text-right p-2">
            <button className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90 transition mb-2 flex flex-row justify-self-end" onClick={handleAddItem}>
          <Plus size={20}/> New
        </button>
            </div>

            <div className="mt-2 bg-white h-[72vh] rounded-lg shadow overflow-hidden">
                
                    <ProductDataGrid
                        className={"p-2"}
                        companyId={companyId}
                        onError={setErrorModal}
                        onDelete={handleDeleteClick}
                        onEdit={handleOpenModal}
                    />
            </div>
            
        </div>
    );
};

export default ItemMaintenance;
