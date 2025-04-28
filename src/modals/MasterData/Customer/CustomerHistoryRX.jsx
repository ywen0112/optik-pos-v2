import { useState, useEffect } from "react";
import { Plus } from 'lucide-react';
import CustomStore from "devextreme/data/custom_store";
import NotificationModal from "../../NotificationModal";
import ConfirmationModal from "../../ConfirmationModal";
import CustomerHistoryRXDataGrid from "../../../Components/DataGrid/CustomerHistoryRXDataGrid";
import AddHistoryRXModal from "./AddHistoryRXModal";
import { NewSpectacles, NewContactLens, SaveSpectacles, SaveContactLensProfile } from "../../../api/eyepowerapi";
import { GetDebtorRXHistorys } from "../../../api/maintenanceapi";

const CustomerHistoryRX = ({ companyId, onError, customerId }) => {
  const userId = sessionStorage.getItem("userId");
  const [activeTab, setActiveTab] = useState("Prescribed");
  const [selectedRX, setSelectedRX] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isModalOpened, setIsModalOpened] = useState({ isOpen: false, type: "", data: null });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null })
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
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

  const rxHistoryStore = new CustomStore({
              key: "docNo",
              load: async (loadOptions) => {
                  const skip = loadOptions.skip ?? 0;
                  const take = loadOptions.take ?? 10;
                  const keyword = loadOptions.filter?.[2][2] || "";
                  const getLocalISOString = () => {
                      const now = new Date();
                      const timezoneOffset = now.getTimezoneOffset() * 60000; // offset in milliseconds
                      const localISOTime = new Date(now.getTime() - timezoneOffset).toISOString().slice(0, -1); // remove Z
                      return localISOTime;
                  };
                  let fromDate = getLocalISOString;
                  let toDate = getLocalISOString;
                  if (Array.isArray(loadOptions.filter)) {
                      if (loadOptions.filter[0]?.[0] === "fromDate") {
                          fromDate = loadOptions.filter[0]?.[2] || getLocalISOString;
                      }
                      if (loadOptions.filter[1]?.[0] === "toDate") {
                          toDate = loadOptions.filter[1]?.[2] || getLocalISOString;
                      }
                  }
  
                  try {
                      const response = await GetDebtorRXHistorys({
                          companyId: customerId,
                          offset: skip,
                          limit: take,
                          keyword,
                          fromDate,
                          toDate
                      });
                      return {
                          data: response?.data || [],
                          totalCount: response?.totalRecords || 0
                      };
                  } catch (error) {
                      onError({ title: "Fetch Error", message: error.message });
                      return { data: [], totalCount: 0 };
                  }
              }
          });
  

  // useEffect(() => {
  //   if (rxHistoryStore) {
  //     rxHistoryStore.load().then((data) => {
  //       if (data?.length > 0) {
  //         setSelectedRX(data[0]);
  //       }
  //     });
  //   }
  // }, [rxHistoryStore]);

  const openAddNewModal = async ({ type }) => {
    let data = null;
    try {
      if (type === "Specs") {
        const res = await NewSpectacles({ companyId: companyId, userId: userId, id: customerId });
        if (res.success) {
          data = res.data;
        } else throw new Error(res.errorMessage || "Failed to create new Spectacles Eye Power");
      } else if (type === "Lens") {
        const res = await NewContactLens({ companyId: companyId, userId: userId, id: userId });
        if (res.success) {
          data = res.data;
        } else throw new Error(res.errorMessage || "Failed to create new Contact Lens Eye Power");
      }
      setIsModalOpened({ isOpen: true, type: type, data: data });
    } catch (error) {
      onError({ title: "New Eye Power Error", message: error.message })
    }

  }

  const handleModalClose = () => {
    setIsModalOpened({ isOpen: false, type: "", data: null })
  }

  const confirmAction = async () =>{
    setSaving(true)
    setConfirmModal({ isOpen: false, action: null });
    try{
      if(confirmModal.action === "add"){
        console.log(confirmModal.type)
        if(confirmModal.type === "Specs"){
          const res = await SaveSpectacles(confirmModal.data)
          if(res.success){
            setNotifyModal({ isOpen: true, message: "Spectacles Eye Power Records saved successfully!" });
          }else throw new Error(res.errorMessage || "Failed to save Spectacles Eye Power Records");
        }else if(confirmModal.type === "Lens"){
          const res = await SaveContactLensProfile(confirmModal.data)
          if(res.success){
            setNotifyModal({ isOpen: true, message: "Contact Lens Eye Power Records saved successfully!" });
          }else throw new Error(res.errorMessage || "Failed to save Contact Lens Eye Power Records");
        }
      }
    }catch(error){
      onError({title: "Add Error", message: error.message});
    }finally{
      setIsModalOpened({isOpen: false, type: "", data: null});
      setSaving(false);
    }
  }

  const confirmationTitleMap = {
    add: "Confirm New",
  };

  const confirmationMessageMap = {
    add: "Are you sure you want to add this eye power record?",
  };

  return (
    <>
      <NotificationModal isOpen={notifyModal.isOpen} message={notifyModal.message} onClose={() => setNotifyModal({ isOpen: false, message: "" })} />
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmationTitleMap[confirmModal.action]}
        message={confirmationMessageMap[confirmModal.action]}
        loading={saving}
        onConfirm={() => confirmAction()}
        onCancel={() => setConfirmModal({ isOpen: false, action: null })}
      />

      <AddHistoryRXModal
        isOpen={isModalOpened.isOpen}
        type={isModalOpened.type}
        handleClose={handleModalClose}
        data={isModalOpened.data}
        onConfirm={setConfirmModal}
      />

      <div className="mt-2 bg-white h-[72vh] rounded-lg shadow overflow-y-auto">
        <div className="text-right p-2 flex-row flex justify-end space-x-2">
          <button onClick={() => openAddNewModal({ type: "Specs" })} className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90 transition mb-2 flex flex-row justify-self-end">
            <Plus size={20} /> New Spectacles
          </button>
          <button onClick={() => openAddNewModal({ type: "Lens" })} className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90 transition mb-2 flex flex-row justify-self-end">
            <Plus size={20} /> New Contact Lens
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


    </>

  );
};

export default CustomerHistoryRX;
