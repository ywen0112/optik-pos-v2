import { useEffect, useState } from "react";
import { X } from 'lucide-react';

const AddExpressCustomerModal = ({
    selectedCustomer,
    isEdit,
    isOpen,
    onConfirm,
    onError,
    onClose,
}) => {
    const [formData, setFormData] = useState({
        isActive: true,
        customerCode: "",
        name: "",
        ic: "",
        dob: "",
        billingAddress: "",
        remark: "",
        phone1: "",
        phone2: "",
        email: "",
        // Medical Info
        diabetes: false,
        hypertension: false,
        squint: false,
        lazyEye: false,
        surgery: false,
        medicalOthers: "",
        ocularOthers: "",
        // RX
        lastUpdate: new Date().toISOString().split("T")[0],
        opticalHeight: "",
        segmentHeight: "",
        dominentEye: "",
        rxRight: false,
        rxLeft: false,
        rSPH: "",
        rCYL: "",
        rAXIS: "",
        rVA: "",
        rPRISM: "",
        rADD: "",
        rPD: "",
        lSPH: "",
        lCYL: "",
        lAXIS: "",
        lVA: "",
        lPRISM: "",
        lADD: "",
        lPD: "",

        docDate: new Date().toISOString().split("T")[0],
        historyRight: false,
        historyLeft: false,
    });

    useEffect(() => {
        if (isOpen) {
            setFormData(
                isEdit && selectedCustomer
                    ? selectedCustomer
                    : {
                        ...formData,
                        lastUpdate: new Date().toISOString().split("T")[0],
                        docDate: new Date().toISOString().split("T")[0],
                    }
            );
        }
    }, [isOpen, selectedCustomer, isEdit]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-1/2 h-1/2 p-6 text-secondary">
                <div className="sticky top-0 bg-white z-10">
                    <div className="flex flex-row justify-between">
                        <h3 className="font-semibold mb-4">
                            {isEdit ? "Edit Customer" : "New Customer"}
                        </h3>
                        <div className='col-span-4' onClick={onClose}>
                            <X size={20} />
                        </div>
                    </div>
                </div>

                <div className="overflow-y-auto flex-1 mt-4 h-[90%]">
                    <div className="grid grid-cols-2 w-full gap-1">
                        {/* General */}
                        <div className="w-full h-full border rounded p-4">
                            <h4 className="font-semibold mb-2">General</h4>
                            <div className="grid grid-cols-4 gap-1">
                                <div className="col-span-4 flex justify-between items-center">
                                    <label className="block">Customer Code</label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) =>
                                                setFormData({ ...formData, isActive: e.target.checked })
                                            }
                                        />
                                        <label>Active</label>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <input
                                        type="text"
                                        className="mr-2 border w-full h-[40px] px-2"
                                        placeholder="Customer Code"
                                        value={formData.customerCode}
                                        onChange={(e) =>
                                            setFormData({ ...formData, customerCode: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="col-span-4 mt-2">
                                    <label className="block mb-2">Name</label>
                                    <input
                                        type="text"
                                        className="mr-2 border w-full h-[40px] px-2"
                                        placeholder="Name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="col-span-2 mt-2">
                                    <label className="block mb-2">IC</label>
                                    <input
                                        type="text"
                                        className="mr-2 border w-full h-[40px] px-2"
                                        placeholder="IC"
                                        value={formData.ic}
                                        onChange={(e) =>
                                            setFormData({ ...formData, ic: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="col-span-2 mt-2">
                                    <label className="block mb-2">D.O.B</label>
                                    <input
                                        type="date"
                                        className="mr-2 border w-full h-[40px] px-2"
                                        value={formData.dob}
                                        onChange={(e) =>
                                            setFormData({ ...formData, dob: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="col-span-2 mt-2">
                                    <label className="block mb-2">Billing Address</label>
                                    <textarea
                                        rows={4}
                                        className="mr-2 border w-full h-[80px] px-2 py-2"
                                        placeholder="Billing Address"
                                        value={formData.billingAddress}
                                        onChange={(e) =>
                                            setFormData({ ...formData, billingAddress: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="col-span-2 mt-2">
                                    <label className="block mb-2">Remark</label>
                                    <textarea
                                        rows={4}
                                        className="mr-2 border w-full h-[80px] px-2 py-2"
                                        placeholder="Remark"
                                        value={formData.remark}
                                        onChange={(e) =>
                                            setFormData({ ...formData, remark: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="col-span-1 mt-2">
                                    <label className="block mb-2">Phone</label>
                                    <input
                                        type="text"
                                        className="mr-2 border w-full h-[40px] px-2"
                                        placeholder="Phone"
                                        value={formData.phone1}
                                        onChange={(e) =>
                                            setFormData({ ...formData, phone1: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="col-span-1 mt-2">
                                    <label className="block mb-2">Phone 2</label>
                                    <input
                                        type="text"
                                        className="mr-2 border w-full h-[40px] px-2"
                                        placeholder="Phone 2"
                                        value={formData.phone2}
                                        onChange={(e) =>
                                            setFormData({ ...formData, phone2: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="col-span-2 mt-2">
                                    <label className="block mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="mr-2 border w-full h-[40px] px-2"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Medical Info */}
                        <div className="w-full h-full border rounded p-4">
                            <h4 className="font-semibold mb-2">Medical Info</h4>

                            <div className="mt-2">
                                <label className="block">Medical History</label>
                                <div className="grid grid-cols-4 gap-1 mb-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.diabetes}
                                            className="h-[47px]"
                                            onChange={(e) =>
                                                setFormData({ ...formData, diabetes: e.target.checked })
                                            }
                                        />
                                        <span>Diabetes</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            className="h-[47px]"
                                            checked={formData.hypertension}
                                            onChange={(e) =>
                                                setFormData({ ...formData, hypertension: e.target.checked })
                                            }
                                        />
                                        <span>Hypertension</span>
                                    </label>
                                </div>
                                <div className="col-span-1 mt-2">
                                    <label className="block mb-2">Others</label>
                                    <input
                                        type="text"
                                        className="mr-2 border w-full h-[40px] px-2"
                                        placeholder="Others"
                                        value={formData.medicalOthers}
                                        onChange={(e) =>
                                            setFormData({ ...formData, medicalOthers: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="mt-3">
                                <label className="block">Ocular History</label>
                                <div className="grid grid-cols-4 gap-1 mb-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            className="h-[47px]"
                                            checked={formData.squint}
                                            onChange={(e) =>
                                                setFormData({ ...formData, squint: e.target.checked })
                                            }
                                        />
                                        <span>Squint</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            className="h-[47px]"
                                            checked={formData.lazyEye}
                                            onChange={(e) =>
                                                setFormData({ ...formData, lazyEye: e.target.checked })
                                            }
                                        />
                                        <span>Lazy Eye</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            className="h-[47px]"
                                            checked={formData.surgery}
                                            onChange={(e) =>
                                                setFormData({ ...formData, surgery: e.target.checked })
                                            }
                                        />
                                        <span>Surgery</span>
                                    </label>
                                </div>
                                <div className="col-span-1 mt-2">
                                    <label className="block mb-2">Others</label>
                                    <input
                                        type="text"
                                        className="mr-2 border w-full h-[40px] px-2"
                                        placeholder="Others"
                                        value={formData.ocularOthers}
                                        onChange={(e) =>
                                            setFormData({ ...formData, ocularOthers: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Action Buttons */}
                <div className="sticky bottom-0 bg-white z-10 border-t pt-4 pb-6">
                    <div className="flex justify-end space-x-2">
                        <button
                            className="bg-red-600 text-white w-36 px-4 py-2 rounded hover:bg-red-700"
                            onClick={onClose}
                        >
                            Close
                        </button>
                        <button
                            className="bg-primary text-white w-36 px-4 py-2 rounded hover:bg-primary/90"
                            onClick={() => {
                                if (!formData.customerCode.trim()) {
                                    onError({
                                        title: "Validation Error",
                                        message: "Customer Code is required.",
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
        </div>
    );
};

export default AddExpressCustomerModal;
