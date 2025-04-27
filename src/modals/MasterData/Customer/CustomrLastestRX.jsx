import { useState } from "react";

const CustomerLatestRX = ({ latesSpecRXData, latestLensRXData }) => {
  const [activeSpectaclesTab, setActiveSpectaclesTab] = useState('SpecDistance');
  const [activeLensTab, setActiveLensTab] = useState('LensDistance');

  const specFields = ['SPH', 'CYL', 'AXIS', 'VA', 'PRISM', 'ADD', 'PD'];
  const lensFields = ['SPH', 'CYL', 'AXIS', 'BC', 'DIA', 'ADD'];

  return (
    <div className="w-full h-[75vh] overflow-y-auto border rounded p-4">
      {/* Spectacles Section */}
      <div className="border w-full mt-4 p-2">
        <div className="mb-4">
          <div className="text-center">
            <h5 className="font-semibold mb-2">Spectacles</h5>
          </div>

          <label className="col-span-2">Doc Date</label>
          <input
            type="text"
            readOnly
            className="col-span-2 border px-2 h-[40px] ml-2 "
            value={latesSpecRXData.docDate}
          />

          <div className="grid grid-cols-4 gap-1 mt-4">
            <label className="block">Spectacles Type</label>
            <label className="block">Optical Height</label>
            <label className="block">Segment Height</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={latesSpecRXData.dominentRightEye}
                readOnly
                disabled
                className=""
              />
              <label>Right</label>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1">
            <div className="mt-2">
              <input
                type="text"
                readOnly
                className="mr-2 border w-full h-[40px] px-2 "
                placeholder="Spectacles Type"
                value={latesSpecRXData.spectaclesType}
              />
            </div>
            <div className="mt-2">
              <input
                type="text"
                readOnly
                className="mr-2 border w-full h-[40px] px-2 "
                placeholder="Optical Height"
                value={latesSpecRXData.opticalHeight}
              />
            </div>
            <div className="mt-2">
              <input
                type="text"
                readOnly
                className="mr-2 border w-full h-[40px] px-2 "
                placeholder="Segment Height"
                value={latesSpecRXData.segmentHeight}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={latesSpecRXData.dominentLeftEye}
                readOnly
                disabled
                className=""
              />
              <label>Left</label>
            </div>
          </div>

          {/* Tabs for Spectacles */}
          <div className="flex space-x-4 mb-4 mt-4">
            {['SpecDistance', 'SpecReading'].map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 rounded ${activeSpectaclesTab === tab ? 'bg-primary text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveSpectaclesTab(tab)}
              >
                {tab === 'SpecDistance' ? 'Distance' : 'Reading'}
              </button>
            ))}
          </div>

          {/* Spectacles Right / Left Table */}
          <div className="grid grid-cols-8 gap-1 mt-4">
            <div></div>
            {specFields.map(field => (
              <label key={`header-${field}`}>{field}</label>
            ))}

            <label>Right</label>
            {specFields.map(field => (
              <input
                key={`r-${field}`}
                type="text"
                readOnly
                className="border px-2 h-[40px] "
                value={latesSpecRXData[
                  activeSpectaclesTab === 'SpecDistance' ? `r_D_${field}` : `r_R_${field}`
                ] || ""}
              />
            ))}

            <label>Left</label>
            {specFields.map(field => (
              <input
                key={`l-${field}`}
                type="text"
                readOnly
                className="border px-2 h-[40px] "
                value={latesSpecRXData[
                  activeSpectaclesTab === 'SpecDistance' ? `l_D_${field}` : `l_R_${field}`
                ] || ""}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Contact Lens Section */}
      <div className="border w-full mt-4 p-2">
        <div className="mb-4">
          <div className="text-center">
            <h5 className="font-semibold mb-2">Contact Lens</h5>
          </div>

          <label className="col-span-2">Doc Date</label>
          <input
            type="text"
            readOnly
            className="col-span-2 border px-2 h-[40px] ml-2 "
            value={latestLensRXData.docDate}
          />

          {/* Tabs for Lens */}
          <div className="flex space-x-4 mb-4 mt-4">
            {['LensDistance', 'LensReading'].map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 rounded ${activeLensTab === tab ? 'bg-primary text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveLensTab(tab)}
              >
                {tab === 'LensDistance' ? 'Distance' : 'Reading'}
              </button>
            ))}
          </div>

          {/* Contact Lens Right / Left Table */}
          <div className="grid grid-cols-8 gap-1 mt-4">
            <div></div>
            {lensFields.map(field => (
              <label key={`header-lens-${field}`}>{field}</label>
            ))}
            <div></div>

            <label>Right</label>
            {lensFields.map(field => (
              <input
                key={`lens-r-${field}`}
                type="text"
                readOnly
                className="border px-2 h-[40px] "
                value={latestLensRXData[
                  activeLensTab === 'LensDistance' ? `r_D_${field}` : `r_R_${field}`
                ] || ""}
              />
            ))}
            <div></div>

            <label>Left</label>
            {lensFields.map(field => (
              <input
                key={`lens-l-${field}`}
                type="text"
                readOnly
                className="border px-2 h-[40px] "
                value={latestLensRXData[
                  activeLensTab === 'LensDistance' ? `l_D_${field}` : `l_R_${field}`
                ] || ""}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLatestRX;
