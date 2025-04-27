import { useState } from "react";
import { Copy, X } from "lucide-react";

import ConfirmationModal from "../../ConfirmationModal";

const AddHistoryRXModal = ({isOpen, type, handleClose}) => {
    const typeDefine = type === "Specs" ? "Spectacles" : "Contact Lens"
    const [activeRxTab, setActiveRxTab] = useState("Prescribed RX");
    const [eyePowerData, setEyePowerData] = useState({
        "Prescribed RX": { opticalHeight: "", segmentHeight: "", dominantLeft: false, dominantRight: false },
        "Actual RX": { opticalHeight: "", segmentHeight: "", dominantLeft: false, dominantRight: false }
    });

    const [activeRxMode, setActiveRxMode] = useState("Distance");
    const [showCopyModal, setShowCopyModal] = useState(false);
    const rxParams = ["SPH", "CYL", "AXIS", "VA", "PRISM", "BC", "DIA", "ADD", "PD"];
    const [rxValues, setRxValues] = useState({
        "Prescribed RX": {
            Distance: { Left: {}, Right: {} },
            Reading: { Left: {}, Right: {} }
        },
        "Actual RX": {
            Distance: { Left: {}, Right: {} },
            Reading: { Left: {}, Right: {} }
        }
    });

    const handleRxChange = (rxTab, mode, eye, field, value) => {
        if (field === "REMARK") {
            setRxValues((prev) => ({
                ...prev,
                [rxTab]: {
                    ...prev[rxTab],
                    [mode]: {
                        ...prev[rxTab][mode],
                        [eye]: {
                            ...prev[rxTab][mode][eye],
                            [field]: value,
                        },
                    },
                },
            }));
            return;
        }

        if (value === "") {
            setRxValues((prev) => ({
                ...prev,
                [rxTab]: {
                    ...prev[rxTab],
                    [mode]: {
                        ...prev[rxTab][mode],
                        [eye]: {
                            ...prev[rxTab][mode][eye],
                            [field]: "",
                        },
                    },
                },
            }));
            return;
        }

        const regex = /^\d*(\.\d{0,2})?$/;
        if (regex.test(value)) {
            setRxValues((prev) => ({
                ...prev,
                [rxTab]: {
                    ...prev[rxTab],
                    [mode]: {
                        ...prev[rxTab][mode],
                        [eye]: {
                            ...prev[rxTab][mode][eye],
                            [field]: value,
                        },
                    },
                },
            }));
        }
    };

    const handleCopyRxData = () => {
        const sourceTab = activeRxTab;
        const targetTab = activeRxTab === "Prescribed RX" ? "Actual RX" : "Prescribed RX";

        setEyePowerData((prev) => ({
            ...prev,
            [targetTab]: { ...prev[sourceTab] }
        }));

        const copiedRx = JSON.parse(JSON.stringify(rxValues[sourceTab]));
        setRxValues((prev) => ({
            ...prev,
            [targetTab]: copiedRx
        }));

        setShowCopyModal(false);
        setActiveRxTab(targetTab);
    };

    if(!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-40">
                <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-y-auto text-secondary">
                <div className="flex flex-row justify-between">
                        <h3 className="font-semibold mb-4">
                            Update {typeDefine} Eye Power
                        </h3>
                        <div className='col-span-4' onClick={handleClose}>
                            <X size={20} />
                        </div>
                    </div>
                   
                    <div className="mb-4 flex space-x-4 w-full">
                        {["Prescribed RX", "Actual RX"].map((tab) => (
                            <div key={tab} className="relative flex-1">
                                <button
                                    className={`w-full flex justify-center items-center gap-1 px-4 py-2 font-medium border-b-2 text-center relative ${activeRxTab === tab
                                        ? "text-secondary after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:border-b-2 after:border-primary after:bg-white"
                                        : "text-gray-500 hover:text-secondary"
                                        }`}
                                    onClick={() => {
                                        setActiveRxTab(tab);
                                        setActiveRxMode("Distance");
                                    }}
                                >
                                    {tab}
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveRxTab(tab);
                                        setShowCopyModal(true);
                                    }}
                                    title={`Copy ${tab} to ${tab === "Prescribed RX" ? "Actual RX" : "Prescribed RX"}`}
                                    className="text-secondary bg-gray-100 absolute top-1/3 right-2 -translate-y-1/2 text-sm px-2 py-1 border rounded hover:text-primary"
                                >
                                    <Copy size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <ConfirmationModal
                        isOpen={showCopyModal}
                        title="Copy RX Data"
                        message={`This will copy all RX data from "${activeRxTab}" to the other tab. Continue?`}
                        onConfirm={handleCopyRxData}
                        onCancel={() => setShowCopyModal(false)}
                    />

                    <div className="grid grid-cols-[7%,15%,7%,15%,20%,auto] items-center gap-3 w-full">
                        <label className={activeRxTab === "Prescribed RX" ? "font-medium text-sm text-secondary" : "invisible font-medium text-sm text-secondary"}>Optical Height</label>
                        <input
                            type="text"
                            className={activeRxTab === "Prescribed RX" ? "border rounded px-2 py-1 bg-white text-secondary w-full" : "border rounded px-2 py-1 bg-white text-secondary w-full invisible"}
                            placeholder="Enter"
                            value={eyePowerData[activeRxTab].opticalHeight}
                            onChange={(e) =>
                                handleEyePowerChange(activeRxTab, "opticalHeight", e.target.value)
                            }
                        />

                        <label className={activeRxTab === "Prescribed RX" ? "font-medium text-sm text-secondary" : "invisible font-medium text-sm text-secondary"}>Segment Height</label>
                        <input
                            type="text"
                            placeholder="Enter"
                            className={activeRxTab === "Prescribed RX" ? "border rounded px-2 py-1 bg-white text-secondary w-full" : "border rounded px-2 py-1 bg-white text-secondary w-full invisible"}
                            value={eyePowerData[activeRxTab].segmentHeight}
                            onChange={(e) =>
                                handleEyePowerChange(activeRxTab, "segmentHeight", e.target.value)
                            }
                        />

                        <div className={activeRxTab === "Prescribed RX" ? "flex items-center space-x-2 col-span-2 " : "invisible items-center space-x-2 col-span-2"}>
                            <span className="font-medium text-sm text-secondary">Dominant Eye:</span>

                            <label className="inline-flex items-center text-secondary ">
                                <input
                                    type="checkbox"
                                    className="mr-1 accent-white bg-white"
                                    checked={eyePowerData[activeRxTab].dominantLeft}
                                    onChange={(e) =>
                                        handleEyePowerChange(activeRxTab, "dominantLeft", e.target.checked)
                                    }
                                />
                                Left
                            </label>

                            <label className="inline-flex items-center text-secondary ">
                                <input
                                    type="checkbox"
                                    className="mr-1 accent-white bg-white"
                                    checked={eyePowerData[activeRxTab].dominantRight}
                                    onChange={(e) =>
                                        handleEyePowerChange(activeRxTab, "dominantRight", e.target.checked)
                                    }
                                />
                                Right
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">


                        <div className="overflow-x-auto flex flex-row">
                            <div className="px-2 py-4">
                                {["Distance", "Reading"].map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setActiveRxMode(mode)}
                                        className={`px-1 py-1 border rounded text-sm w-full font-medium ${activeRxMode === mode
                                            ? "bg-primary text-white"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                            }`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                            <table className="min-w-[80%] border mt-2 text-sm">
                                <thead className="bg-gray-100 text-secondary">
                                    <tr>
                                        <th className="border px-2 py-1 text-left w-20">Eye</th>
                                        {rxParams.map((field) => (
                                            <th key={field} className="border px-2 py-1 text-left">{field}</th>
                                        ))}
                                        <th className="border px-2 py-1 text-center">Remark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {["Left", "Right"].map((eye) => (
                                        <tr key={eye}>
                                            <td className="border px-2 py-1 font-medium text-secondary">{eye}</td>
                                            {rxParams.map((field) => (
                                                <td key={field} className="border px-2 py-1 text-left text-secondary bg-white">
                                                    <input
                                                        type="number"
                                                        step="0.25"
                                                        className="w-full border rounded px-1 py-0.5 text-left text-secondary bg-white"
                                                        value={rxValues[activeRxTab][activeRxMode][eye][field] || ""}
                                                        onChange={(e) =>
                                                            handleRxChange(activeRxTab, activeRxMode, eye, field, e.target.value)
                                                        }
                                                    />
                                                </td>
                                            ))}
                                            <td className="border px-2 py-1 text-left">
                                                <input
                                                    type="text"
                                                    className="w-28 border rounded px-1 py-0.5 text-left text-secondary bg-white"
                                                    value={rxValues[activeRxTab][activeRxMode][eye]["REMARK"] || ""}
                                                    onChange={(e) =>
                                                        handleRxChange(activeRxTab, activeRxMode, eye, "REMARK", e.target.value)
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                
                    <div className="sticky bottom-0 bg-white z-10 border-t pt-4 pb-6">
                    <div className="flex justify-end space-x-2">
                        <button
                            className="bg-red-600 text-white w-36 px-4 py-2 rounded hover:bg-red-700"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-primary text-white w-36 px-4 py-2 rounded hover:bg-primary/90"
                            onClick={() => {
                                if (!debtorFormData.debtorCode.trim() && !debtorFormData.companyName.trim) {
                                onError({
                                    title: "Validation Error",
                                    message: "Customer Code & Name is required.",
                                });
                                return;
                                }

                                const mergedData = {
                                ...debtorFormData,
                                ...medicalInfoData,
                                };
                                console.log(selectedCustomer)
                                onConfirm({
                                isOpen: true,
                                action: isEdit ? "edit" : "add",
                                data: {
                                    actionData: {
                                        companyId: companyId, 
                                        userId: userId,
                                        id: selectedCustomer?.debtorId || "",
                                    },
                                    debtorId: selectedCustomer?.debtorId,
                                    ...mergedData
                                },
                                });
                            }}
                            >
                            Save
                        </button>
                    </div>
                </div>
                </div>
            </div>
        </>
    )
}

export default AddHistoryRXModal;