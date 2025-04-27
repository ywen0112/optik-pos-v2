const CustomerMedicalInfo = ({ medicalInfoData, setMedicalInfoData }) => {
    return (
        <div className="w-full h-full overflow-y-auto border rounded p-4">
            <div className="mt-2">
                <label className="block">Medical History</label>
                <div className="grid grid-cols-4 gap-1 mb-2">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={medicalInfoData.medicalIsDiabetes}
                            className="h-[47px]"
                            onChange={(e) =>
                                setMedicalInfoData({ ...medicalInfoData, medicalIsDiabetes: e.target.checked })
                            }
                        />
                        <span>Diabetes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            className="h-[47px]"
                            checked={medicalInfoData.medicalIsHypertension}
                            onChange={(e) =>
                                setMedicalInfoData({ ...medicalInfoData, medicalIsHypertension: e.target.checked })
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
                        value={medicalInfoData.medicalOthers}
                        onChange={(e) =>
                            setMedicalInfoData({ ...medicalInfoData, medicalOthers: e.target.value })
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
                            checked={medicalInfoData.ocularIsSquint}
                            onChange={(e) =>
                                setMedicalInfoData({ ...medicalInfoData, ocularIsSquint: e.target.checked })
                            }
                        />
                        <span>Squint</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            className="h-[47px]"
                            checked={medicalInfoData.ocularIsLazyEye}
                            onChange={(e) =>
                                setMedicalInfoData({ ...medicalInfoData, ocularIsLazyEye: e.target.checked })
                            }
                        />
                        <span>Lazy Eye</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            className="h-[47px]"
                            checked={medicalInfoData.ocularHasSurgery}
                            onChange={(e) =>
                                setMedicalInfoData({ ...medicalInfoData, ocularHasSurgery: e.target.checked })
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
                        value={medicalInfoData.ocularOthers}
                        onChange={(e) =>
                            setMedicalInfoData({ ...medicalInfoData, ocularOthers: e.target.value })
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomerMedicalInfo;