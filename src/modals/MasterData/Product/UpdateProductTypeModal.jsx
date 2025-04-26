import { useEffect, useState } from "react";
import { X } from "lucide-react";

const UpdateProductTypeModal = ({
    selectedProductType,
    isEdit,
    isOpen,
    onConfirm,
    onError,
    onClose,
}) => {
    const [formData, setFormData] = useState(null);
    const handleClose = () => {
        setFormData(null);
        onClose();
    }

    useEffect(() => {
        setFormData(selectedProductType);
    }, [isOpen, selectedProductType, isEdit]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 max-h-[90vh] overflow-y-auto text-secondary">
                <div className="flex flex-row justify-between">
                    <h3 className="font-semibold mb-4">
                        {isEdit ? "Edit Product Type" : "New Product Type"}
                    </h3>
                    <div className='col-span-4' onClick={handleClose}>
                        <X size={20} />
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-1">
                    <div className="col-span-4 flex justify-start items-center">
                        <label className="block">Product Type</label>
                    </div>
                    <div className="col-span-4 flex justify-start items-center">
                        <input
                            type="text"
                            className="mr-2 border w-full h-[40px] px-2"
                            placeholder="Product Type Code"
                            value={formData?.itemTypeCode}
                            onChange={(e) =>
                                setFormData({ ...formData, itemTypeCode: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-span-4 mt-2">
                        <label className="block mb-2">Description</label>
                        <input
                            type="text"
                            className="mr-2 border w-full h-[40px] px-2"
                            placeholder="Description"
                            value={formData?.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        className="bg-red-600 text-white w-36 px-4 py-2 rounded hover:bg-red-700"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-primary text-white w-36 px-4 py-2 rounded hover:bg-primary/90"
                        onClick={() => {
                            if (!formData?.itemTypeCode.trim()) {
                                onError({
                                    title: "Validation Error",
                                    message: "Product Type Code is required.",
                                });
                                return;
                            }
                            onConfirm({
                                isOpen: true,
                                action: isEdit ? "edit" : "add",
                                data: formData,
                            });
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UpdateProductTypeModal;