import { useEffect, useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { GetAccessRightRecords } from "../apiconfig";
import ErrorModal from "../modals/ErrorModal";
import NotificationModal from "../modals/NotificationModal";

const AccessRightMaintenance = () => {
  const customerId = localStorage.getItem("customerId");
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ title: "", message: "" });
  const [notifyModal, setNotifyModal] = useState({ isOpen: false, message: "" });
  const [accessRights, setAccessRights] = useState([]);
  const [selectedAccessRight, setSelectedAccessRight] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [pagination, setPagination] = useState({
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
  });
  
    
  useEffect(() => {
    fetchAccessRights();
  }, [pagination.currentPage]);


  const fetchAccessRights = async () => {
    setLoading(true);
    const offset = (pagination.currentPage - 1) * pagination.itemsPerPage;

    const requestBody = {
      customerId: Number(customerId),
      keyword: "",
      offset,
      limit: pagination.itemsPerPage,
    };

    try {
      const res = await fetch(GetAccessRightRecords, {
        method: "POST",
        headers: { Accept: "text/plain", "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });
      const data = await res.json();
      if (data.success) {
        setAccessRights(data.data);
        setPagination((prev) => ({
        ...prev,
        totalItems: data.data.length,
      }));
    }
      else throw new Error(data.errorMessage || "Failed to fetch access rights.");
    } catch (error) {
      setErrorModal({ title: "Fetch Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(pagination.totalItems / pagination.itemsPerPage)) {
      setPagination((prev) => ({
        ...prev,
        currentPage: newPage,
      }));
    }
  };

  const handleOpenModal = (accessRight, mode) => {
    setSelectedAccessRight({ ...accessRight });
    setViewMode(mode === "view");
  };

  const handleCheckboxChange = (idx, actionType) => {
    const updated = { ...selectedAccessRight };
    updated.accessRightActions[idx][actionType] = !updated.accessRightActions[idx][actionType];
    setSelectedAccessRight(updated);
  };


  return (
    <div>
      <ErrorModal title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ title: "", message: "" })} />
      <NotificationModal isOpen={notifyModal.isOpen} message={notifyModal.message} onClose={() => setNotifyModal({ isOpen: false, message: "" })} />
      <style>
        {`
          button:hover {
            border-color: transparent !important;
          }
          button:focus, button:focus-visible {
            outline: none !important;
          }
        `}
      </style>

      <div className="text-right">
        <button
            className="bg-secondary text-white px-4 py-1 rounded text-xs hover:bg-secondary/90 transition"
            >
            Add User Role
        </button>
     </div>
      <div className="mt-2 bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="text-center py-4 text-gray-500">Loading...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 border-b-2 border-gray-100 font-bold text-xs text-secondary text-left">
              <tr>
                <th className="px-4 py-3">NO</th>
                <th className="px-4 py-3">USER ROLE</th>
                <th className="px-4 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {accessRights.map((accessRight, index) => (
                <tr key={accessRight.accessRightId} className="text-xs text-secondary border-gray-100 text-secondary">
                  <td className="pl-4 p-2">{index + 1}</td>
                  <td className="px-4 py-2">{accessRight.description}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                  <button className="text-blue-600 bg-transparent" onClick={() => handleOpenModal(accessRight, "view")}> <Eye size={16} /> </button>
                  <button className="text-yellow-500 bg-transparent" onClick={() => handleOpenModal(accessRight, "edit")}> <Pencil size={16} /> </button>
                    <button className="bg-transparent text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-between p-4 text-xs text-secondary mt-4">
        <span>
          Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
          {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
          {pagination.totalItems}
        </span>
        <div className="flex">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-2 py-1 bg-white border rounded disabled:opacity-50 cursor-not-allowed"
          >
            ←
          </button>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage * pagination.itemsPerPage >= pagination.totalItems}
            className="px-2 py-1 bg-white border rounded disabled:opacity-50 cursor-not-allowed"
          >
            →
          </button>
        </div>
      </div>

      {selectedAccessRight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto text-secondary text-xs">
            <h2 className="text-lg font-semibold mb-4">{viewMode ? "View" : "Edit"} Access Right</h2>
            <div className="mb-4">
              <label className="block mb-1">User Role</label>
              {viewMode ? (
                <div className="p-2 bg-gray-100 rounded">{selectedAccessRight.description}</div>
              ) : (
                <input type="text" value={selectedAccessRight.description} className="w-full p-2 border rounded bg-transparent" />
              )}
            </div>
            <div className="mb-2 font-semibold">Access Rights</div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Access</th>
                    <th className="p-2 text-center">View</th>
                    <th className="p-2 text-center">Add</th>
                    <th className="p-2 text-center">Edit</th>
                    <th className="p-2 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                {selectedAccessRight.accessRightActions.map((action, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{action.module}</td>
                      {['view', 'add', 'edit', 'delete'].map((type) => (
                        <td key={type} className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={action[type]}
                            disabled={viewMode}
                            onChange={() => handleCheckboxChange(idx, type)}
                            className="form-checkbox h-4 w-4 bg-white text-secondary border-gray-300 rounded focus:ring-secondary"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button className="px-4 py-1 bg-red-500 text-white text-sm rounded" onClick={() => setSelectedAccessRight(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessRightMaintenance;
