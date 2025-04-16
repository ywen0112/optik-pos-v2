// import { useEffect, useState } from "react";
// import { Pencil, Trash2, Eye } from "lucide-react";
// import {
//   GetDebtorRecords,
//   NewDebtor,
//   EditDebtor,
//   SaveDebtor,
//   DeleteDebtor,
//   GetDebtorType,
//   GetDebtorEyePowerRecords,
//   EditEyePower,
//   SaveEyePower,
//   DeleteEyePower,
//   NewEyePower
// } from "../../apiconfig";
// import ErrorModal from "../../modals/ErrorModal";
// import NotificationModal from "../../modals/NotificationModal";
// import ConfirmationModal from "../../modals/ConfirmationModal";
// import Select from "react-select";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const DebtorMaintenance = () => {
//   const customerId = localStorage.getItem("customerId");
//   const userId = localStorage.getItem("userId");
//   const locationId = localStorage.getItem("locationId");

//   const [loading, setLoading] = useState(false);
//   const [errorModal, setErrorModal] = useState({ title: "", message: "" });
//   const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
//   const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null });
//   const [debtorTypes, setDebtorTypes] = useState([]);
//   const [selectedDebtorType, setSelectedDebtorType] = useState(null);

//   const [debtors, setDebtors] = useState([]);
//   const [selectedDebtor, setSelectedDebtor] = useState(null);
//   const [formAction, setFormAction] = useState(null);
//   const [viewMode, setViewMode] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [saving, setSaving] = useState(false);

//   const [eyePowerRecords, setEyePowerRecords] = useState([]);
//   const [selectedEyeRecord, setSelectedEyeRecord] = useState(null);
//   const [eyePowerEditData, setEyePowerEditData] = useState(null);
//   const [isEditingEyePower, setIsEditingEyePower] = useState(false);  
//   const [deleteEyePowerId, setDeleteEyePowerId] = useState(null);
//   const [newEyePowerData, setNewEyePowerData] = useState(null);

//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     itemsPerPage: 10,
//     totalItems: 0
//   });

//   useEffect(() => {
//     fetchDebtors();
//     fetchDebtorType();
//   }, [pagination.currentPage]);

//   const fetchDebtors = async () => {
//     setLoading(true);
//     const offset = (pagination.currentPage - 1) * pagination.itemsPerPage;
//     const limit = pagination.itemsPerPage;

//     try {
//       const res = await fetch(GetDebtorRecords, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ customerId: Number(customerId), keyword: "", offset, limit })
//       });
//       const data = await res.json();
//       if (data.success) {
//       const records = data.data.debtorRecords || [];
//       const total = data.data.totalRecords || 0;

//       setDebtors(records);
//       setPagination((prev) => ({
//         ...prev,
//         totalItems: total,
//        }));
//       } else throw new Error(data.errorMessage || "Failed to fetch debtors.");
//     } catch (error) {
//       setErrorModal({ title: "Fetch Error", message: error.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage > 0 && newPage <= Math.ceil(pagination.totalItems / pagination.itemsPerPage)) {
//       setPagination((prev) => ({ ...prev, currentPage: newPage }));
//     }
//   };

//   const handleAddNew = async () => {
//     try {
//       const res = await fetch(NewDebtor, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ customerId: Number(customerId), userId, locationId, id: "" })
//       });
//       const data = await res.json();
//       if (data.success) {
//         setSelectedDebtor(data.data);
//         setSelectedDebtorType(null);
//         setEyePowerRecords([]);           
//         setSelectedEyeRecord(null);      
//         setNewEyePowerData(null); 
//         setFormAction("add");
//         setViewMode(false);
//       } else throw new Error(data.errorMessage || "Failed to create new debtor.");
//     } catch (error) {
//       setErrorModal({ title: "New Debtor Error", message: error.message });
//     }
//   };

  
// const fetchDebtorType = async () => {
//   try{
//   const res = await fetch(GetDebtorType, {
//     method: "POST",
//     headers: {
//       Accept: "text/plain",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ customerId: Number(customerId), keyword: "", offset: 0, limit: 9999 }),
//   });
//   const data = await res.json();
//   if (data.success) {
//       setDebtorTypes(data.data.debtorTypeRecords || [])
//   } else {
//       throw new Error(data.errorMessage || "Failed to fetch debtor type.");
//     }
//   } catch (error) {
//     setErrorModal({ title: "Fetch Error", message: error.message });
//   }
// };

// const getDebtorTypeLabel = (id) => debtorTypes.find((dt) => dt.debtorTypeId === id)?.debtorTypeCode || "-";

//   const handleOpenModal = async (debtor, mode) => {
//     if (mode === "edit") {
//       try {
//         const res = await fetch(EditDebtor, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ customerId: Number(customerId), userId, locationId, id: debtor.debtorId })
//         });
//         const data = await res.json();
//         if (data.success) {
//           setSelectedDebtor(data.data);
//           const matchedType = debtorTypes.find((dt) => dt.debtorTypeId === data.data.debtorTypeId);
//           setSelectedDebtorType(matchedType ? {
//             value: matchedType.debtorTypeId,
//             label: matchedType.debtorTypeCode
//           } : null);
//           setFormAction("edit");
//           setViewMode(false);
//         } else throw new Error(data.errorMessage || "Failed to fetch debtor data");
//       } catch (error) {
//         setErrorModal({ title: "Edit Error", message: error.message });
//       }
//     } else {
//       setSelectedDebtor(debtor);
//       setViewMode(true);
//     }

//     try {
//       const res = await fetch(GetDebtorEyePowerRecords, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'text/plain',
//         },
//         body: JSON.stringify({
//           customerId: Number(customerId),
//           userId,
//           locationId,
//           id: debtor.debtorId,
//         }),
//       });
  
//       const data = await res.json();
//       if (data.success) {
//         setEyePowerRecords(data.data || []);
//         setSelectedEyeRecord(data.data?.[0] || null); 
//       } else {
//         throw new Error(data.errorMessage || "Failed to fetch eye power records");
//       }
//     } catch (error) {
//       setErrorModal({ title: "Service Record Error", message: error.message });
//     }
//   };

//   const handleDeleteClick = (id) => {
//     setDeleteTarget(id);
//     setConfirmModal({ isOpen: true, action: "delete" });
//   };

//   const handleInputChange = (field, value) => {
//     setSelectedDebtor((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleCheckboxChange = (field) => {
//     setSelectedDebtor((prev) => ({ ...prev, [field]: !prev[field] }));
//   };

//   const confirmAction = async () => {
//     setSaving(true);
//     const action = confirmModal.action;
//     setConfirmModal({ isOpen: false, action: null });

//     try {
//       if (action === "delete") {
//         const res = await fetch(DeleteDebtor, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ customerId: Number(customerId), userId, locationId, id: deleteTarget })
//         });
//         const data = await res.json();
//         if (data.success) {
//           setNotifyModal({ isOpen: true, message: "Debtor deleted successfully!" });
//           fetchDebtors();
//         } else throw new Error(data.errorMessage || "Failed to delete debtor.");
//       } else if (action === "deleteEyePower") {
//         await handleDeleteEyePower();
//       } else {
//         const res = await fetch(SaveDebtor, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             actionData: {
//                 customerId: Number(customerId),
//                 userId,
//                 locationId,
//                 id: selectedDebtor.debtorId || ""
//             },
//             debtorId: selectedDebtor.debtorId,
//             debtorCode: selectedDebtor.debtorCode || "",
//             companyName: selectedDebtor.companyName || "",
//             debtorTypeId: selectedDebtor.debtorTypeId || "",
//             isActive: !!selectedDebtor.isActive,
//             address1: selectedDebtor.address1 || "",
//             address2: selectedDebtor.address2 || "",
//             address3: selectedDebtor.address3 || "",
//             address4: selectedDebtor.address4 || "",
//             postCode: selectedDebtor.postCode || "",
//             phone1: selectedDebtor.phone1 || "",
//             phone2: selectedDebtor.phone2 || "",
//             mobile: selectedDebtor.mobile || "",
//             medicalIsDiabetes: !!selectedDebtor.medicalIsDiabetes,
//             medicalIsHypertension: !!selectedDebtor.medicalIsHypertension,
//             medicalOthers: selectedDebtor.medicalOthers || "",
//             ocularIsSquint: !!selectedDebtor.ocularIsSquint,
//             ocularIsLazyEye: !!selectedDebtor.ocularIsLazyEye,
//             ocularHasSurgery: !!selectedDebtor.ocularHasSurgery,
//             ocularOthers: selectedDebtor.ocularOthers || ""
//           })
//         });
//         const data = await res.json();
//         if (data.success) {
//           setNotifyModal({ isOpen: true, message: "Debtor saved successfully!" });
//           setSelectedDebtor(null);
//           fetchDebtors();
//         } else throw new Error(data.errorMessage || "Failed to save debtor.");
//       }
//     } catch (error) {
//       setErrorModal({ title: `${action === "delete" ? "Delete" : "Save"} Error`, message: error.message });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const confirmationTitleMap = {
//     add: "Confirm Add",
//     edit: "Confirm Edit",
//     delete: "Confirm Delete",
//     deleteEyePower: "Confirm Delete Eye Power"
//   };

//   const confirmationMessageMap = {
//     add: "Are you sure you want to add this debtor?",
//     edit: "Are you sure you want to edit this debtor?",
//     delete: "Are you sure you want to delete this debtor?",
//     deleteEyePower: "Are you sure you want to delete this eye power?"
//   };

//   const normalizeProfileKeys = (profileObj, prefix) => {
//     const normalized = {};
  
//     for (const key in profileObj) {
//       const value = profileObj[key];
//       const match = key.match(new RegExp(`^${prefix}_(R|L)_(.*)$`)); // e.g. lens_R_SPH
//       if (match) {
//         const eye = match[1].toLowerCase(); // 'r' or 'l'
//         const suffix = match[2]; // e.g. 'SPH'
//         normalized[`${eye}_${suffix}`] = value;
//       }
//     }
  
//     return normalized;
//   };
  
//   const normalizeEyePowerEditData = (data) => ({
//     ...data,
//     latestGlassProfile: normalizeProfileKeys(data.latestGlassProfile || {}, "latest_Glass"),
//     actualGlassProfile: normalizeProfileKeys(data.actualGlassProfile || {}, "actual_Glass"),
//     lensProfile: normalizeProfileKeys(data.lensProfile || {}, "lens"),
//   });

//   const handleEditEyePower = async () => {
//     try {
//       const res = await fetch(EditEyePower, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "text/plain",
//         },
//         body: JSON.stringify({
//           customerId: Number(customerId),
//           userId,
//           locationId,
//           id: selectedEyeRecord.eyeProfileId, 
//         }),
//       });
  
//       const data = await res.json();
//       if (data.success && data.data) {
//         const normalizedData = normalizeEyePowerEditData(data.data);
//         setEyePowerEditData(normalizedData);
//         setIsEditingEyePower(true);
//       } else {
//         throw new Error(data.errorMessage || "Failed to fetch editable eye power data");
//       }
//     } catch (err) {
//       setErrorModal({ title: "Edit Eye Power Error", message: err.message });
//     }
//   };
  
//   const handleCancelEditEyePower = () => {
//     setIsEditingEyePower(false);
//     setEyePowerEditData(null);
//   };

//   const denormalizeProfileKeys = (profileObj, prefix) => {
//     const denormalized = {};
  
//     for (const key in profileObj) {
//       const match = key.match(/^(r|l)_(.+)$/);
//       if (match) {
//         const eye = match[1].toUpperCase(); // R or L
//         const suffix = match[2];
//         denormalized[`${prefix}_${eye}_${suffix}`] = profileObj[key];
//       }
//     }
  
//     return denormalized;
//   };
  
//   const denormalizeEyePowerEditData = (data) => {
//     const {
//       latestGlassProfile,
//       actualGlassProfile,
//       lensProfile,
//       ...rest
//     } = data;
  
//     return {
//       ...rest,
//       latestGlassProfile: denormalizeProfileKeys(latestGlassProfile || {}, "latest_Glass"),
//       actualGlassProfile: denormalizeProfileKeys(actualGlassProfile || {}, "actual_Glass"),
//       lensProfile: denormalizeProfileKeys(lensProfile || {}, "lens"),
//     };
//   };

//   const handleAddEyePower = async () => {
//     try {
//       const res = await fetch(NewEyePower, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           customerId: Number(customerId),
//           userId,
//           locationId,
//           id: ""
//         }),
//       });
  
//       const data = await res.json();
//       if (data.success && data.data) {
//         const normalizedData = normalizeEyePowerEditData(data.data);
//         setNewEyePowerData({ ...normalizedData, userDefinedTime: new Date() });
//       } else {
//         throw new Error(data.errorMessage || "Failed to create new Eye Power record.");
//       }
//     } catch (err) {
//       setErrorModal({ title: "Add Eye Power Error", message: err.message });
//     }
//   };

//   const denormalizeNewEyePowerData = (data) => {
//     const {
//       latestGlassProfile,
//       actualGlassProfile,
//       lensProfile,
//       userDefinedTime,
//       ...rest
//     } = data;
  
//     return {
//       ...rest,
//       userDefinedTime: new Date(userDefinedTime.getTime() - userDefinedTime.getTimezoneOffset() * 60000)
//         .toISOString()
//         .slice(0, 19),
//       latestGlassProfile: denormalizeProfileKeys(latestGlassProfile || {}, "latest_Glass"),
//       actualGlassProfile: denormalizeProfileKeys(actualGlassProfile || {}, "actual_Glass"),
//       lensProfile: denormalizeProfileKeys(lensProfile || {}, "lens"),
//     };
//   };

//   const handleSaveNewEyePower = async () => {
//     try {
//       const payload = denormalizeNewEyePowerData({
//         ...newEyePowerData,
//         customerId: Number(customerId),
//         userId,
//         locationId,
//         id: newEyePowerData.eyeProfileId,
//         debtorId: selectedDebtor?.debtorId,
//       });
  
//       const res = await fetch(SaveEyePower, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
  
//       const data = await res.json();
//       if (data.success) {
//         setNotifyModal({ isOpen: true, message: "New Eye Power saved successfully!" });
//         setNewEyePowerData(null);
//         handleOpenModal(selectedDebtor, viewMode ? "view" : "edit"); 
//       } else {
//         throw new Error(data.errorMessage || "Failed to save new eye power");
//       }
//     } catch (err) {
//       setErrorModal({ title: "Save New Eye Power Error", message: err.message });
//     }
//   };  

//   const handleSaveEyePower = async () => {
//     const date = new Date();
//     const tzOffset = date.getTimezoneOffset() * 60000;
//     const userDefinedTime = new Date(date - tzOffset).toISOString().slice(0, 19);

//     const normalized = denormalizeEyePowerEditData(eyePowerEditData);

//     const payload = {
//       ...normalized,
//       userDefinedTime,
//     };

//     try {
//       const res = await fetch(SaveEyePower, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setNotifyModal({ isOpen: true, message: "Eye Power saved successfully!" });
//         setIsEditingEyePower(false);
//         setEyePowerEditData(null);
//         handleOpenModal(selectedDebtor, viewMode ? "view" : "edit");
//       } else {
//         throw new Error(data.errorMessage || "Failed to save eye power");
//       }
//     } catch (err) {
//       setErrorModal({ title: "Save Eye Power Error", message: err.message });
//     }
//   };
  
//   const recordTitles = {
//     latestRecords: "Latest Glass Profile",
//     actualRecords: "Actual Class Profile",
//     lensRecords: "Lens Profile",
//   };

//   const convertKey = (key) => {
//     if (key === "lensRecords") return "lensProfile";
//     if (key === "latestRecords") return "latestGlassProfile";
//     if (key === "actualRecords") return "actualGlassProfile";
//     return key;
//   };  

//   const handleDeleteEyePower = async () => {
//     setConfirmModal({ isOpen: false, action: null });
  
//     try {
//       const res = await fetch(DeleteEyePower, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           customerId: Number(customerId),
//           userId,
//           locationId,
//           id: deleteEyePowerId,
//         }),
//       });
  
//       const data = await res.json();
//       if (data.success) {
//         setNotifyModal({ isOpen: true, message: "Eye Power record deleted successfully!" });
//         handleOpenModal(selectedDebtor, viewMode ? "view" : "edit");
//       } else {
//         throw new Error(data.errorMessage || "Failed to delete eye power record");
//       }
//     } catch (error) {
//       setErrorModal({ title: "Delete Eye Power Error", message: error.message });
//     } finally {
//       setDeleteEyePowerId(null);
//     }
//   };  

//   const customStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       border: "1px solid #ccc",
//       padding: "1px",
//       fontSize: "0.75rem",
//       width: "100%",
//       minHeight: "2.5rem",
//       backgroundColor: state.isDisabled ? "#f9f9f9" : "white",
//       cursor: state.isDisabled ? "not-allowed" : "pointer",
//     }),
//     input: (provided) => ({
//       ...provided,
//       fontSize: "0.75rem",
//     }),
//     placeholder: (provided) => ({
//       ...provided,
//       fontSize: "0.75rem",
//     }),
//     menu: (provided) => ({
//       ...provided,
//       fontSize: "0.75rem",
//       zIndex: 9999,
//       position: "absolute",
//       maxHeight: "10.5rem",
//       overflowY: "auto",
//       WebkitOverflowScrolling: "touch",
//       pointerEvents: "auto",
//     }),
//     menuList: (provided) => ({
//       ...provided,
//       maxHeight: "10.5rem",
//       overflowY: "auto", 
//       WebkitOverflowScrolling: "touch",
//     }),
//     menuPortal: (provided) => ({
//       ...provided,
//       zIndex: 9999,
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       fontSize: "0.75rem",
//       padding: "4px 8px",
//       backgroundColor: state.isSelected ? "#f0f0f0" : "#fff",
//       color: state.isSelected ? "#333" : "#000",
//       ":hover": {
//         backgroundColor: "#e6e6e6",
//       },
//     }),
//   };

//   return (
//     <div>
//       <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
//       <NotificationModal isOpen={notifyModal.isOpen} message={notifyModal.message} onClose={() => setNotifyModal({ isOpen: false, message: "" })} />
//       <ConfirmationModal
//         isOpen={confirmModal.isOpen}
//         title={confirmationTitleMap[confirmModal.action]}
//         message={confirmationMessageMap[confirmModal.action]}
//         loading={saving}
//         onConfirm={confirmAction}
//         onCancel={() => setConfirmModal({ isOpen: false, action: null })}
//       />

//       <div className="text-right">
//         <button className="bg-secondary text-white px-4 py-1 rounded text-xs hover:bg-secondary/90 transition" onClick={handleAddNew}>
//           Add Debtor
//         </button>
//       </div>

//       <div className="mt-2 bg-white rounded-lg shadow overflow-hidden">
//         {loading ? (
//           <p className="text-center py-4 text-gray-500">Loading...</p>
//         ) : (
//           <table className="w-full border-collapse">
//             <thead className="bg-gray-200 border-b-2 border-gray-100 font-bold text-xs text-secondary text-left">
//               <tr>
//                 <th className="px-4 py-3">NO</th>
//                 <th className="py-3">DEBTOR CODE</th>
//                 <th className="py-3">COMPANY NAME</th>
//                 <th className="py-3">DEBTOR TYPE CODE</th>
//                 <th className="py-3">MOBILE</th>
//                 <th className="py-3">ACTIONS</th>
//               </tr>
//             </thead>
//             <tbody>
//               {debtors.map((debtor, index) => (
//                 <tr key={debtor.debtorId} className="text-xs font-medium text-secondary border-gray-100">
//                   <td className="pl-4 p-2">
//                     {(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}
//                   </td>
//                   <td className="p-1">{debtor.debtorCode}</td>
//                   <td className="p-1">{debtor.companyName || "-"}</td>
//                   <td className="p-1">{getDebtorTypeLabel(debtor.debtorTypeId)}</td>
//                   <td className="p-1">{debtor.mobile || "-"}</td>
//                   <td className="p-1 flex space-x-1">
//                     <button className="text-blue-600 pl-0" onClick={() => handleOpenModal(debtor, "view")}><Eye size={14} /></button>
//                     <button className="text-yellow-500 pl-0" onClick={() => handleOpenModal(debtor, "edit")}><Pencil size={14} /></button>
//                     <button className="text-red-500 pl-0" onClick={() => handleDeleteClick(debtor.debtorId)}><Trash2 size={14} /></button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       <div className="flex justify-between p-4 text-xs text-secondary mt-4">
//         <span>
//           Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems}
//         </span>
//         <div className="flex">
//         <button
//           onClick={() => handlePageChange(pagination.currentPage - 1)}
//           disabled={pagination.currentPage === 1}
//           className={`px-2 py-1 bg-white border rounded ${
//             pagination.currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"
//           }`}
//         >
//           ←
//         </button>

//         <button
//           onClick={() => handlePageChange(pagination.currentPage + 1)}
//           disabled={pagination.currentPage * pagination.itemsPerPage >= pagination.totalItems}
//           className={`px-2 py-1 bg-white border rounded ${
//             pagination.currentPage * pagination.itemsPerPage >= pagination.totalItems
//               ? "opacity-50 cursor-not-allowed"
//               : "hover:bg-gray-100 cursor-pointer"
//           }`}
//         >
//           →
//         </button>
//         </div>
//       </div>

//       {selectedDebtor && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
//           <div className="bg-white w-full p-6 rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto text-secondary text-xs scrollbar-hide">
//             <h3 className="text-lg font-semibold mb-4">
//               {viewMode ? "View Debtor" : formAction === "edit" ? "Edit Debtor" : "Add Debtor"}
//             </h3>

//             <div className="grid grid-cols-5 gap-4">
//                 {[
//                   ["Debtor Code", "debtorCode"],
//                   ["Company Name", "companyName"],
//                 ].map(([label, key, disabled = false]) => (
//                   <div key={key}>
//                     <label className="block">{label}</label>
//                     <input
//                       type="text"
//                       value={selectedDebtor[key] || ""}
//                       onChange={(e) => handleInputChange(key, e.target.value)}
//                       readOnly={viewMode || disabled}
//                       className={`mt-1 w-full p-2 border rounded ${viewMode || disabled ? "bg-gray-100" : "bg-white"}`}
//                     />
//                   </div>
//                 ))}
                
//                 <div>
//                   <label className="block">Debtor Type Code</label>
//                   <Select
//                     options={debtorTypes.map((type) => ({
//                       value: type.debtorTypeId,
//                       label: type.debtorTypeCode
//                     }))}
//                     value={selectedDebtorType}
//                     isDisabled={viewMode}
//                     onChange={(selected) => {
//                       setSelectedDebtorType(selected);
//                       handleInputChange("debtorTypeId", selected ? selected.value : null);
//                     }}
//                     styles={customStyles}
//                     placeholder="Select"
//                     isSearchable={false} 
//                     isClearable
//                     classNames={{ menuList: () => "scrollbar-hide" }} menuPortalTarget={document.body} menuPosition="fixed" tabIndex={0}
//                   />
//                 </div>

//                 {[
//                   ["Mobile", "mobile"],
//                   ["Phone 1", "phone1"],
//                   ["Phone 2", "phone2"],
//                   ["Post Code", "postCode"],
//                   ["Address 1", "address1"],
//                   ["Address 2", "address2"],
//                   ["Address 3", "address3"],
//                   ["Address 4", "address4"],
//                   ["Medical Others", "medicalOthers"],
//                   ["Ocular Others", "ocularOthers"]
//                 ].map(([label, key, disabled = false]) => (
//                   <div key={key}>
//                     <label className="block">{label}</label>
//                     <input
//                       type="text"
//                       value={selectedDebtor[key] || ""}
//                       onChange={(e) => handleInputChange(key, e.target.value)}
//                       readOnly={viewMode || disabled}
//                       className={`mt-1 w-full p-2 border rounded ${viewMode || disabled ? "bg-gray-100" : "bg-white"}`}
//                     />
//                   </div>
//                 ))}

//                 {[
//                 ["Is Active", "isActive"],
//                 ["Diabetes", "medicalIsDiabetes"],
//                 ["Hypertension", "medicalIsHypertension"],
//                 ["Squint", "ocularIsSquint"],
//                 ["Lazy Eye", "ocularIsLazyEye"],
//                 ["Had Surgery", "ocularHasSurgery"]
//                 ].map(([label, key]) => (
//                 <div key={key} className="flex items-center space-x-2 mt-2">
//                     <label className="inline-block relative w-4 h-4">
//                     <input
//                         type="checkbox"
//                         checked={!!selectedDebtor[key]}
//                         disabled={viewMode}
//                         onChange={() => handleCheckboxChange(key)}
//                         className="peer sr-only"
//                     />
//                     <div
//                         className={`w-4 h-4 rounded border flex items-center justify-center 
//                         ${viewMode ? "cursor-default" : "cursor-pointer"} 
//                         ${selectedDebtor[key] ? "bg-secondary border-secondary" : "bg-white border-gray-300"}`}
//                     >
//                         {selectedDebtor[key] && (
//                         <svg
//                             className="w-3 h-3 text-white"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="3"
//                             viewBox="0 0 24 24"
//                         >
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                         </svg>
//                         )}
//                     </div>
//                     </label>
//                     <label>{label}</label>
//                 </div>
//                 ))}
//             </div>

//             <div className="mt-2 flex justify-end space-x-2">
//               {!viewMode && (
//                 <button
//                   className="px-4 py-1 rounded text-sm bg-green-500 text-white"
//                   onClick={() => {
//                     if (!selectedDebtor.debtorCode?.trim()) {
//                       setErrorModal({ title: "Validation Error", message: "Debtor Code is required." });
//                       return;
//                     }
//                     setConfirmModal({ isOpen: true, action: formAction });
//                   }}
//                 >
//                   Save
//                 </button>
//               )}
//               <button className="px-4 py-1 rounded text-sm bg-red-500 text-white" onClick={() => {setSelectedDebtor(null); setIsEditingEyePower(false); setEyePowerEditData(null);} }>Close</button>
//             </div>

//             <h3 className="border-b-2 text-left text-secondary font-semibold mt-2 mb-2">Service Records</h3>
//             {!viewMode && (
//               <div className="text-left">
//                 <button
//                   className="bg-secondary text-white px-3 py-1 rounded text-xs hover:bg-secondary/90 transition"
//                   onClick={handleAddEyePower}
//                 >
//                   Add Eye Power
//                 </button>
//               </div>
//             )}
//             <div className="mt-4 flex gap-4">
//               <div className="overflow-y-auto scrollbar-hide border rounded min-w-[350px] max-h-[500px] flex-auto">
//                 <table className="w-full text-xs">
//                   <thead className="bg-gray-100 text-secondary font-bold">
//                     <tr>
//                       <th className="p-2 text-left">No</th>
//                       <th className="p-2 text-left">Doc No</th>
//                       <th className="p-2 text-left">Date</th>
//                       <th className="p-2 text-left">Total</th>
//                       <th className="p-2 text-left">Recorded By</th>
//                       {!viewMode && (
//                       <th className="p-2 text-left">Action</th>
//                       )}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {eyePowerRecords.map((record, index) => (
//                       <tr
//                         key={record.eyeProfileId}
//                         className={`cursor-pointer hover:bg-gray-100 ${selectedEyeRecord?.eyeProfileId === record.eyeProfileId ? 'bg-gray-200' : ''}`}
//                         onClick={() => setSelectedEyeRecord(record)}
//                       >
//                         <td className="p-2">{index + 1}</td>
//                         <td className="p-2">{record.docNo ?? "-"}</td>
//                         <td className="p-2">{record.recordedDate?.slice(0, 10) || "-"}</td>
//                         <td className="p-2">{record.total ?? "-"}</td>
//                         <td className="p-2">{record.recordedBy ?? "-"}</td>
//                         {!viewMode && (
//                         <td className="p-2 text-red-500" 
//                         onClick={() => {
//                           setDeleteEyePowerId(record.eyeProfileId);
//                           setConfirmModal({
//                             isOpen: true,
//                             action: "deleteEyePower",
//                           });
//                         }}><Trash2 size={14} /></td>
//                         )}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               <div className="text-xs text-secondary max-w-[1100px] flex-auto text-left">
//                 {selectedEyeRecord ? (
//                   <div className="space-y-3">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label>Optical Height</label>
//                         <input
//                           value={isEditingEyePower ? eyePowerEditData?.opticalHeight ?? "" : selectedEyeRecord.opticalHeight ?? "-"}
//                           onChange={(e) => setEyePowerEditData(prev => ({ ...prev, opticalHeight: e.target.value }))}
//                           readOnly={!isEditingEyePower}
//                           className={`w-full border p-1 rounded ${isEditingEyePower ? "bg-white" : "bg-gray-100"}`}
//                         />
//                       </div>
//                       <div>
//                         <label>Segment Height</label>
//                         <input
//                           value={isEditingEyePower ? eyePowerEditData?.segmentHeight ?? "" : selectedEyeRecord.segmentHeight ?? "-"}
//                           onChange={(e) => setEyePowerEditData(prev => ({ ...prev, segmentHeight: e.target.value }))}
//                           readOnly={!isEditingEyePower}
//                           className={`w-full border p-1 rounded ${isEditingEyePower ? "bg-white" : "bg-gray-100"}`}
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 gap-4">
//                     {["latestRecords", "actualRecords", "lensRecords"].map((key) => {
//                       const profileKey = convertKey(key);
//                       const profileData = isEditingEyePower
//                         ? eyePowerEditData?.[profileKey]
//                         : selectedEyeRecord?.[key];

//                       if (!profileData) return null;

//                       return (
//                         <div key={key}>
//                           <h4 className="font-semibold">{recordTitles[key]}</h4>
//                           <table className="w-full table-fixed border border-gray-200 text-xs">
//                             <thead className="bg-gray-100">
//                               <tr>
//                                 <th className="p-1 w-[60px]">Eye</th>
//                                 {Object.keys(profileData)
//                                   .filter((k) => k.startsWith("r_"))
//                                   .map((k) => (
//                                     <th key={k} className="p-1 min-w-[60px]">
//                                       {k.replace("r_", "")}
//                                     </th>
//                                   ))}
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {["r_", "l_"].map((prefix) => (
//                                 <tr key={prefix}>
//                                   <td className="p-1 font-semibold">
//                                     {prefix === "r_" ? "Right" : "Left"}
//                                   </td>
//                                   {Object.entries(profileData)
//                                     .filter(([k]) => k.startsWith(prefix))
//                                     .map(([k, v]) => (
//                                       <td key={k} className="p-1 text-secondary">
//                                         {isEditingEyePower ? (
//                                           <input
//                                             value={eyePowerEditData?.[profileKey]?.[k] ?? ""}
//                                             onChange={(e) =>
//                                               setEyePowerEditData((prev) => ({
//                                                 ...prev,
//                                                 [profileKey]: {
//                                                   ...prev[profileKey],
//                                                   [k]: e.target.value,
//                                                 },
//                                               }))
//                                             }
//                                             className="w-full border bg-white text-secondary rounded"
//                                           />
//                                         ) : (
//                                           <span>
//                                             {v ?? "-"}
//                                           </span>
//                                         )}
//                                       </td>
//                                     ))}
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       );
//                     })}

//                       <div>
//                         <h4 className="font-semibold">Items Details</h4>
//                         <table className="w-full border">
//                           <thead className="bg-gray-100">
//                             <tr>
//                               <th className="p-1">Item Code</th>
//                               <th className="p-1">Desc</th>
//                               <th className="p-1">UOM</th>
//                               <th className="p-1">Qty</th>
//                               <th className="p-1">Unit Price</th>
//                               <th className="p-1">Discount</th>
//                               <th className="p-1">Subtotal</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {selectedEyeRecord.details?.map((d) => (
//                               <tr key={d.salesDetailId}>
//                                 <td className="p-1">{d.itemCode}</td>
//                                 <td className="p-1">{d.description}</td>
//                                 <td className="p-1">{d.uom}</td>
//                                 <td className="p-1">{d.qty}</td>
//                                 <td className="p-1">{d.unitPrice}</td>
//                                 <td className="p-1">{d.discount}</td>
//                                 <td className="p-1">{d.subTotal}</td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold">Payment History</h4>
//                         <table className="w-full border">
//                           <thead className="bg-gray-100">
//                             <tr>
//                               <th className="p-1">Doc No</th>
//                               <th className="p-1">Payment Date</th>
//                               <th className="p-1">Remark</th>
//                               <th className="p-1">Amount</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {selectedEyeRecord.paymentHistory?.map((p) => (
//                               <tr key={p.salesPaymentId}>
//                                 <td className="p-1">{p.docNo}</td>
//                                 <td className="p-1">{p.paymentDate?.slice(0, 19).replace("T", " ")}</td>
//                                 <td className="p-1">{p.remark}</td>
//                                 <td className="p-1">{p.amount}</td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="text-gray-500 text-sm">No record selected.</p>
//                 )}

//                 {!viewMode && (
//                   <div className="text-right space-x-2 mt-2">
//                     {!isEditingEyePower ? (
//                       <button
//                         className="px-4 py-1 border rounded text-sm bg-blue-100 text-blue-700 hover:bg-blue-200"
//                         onClick={handleEditEyePower}
//                       >
//                         Edit
//                       </button>
//                     ) : (
//                       <>
//                         <button
//                           className="px-4 py-1 border rounded text-sm bg-gray-300 hover:bg-gray-400"
//                           onClick={handleCancelEditEyePower}
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           className="px-4 py-1 border rounded text-sm bg-green-500 text-white hover:bg-green-600"
//                           onClick={handleSaveEyePower}
//                         >
//                           Save
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 )}

//                 {newEyePowerData && (
//                   <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center">
//                     <div className="bg-white rounded-lg shadow-lg p-4 w-[90vw] max-w-6xl max-h-[90vh] overflow-y-auto text-xs text-secondary">
//                       <h3 className="font-bold text-lg mb-2">Add Eye Power</h3>

//                       <div className="grid grid-cols-2 gap-4 mb-4">
//                         <div>
//                           <label>Optical Height</label>
//                           <input
//                             type="text"
//                             value={newEyePowerData.opticalHeight ?? ""}
//                             onChange={(e) =>
//                               setNewEyePowerData((prev) => ({ ...prev, opticalHeight: e.target.value }))
//                             }
//                             className="w-full border p-1 rounded bg-white text-secondary"
//                           />
//                         </div>
//                         <div>
//                           <label>Segment Height</label>
//                           <input
//                             type="text"
//                             value={newEyePowerData.segmentHeight ?? ""}
//                             onChange={(e) =>
//                               setNewEyePowerData((prev) => ({ ...prev, segmentHeight: e.target.value }))
//                             }
//                             className="w-full border p-1 rounded bg-white text-secondary"
//                           />
//                         </div>
//                         <div>
//                           <label className="pr-2">User Defined Time</label>
//                           <DatePicker
//                             selected={newEyePowerData.userDefinedTime}
//                             onChange={(date) =>
//                               setNewEyePowerData((prev) => ({ ...prev, userDefinedTime: date }))
//                             }
//                             showTimeSelect
//                             dateFormat="yyyy-MM-dd HH:mm:ss"
//                             className="w-full border p-1 rounded bg-white text-secondary"
//                           />
//                         </div>
//                       </div>

//                       {["lensProfile", "latestGlassProfile", "actualGlassProfile"].map((profileKey) => {
//                         const profileData = newEyePowerData?.[profileKey];
//                         const titleMap = {
//                           lensProfile: "Lens Profile",
//                           latestGlassProfile: "Latest Glass Profile",
//                           actualGlassProfile: "Actual Glass Profile",
//                         };

//                         if (!profileData) return null;

//                         return (
//                           <div key={profileKey} className="mb-4">
//                             <h4 className="font-semibold mb-1">{titleMap[profileKey]}</h4>
//                             <table className="w-full table-fixed border border-gray-200 text-xs">
//                               <thead className="bg-gray-100">
//                                 <tr>
//                                   <th className="p-1 w-[60px]">Eye</th>
//                                   {Object.keys(profileData)
//                                     .filter((k) => k.startsWith("r_"))
//                                     .map((k) => (
//                                       <th key={k} className="p-1 min-w-[60px]">
//                                         {k.replace("r_", "")}
//                                       </th>
//                                     ))}
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {["r_", "l_"].map((prefix) => (
//                                   <tr key={prefix}>
//                                     <td className="p-1 font-semibold">
//                                       {prefix === "r_" ? "Right" : "Left"}
//                                     </td>
//                                     {Object.entries(profileData)
//                                       .filter(([k]) => k.startsWith(prefix))
//                                       .map(([k]) => (
//                                         <td key={k} className="p-1 text-secondary">
//                                           <input
//                                             value={newEyePowerData?.[profileKey]?.[k] ?? ""}
//                                             onChange={(e) =>
//                                               setNewEyePowerData((prev) => ({
//                                                 ...prev,
//                                                 [profileKey]: {
//                                                   ...prev[profileKey],
//                                                   [k]: e.target.value,
//                                                 },
//                                               }))
//                                             }
//                                             className="w-full border bg-white text-secondary rounded"
//                                           />
//                                         </td>
//                                       ))}
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         );
//                       })}

//                       <div className="text-right space-x-2 mt-2">
//                         <button
//                           className="px-4 py-1 border rounded text-sm bg-gray-300 hover:bg-gray-400"
//                           onClick={() => setNewEyePowerData(null)}
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           className="px-4 py-1 border rounded text-sm bg-green-500 text-white hover:bg-green-600"
//                           onClick={handleSaveNewEyePower}
//                         >
//                           Save
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DebtorMaintenance;


import { useEffect, useState } from "react";
import {
  NewDebtor,
  EditDebtor,
  SaveDebtor,
  DeleteDebtor
} from "../../apiconfig";
import ErrorModal from "../../modals/ErrorModal";
import NotificationModal from "../../modals/NotificationModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import CustomerTableDataGrid from "../../Components/DataGrid/CustomerTableDataGrid";
import AddSupplierModal from "../../modals/MasterData/Supplier/AddSupplierModal";

const DebtorMaintenance = () => {
  const customerId = localStorage.getItem("customerId");
  const userId = localStorage.getItem("userId");
  const locationId = localStorage.getItem("locationId");

  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null });

  const [debtors, setDebtors] = useState([]);
  const [selectedDebtor, setSelectedDebtor] = useState(null);
  const [formAction, setFormAction] = useState(null);
  const [isUpdateModelOpen, setIsUpdateModelOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAddNew = async () => {
    try {
      const res = await fetch(NewDebtor, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: Number(customerId), userId, locationId, id: "" })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedDebtor(data.data);
        setFormAction("add");
        setIsUpdateModelOpen(true);
      } else throw new Error(data.errorMessage || "Failed to create new customer.");
    } catch (error) {
      setErrorModal({ title: "New Customer Error", message: error.message });
    }
  };

  const handleOpenModal = async (debtor, mode) => {
    if (mode === "edit") {
      try {
        const res = await fetch(EditDebtor, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId: Number(customerId), userId, locationId, id: debtor.debtorId })
        });
        const data = await res.json();
        if (data.success) {
          setSelectedDebtor(data.data);
          setFormAction("edit");
          setIsUpdateModelOpen(true);
        } else throw new Error(data.errorMessage || "Failed to fetch debtor data");
      } catch (error) {
        setErrorModal({ title: "Edit Error", message: error.message });
      }
    } else {
      setSelectedDebtor(location);
      setIsUpdateModelOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
    setConfirmModal({ isOpen: true, action: "delete" });
  };

  const confirmAction = async () => {
    setSaving(true);
    const action = confirmModal.action;
    setConfirmModal({ isOpen: false, action: null });

    try {
      if (action === "delete") {
        const res = await fetch(DeleteDebtor, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId: Number(customerId), userId, locationId, id: deleteTarget })
        });
        const data = await res.json();
        if (data.success) {
          setNotifyModal({ isOpen: true, message: "Customer deleted successfully!" });
          // fetchLocations();
        } else throw new Error(data.errorMessage || "Failed to delete customer.");
      } else {
        const res = await fetch(SaveDebtor, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionData: {
                customerId: Number(customerId),
                userId,
                locationId,
                id: selectedDebtor.debtorId || ""
            },
            debtorId: selectedDebtor.debtorId,
            debtorCode: selectedDebtor.debtorCode || "",
            companyName: selectedDebtor.companyName || "",
            debtorTypeId: selectedDebtor.debtorTypeId || "",
            isActive: !!selectedDebtor.isActive,
            address1: selectedDebtor.address1 || "",
            address2: selectedDebtor.address2 || "",
            address3: selectedDebtor.address3 || "",
            address4: selectedDebtor.address4 || "",
            postCode: selectedDebtor.postCode || "",
            phone1: selectedDebtor.phone1 || "",
            phone2: selectedDebtor.phone2 || "",
            mobile: selectedDebtor.mobile || "",
            medicalIsDiabetes: !!selectedDebtor.medicalIsDiabetes,
            medicalIsHypertension: !!selectedDebtor.medicalIsHypertension,
            medicalOthers: selectedDebtor.medicalOthers || "",
            ocularIsSquint: !!selectedDebtor.ocularIsSquint,
            ocularIsLazyEye: !!selectedDebtor.ocularIsLazyEye,
            ocularHasSurgery: !!selectedDebtor.ocularHasSurgery,
            ocularOthers: selectedDebtor.ocularOthers || ""
        })
        });
        const data = await res.json();
        if (data.success) {
          setNotifyModal({ isOpen: true, message: "Customer saved successfully!" });
          setSelectedDebtor(null);
          // fetchLocations();
        } else throw new Error(data.errorMessage || "Failed to save customer.");
      }
    } catch (error) {
      setErrorModal({ title: `${action === "delete" ? "Delete" : "Save"} Error`, message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseUpdateModal = async () =>{
    setIsUpdateModelOpen(false);
    setSelectedDebtor(null);
  };

  const confirmationTitleMap = {
    add: "Confirm Add",
    edit: "Confirm Edit",
    delete: "Confirm Delete"
  };

  const confirmationMessageMap = {
    add: "Are you sure you want to add this customer?",
    edit: "Are you sure you want to edit this customer?",
    delete: "Are you sure you want to delete this customer?"
  };

  return (
    <div>
      <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
      <NotificationModal isOpen={notifyModal.isOpen} message={notifyModal.message} onClose={() => setNotifyModal({ isOpen: false, message: "" })} />
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmationTitleMap[confirmModal.action]}
        message={confirmationMessageMap[confirmModal.action]}
        loading={saving}
        onConfirm={confirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, action: null })}
      />

      <AddSupplierModal
        selectedLocation={selectedDebtor}
        isEdit={formAction === "edit"}
        isOpen={isUpdateModelOpen}
        onConfirm={confirmAction}
        onError={setErrorModal}
        onClose={handleCloseUpdateModal}
      />

      <div className="text-right p-2">
        <button className="bg-secondary text-white px-4 py-1 rounded hover:bg-secondary/90 transition" onClick={handleAddNew}>
          Add Customer
        </button>
      </div>

      <div className="mt-2 bg-white h-[50vh] rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="text-center py-4 text-gray-500">Loading...</p>
        ) : (
          <CustomerTableDataGrid
            vustomerRecords={debtors}
            className={"p-2"}
            customerId={customerId}
            onError={setErrorModal}
            onDelete={handleDeleteClick}
            onEdit={handleOpenModal}
          >
          </CustomerTableDataGrid>

        )}
      </div>

    </div>
  );
};

export default DebtorMaintenance;
