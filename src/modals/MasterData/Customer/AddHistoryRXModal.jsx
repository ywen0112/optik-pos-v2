import { useState } from "react";
import { Copy, X } from "lucide-react";

import ConfirmationModal from "../../ConfirmationModal";

const AddHistoryRXModal = ({ isOpen, type, handleClose, data, onConfirm }) => {
    const typeDefine = type === "Specs" ? "Spectacles" : "Contact Lens"
    const [actualRX, setActualRX] = useState({
        dominentEye: type === "Specs" ? data?.actualRXSpectacles?.dominentEye || "" : "",
        opticalHeight: type === "Specs" ? data?.actualRXSpectacles?.opticalHeight  : 0,
        segmentHeight: type === "Specs" ? data?.actualRXSpectacles?.segmentHeight  : 0,
    })

    const [prescribedRX, setPrescribedRX] = useState({
        dominentEye: type === "Specs" ? data?.prescribedRXSpectacles?.dominentEye || "" : "",
        opticalHeight: type === "Specs" ? data?.prescribedRXSpectacles?.opticalHeight  : null,
        segmentHeight: type === "Specs" ? data?.prescribedRXSpectacles?.segmentHeight  : null,
    })

    const [prescribedReadingData, setPrescribedReadingData] = useState({
        l_R_ADD: type === "Specs" ? data?.prescribedRXSpectacles?.l_R_ADD  : data?.prescribedRXContactLens?.l_R_ADD ,
        l_R_AXIS: type === "Specs" ? data?.prescribedRXSpectacles?.l_R_AXIS  : data?.prescribedRXContactLens?.l_R_AXIS ,
        l_R_CYL: type === "Specs" ? data?.prescribedRXSpectacles?.l_R_CYL  : data?.prescribedRXContactLens?.l_R_CYL ,
        l_R_PD: type === "Specs" ? data?.prescribedRXSpectacles?.l_R_PD  : data?.prescribedRXContactLens?.l_R_PD ,
        l_R_PRISM: type === "Specs" ? data?.prescribedRXSpectacles?.l_R_PRISM  : data?.prescribedRXContactLens?.l_R_PRISM ,
        l_R_Remark: type === "Specs" ? data?.prescribedRXSpectacles?.l_R_Remark ?? "" : data?.prescribedRXContactLens?.l_R_Remark ?? "",
        l_R_SPH: type === "Specs" ? data?.prescribedRXSpectacles?.l_R_SPH  : data?.prescribedRXContactLens?.l_R_SPH ,
        l_R_VA: type === "Specs" ? data?.prescribedRXSpectacles?.l_R_VA  : data?.prescribedRXContactLens?.l_R_VA ,
        r_R_ADD: type === "Specs" ? data?.prescribedRXSpectacles?.r_R_ADD  : data?.prescribedRXContactLens?.r_R_ADD ,
        r_R_AXIS: type === "Specs" ? data?.prescribedRXSpectacles?.r_R_AXIS  : data?.prescribedRXContactLens?.r_R_AXIS ,
        r_R_CYL: type === "Specs" ? data?.prescribedRXSpectacles?.r_R_CYL  : data?.prescribedRXContactLens?.r_R_CYL ,
        r_R_PD: type === "Specs" ? data?.prescribedRXSpectacles?.r_R_PD  : data?.prescribedRXContactLens?.r_R_PD ,
        r_R_PRISM: type === "Specs" ? data?.prescribedRXSpectacles?.r_R_PRISM  : data?.prescribedRXContactLens?.r_R_PRISM ,
        r_R_Remark: type === "Specs" ? data?.prescribedRXSpectacles?.r_R_Remark ?? "" : data?.prescribedRXContactLens?.r_R_Remark ?? "",
        r_R_SPH: type === "Specs" ? data?.prescribedRXSpectacles?.r_R_SPH  : data?.prescribedRXContactLens?.r_R_SPH ,
        r_R_VA: type === "Specs" ? data?.prescribedRXSpectacles?.r_R_VA  : data?.prescribedRXContactLens?.r_R_VA ,
    });
    
    const [prescribedDistanceData, setPrescribedDistanceData] = useState({
        l_D_ADD: type === "Specs" ? data?.prescribedRXSpectacles?.l_D_ADD  : data?.prescribedRXContactLens?.l_D_ADD ,
        l_D_AXIS: type === "Specs" ? data?.prescribedRXSpectacles?.l_D_AXIS  : data?.prescribedRXContactLens?.l_D_AXIS ,
        l_D_CYL: type === "Specs" ? data?.prescribedRXSpectacles?.l_D_CYL  : data?.prescribedRXContactLens?.l_D_CYL ,
        l_D_PD: type === "Specs" ? data?.prescribedRXSpectacles?.l_D_PD  : data?.prescribedRXContactLens?.l_D_PD ,
        l_D_PRISM: type === "Specs" ? data?.prescribedRXSpectacles?.l_D_PRISM  : data?.prescribedRXContactLens?.l_D_PRISM ,
        l_D_Remark: type === "Specs" ? data?.prescribedRXSpectacles?.l_D_Remark ?? "" : data?.prescribedRXContactLens?.l_D_Remark ?? "",
        l_D_SPH: type === "Specs" ? data?.prescribedRXSpectacles?.l_D_SPH  : data?.prescribedRXContactLens?.l_D_SPH ,
        l_D_VA: type === "Specs" ? data?.prescribedRXSpectacles?.l_D_VA  : data?.prescribedRXContactLens?.l_D_VA ,
        r_D_ADD: type === "Specs" ? data?.prescribedRXSpectacles?.r_D_ADD  : data?.prescribedRXContactLens?.r_D_ADD ,
        r_D_AXIS: type === "Specs" ? data?.prescribedRXSpectacles?.r_D_AXIS  : data?.prescribedRXContactLens?.r_D_AXIS ,
        r_D_CYL: type === "Specs" ? data?.prescribedRXSpectacles?.r_D_CYL  : data?.prescribedRXContactLens?.r_D_CYL ,
        r_D_PD: type === "Specs" ? data?.prescribedRXSpectacles?.r_D_PD  : data?.prescribedRXContactLens?.r_D_PD ,
        r_D_PRISM: type === "Specs" ? data?.prescribedRXSpectacles?.r_D_PRISM  : data?.prescribedRXContactLens?.r_D_PRISM ,
        r_D_Remark: type === "Specs" ? data?.prescribedRXSpectacles?.r_D_Remark ?? "" : data?.prescribedRXContactLens?.r_D_Remark ?? "",
        r_D_SPH: type === "Specs" ? data?.prescribedRXSpectacles?.r_D_SPH  : data?.prescribedRXContactLens?.r_D_SPH ,
        r_D_VA: type === "Specs" ? data?.prescribedRXSpectacles?.r_D_VA  : data?.prescribedRXContactLens?.r_D_VA ,
    });
    
    const [actualReadingData, setActualReadingData] = useState({
        l_R_ADD: type === "Specs" ? data?.actualRXSpectacles?.l_R_ADD  : data?.actualRXContactLens?.l_R_ADD ,
        l_R_AXIS: type === "Specs" ? data?.actualRXSpectacles?.l_R_AXIS  : data?.actualRXContactLens?.l_R_AXIS ,
        l_R_CYL: type === "Specs" ? data?.actualRXSpectacles?.l_R_CYL  : data?.actualRXContactLens?.l_R_CYL ,
        l_R_PD: type === "Specs" ? data?.actualRXSpectacles?.l_R_PD  : data?.actualRXContactLens?.l_R_PD ,
        l_R_PRISM: type === "Specs" ? data?.actualRXSpectacles?.l_R_PRISM  : data?.actualRXContactLens?.l_R_PRISM ,
        l_R_Remark: type === "Specs" ? data?.actualRXSpectacles?.l_R_Remark ?? "" : data?.actualRXContactLens?.l_R_Remark ?? "",
        l_R_SPH: type === "Specs" ? data?.actualRXSpectacles?.l_R_SPH  : data?.actualRXContactLens?.l_R_SPH ,
        l_R_VA: type === "Specs" ? data?.actualRXSpectacles?.l_R_VA  : data?.actualRXContactLens?.l_R_VA ,
        r_R_ADD: type === "Specs" ? data?.actualRXSpectacles?.r_R_ADD  : data?.actualRXContactLens?.r_R_ADD ,
        r_R_AXIS: type === "Specs" ? data?.actualRXSpectacles?.r_R_AXIS  : data?.actualRXContactLens?.r_R_AXIS ,
        r_R_CYL: type === "Specs" ? data?.actualRXSpectacles?.r_R_CYL  : data?.actualRXContactLens?.r_R_CYL ,
        r_R_PD: type === "Specs" ? data?.actualRXSpectacles?.r_R_PD  : data?.actualRXContactLens?.r_R_PD ,
        r_R_PRISM: type === "Specs" ? data?.actualRXSpectacles?.r_R_PRISM  : data?.actualRXContactLens?.r_R_PRISM ,
        r_R_Remark: type === "Specs" ? data?.actualRXSpectacles?.r_R_Remark ?? "" : data?.actualRXContactLens?.r_R_Remark ?? "",
        r_R_SPH: type === "Specs" ? data?.actualRXSpectacles?.r_R_SPH  : data?.actualRXContactLens?.r_R_SPH ,
        r_R_VA: type === "Specs" ? data?.actualRXSpectacles?.r_R_VA  : data?.actualRXContactLens?.r_R_VA ,
    });
    
    const [actualDistanceData, setActualDistanceData] = useState({
        l_D_ADD: type === "Specs" ? data?.actualRXSpectacles?.l_D_ADD  : data?.actualRXContactLens?.l_D_ADD ,
        l_D_AXIS: type === "Specs" ? data?.actualRXSpectacles?.l_D_AXIS  : data?.actualRXContactLens?.l_D_AXIS ,
        l_D_CYL: type === "Specs" ? data?.actualRXSpectacles?.l_D_CYL  : data?.actualRXContactLens?.l_D_CYL ,
        l_D_PD: type === "Specs" ? data?.actualRXSpectacles?.l_D_PD  : data?.actualRXContactLens?.l_D_PD ,
        l_D_PRISM: type === "Specs" ? data?.actualRXSpectacles?.l_D_PRISM  : data?.actualRXContactLens?.l_D_PRISM ,
        l_D_Remark: type === "Specs" ? data?.actualRXSpectacles?.l_D_Remark ?? "" : data?.actualRXContactLens?.l_D_Remark ?? "",
        l_D_SPH: type === "Specs" ? data?.actualRXSpectacles?.l_D_SPH  : data?.actualRXContactLens?.l_D_SPH ,
        l_D_VA: type === "Specs" ? data?.actualRXSpectacles?.l_D_VA  : data?.actualRXContactLens?.l_D_VA ,
        r_D_ADD: type === "Specs" ? data?.actualRXSpectacles?.r_D_ADD  : data?.actualRXContactLens?.r_D_ADD ,
        r_D_AXIS: type === "Specs" ? data?.actualRXSpectacles?.r_D_AXIS  : data?.actualRXContactLens?.r_D_AXIS ,
        r_D_CYL: type === "Specs" ? data?.actualRXSpectacles?.r_D_CYL  : data?.actualRXContactLens?.r_D_CYL ,
        r_D_PD: type === "Specs" ? data?.actualRXSpectacles?.r_D_PD  : data?.actualRXContactLens?.r_D_PD ,
        r_D_PRISM: type === "Specs" ? data?.actualRXSpectacles?.r_D_PRISM  : data?.actualRXContactLens?.r_D_PRISM ,
        r_D_Remark: type === "Specs" ? data?.actualRXSpectacles?.r_D_Remark ?? "" : data?.actualRXContactLens?.r_D_Remark ?? "",
        r_D_SPH: type === "Specs" ? data?.actualRXSpectacles?.r_D_SPH  : data?.actualRXContactLens?.r_D_SPH ,
        r_D_VA: type === "Specs" ? data?.actualRXSpectacles?.r_D_VA  : data?.actualRXContactLens?.r_D_VA ,
    });
    

    const [activeRxTab, setActiveRxTab] = useState("Prescribed RX");

    const [activeRxMode, setActiveRxMode] = useState("Distance");
    const [showCopyModal, setShowCopyModal] = useState(false);
    const rxParams = ["SPH", "CYL", "AXIS", "VA", "PRISM", "BC", "DIA", "ADD", "PD"];
    const dataFieldMapping = {
        Distance: "D",
        Reading: "R"
    }
    const getRxData = () => {
        if (activeRxTab === "Prescribed RX" && activeRxMode === "Reading") return prescribedReadingData;
        if (activeRxTab === "Prescribed RX" && activeRxMode === "Distance") return prescribedDistanceData;
        if (activeRxTab === "Actual RX" && activeRxMode === "Reading") return actualReadingData;
        if (activeRxTab === "Actual RX" && activeRxMode === "Distance") return actualDistanceData;
    };

    const getRxSetter = () => {
        if (activeRxTab === "Prescribed RX" && activeRxMode === "Reading") return setPrescribedReadingData;
        if (activeRxTab === "Prescribed RX" && activeRxMode === "Distance") return setPrescribedDistanceData;
        if (activeRxTab === "Actual RX" && activeRxMode === "Reading") return setActualReadingData;
        if (activeRxTab === "Actual RX" && activeRxMode === "Distance") return setActualDistanceData;
    };


    const handleRxChange = (eye, mode, field, value) => {
        const setter = getRxSetter();
        setter(prev => ({
            ...prev,
            [`${eye}_${mode}_${field}`]: value
        }));
    };


    const handleCopyRxdata = () => {
        const sourceTab = activeRxTab;
        const targetTab = activeRxTab === "Prescribed RX" ? "Actual RX" : "Prescribed RX";

        if (sourceTab === "Prescribed RX") {
            setActualRX({ ...prescribedRX });
            setActualReadingData({ ...prescribedReadingData });
            setActualDistanceData({ ...prescribedDistanceData });
        } else {
            setPrescribedRX({ ...actualRX });
            setPrescribedReadingData({ ...actualReadingData });
            setPrescribedDistanceData({ ...actualDistanceData });
        }

        setShowCopyModal(false);
        setActiveRxTab(targetTab);
    };

    const decimalRegex = /^-?\d*(\.\d{0,2})?$/;
    const roundUpToQuarter = (val) => Math.ceil(val * 4) / 4;


    if (!isOpen) return null;

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
                        title="Copy RX data?"
                        message={`This will copy all RX data? from "${activeRxTab}" to the other tab. Continue?`}
                        onConfirm={handleCopyRxdata}
                        onCancel={() => setShowCopyModal(false)}
                    />

                    <div className="grid grid-cols-[7%,15%,7%,15%,20%,auto] items-center gap-3 w-full">
                        <label className={activeRxTab === "Prescribed RX" ? "font-medium text-sm text-secondary" : "invisible font-medium text-sm text-secondary"}>Optical Height</label>
                        <input
                            type="text"
                            className={activeRxTab === "Prescribed RX" ? "border rounded px-2 py-1 bg-white text-secondary w-full" : "border rounded px-2 py-1 bg-white text-secondary w-full invisible"}
                            placeholder="Enter"
                            value={activeRxTab === "Prescribed RX" ? prescribedRX?.opticalHeight : actualRX?.opticalHeight}
                            onChange={(e) =>
                                activeRxTab === "Prescribed RX"
                                    ? setPrescribedRX({ ...prescribedRX, opticalHeight: e.target.value })
                                    : setActualRX({ ...actualRX, opticalHeight: e.target.value })
                            }
                        />

                        <label className={activeRxTab === "Prescribed RX" ? "font-medium text-sm text-secondary" : "invisible font-medium text-sm text-secondary"}>Segment Height</label>
                        <input
                            type="text"
                            placeholder="Enter"
                            className={activeRxTab === "Prescribed RX" ? "border rounded px-2 py-1 bg-white text-secondary w-full" : "border rounded px-2 py-1 bg-white text-secondary w-full invisible"}
                            value={activeRxTab === "Prescribed RX" ? prescribedRX?.segmentHeight : actualRX?.segmentHeight}
                            onChange={(e) =>
                                activeRxTab === "Prescribed RX"
                                    ? setPrescribedRX({ ...prescribedRX, segmentHeight: e.target.value })
                                    : setActualRX({ ...actualRX, segmentHeight: e.target.value })
                            }
                        />

                        <div className={activeRxTab === "Prescribed RX" ? "flex items-center space-x-2 col-span-2 " : "invisible items-center space-x-2 col-span-2"}>
                            <span className="font-medium text-sm text-secondary">Dominant Eye:</span>

                            <label className="inline-flex items-center text-secondary ">
                                <input
                                    type="checkbox"
                                    className="mr-1 accent-white bg-white"
                                    checked={activeRxTab === "Prescribed RX" ? prescribedRX?.dominentEye === "left" : actualRX?.segmentHeight === "left"}
                                    onChange={(e) =>
                                        activeRxTab === "Prescribed RX"
                                            ? setPrescribedRX({ ...prescribedRX, dominentEye: e.target.checked ? "left" : "" })
                                            : setActualRX({ ...actualRX, dominentEye: e.target.checked ? "left" : "" })
                                    }
                                />
                                Left
                            </label>

                            <label className="inline-flex items-center text-secondary ">
                                <input
                                    type="checkbox"
                                    className="mr-1 accent-white bg-white"
                                    checked={activeRxTab === "Prescribed RX" ? prescribedRX?.dominentEye === "right" : actualRX?.segmentHeight === "right"}
                                    onChange={(e) =>
                                        activeRxTab === "Prescribed RX"
                                            ? setPrescribedRX({ ...prescribedRX, dominentEye: e.target.checked ? "right" : "" })
                                            : setActualRX({ ...actualRX, dominentEye: e.target.checked ? "right" : "" })
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
                                <thead className="bgw-gray-100 text-secondary">
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
                                            {rxParams.map((field) => {
                                                const key = `${eye === "Left" ? "l" : "r"}_${dataFieldMapping[activeRxMode]}_${field}`;
                                                return (
                                                    <td key={field} className="border px-2 py-1 text-left text-secondary bg-white">
                                                        <input
                                                            type="number"
                                                            step="0.25"
                                                            className="w-full border rounded px-1 py-0.5 text-left text-secondary bg-white"
                                                            value={getRxData()?.[key] || ""}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (val === "" || decimalRegex.test(val)) {
                                                                  handleRxChange(
                                                                    eye === "Left" ? "l" : "r",
                                                                    dataFieldMapping[activeRxMode],
                                                                    field,
                                                                    val
                                                                  );
                                                                }
                                                            }}
                                                            onBlur={(e) => {
                                                                const raw = parseFloat(e.target.value);
                                                                if (!isNaN(raw)) {
                                                                  const isPD = field === "PD";
                                                                  const newVal = isPD
                                                                    ? raw.toFixed(2)
                                                                    : roundUpToQuarter(raw).toFixed(2);
                                                                  handleRxChange(
                                                                    eye === "Left" ? "l" : "r",
                                                                    dataFieldMapping[activeRxMode],
                                                                    field,
                                                                    newVal
                                                                  );
                                                                }
                                                            }}
                                                        />
                                                    </td>
                                                );
                                            })}
                                            <td className="border px-2 py-1 text-left">
                                                <input
                                                    type="text"
                                                    className="w-28 border rounded px-1 py-0.5 text-left text-secondary bg-white"
                                                    value={getRxData()?.[`${eye === "Left" ? "l" : "r"}_${dataFieldMapping[activeRxMode]}_Remark`] || ""}
                                                    onChange={(e) => {
                                                        const remarkKey = `${eye === "Left" ? "l" : "r"}_${dataFieldMapping[activeRxMode]}_Remark`;
                                                        const setter = getRxSetter();
                                                        setter((prev) => ({
                                                        ...prev,
                                                        [remarkKey]: e.target.value
                                                        }));
                                                    }}
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
                                onClick={() =>{
                                    setActualRX(null)
                                    setActualDistanceData(null)
                                    setActualReadingData(null)
                                    setPrescribedRX(null)
                                    setPrescribedDistanceData(null)
                                    setPrescribedReadingData(null);
                                    handleClose()
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-primary text-white w-36 px-4 py-2 rounded hover:bg-primary/90"
                                onClick={() => {
                                    let mergedData = {}
                                    if (type === "Specs") {
                                        mergedData = {
                                            actionData: data.actionData,
                                            spectaclesId: data.spectaclesId,
                                            debtorId: data.debtorId,
                                            cashSalesId: data.cashSalesId,
                                            cashSalesDetailId: data.cashSalesDetailId,
                                            docDate: data.docDate,
                                            prescribedRXSpectacles: {
                                                ...prescribedRX,
                                                ...prescribedReadingData,
                                                ...prescribedDistanceData,
                                            },
                                            actualRXSpectacles: {
                                                ...actualRX,
                                                ...actualReadingData,
                                                ...actualDistanceData,
                                            }
                                        }
                                    } else {
                                        mergedData = {
                                            actionData: data.actionData,
                                            contactLensId: data.contactLensId,
                                            debtorId: data.debtorId,
                                            cashSalesId: data.cashSalesId,
                                            cashSalesDetailId: data.cashSalesDetailId,
                                            docDate: data.docDate,
                                            prescribedRXContactLens: {
                                                ...prescribedRX,
                                                ...prescribedReadingData,
                                                ...prescribedDistanceData,
                                            },
                                            actualRXContactLens: {
                                                ...actualRX,
                                                ...actualReadingData,
                                                ...actualDistanceData,
                                            }
                                        }
                                    }
                                    onConfirm({
                                        isOpen: true,
                                        action: "add",
                                        data: mergedData,
                                        type: type
                                    });
                                    setActualRX(null)
                                    setActualDistanceData(null)
                                    setActualReadingData(null)
                                    setPrescribedRX(null)
                                    setPrescribedDistanceData(null)
                                    setPrescribedReadingData(null);
                                    handleClose()
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