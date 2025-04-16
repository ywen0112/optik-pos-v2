import { useEffect, useState, useRef } from "react";
import { Eye, Trash2, Pencil } from "lucide-react";
import ErrorModal from "../../modals/ErrorModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import NotificationModal from "../../modals/NotificationModal";
import { GetItemRecords, EditItem, GetItemGroup, GetItemType, NewItem, NewItemDetail, SaveItem, DeleteItem } from "../../apiconfig";
import Select from "react-select";

import ProductDataGrid from "../../Components/DataGrid/ProductDataGrid"
import UpdateProductModal from "../../modals/MasterData/Product/AddProductModal";

const ItemMaintenance = () => {
    const customerId = localStorage.getItem("customerId");
    const userId = localStorage.getItem("userId");
    const locationId = localStorage.getItem("locationId");

    const productDataGridRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [errorModal, setErrorModal] = useState({ title: "", message: "" });
    const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null });
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formAction, setFormAction] = useState(null);
    const [viewMode, setViewMode] = useState(false);
    const [itemTypes, setItemTypes] = useState([]);
    const [selectedItemType, setSelectedItemType] = useState(null);
    const [itemGroups, setItemGroups] = useState([]);
    const [selectedItemGroup, setSelectedItemGroup] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
    });

    useEffect(() => {
        fetchItems();
        fetchItemType();
        fetchItemGroup();
    }, [pagination.currentPage]);

    const fetchItems = async () => {
        setLoading(true);
        const offset = (pagination.currentPage - 1) * pagination.itemsPerPage;
        const limit = pagination.itemsPerPage;

        try {
            const res = await fetch(GetItemRecords, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customerId: Number(customerId), keyword: "", offset, limit }),
            });
            const data = await res.json();
            if (data.success) {
                setItems(data.data.itemRecords || []);
                setPagination((prev) => ({ ...prev, totalItems: data.data.totalRecords || 0 }));
            } else {
                throw new Error(data.errorMessage || "Failed to fetch item records.");
            }
        } catch (error) {
            setErrorModal({ title: "Fetch Error", message: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= Math.ceil(pagination.totalItems / pagination.itemsPerPage)) {
            setPagination((prev) => ({ ...prev, currentPage: newPage }));
        }
    };

    const fetchItemType = async () => {
        try {
            const res = await fetch(GetItemType, {
                method: "POST",
                headers: {
                    Accept: "text/plain",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ customerId: Number(customerId), keyword: "", offset: 0, limit: 9999 }),
            });
            const data = await res.json();
            if (data.success) {
                setItemTypes(data.data.itemTypeRecords || [])
            } else {
                throw new Error(data.errorMessage || "Failed to fetch item type.");
            }
        } catch (error) {
            setErrorModal({ title: "Fetch Error", message: error.message });
        }
    };

    const fetchItemGroup = async () => {
        try {
            const res = await fetch(GetItemGroup, {
                method: "POST",
                headers: {
                    Accept: "text/plain",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ customerId: Number(customerId), keyword: "", offset: 0, limit: 9999 }),
            });
            const data = await res.json();
            if (data.success) {
                setItemGroups(data.data.itemGroupsRecords || []);
            } else {
                throw new Error(data.errorMessage || "Failed to fetch item group.");
            }
        } catch (error) {
            setErrorModal({ title: "Fetch Error", message: error.message });
        }
    };

    const getItemTypeLabel = (id) => itemTypes.find((it) => it.itemTypeId === id)?.itemTypeCode || "-";
    const getItemGroupLabel = (id) => itemGroups.find((ig) => ig.itemGroupId === id)?.itemGroupCode || "-";

    const handleAddItem = async () => {
        setIsModalOpen(true)
        // try {
        //     const newItemRes = await fetch(NewItem, {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({
        //             customerId: Number(customerId),
        //             userId,
        //             locationId,
        //             id: ""
        //         }),
        //     });

        //     if (!newItemRes.ok) throw new Error("Failed to call NewItem API.");
        //     const newItemData = await newItemRes.json();

        //     if (!newItemData.success) throw new Error(newItemData.errorMessage || "NewItem API failed.");

        //     const newItem = newItemData.data;

        //     const uomRes = await fetch(NewItemDetail, {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({
        //             customerId: Number(customerId),
        //             userId,
        //             locationId,
        //             id: newItem.itemId
        //         }),
        //     });

        //     if (!uomRes.ok) throw new Error("Failed to call NewItemDetail API.");
        //     const uomData = await uomRes.json();

        //     const defaultUOM = uomData.success
        //         ? [{ ...uomData.data, uom: "", unitPrice: "", barCode: "" }]
        //         : [];

        //     setSelectedItem({ ...newItem, itemUOMs: defaultUOM });
        //     setSelectedItemGroup(null);
        //     setSelectedItemType(null);
        //     setFormAction("add");
        //     setViewMode(false);
        // } catch (err) {
        //     setErrorModal({ title: "Add Item Error", message: err.message });
        // }
    };

    const handleOpenModal = async (item, mode) => {
        if (mode === "edit") {
            try {
                const res = await fetch(EditItem, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        customerId: Number(customerId),
                        userId,
                        locationId,
                        id: item.itemId,
                    }),
                });
                const data = await res.json();
                if (data.success) {
                    setSelectedItem(data.data);
                    const matchedType = itemTypes.find((it) => it.itemTypeId === data.data.itemTypeId);
                    setSelectedItemType(matchedType ? {
                        value: matchedType.itemTypeId,
                        label: matchedType.itemTypeCode
                    } : null);
                    const matchedGroup = itemGroups.find((ig) => ig.itemGroupId === data.data.itemGroupId);
                    setSelectedItemGroup(matchedGroup ? {
                        value: matchedGroup.itemGroupId,
                        label: matchedGroup.itemGroupCode
                    } : null);
                    setFormAction("edit");
                    setViewMode(false);
                } else {
                    throw new Error(data.errorMessage || "Failed to fetch item.");
                }
            } catch (error) {
                setErrorModal({ title: "Edit Error", message: error.message });
            }
        } else {
            setSelectedItem(item);
            setViewMode(true);
        }
    };

    const handleInputChange = (field, value) => {
        setSelectedItem((prev) => ({ ...prev, [field]: value }));
    };

    const handleCheckboxChange = (field) => {
        setSelectedItem((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const confirmationTitleMap = {
        add: "Confirm Add",
        edit: "Confirm Edit",
        delete: "Confirm Delete"
    };

    const confirmationMessageMap = {
        add: "Are you sure you want to add this item?",
        edit: "Are you sure you want to edit this item?",
        delete: "Are you sure you want to delete this item?"
    };

    const handleUomChange = (index, field, value) => {
        setSelectedItem((prev) => {
            const updatedUOMs = [...prev.itemUOMs];
            updatedUOMs[index][field] = value;
            return { ...prev, itemUOMs: updatedUOMs };
        });
    };

    const addUom = async () => {
        try {
            const res = await fetch(NewItemDetail, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: Number(customerId),
                    userId,
                    locationId,
                    id: selectedItem.itemId
                }),
            });

            if (!res.ok) throw new Error("Failed to call NewItemDetail API.");
            const data = await res.json();

            if (data.success) {
                const newUOM = { ...data.data, uom: "", unitPrice: "", barCode: "" };
                setSelectedItem((prev) => ({
                    ...prev,
                    itemUOMs: [...(prev.itemUOMs || []), newUOM],
                }));
            } else {
                throw new Error(data.errorMessage || "Failed to create new item UOM.");
            }
        } catch (error) {
            setErrorModal({ title: "Add UOM Error", message: error.message });
        }
    };

    const deleteUom = (index) => {
        setSelectedItem((prev) => {
            const updatedUOMs = [...prev.itemUOMs];
            updatedUOMs.splice(index, 1);
            return { ...prev, itemUOMs: updatedUOMs };
        });
    };

    const handleSaveItem = () => {
        setConfirmModal({ isOpen: true, action: formAction });
    };

    const handleDeleteClick = (id) => {
        setDeleteTarget(id);
        setConfirmModal({ isOpen: true, action: "delete" });
    };

    const confirmAction = async () => {
        setSaving(true);
        const action = confirmModal.action;
        setConfirmModal({ isOpen: false, action: null });

        try {
            if (action === "add" || action === "edit") {
                const res = await fetch(SaveItem, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        actionData: {
                            customerId: Number(customerId),
                            userId,
                            locationId,
                            id: selectedItem.itemId
                        },
                        itemId: selectedItem.itemId,
                        itemCode: selectedItem.itemCode || null,
                        description: selectedItem.description || null,
                        desc2: selectedItem.desc2 || null,
                        itemGroupId: selectedItem.itemGroupId || null,
                        itemTypeId: selectedItem.itemTypeId || null,
                        classification: selectedItem.classification || null,
                        isActive: !!selectedItem.isActive,
                        image: "",
                        itemUOMs: selectedItem.itemUOMs || []
                    }),
                });

                const data = await res.json();
                if (data.success) {
                    setNotifyModal({ isOpen: true, message: "Item saved successfully!" });
                    setSelectedItem(null);
                    fetchItems();
                } else {
                    throw new Error(data.errorMessage || "Failed to save item.");
                }
            } else if (action === "delete") {
                const res = await fetch(DeleteItem, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        customerId: Number(customerId),
                        userId,
                        locationId,
                        id: deleteTarget
                    }),
                });

                const data = await res.json();
                if (data.success) {
                    setNotifyModal({ isOpen: true, message: "Item deleted successfully!" });
                    fetchItems();
                } else {
                    throw new Error(data.errorMessage || "Failed to delete item.");
                }
            }
        } catch (error) {
            setErrorModal({ title: `${action === "delete" ? "Delete" : "Save"} Error`, message: error.message });
        } finally {
            setSaving(false);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false)
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            border: "1px solid #ccc",
            padding: "1px",
            fontSize: "0.75rem",
            width: "100%",
            minHeight: "2.5rem",
            backgroundColor: state.isDisabled ? "#f9f9f9" : "white",
            cursor: state.isDisabled ? "not-allowed" : "pointer",
        }),
        input: (provided) => ({
            ...provided,
            fontSize: "0.75rem",
        }),
        placeholder: (provided) => ({
            ...provided,
            fontSize: "0.75rem",
        }),
        menu: (provided) => ({
            ...provided,
            fontSize: "0.75rem",
            zIndex: 9999,
            position: "absolute",
            maxHeight: "10.5rem",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            pointerEvents: "auto",
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: "10.5rem",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
        }),
        menuPortal: (provided) => ({
            ...provided,
            zIndex: 9999,
        }),
        option: (provided, state) => ({
            ...provided,
            fontSize: "0.75rem",
            padding: "4px 8px",
            backgroundColor: state.isSelected ? "#f0f0f0" : "#fff",
            color: state.isSelected ? "#333" : "#000",
            ":hover": {
                backgroundColor: "#e6e6e6",
            },
        }),
    };

    const handleModalClose = () =>{
        setIsModalOpen(false)
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
                onConfirm={confirmAction}
                onCancel={() => setConfirmModal({ isOpen: false, action: null })}
            />
            <UpdateProductModal
                isOpen={isModalOpen}
                isEdit={false}
                handleClose={handleModalClose}
            />

            <div className="text-right p-2">
                <button className="bg-secondary text-white px-4 py-1 rounded hover:bg-secondary/90 transition" onClick={handleAddItem}>
                    Add Item
                </button>
            </div>

            <div className="mt-2 bg-white h-[50vh] rounded-lg shadow overflow-hidden">
                {loading ? (
                    <p className="text-center py-4 text-gray-500">Loading...</p>
                ) : (

                    <ProductDataGrid
                        ref={productDataGridRef}
                        datasource={items}
                        className={"p-2"}
                        customerId={customerId}
                        onError={setErrorModal}
                        onDelete={handleDeleteClick}
                        
                    />
                )}
            </div>



           
            {/* {selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                    <div className="bg-white w-fit p-6 rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto text-secondary text-xs">
                        <h3 className="text-lg font-semibold mb-4">
                            {viewMode ? "View Item" : formAction === "edit" ? "Edit Item" : "Add Item"}
                        </h3>

                        <div className="grid grid-cols-4 gap-4">
                            {[
                                ["Item Code", "itemCode"],
                                ["Description", "description"],
                                ["Desc 2", "desc2"],
                                ["Classification", "classification"],
                            ].map(([label, key, disabled = false]) => (
                                <div key={key}>
                                    <label className="block">{label}</label>
                                    <input
                                        type="text"
                                        value={selectedItem[key] || ""}
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                        readOnly={viewMode || disabled}
                                        className={`mt-1 w-full p-2 border rounded ${viewMode || disabled ? "bg-gray-100" : "bg-white"}`}
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="block">Item Group Code</label>
                                <Select
                                    options={itemGroups.map((group) => ({
                                        value: group.itemGroupId,
                                        label: group.itemGroupCode
                                    }))}
                                    value={selectedItemGroup}
                                    isDisabled={viewMode}
                                    onChange={(selected) => {
                                        setSelectedItemGroup(selected);
                                        handleInputChange("itemGroupId", selected ? selected.value : null);
                                    }}
                                    styles={customStyles}
                                    placeholder="Select"
                                    isSearchable={false}
                                    isClearable
                                    classNames={{ menuList: () => "scrollbar-hide" }} menuPortalTarget={document.body} menuPosition="fixed" tabIndex={0}
                                />
                            </div>

                            <div>
                                <label className="block">Item Type Code</label>
                                <Select
                                    options={itemTypes.map((type) => ({
                                        value: type.itemTypeId,
                                        label: type.itemTypeCode
                                    }))}
                                    value={selectedItemType}
                                    isDisabled={viewMode}
                                    onChange={(selected) => {
                                        setSelectedItemType(selected);
                                        handleInputChange("itemTypeId", selected ? selected.value : null);
                                    }}
                                    styles={customStyles}
                                    placeholder="Select"
                                    isSearchable={false}
                                    isClearable
                                    classNames={{ menuList: () => "scrollbar-hide" }} menuPortalTarget={document.body} menuPosition="fixed" tabIndex={0}
                                />
                            </div>

                            {[
                                ["Is Active", "isActive"],
                            ].map(([label, key]) => (
                                <div key={key} className="flex items-center space-x-2 mt-2">
                                    <label className="inline-block relative w-4 h-4">
                                        <input
                                            type="checkbox"
                                            checked={!!selectedItem[key]}
                                            disabled={viewMode}
                                            onChange={() => handleCheckboxChange(key)}
                                            className="peer sr-only"
                                        />
                                        <div
                                            className={`w-4 h-4 rounded border flex items-center justify-center 
                        ${viewMode ? "cursor-default" : "cursor-pointer"} 
                        ${selectedItem[key] ? "bg-secondary border-secondary" : "bg-white border-gray-300"}`}
                                        >
                                            {selectedItem[key] && (
                                                <svg
                                                    className="w-3 h-3 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </label>
                                    <label>{label}</label>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold">Item UOMs</h4>
                                {!viewMode && (
                                    <button className="text-xs text-white bg-secondary px-2 py-1 rounded" onClick={addUom}>Add UOM</button>
                                )}
                            </div>
                            <table className="w-full border-collapse border border-gray-200 text-xs text-left text-secondary">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-1 border">UOM</th>
                                        <th className="p-1 border">Unit Price</th>
                                        <th className="p-1 border">Barcode</th>
                                        {!viewMode && <th className="p-1 border">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(selectedItem.itemUOMs || []).map((uom, idx) => (
                                        <tr key={idx}>
                                            <td className="border">
                                                <input
                                                    type="text"
                                                    value={uom.uom}
                                                    onChange={(e) => handleUomChange(idx, "uom", e.target.value)}
                                                    readOnly={viewMode}
                                                    className={`w-full px-1 ${viewMode ? "bg-white cursor-not-allowed" : "bg-white border rounded-sm"}`}
                                                />
                                            </td>
                                            <td className="border">
                                                <input
                                                    type="number"
                                                    value={uom.unitPrice}
                                                    min={0}
                                                    onChange={(e) => handleUomChange(idx, "unitPrice", e.target.value)}
                                                    readOnly={viewMode}
                                                    className={`w-full px-1 ${viewMode ? "bg-white cursor-not-allowed" : "bg-white border rounded-sm"}`}
                                                />
                                            </td>
                                            <td className="border">
                                                <input
                                                    type="text"
                                                    value={uom.barCode}
                                                    onChange={(e) => handleUomChange(idx, "barCode", e.target.value)}
                                                    readOnly={viewMode}
                                                    className={`w-full px-1 ${viewMode ? "bg-white cursor-not-allowed" : "bg-white border rounded-sm"}`}
                                                />
                                            </td>
                                            {!viewMode && (
                                                <td className="border">
                                                    <button className="text-red-500 pl-0" onClick={() => deleteUom(idx)}><Trash2 size={14} /></button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-end space-x-2">
                            {!viewMode && (
                                <button
                                    className="px-4 py-1 rounded text-sm bg-green-500 text-white"
                                    onClick={handleSaveItem}
                                >
                                    Save
                                </button>
                            )}
                            <button className="px-4 py-1 rounded text-sm bg-red-500 text-white" onClick={() => setSelectedItem(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default ItemMaintenance;
