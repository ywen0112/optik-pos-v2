import { useEffect, useState } from "react";
import { X, Plus } from 'lucide-react';

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
    monthlyNumbers: [],
  });

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const getCurrentYear = () => new Date().getFullYear();

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        ...selectedFormat,
        monthlyNumbers: selectedFormat?.monthlyNumbers?.length
          ? selectedFormat.monthlyNumbers
          : [{ year: getCurrentYear(), months: Array(12).fill(1) }],
      }));
    }
  }, [isOpen, selectedFormat, isEdit]);


  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        ...selectedFormat,
        monthlyNumbers: selectedFormat?.monthlyNumbers || [],
      }));
    }
  }, [isOpen, selectedFormat]);

  const addRow = () => {
    const newRow = {
      year: getCurrentYear(),
      months: Array(12).fill(1),
    };
    setFormData(prev => ({
      ...prev,
      monthlyNumbers: [...(prev.monthlyNumbers || []), newRow],
    }));
  };

  const updateMonthValue = (rowIndex, monthIndex, value) => {
    const updatedRows = [...formData.monthlyNumbers];
    updatedRows[rowIndex].months[monthIndex] = parseInt(value) || 0;
    setFormData({ ...formData, monthlyNumbers: updatedRows });
  };

  const updateYearValue = (rowIndex, value) => {
    const updatedRows = [...formData.monthlyNumbers];
    updatedRows[rowIndex].year = parseInt(value) || getCurrentYear();
    setFormData({ ...formData, monthlyNumbers: updatedRows });
  };

  const deleteRow = (rowIndex) => {
    const updatedRows = formData.monthlyNumbers.filter((_, idx) => idx !== rowIndex);
    setFormData({ ...formData, monthlyNumbers: updatedRows });
  };

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

          <div className="col-span-4 mt-2">
            <label className="block mb-2">Next Number</label>
            <input
              type="number"
              min="0"
              className="mr-2 border w-1/2 h-[40px] px-2"
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

          <div className="col-span-2 mt-2">
            <label className="block mb-2">Sample</label>
            <input
              type="text"
              className="mr-2 border w-full h-[40px] px-2 bg-gray-200"
              value={formData.sample}
              readOnly
            />
            <label className="block mb-2 text-gray-400">CS-2504-001&gt;</label>
          </div>

          <div className="col-span-4 mt-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.oneMonthOneSet}
                onChange={(e) => setFormData({ ...formData, oneMonthOneSet: e.target.checked })}
              />
              <label>Each month with different running set number</label>
            </div>
            <small className="text-gray-500">
              Hint: Format like PV-@yyyyMM-&lt;0000&gt;
            </small>
          </div>
        </div>

        {/* Table */}
        {formData.oneMonthOneSet && (
          <div className="mt-4 overflow-x-auto">
            <button onClick={addRow} className="mt-2 flex items-center gap-1 px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200">
              <Plus size={16} />
            </button>
            <table className="w-full text-center border border-collapse">
              <thead>
                <tr className="bg-primary text-secondary">
                  <th className="border px-2 py-1">Year</th>
                  {months.map((m, i) => (
                    <th key={i} className="border px-2 py-1">{m}</th>
                  ))}
                  <th className="border px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.monthlyNumbers.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="p-1">
                      <input
                        type="number"
                        value={row.year}
                        onChange={(e) => updateYearValue(rowIndex, e.target.value)}
                        className="w-[60px] px-1 text-center"
                      />
                    </td>
                    {row.months.map((value, monthIndex) => (
                      <td key={monthIndex} className="p-1">
                        <input
                          type="number"
                          min="0"
                          className="w-[30px] px-1 text-center"
                          value={value}
                          onChange={(e) => updateMonthValue(rowIndex, monthIndex, e.target.value)}
                        />
                      </td>
                    ))}
                    <td className="border p-1">
                      <button onClick={() => deleteRow(rowIndex)} className="text-blue-600 underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
