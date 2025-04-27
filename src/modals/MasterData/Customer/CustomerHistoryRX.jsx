import { useState, useEffect } from "react";
import CustomerHistoryRXDataGrid from "../../../Components/DataGrid/CustomerHistoryRXDataGrid";
import { Plus } from 'lucide-react';

const CustomerHistoryRX = ({ rxHistoryStore }) => {
  const [activeTab, setActiveTab] = useState("Prescribed"); 
  const [selectedRX, setSelectedRX] = useState(null);

  const specFields = ["SPH", "CYL", "AXIS", "VA", "PRISM", "ADD", "PD"];
  const lensFields = ["SPH", "CYL", "AXIS", "BC", "DIA", "ADD"];

  const handleRowClick = (e) => {
    setSelectedRX(e.data);
  };

  const renderSpecValue = (eye, field) => {
    if (!selectedRX) return "";
    const target = activeTab === "Prescribed" ? selectedRX.prescribedRXSpectacles : selectedRX.actualRXSpectacles;
    return target ? target[`${eye}_${field}`] ?? "" : "";
  };

  const renderLensValue = (eye, field) => {
    if (!selectedRX) return "";
    const target = activeTab === "Prescribed" ? selectedRX.prescribedRXContactLens : selectedRX.actualRXContactLens;
    return target ? target[`${eye}_${field}`] ?? "" : "";
  };

  useEffect(() => {
    if (rxHistoryStore) {
      rxHistoryStore.load().then((data) => {
        if (data?.length > 0) {
          setSelectedRX(data[0]);
        }
      });
    }
  }, [rxHistoryStore]);

  return (
    <div className="mt-2 bg-white h-[72vh] rounded-lg shadow overflow-y-auto">
        <div className="text-right p-2">
        <button className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90 transition mb-2 flex flex-row justify-self-end">
            <Plus size={20}/> New
            </button>
        </div>

    <div className="flex">
      {/* Left Side - DataGrid */}
      <div className="w-[45%] border-r overflow-y-auto">
        <CustomerHistoryRXDataGrid
          rxHistoryStore={rxHistoryStore}
          className="p-2"
          onRowClick={handleRowClick}
        />
      </div>

      {/* Right Side - Details */}
      <div className="w-[55%] overflow-y-auto p-4">
        {/* Prescribed/Actual Toggle */}
        <div className="flex space-x-4 mb-6">
          {["Prescribed", "Actual"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded ${activeTab === tab ? "bg-primary text-white" : "bg-gray-200"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Spectacles Section */}
        <div className="mb-8">
          <div className="text-center">
            <h5 className="font-semibold mb-4">Spectacles</h5>
          </div>

          {/* Spectacles Info */}
          <div className="grid grid-cols-4 gap-1 mb-4">
            <div className="col-span-1 mt-2">
                <label className="block mb-2">Spectacles Type</label>
                <input type="text" readOnly className="border px-2 h-[40px]" placeholder="Spectacles Type" value={selectedRX?.[activeTab === "Prescribed" ? "prescribedRXSpectacles" : "actualRXSpectacles"]?.spectaclesType || ""} />
            </div>

            <div className="col-span-1 mt-2">
                <label className="block mb-2">Optical Height</label>
                <input type="text" readOnly className="border px-2 h-[40px]" placeholder="Optical Height" value={selectedRX?.[activeTab === "Prescribed" ? "prescribedRXSpectacles" : "actualRXSpectacles"]?.opticalHiehgt || ""} />
            </div>

            <div className="col-span-1 mt-2">
                <label className="block mb-2">Segment Height</label>
                <input type="text" readOnly className="border px-2 h-[40px]" placeholder="Segment Height" value={selectedRX?.[activeTab === "Prescribed" ? "prescribedRXSpectacles" : "actualRXSpectacles"]?.segmentHiehgt || ""} />
            </div>

            <div className="col-span-1 mt-2">
                <label className="block mb-2">Dominent Eye</label>
                <input type="text" readOnly className="border px-2 h-[40px]" placeholder="Dominent Eye" value={selectedRX?.[activeTab === "Prescribed" ? "prescribedRXSpectacles" : "actualRXSpectacles"]?.dominentEye || ""} />
            </div>          
          </div>

          {/* Spectacles Power Table */}
          <div className="grid grid-cols-8 gap-1">
            <div></div>
            {specFields.map((field) => (
              <label key={`spec-header-${field}`}>{field}</label>
            ))}

            <label>Right</label>
            {specFields.map((field) => (
              <input
                key={`spec-right-${field}`}
                type="text"
                readOnly
                className="border px-2 h-[40px]"
                value={renderSpecValue("r_D", field)}
              />
            ))}

            <label>Left</label>
            {specFields.map((field) => (
              <input
                key={`spec-left-${field}`}
                type="text"
                readOnly
                className="border px-2 h-[40px]"
                value={renderSpecValue("l_D", field)}
              />
            ))}
          </div>
        </div>

        {/* Contact Lens Section */}
        <div className="pt-4 border-t">
          <div className="text-center">
            <h5 className="font-semibold mb-4">Contact Lens</h5>
          </div>

          {/* Contact Lens Power Table */}
          <div className="grid grid-cols-8 gap-1">
            <div></div>
            {lensFields.map((field) => (
              <label key={`lens-header-${field}`}>{field}</label>
            ))}
            <div></div>

            <label>Right</label>
            {lensFields.map((field) => (
              <input
                key={`lens-right-${field}`}
                type="text"
                readOnly
                className="border px-2 h-[40px]"
                value={renderLensValue("r_D", field)}
              />
            ))}
            <div></div>

            <label>Left</label>
            {lensFields.map((field) => (
              <input
                key={`lens-left-${field}`}
                type="text"
                readOnly
                className="border px-2 h-[40px]"
                value={renderLensValue("l_D", field)}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CustomerHistoryRX;
