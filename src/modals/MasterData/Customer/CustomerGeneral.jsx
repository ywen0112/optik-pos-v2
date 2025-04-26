const CustomerGeneral = ({ debtorFormData, setDebtorFormData }) => {
    return (
        <div className="w-full h-full border rounded p-4">
        <h4 className="font-semibold mb-2">General</h4>
            <div className="grid grid-cols-4 gap-1">
                <div className="col-span-4 flex justify-between items-center">
                <label className="block">Customer Code</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={debtorFormData.isActive}
                            onChange={(e) =>
                                setDebtorFormData({ ...debtorFormData, isActive: e.target.checked })
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
                        value={debtorFormData.debtorCode}
                        onChange={(e) =>
                            setDebtorFormData({ ...debtorFormData, debtorCode: e.target.value })
                        }
                    />
                    </div>

                    <div className="col-span-4 mt-2">
                    <label className="block mb-2">Name</label>
                    <input
                        type="text"
                        className="mr-2 border w-full h-[40px] px-2"
                        placeholder="Name"
                        value={debtorFormData.companyName}
                        onChange={(e) =>
                            setDebtorFormData({ ...debtorFormData, companyName: e.target.value })
                        }
                    />
                    </div>

                    <div className="col-span-2 mt-2">
                    <label className="block mb-2">IC</label>
                    <input
                        type="text"
                        className="mr-2 border w-full h-[40px] px-2"
                        placeholder="IC"
                        value={debtorFormData.identityNo}
                        onChange={(e) =>
                            setDebtorFormData({ ...debtorFormData, identityNo: e.target.value })
                        }
                    />
                    </div>

                    <div className="col-span-2 mt-2">
                    <label className="block mb-2">D.O.B</label>
                    <input
                        type="date"
                        className="mr-2 border w-full h-[40px] px-2"
                        value={debtorFormData.dob}
                        onChange={(e) =>
                            setDebtorFormData({ ...debtorFormData, dob: e.target.value })
                        }
                    />
                    </div>

                    <div className="col-span-2 mt-2">
                    <label className="block mb-2">Billing Address</label>
                    <textarea
                        rows={4}
                        className="mr-2 border w-full h-[80px] px-2 py-2"
                        placeholder="Billing Address"
                        value={debtorFormData.address}
                        onChange={(e) =>
                            setDebtorFormData({ ...debtorFormData, address: e.target.value })
                        }
                    />
                    </div>

                    <div className="col-span-2 mt-2">
                    <label className="block mb-2">Remark</label>
                    <textarea
                        rows={4}
                        className="mr-2 border w-full h-[80px] px-2 py-2"
                        placeholder="Remark"
                        value={debtorFormData.remark}
                        onChange={(e) =>
                            setDebtorFormData({ ...debtorFormData, remark: e.target.value })
                        }
                    />
                    </div>

                    <div className="col-span-1 mt-2">
                    <label className="block mb-2">Phone</label>
                    <input
                        type="text"
                        className="mr-2 border w-full h-[40px] px-2"
                        placeholder="Phone"
                        value={debtorFormData.phone1}
                        onChange={(e) =>
                            setDebtorFormData({ ...debtorFormData, phone1: e.target.value })
                        }
                    />
                    </div>

                    <div className="col-span-1 mt-2">
                    <label className="block mb-2">Phone 2</label>
                    <input
                        type="text"
                        className="mr-2 border w-full h-[40px] px-2"
                        placeholder="Phone 2"
                        value={debtorFormData.phone2}
                        onChange={(e) =>
                            setDebtorFormData({ ...debtorFormData, phone2: e.target.value })
                        }
                    />
                    </div>

                    <div className="col-span-2 mt-2">
                    <label className="block mb-2">Email</label>
                    <input
                        type="email"
                        className="mr-2 border w-full h-[40px] px-2"
                        placeholder="Email"
                        value={debtorFormData.emailAddress}
                        onChange={(e) =>
                            setDebtorFormData({ ...debtorFormData, emailAddress: e.target.value })
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomerGeneral;