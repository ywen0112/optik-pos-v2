import { useEffect, useState } from "react";

const UpdatelocationModal = ({
  selectedLocation,
  isEdit,
  Open,
  onConfirm,
  onError,
  onClose
}) => {
  const [newLocation, setLocation] = useState({});

  // ✅ Initialize newLocation when modal opens or selectedLocation changes
  useEffect(() => {
    if (Open) {
      setLocation(isEdit ? selectedLocation : {
        isActive: true,
        isDefault: false,
        locationCode: '',
        description: ''
      });
    }
  }, [Open, selectedLocation, isEdit]);

  if (!Open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
        <div className="bg-white h-max p-6 rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-y-auto text-secondary">
          <h3 className="font-semibold mb-4">
            {isEdit ? "Edit Location" : "Add Location"}
          </h3>

          <div className="grid grid-cols-1 gap-1">
            <div className="flex flex-row">
              <input
                type="checkbox"
                checked={newLocation.isActive ?? false}
                className="mr-2"
                onChange={(e) =>
                  setLocation({ ...newLocation, isActive: e.target.checked })
                }
              />
              <label>Active</label>
            </div>
            <div className="flex flex-row">
              <input
                type="checkbox"
                checked={newLocation.isDefault ?? false}
                className="mr-2"
                onChange={(e) =>
                  setLocation({ ...newLocation, isDefault: e.target.checked })
                }
              />
              <label>Default</label>
            </div>

            <label>Location Code</label>
            <input
              type="text"
              placeholder="Location Code"
              value={newLocation.locationCode || ''}
              onChange={(e) =>
                setLocation({ ...newLocation, locationCode: e.target.value })
              }
              className="mr-2 border w-1/2 h-[40px] px-2"
            />

            <label>Description</label>
            <input
              type="text"
              placeholder="Description"
              value={newLocation.description || ''}
              onChange={(e) =>
                setLocation({ ...newLocation, description: e.target.value })
              }
              className="mr-2 border w-1/2 h-[40px] px-2"
            />
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <button
              className="px-4 py-1 rounded text-sm bg-green-500 text-white"
              onClick={() => {
                if (!newLocation.locationCode?.trim()) {
                  onError({
                    title: "Validation Error",
                    message: "Location Code is required."
                  });
                  return;
                }
                onConfirm({ isOpen: true, action: isEdit ? "edit" : "add", data: newLocation });
              }}
            >
              Save
            </button>
            <button
              className="px-4 py-1 rounded text-sm bg-red-500 text-white"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdatelocationModal;
