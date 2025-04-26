const CustomerLatestRX = ({ latesRXData, setLatestRXData }) => {
    return (
    <div className="w-full h-[70vh] overflow-y-auto border rounded p-4">
        <h4 className="font-semibold">Latest RX</h4>

        {/* Spectacles Section */}
        <div className="mb-4">
            <div className="text-center">
                <h5 className="font-semibold mb-2">Spectacles</h5>
            </div>
            <label className="col-span-2">Last Update</label>
            <input
                type="date"
                className="col-span-2 border px-2 h-[40px] ml-2"
                value={latesRXData.lastUpdate}
                onChange={(e) => setLatestRXData({ ...latesRXData, lastUpdate: e.target.value })}
            />
            <div className="grid grid-cols-4 gap-1 mt-4">
                <label className="block">Optical Height</label>
                <label className="block">Segment Height</label>
                <label className="block">Dominent Eye</label>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={latesRXData.rxRight}
                        onChange={(e) =>
                            setLatestRXData({ ...latesRXData, rxRight: e.target.checked })
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
                        value={latesRXData.opticalHeight}
                        onChange={(e) =>
                            setLatestRXData({ ...latesRXData, opticalHeight: e.target.value })
                        }
                    />
                </div>
                <div className="mt-2">
                    <input
                        type="text"
                        className="mr-2 border w-full h-[40px] px-2"
                        placeholder="Segment Height"
                        value={latesRXData.segmentHeight}
                        onChange={(e) =>
                            setLatestRXData({ ...latesRXData, segmentHeight: e.target.value })
                        }
                    />
                </div>
                <div className="mt-2">
                    <input
                        type="text"
                        className="mr-2 border w-full h-[40px] px-2"
                        placeholder="Dominent Eye"
                        value={latesRXData.dominentEye}
                        onChange={(e) =>
                            setLatestRXData({ ...latesRXData, segmentHeight: e.target.value })
                        }
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={latesRXData.rxLeft}
                        onChange={(e) =>
                            setLatestRXData({ ...latesRXData, rxLeft: e.target.checked })
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
                value={latesRXData.lastUpdate}
                onChange={(e) => setLatestRXData({ ...latesRXData, lastUpdate: e.target.value })}
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

        {/*K-Reading Section*/}
        <div className="mt-4 mb-4">
            <div className="text-center">
                <h5 className="font-semibold mb-2">K-Reading</h5>
            </div>

            <div className="grid grid-cols-8 gap-1 mt-4">
                <div></div>
                <label>hm</label>
                <label>Vm</label>
                <label>HVID</label>
                <label colSpan={2}></label>
                <label colSpan={2}></label>
                <label colSpan={2}></label>
                <label colSpan={2}></label>

                <label>Right</label>
                <input className="border px-2 h-[40px]" />
                <input className="border px-2" />
                <input className="border px-2" />
                <input colSpan={2} />
                <input colSpan={2} />
                <input colSpan={2} />
                <input colSpan={2} />

                <label>Left</label>
                <input className="border px-2 h-[40px]" />
                <input className="border px-2" />
                <input className="border px-2" />
                <input colSpan={2} />
                <input colSpan={2} />
                <input colSpan={2} />
                <input colSpan={2} />
            </div>
        </div>
    </div>
    );
};

export default CustomerLatestRX;