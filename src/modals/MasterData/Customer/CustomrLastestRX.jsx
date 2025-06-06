import { useState } from "react";
import DatePicker from "react-datepicker";
import CustomInput from "../../../Components/input/dateInput";

const CustomerLatestRX = ({ isEdited, onEdit, isEdit, latesSpecRXData, latestLensRXData, specSetter, lensSetter }) => {
  const [activeSpectaclesTab, setActiveSpectaclesTab] = useState('SpecDistance');
  const [activeLensTab, setActiveLensTab] = useState('LensDistance');

  const specFields = ['SPH', 'CYL', 'AXIS', 'VA', 'PRISM', 'ADD', 'PD', 'Remark'];
  const lensFields = ['SPH', 'CYL', 'AXIS', 'BC', 'DIA', 'ADD', 'Remark'];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const handleSpecRxChange = (eye, mode, field, value) => {
    if (!isEdit) {
      return;
    }
    specSetter(prev => ({
      ...prev,
      actualRXSpectacles: {
        ...prev.actualRXSpectacles,
        [`${eye}_${mode}_${field}`]: value
      }
    }));
    if (!isEdited) {
      onEdit(true)
    }

  }

  const handleLensRxChange = (eye, mode, field, value) => {
    if (!isEdit) {
      return;
    }
    lensSetter(prev => ({
      ...prev,
      actualRXContactLens: {
        ...prev.actualRXContactLens,
        [`${eye}_${mode}_${field}`]: value
      }
    }));
    if (!isEdited) {
      onEdit(true)
    }
  }

  const SpecDataFieldMapping = {
    SpecDistance: "D",
    SpecReading: "R"
  }
  const LensDataFieldMapping = {
    LensDistance: "D",
    LensReading: "R"
  }

  const decimalRegex = /^-?\d*(\.\d{0,2})?$/;
  const roundUpToQuarter = (val) => Math.ceil(val * 4) / 4;

  return (
    <div className="w-full h-[77vh] overflow-y-auto p-4">
      {/* Spectacles Section */}
      <div className="border-2 w-full mt-4 p-2">
        <div className="mb-4">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Spectacles</h3>
          </div>

          <label className="col-span-2">Doc Date</label>
          <DatePicker
            disabled={!isEdit}
            customInput={<CustomInput disabled={!isEdit} />}
            selected={latesSpecRXData?.docDate ? new Date(latesSpecRXData.docDate) : new Date()}
            dateFormat="dd-MM-yyyy"
            className="col-span-2 border-2 px-2 h-[40px] ml-2 "
            onChange={(e) => {
              specSetter(prev => ({
                ...prev,
                docDate: e
              }));
              if (!isEdited) {
                onEdit(true)
              }
            }}
          />


          <div className="grid grid-cols-4 gap-1 mt-4">
            <label className="block">Optical Height</label>
            <label className="block">Segment Height</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={latesSpecRXData?.actualRXSpectacles?.dominentEye === "right"}
                onChange={(e) => {
                  if (!isEdit) {
                    return;
                  }
                  specSetter(prev => ({
                    ...prev,
                    actualRXSpectacles: {
                      ...prev.actualRXSpectacles,
                      dominentEye: e.target.checked ? "right" : ""
                    }
                  }))
                  if (!isEdited) {
                    onEdit(true)
                  }
                }}
                className=""
              />
              <label>Right</label>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1">

            <div className="mt-2">
              <input
                type="text"

                className="mr-2 border-2 w-full h-[40px] px-2 "
                placeholder="Optical Height"
                value={latesSpecRXData?.actualRXSpectacles?.opticalHeight}
                onChange={(e) => {
                  if (!isEdit) {
                    return;
                  }
                  specSetter(prev => ({
                    ...prev,
                    actualRXSpectacles: {
                      ...prev.actualRXSpectacles,
                      opticalHeight: e.target.value
                    }
                  }))
                  if (!isEdited) {
                    onEdit(true)
                  }
                }}
              />
            </div>
            <div className="mt-2">
              <input
                type="text"
                className="mr-2 border-2 w-full h-[40px] px-2 "
                placeholder="Segment Height"
                value={latesSpecRXData?.actualRXSpectacles?.segmentHeight}
                onChange={(e) => {
                  if (!isEdit) {
                    return;
                  }
                  specSetter(prev => ({
                    ...prev,
                    actualRXSpectacles: {
                      ...prev.actualRXSpectacles,
                      segmentHeight: e.target.value
                    }
                  }))
                  if (!isEdited) {
                    onEdit(true)
                  }
                }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={latesSpecRXData?.actualRXSpectacles?.dominentEye === "left"}
                className=""
                onChange={(e) => {
                  if (!isEdit) {
                    return;
                  }
                  specSetter(prev => ({
                    ...prev,
                    actualRXSpectacles: {
                      ...prev.actualRXSpectacles,
                      dominentEye: e.target.checked ? "left" : ""
                    }
                  }))
                  if (!isEdited) {
                    onEdit(true)
                  }
                }}
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
          <div className="grid grid-cols-9 gap-1 mt-4">
            <div></div>
            {specFields.map(field => (
              <label key={`header-${field}`}>{field}</label>
            ))}

            <label>Right</label>
            {specFields.map(field => (
              <input
                key={`r-${field}`}
                type="text"
                onChange={(e) => {
                  const val = e.target.value;
                  if(field === "Remark"){
                    handleSpecRxChange(
                      "r",
                      SpecDataFieldMapping[activeSpectaclesTab],
                      field,
                      val
                    );
                    return;
                  }
                  if (val === "" || decimalRegex.test(val)) {
                    handleSpecRxChange(
                      "r",
                      SpecDataFieldMapping[activeSpectaclesTab],
                      field,
                      val
                    );
                  }
                }}
                onBlur={(e) => {
                  if(field === "Remark") return;
                  const raw = parseFloat(e.target.value);
                  if (!isNaN(raw)) {
                    const isPD = field === "PD";
                    const isAxis = field === "AXIS";
                    const newVal = isAxis
                      ? Math.round(raw).toString()
                      : isPD
                        ? raw.toFixed(2)
                        : roundUpToQuarter(raw).toFixed(2);
                    handleSpecRxChange(
                      "r",
                      SpecDataFieldMapping[activeSpectaclesTab],
                      field,
                      newVal
                    );
                  }
                }}
                className="border-2 px-2 h-[40px] "
                value={latesSpecRXData?.actualRXSpectacles?.[
                  activeSpectaclesTab === 'SpecDistance' ? `r_D_${field}` : `r_R_${field}`
                ] || ""}
              />
            ))}

            <label>Left</label>
            {specFields.map(field => (
              <input
                key={`l-${field}`}
                type="text"
                onChange={(e) => {
                  const val = e.target.value;
                  if(field === "Remark"){
                    handleSpecRxChange(
                      "l",
                      SpecDataFieldMapping[activeSpectaclesTab],
                      field,
                      val
                    );
                    return;
                  }
                  if (val === "" || decimalRegex.test(val)) {
                    handleSpecRxChange(
                      "l",
                      SpecDataFieldMapping[activeSpectaclesTab],
                      field,
                      val
                    );
                  }
                }}
                onBlur={(e) => {
                  if(field === "Remark") return;
                  const raw = parseFloat(e.target.value);
                  if (!isNaN(raw)) {
                    const isPD = field === "PD";
                    const isAxis = field === "AXIS";
                    const newVal = isAxis
                      ? Math.round(raw).toString()
                      : isPD
                        ? raw.toFixed(2)
                        : roundUpToQuarter(raw).toFixed(2);
                    handleSpecRxChange(
                      "l",
                      SpecDataFieldMapping[activeSpectaclesTab],
                      field,
                      newVal
                    );
                  }
                }}
                className="border-2 px-2 h-[40px] "
                value={latesSpecRXData?.actualRXSpectacles?.[
                  activeSpectaclesTab === 'SpecDistance' ? `l_D_${field}` : `l_R_${field}`
                ] || ""}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Contact Lens Section */}
      <div className="border-2 w-full mt-4 p-2">
        <div className="mb-4">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Contact Lens</h3>
          </div>

          <label className="col-span-2">Doc Date</label>
          <DatePicker
            disabled={!isEdit}
            customInput={<CustomInput disabled={!isEdit} />}
            selected={latestLensRXData?.docDate ? new Date(latestLensRXData.docDate) : new Date()}
            dateFormat="dd-MM-yyyy"
            className="col-span-2 border-2 px-2 h-[40px] ml-2 "
            onChange={(e) => {
              lensSetter(prev => ({
                ...prev,
                docDate: e
              }));
              if (!isEdited) {
                onEdit(true)
              }
            }}
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
          <div className="grid grid-cols-9 gap-1 mt-4">
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
                onChange={(e) => {
                  const val = e.target.value;
                  if(field === "Remark"){
                    handleLensRxChange(
                      "r",
                      LensDataFieldMapping[activeLensTab],
                      field,
                      val
                    );
                    return;
                  }
                  if (val === "" || decimalRegex.test(val)) {
                    handleLensRxChange(
                      "r",
                      LensDataFieldMapping[activeLensTab],
                      field,
                      val
                    );
                  }
                }}
                onBlur={(e) => {
                  if(field === "Remark") return;
                  const raw = parseFloat(e.target.value);
                  if (!isNaN(raw)) {
                    const isPD = field === "PD";
                    const isAxis = field === "AXIS";
                    const newVal = isAxis
                      ? Math.round(raw).toString()
                      : isPD
                        ? raw.toFixed(2)
                        : roundUpToQuarter(raw).toFixed(2);
                    handleLensRxChange(
                      "r",
                      LensDataFieldMapping[activeLensTab],
                      field,
                      newVal
                    );
                  }
                }}
                className="border-2 px-2 h-[40px] "
                value={latestLensRXData?.actualRXContactLens?.[
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
                onChange={(e) => {
                  const val = e.target.value;
                  if(field === "Remark"){
                    handleLensRxChange(
                      "l",
                      LensDataFieldMapping[activeLensTab],
                      field,
                      val
                    );
                    return;
                  }
                  if (val === "" || decimalRegex.test(val)) {
                    handleLensRxChange(
                      "l",
                      LensDataFieldMapping[activeLensTab],
                      field,
                      val
                    );
                  }
                }}
                onBlur={(e) => {
                  if(field === "Remark") return;
                  const raw = parseFloat(e.target.value);
                  if (!isNaN(raw)) {
                    const isPD = field === "PD";
                    const isAxis = field === "AXIS";
                    const newVal = isAxis
                      ? Math.round(raw).toString()
                      : isPD
                        ? raw.toFixed(2)
                        : roundUpToQuarter(raw).toFixed(2);
                    handleLensRxChange(
                      "l",
                      LensDataFieldMapping[activeLensTab],
                      field,
                      newVal
                    );
                  }
                }}
                className="border-2 px-2 h-[40px] "
                value={latestLensRXData?.actualRXContactLens?.[
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
