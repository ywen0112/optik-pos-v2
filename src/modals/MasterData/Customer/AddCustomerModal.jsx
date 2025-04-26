import { useEffect, useState } from "react";
import { X } from 'lucide-react';
import CustomerGeneral from "./CustomerGeneral";
import CustomerMedicalInfo from "./CustomerMedicalInfo";
import CustomerLatestRX from "./CustomrLastestRX";
import CustomerHistoryRX from "./CustomerHistoryRX";

const AddCustomerModal = ({
    selectedCustomer,
    isEdit,
    isOpen,
    onConfirm,
    onError,
    onClose,
    companyId, 
    userId
}) => {
    const [activeTab, setActiveTab] = useState("General");
    const [debtorFormData, setDebtorFormData] = useState({
        isActive: true,
        debtorCode: "",
        companyName: "",
        identityNo: "",
        dob: "",
        address: "",
        remark: "",
        phone1: "",
        phone2: "",
        emailAddress: "",        
    });

    const [medicalInfoData, setMedicalInfoData] = useState({
        medicalIsDiabetes: false,
        medicalIsHypertension: false,
        ocularIsSquint: false,
        ocularIsLazyEye: false,
        ocularHasSurgery: false,
        medicalOthers: "",
        ocularOthers: "",
    });

    const [latesRXData, setLatestRXData] = useState({
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
    })

    const [historyRXData, setHistoryRXData] = useState ({
        docDate: new Date().toISOString().split("T")[0],
        historyRight: false,
        historyLeft: false,
    })

    const handleClose = () =>{
        setDebtorFormData({
            isActive: true,
            debtorCode: "",
            companyName: "",
            identityNo: "",
            dob: "",
            address: "",
            remark: "",
            phone1: "",
            phone2: "",
            emailAddress: "",
        });

        setMedicalInfoData({
            medicalIsDiabetes: false,
            medicalIsHypertension: false,
            ocularIsSquint: false,
            ocularIsLazyEye: false,
            ocularHasSurgery: false,
            medicalOthers: "",
            ocularOthers: "",
        });

        setLatestRXData ({
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
        });

        setHistoryRXData ({
            docDate: new Date().toISOString().split("T")[0],
            historyRight: false,
            historyLeft: false,
        });

        onClose();
    }

    useEffect(() => {
        if (isOpen) {
            setActiveTab("General");
    
            if (selectedCustomer) {
                setDebtorFormData({
                    isActive: selectedCustomer.isActive ?? true,
                    debtorCode: selectedCustomer.debtorCode ?? "",
                    companyName: selectedCustomer.companyName ?? "",
                    identityNo: selectedCustomer.identityNo ?? "",
                    dob: selectedCustomer.dob ?? "",
                    address: selectedCustomer.address ?? "",
                    remark: selectedCustomer.remark ?? "",
                    phone1: selectedCustomer.phone1 ?? "",
                    phone2: selectedCustomer.phone2 ?? "",
                    emailAddress: selectedCustomer.emailAddress ?? "",
                });
    
                setMedicalInfoData({
                    medicalIsDiabetes: selectedCustomer.medicalIsDiabetes ?? false,
                    medicalIsHypertension: selectedCustomer.medicalIsHypertension ?? false,
                    ocularIsSquint: selectedCustomer.ocularIsSquint ?? false,
                    ocularIsLazyEye: selectedCustomer.ocularIsLazyEye ?? false,
                    ocularHasSurgery: selectedCustomer.ocularHasSurgery ?? false,
                    medicalOthers: selectedCustomer.medicalOthers ?? "",
                    ocularOthers: selectedCustomer.ocularOthers ?? "",
                });
            } else {
                setDebtorFormData({
                    isActive: true,
                    debtorCode: "",
                    companyName: "",
                    identityNo: "",
                    dob: "",
                    address: "",
                    remark: "",
                    phone1: "",
                    phone2: "",
                    emailAddress: "",
                });
    
                setMedicalInfoData({
                    medicalIsDiabetes: false,
                    medicalIsHypertension: false,
                    ocularIsSquint: false,
                    ocularIsLazyEye: false,
                    ocularHasSurgery: false,
                    medicalOthers: "",
                    ocularOthers: "",
                });
            }
    
            setLatestRXData({
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
            });
    
            setHistoryRXData({
                docDate: new Date().toISOString().split("T")[0],
                historyRight: false,
                historyLeft: false,
            });
        }
    }, [isOpen]);  // ✅ still only depend on isOpen
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full h-full p-6 text-secondary">
                <div className="sticky top-0 bg-white z-10">
                    <div className="flex flex-row justify-between">
                        <h3 className="font-semibold mb-4">
                            {isEdit ? "Edit Customer" : "New Customer"}
                        </h3>
                        <div className='col-span-4' onClick={handleClose}>
                            <X size={20} />
                        </div>
                    </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-4">
                    {['General', 'Medical Info', 'Latest RX', 'History RX'].map(tab => (
                    <button
                        key={tab}
                        className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-primary text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                    ))}
                </div>
                </div>

                <div className="overflow-y-auto flex-1 mt-4 h-full mb-10">
                {activeTab === "General" && (
                    <CustomerGeneral debtorFormData={debtorFormData} setDebtorFormData={setDebtorFormData} />
                )}

                {activeTab === "Medical Info" && (
                    <CustomerMedicalInfo medicalInfoData={medicalInfoData} setMedicalInfoData={setMedicalInfoData} />
                )}

                {activeTab === "Latest RX" && (
                    <CustomerLatestRX latesRXData={latesRXData} setLatestRXData={setLatestRXData} />
                )}

                {activeTab === "History RX" && (
                    <CustomerHistoryRX historyRXData={historyRXData} setHistoryRXData={setHistoryRXData} />
                )}
                </div>

                {/* Action Buttons */}
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
                                if (!debtorFormData.debtorCode.trim()) {
                                onError({
                                    title: "Validation Error",
                                    message: "Customer Code is required.",
                                });
                                return;
                                }

                                const mergedData = {
                                ...debtorFormData,
                                ...medicalInfoData,
                                ...latesRXData,
                                ...historyRXData,
                                };

                                onConfirm({
                                isOpen: true,
                                action: isEdit ? "edit" : "add",
                                data: {
                                    actionData: {
                                        companyId: companyId, 
                                        userId: userId,
                                        id: selectedCustomer?.debtorId || "",
                                    },
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
  );
};

export default AddCustomerModal;
