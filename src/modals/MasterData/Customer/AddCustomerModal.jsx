import { useEffect, useState } from "react";
import { X } from 'lucide-react';
import CustomerGeneral from "./CustomerGeneral";
import CustomerMedicalInfo from "./CustomerMedicalInfo";
import CustomerLatestRX from "./CustomrLastestRX";
import CustomerHistoryRX from "./CustomerHistoryRX";
import { GetDebtorRXHistorys, GetDebtorSalesHistorys, GetLatestDebtorContactLens, GetLatestDebtorSpectacles } from "../../../api/maintenanceapi";
import CustomStore from "devextreme/data/custom_store";
import ErrorModal from "../../ErrorModal";
import SalesHistory from "./SalesHistory";

const AddCustomerModal = ({
    selectedCustomer,
    isEdit,
    isView,
    isOpen,
    onConfirm,
    onError,
    onClose,
    companyId,
    userId
}) => {
    const [errorModal, setErrorModal] = useState({ title: "", message: "" });
    const [activeTab, setActiveTab] = useState("General");
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null });
    const [debtorFormData, setDebtorFormData] = useState({
        isActive: true,
        debtorId: "",
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

    const [latesSpecRXData, setLatestSpecRXData] = useState({
        docDate: new Date().toISOString().split("T")[0],
        spectaclesType: "",
        opticalHeight: "",
        segmentHeight: "",
        dominentRightEye: false,
        dominentLeftEye: false,

        // Distance - Right Eye
        r_D_SPH: "",
        r_D_CYL: "",
        r_D_AXIS: "",
        r_D_VA: "",
        r_D_PRISM: "",
        r_D_ADD: "",
        r_D_PD: "",

        // Distance - Left Eye
        l_D_SPH: "",
        l_D_CYL: "",
        l_D_AXIS: "",
        l_D_VA: "",
        l_D_PRISM: "",
        l_D_ADD: "",
        l_D_PD: "",

        // Reading - Right Eye
        r_R_SPH: "",
        r_R_CYL: "",
        r_R_AXIS: "",
        r_R_VA: "",
        r_R_PRISM: "",
        r_R_ADD: "",
        r_R_PD: "",

        // Reading - Left Eye
        l_R_SPH: "",
        l_R_CYL: "",
        l_R_AXIS: "",
        l_R_VA: "",
        l_R_PRISM: "",
        l_R_ADD: "",
        l_R_PD: ""
    });

    const [latestLensRXData, setLatestLensRXData] = useState({
        docDate: new Date().toISOString().split("T")[0],

        // Distance - Right Eye
        r_D_SPH: "",
        r_D_CYL: "",
        r_D_AXIS: "",
        r_D_BC: "",
        r_D_DIA: "",
        r_D_ADD: "",

        // Distance - Left Eye
        l_D_SPH: "",
        l_D_CYL: "",
        l_D_AXIS: "",
        l_D_BC: "",
        l_D_DIA: "",
        l_D_ADD: "",

        // Reading - Right Eye
        r_R_SPH: "",
        r_R_CYL: "",
        r_R_AXIS: "",
        r_R_BC: "",
        r_R_DIA: "",
        r_R_ADD: "",

        // Reading - Left Eye
        l_R_SPH: "",
        l_R_CYL: "",
        l_R_AXIS: "",
        l_R_BC: "",
        l_R_DIA: "",
        l_R_ADD: ""
    });
    const handleClose = () => {
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

        setLatestSpecRXData({
            docDate: new Date().toISOString().split("T")[0],
            spectaclesType: "",
            opticalHeight: "",
            segmentHeight: "",
            dominentRightEye: false,
            dominentLeftEye: false,

            // Distance - Right Eye
            r_D_SPH: "",
            r_D_CYL: "",
            r_D_AXIS: "",
            r_D_VA: "",
            r_D_PRISM: "",
            r_D_ADD: "",
            r_D_PD: "",

            // Distance - Left Eye
            l_D_SPH: "",
            l_D_CYL: "",
            l_D_AXIS: "",
            l_D_VA: "",
            l_D_PRISM: "",
            l_D_ADD: "",
            l_D_PD: "",

            // Reading - Right Eye
            r_R_SPH: "",
            r_R_CYL: "",
            r_R_AXIS: "",
            r_R_VA: "",
            r_R_PRISM: "",
            r_R_ADD: "",
            r_R_PD: "",

            // Reading - Left Eye
            l_R_SPH: "",
            l_R_CYL: "",
            l_R_AXIS: "",
            l_R_VA: "",
            l_R_PRISM: "",
            l_R_ADD: "",
            l_R_PD: ""
        });

        setLatestLensRXData({
            docDate: new Date().toISOString().split("T")[0],

            // Distance - Right Eye
            r_D_SPH: "",
            r_D_CYL: "",
            r_D_AXIS: "",
            r_D_BC: "",
            r_D_DIA: "",
            r_D_ADD: "",

            // Distance - Left Eye
            l_D_SPH: "",
            l_D_CYL: "",
            l_D_AXIS: "",
            l_D_BC: "",
            l_D_DIA: "",
            l_D_ADD: "",

            // Reading - Right Eye
            r_R_SPH: "",
            r_R_CYL: "",
            r_R_AXIS: "",
            r_R_BC: "",
            r_R_DIA: "",
            r_R_ADD: "",

            // Reading - Left Eye
            l_R_SPH: "",
            l_R_CYL: "",
            l_R_AXIS: "",
            l_R_BC: "",
            l_R_DIA: "",
            l_R_ADD: ""
        });

        onClose();
    }

    useEffect(() => {
        if (!isOpen) return;

        setActiveTab("General");

        const fetchLatestSpectacles = async () => {
            try {
                const response = await GetLatestDebtorSpectacles({
                    companyId,
                    userId,
                    id: selectedCustomer?.debtorId,
                });

                if (response?.data) {
                    const specData = response.data;
                    setLatestSpecRXData(specData);
                } else {
                    onError({ title: "Fetch Error", message: response.errorMessage });
                }
            } catch (error) {
                onError({ title: "Fetch Error", message: error.message });
            }
        };

        const fetchLatestLens = async () => {
            try {
                const response = await GetLatestDebtorContactLens({
                    companyId,
                    userId,
                    id: selectedCustomer?.debtorId,
                });

                if (response?.data) {
                    const lensData = response.data;
                    setLatestLensRXData(lensData);
                } else {
                    onError({ title: "Fetch Error", message: response.errorMessage });
                }
            } catch (error) {
                onError({ title: "Fetch Error", message: error.message });
            }
        };

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

            fetchLatestSpectacles();
            fetchLatestLens();
        } else {
            handleClose();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
            <div className="bg-white w-full h-full p-6 text-secondary">
                <div className="sticky top-0 bg-white z-10">
                    <div className="flex flex-row justify-between">
                        <h3 className="font-semibold mb-4">
                            {isEdit ? "Edit Customer" : isView ? "View Customer" : "New Customer"}
                        </h3>
                        <div className='col-span-4' onClick={handleClose}>
                            <X size={20} />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-4 mb-4">
                        {(isView || isEdit ?
                            ['General', 'Medical Info', 'Latest RX', 'History RX', 'Sales History'] :
                            ['General', 'Medical Info']
                        ).map(tab => (
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

                <div className="overflow-y-auto flex-1 mt-4 h-full">
                    {activeTab === "General" && (
                        <CustomerGeneral debtorFormData={debtorFormData} setDebtorFormData={setDebtorFormData} isView={isView}/>
                    )}

                    {activeTab === "Medical Info" && (
                        <CustomerMedicalInfo medicalInfoData={medicalInfoData} setMedicalInfoData={setMedicalInfoData} isView={isView}/>
                    )}

                    {activeTab === "Latest RX" && (isEdit || isView) && (
                        <CustomerLatestRX latesSpecRXData={latesSpecRXData} latestLensRXData={latestLensRXData} />
                    )}

                    {activeTab === "History RX" && (isEdit || isView) &&(
                        <CustomerHistoryRX
                            className={"p-2"}
                            companyId={companyId}
                            onError={setErrorModal}
                            onConfirm={setConfirmModal}
                            customerId={selectedCustomer?.debtorId}
                        />
                    )}

                    {activeTab === "Sales History" && (isEdit || isView) &&(
                        <SalesHistory
                            debtorId={selectedCustomer?.debtorId}
                            className={"p-2"}
                            companyId={companyId}
                            onError={setErrorModal}
                        />
                    )}
                </div>

                {/* Action Buttons */}
                {!isView && (<div className="sticky bottom-0 bg-white z-10 border-t pt-4 pb-6">
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
                </div>)}
            </div>
        </div>
    );
};

export default AddCustomerModal;
