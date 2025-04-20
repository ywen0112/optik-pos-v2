import { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GetUsers, GetAllAuditChangeType, GetAuditLog } from "../api/apiconfig";
import ErrorModal from "../modals/ErrorModal";
import { GetUserRecords } from "../api/userapi";
import { GetAllChangeTyp, GetAuditLogs } from "../api/auditlogapi";

const AuditLogs = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [eventType, setEventType] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString());
  const [endDate, setEndDate] = useState(new Date().toISOString());
  const [eventOptions, setEventOptions] = useState([]);
  const [loadingEventTypes, setLoadingEventTypes] = useState(false);
  const [pagination, setPagination] = useState({ offset: 0, limit: 10, page: 1 });
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const companyId = sessionStorage.getItem("companyId");

  const [errorModal, setErrorModal] = useState({ title: "", message: "" });

  useEffect(() => {
    fetchUsers();
    fetchEventTypes();
  }, []);

  const fetchUsers = async () => {
    try{
    const data = await GetUserRecords({
      companyId: companyId,
      keyword: "",
      offset: 0,
      limit: 9999,
    });
    if (data.success) {
      const options = data.data.userRecords?.map((agent) => ({
        value: agent.userId,
        label: agent.userName
      }));
      setUsers(options);
    } else {
        throw new Error(data.errorMessage || "Failed to fetch usert.");
      }
    } catch (error) {
      setErrorModal({ title: "Fetch Error", message: error.message });
    }
  };

  const fetchEventTypes = async () => {
    setLoadingEventTypes(true);
    try {
      
      const data = await GetAllChangeTyp({
        companyId: companyId,
      });
      if (data.success) {
        const formatted = data.data.map((type) => ({
          value: type,
          label: type,
        }));
        setEventOptions(formatted);
      } else {
        console.error("Failed to fetch event types:", data.errorMessage);
      }
    } catch (err) {
      console.error("Error fetching event types:", err);
    } finally {
      setLoadingEventTypes(false);
    }
  };

  const fetchAuditLogs = async () => {
    setLoading(true);
    const now = new Date();
    const offsetMillis = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now - offsetMillis).toISOString().slice(0, 19);

    try {
      const data = await GetAuditLogs({
        companyId: companyId,
        fromDate: startDate ? new Date(startDate).toISOString() : null,
        toDate: endDate ? new Date(endDate).toISOString() : localISOTime,
        userId: selectedUser?.value  || "",
        eventType: eventType?.value || "",
        keyword: "",
        offset: pagination.offset,
        limit: pagination.limit,
      });
      if (data.success) {
        setAuditLogs(data.data || []);
      } else {
        throw new Error(data.errorMessage || "Failed to fetch audit logs.");
      }
    } catch (err) {
      setErrorModal({ title: "Fetch Logs Error", message: err.message });
    } finally {
      setLoading(false); 
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, offset: 0, page: 1 });
    fetchAuditLogs();
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "1px solid #ccc",
      padding: "0px",
      fontSize: "0.75rem",
      width: "100%",
      minHeight: "0.5rem",
      backgroundColor: state.isDisabled ? "#f9f9f9" : "white",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
    }),
    input: (provided) => ({
      ...provided,
      fontSize: "0.75rem",
      padding: "0px",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "0.75rem",
      padding: "0px",
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: "0.75rem",
      zIndex: 9999,
      position: "absolute",
      maxHeight: "10.5rem",
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      pointerEvents: "auto",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "10.5rem",
      overflowY: "auto", 
      WebkitOverflowScrolling: "touch",
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "0.75rem",
      padding: "4px 8px",
      backgroundColor: state.isSelected ? "#f0f0f0" : "#fff",
      color: state.isSelected ? "#333" : "#000",
      ":hover": {
        backgroundColor: "#e6e6e6",
      },
    }),
  };

  return (
    <div className="flex flex-col h-[calc(95vh-50px)] p-6 bg-white rounded shadow-md w-full mx-auto">
    <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sticky top-0 z-10 bg-white pb-2">
        <div className="flex flex-col">
          <label className="text-secondary font-semibold">User</label>
          <Select
            value={selectedUser}
            onChange={setSelectedUser}
            options={users}
            styles={customStyles}
            placeholder="Select User"
            isClearable
            classNames={{ menuList: () => "scrollbar-hide" }} menuPortalTarget={document.body} menuPosition="fixed" tabIndex={0}
            />
        </div>

        <div className="flex flex-col">
          <label className="text-secondary font-semibold">Event Type</label>
          <Select
            value={eventType}
            onChange={setEventType}
            options={eventOptions}
            styles={customStyles}
            placeholder={loadingEventTypes ? "Loading..." : "Select Event"}
            isLoading={loadingEventTypes}
            isClearable
            classNames={{ menuList: () => "scrollbar-hide" }} menuPortalTarget={document.body} menuPosition="fixed" tabIndex={0}
            />
        </div>

        <div className="flex flex-col">
          <label className="text-secondary font-semibold">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            className="p-2 text-xs border border-gray-300 rounded w-full bg-white text-secondary"
          />
        </div>

        <div className="flex flex-col">
          <label className=" text-secondary font-semibold">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            className="p-2 text-xs border border-gray-300 rounded w-full bg-white text-secondary"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSearch}
          disabled={loading}
          className={`bg-primary text-white px-4 py-1 rounded transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-90"
          }`}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {auditLogs.length > 0 && (
        <div className="flex-1 overflow-y-auto mt-2 border-t-2 pr-2 space-y-4">
          {auditLogs.map((log) => (
            <div
              key={log.auditLogId}
              className="border-l-4 border-primary pl-4 py-2 relative"
            >
              <div className="text-xs text-gray-500 mb-1">
                {new Date(log.auditChangeTime).toLocaleString()}
              </div>
              <div className="text-sm font-medium text-gray-800">{log.auditContent}</div>
              {log.auditContentDetails && (
                <div className="text-xs text-gray-500">{log.auditContentDetails}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AuditLogs;
