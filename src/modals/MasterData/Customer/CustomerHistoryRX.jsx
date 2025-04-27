const CustomerHistoryRX = ({ historyRXData, setHistoryRXData }) => {
    return (
        <div className="w-full h-full overflow-y-auto border rounded p-4">
        {/* Spectacles Section */}
        <div className="mb-4">
            <label className="col-span-2">Doc Date</label>
            <input
                type="text"
                className="col-span-2 border px-2 h-[40px] ml-2"
                value={historyRXData.docDate}
                readOnly
            />
            <div className="text-center">
                <h5 className="font-semibold mb-2">Spectacles</h5>
            </div>
            <div className="grid grid-cols-4 gap-1 mt-4">
                <label className="block">Optical Height</label>
                <label className="block">Segment Height</label>
                <label className="block">Dominent Eye</label>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={historyRXData.rxRight}
                        onChange={(e) =>
                            setHistoryRXData({ ...historyRXData, rxRight: e.target.checked })
                        }
                    />
                    <label>Right</label>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-1">
                <div className="mt-2">
                    <input
                        type="text"
                        className="mr-2 border w-full h-[40px] px-2"
                        placeholder="Optical Height"
                        value={historyRXData.opticalHeight}
                        onChange={(e) =>
                            setHistoryRXData({ ...historyRXData, opticalHeight: e.target.value })
                        }
                    />
                </div>
                <div className="mt-2">
                    <input
                        type="text"
                        className="mr-2 border w-full h-[40px] px-2"
                        placeholder="Segment Height"
                        value={historyRXData.segmentHeight}
                        onChange={(e) =>
                            setHistoryRXData({ ...historyRXData, segmentHeight: e.target.value })
                        }
                    />
                </div>
                <div className="mt-2">
                    <input
                        type="text"
                        className="mr-2 border w-full h-[40px] px-2"
                        placeholder="Dominent Eye"
                        value={historyRXData.dominentEye}
                        onChange={(e) =>
                            setHistoryRXData({ ...historyRXData, segmentHeight: e.target.value })
                        }
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={historyRXData.rxLeft}
                        onChange={(e) =>
                            setHistoryRXData({ ...historyRXData, rxLeft: e.target.checked })
                        }
                    />
                    <label>Left</label>
                </div>
            </div>

            <div className="grid grid-cols-8 gap-1 mt-4">
                <div></div>
                <label>SPH</label>
                <label>CYL</label>
                <label>AXIS</label>
                <label>VA</label>
                <label>PRISM</label>
                <label>ADD</label>
                <label>PD</label>

                <label>Right</label>
                <input className="border px-2 h-[40px]" />
                <input className="border px-2" />
                <input className="border px-2" />
                <input className="border px-2" />
                <input className="border px-2" />
                <input className="border px-2" />
                <input className="border px-2" />

                <label>Left</label>
                <input className="border px-2 h-[40px]" />
                <input className="border px-2" />
                <input className="border px-2" />
                <input className="border px-2" />
                <input className="border px-2" />
                <input className="border px-2" />
                <input className="border px-2" />
            </div>
        </div>

        {/* Contact Lens Section */}
        <div className="mb-4">
            <div className="text-center">
                <h5 className="font-semibold mb-2">Contact Lens</h5>
            </div>
            <label className="col-span-2">Last Update</label>
            <input
                type="date"
                className="col-span-2 border px-2 h-[40px] ml-2"
                value={historyRXData.lastUpdate}
                onChange={(e) => setHistoryRXData({ ...historyRXData, lastUpdate: e.target.value })}
            />

            <div className="grid grid-cols-8 gap-1 mt-4">
                <div></div>
                <label>SPH</label>
                <label>CYL</label>
                <label>AXIS</label>
                <label>BC</label>
                <label>DIA</label>
                <label>ADD</label>
                <label colSpan={2}></label>

                <label h->Right</label>
                <input className="border px-2 h-[40px]" />
                <input className="border px-2" />
                <input className="border px-2" />
                <input className="border px-2" />
                <input className="border px-2" />
                <input className="border px-2" />
                <input colSpan={2} />

                <label>Left</label>
                <input className="border px-2 h-[40px]" />
                <input className="border px-2" />
                <input className="border px-2" />
                <input className="border px-2" />
                <input className="border px-2" />
                <input className="border px-2" />
                <input colSpan={2} />
            </div>
        </div>
    </div>
    );
};

export default CustomerHistoryRX;