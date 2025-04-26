import { useEffect, useState } from "react";
import { X } from 'lucide-react';

const AddNumberingFormatModal = ({
  selectedFormat,
  isEdit,
  isOpen,
  onConfirm,
  onError,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    isDefault: true,
    name: "",
    docType: "",
    nextNo: "",
    numberingFormat: "",
    sample: "",
    oneMonthOneSet: false,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(
        isEdit && selectedFormat
          ? selectedFormat
          : {
            isDefault: true,
            name: "",
            docType: "",
            nextNo: "",
            numberingFormat: "",
            sample: "",
            oneMonthOneSet: false,
            }
      );
    }
  }, [isOpen, selectedFormat, isEdit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-y-auto text-secondary">
      <div className="flex flex-row justify-between">
            <h3 className="font-semibold mb-4">
                {isEdit ? "Edit Numbering Format" : "Add Numbering Format"}
            </h3>
            <div className='col-span-4' onClick={onClose}>
                <X size={20} />
            </div>
        </div>

        <div className="grid grid-cols-4 gap-1">
            <div className="col-span-4 mt-2">
              <div className="flex items-center space-x-2">
                  <input
                  type="checkbox"
                  checked={formData.isDefault}
                  readOnly
                  className="bg-gray-200"
                  />
                  <label>Default</label>
              </div>
            </div>

          <div className="col-span-2 mt-2">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              className="mr-2 border w-full h-[40px] px-2 bg-gray-200"
              placeholder="Name"
              value={formData.name}
              readOnly
            />
          </div>

          <div className="col-span-2 mt-2">
            <label className="block mb-2">Doc Type</label>
            <input
              type="text"
              className="mr-2 border w-full h-[40px] px-2 bg-gray-200"
              placeholder="Doc Type"
              value={formData.docType}
              readOnly
            />
          </div>

          <div className="col-span-2 mt-2">
            <label className="block mb-2">Next Number</label>
            <input
              type="number"
              min="0"
              className="mr-2 border w-full h-[40px] px-2"
              value={formData.nextNo}
              onChange={(e) =>
                setFormData({ ...formData, nextNo: e.target.value })
              }
            />
          </div>

          <div className="col-span-2 mt-2">
            <label className="block mb-2">Format</label>
            <input
              type="text"
              className="mr-2 border w-full h-[40px] px-2"
              value={formData.numberingFormat}
              onChange={(e) =>
                setFormData({ ...formData, numberingFormat: e.target.value })
              }
            />
            <label className="block mb-2 text-gray-400">CS-&lt;@yymm&gt;-&lt;000&gt;</label>
            </div>

          <div className="col-span-4 mt-2">
              <div className="flex items-center space-x-2">
                  <input
                  type="checkbox"
                  checked={formData.oneMonthOneSet}
                  onChange={(e) =>
                    setFormData({ ...formData, oneMonthOneSet: e.target.value })
                  }
                  />
                  <label>Each month with different running set number</label>
              </div>
            </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
        <button
                className="bg-red-600 text-white w-36 px-4 py-2 rounded hover:bg-red-700"
                onClick={onClose}
            >
                Close
            </button>
            <button
                className="bg-primary text-white w-36 px-4 py-2 rounded hover:bg-primary/90"
                onClick={() => {
                if (!formData.customerCode.trim()) {    
                    onError({
                    title: "Validation Error",
                    message: "Customer Code is required.",
                    });
                    return;
                }
                onConfirm({
                    isOpen: true,
                    action: isEdit ? "edit" : "add",
                    data: formData,
                });
                }}
            >
                Save
            </button>
        </div>
      </div>
    </div>
  );
};

export default AddNumberingFormatModal;
