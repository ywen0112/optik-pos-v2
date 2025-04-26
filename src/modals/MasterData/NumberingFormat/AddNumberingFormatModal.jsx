import { useEffect, useState } from "react";
import { X, Plus } from 'lucide-react';
import DocNoYearlyNumberingDataGrid from "../../../Components/DataGrid/DocNoYearlyNumberingDataGrid";
import { GetMonthlyNo } from "../../../api/maintenanceapi";

const AddNumberingFormatModal = ({
  selectedFormat,
  isEdit,
  isOpen,
  onConfirm,
  onError,
  onClose,
}) => {
  const [formData, setFormData] = useState(null);

  useEffect(()=>{
    setFormData(selectedFormat);
  },[isOpen])

  const getCurrentYear = () => new Date().getFullYear();
 
  const addRow = async () => {
    const newByMonths = await GetMonthlyNo({});
    const lastRow = formData.docNoFormatYearlyNumbers[formData.docNoFormatYearlyNumbers.length -1];
    const newYear = lastRow ? lastRow.year +1 : getCurrentYear();
    newByMonths.data.year = newYear;
    setFormData(prev => ({
      ...prev,
      docNoFormatYearlyNumbers: [...(prev.docNoFormatYearlyNumbers || []), newByMonths.data],
    }));
  }; 

 
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-y-auto text-secondary">
      <div className="flex flex-row justify-between">
            <h3 className="font-semibold mb-4">
                {isEdit ? "Edit Numbering Format" : "New Numbering Format"}
            </h3>
            <div className='col-span-4' onClick={onClose}>
                <X size={20} />
            </div>
        </div>

        <div className="grid grid-cols-4 gap-1">
          <div className="col-span-4 mt-2">
            <label className="block mb-2">Doc Type</label>
            <input
              type="text"
              className="mr-2 border w-full h-[40px] px-2 bg-gray-200"
              placeholder="Doc Type"
              value={formData?.docType}
              readOnly
            />
          </div>

          <div className="col-span-2 mt-2">
            <label className="block mb-2">Next Number</label>
            <input
              type="number"
              step="1" 
              min="0"
              className="mr-2 border w-full h-[40px] px-2"
              value={formData?.nextNumber}
              onChange={(e) => {
                const intValue = e.target.value.replace(/[^0-9]/g, ''); // remove non-numeric
                setFormData({ ...formData, nextNo: intValue });
              }}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, ''); // block typing non-digit
              }}
              onWheel={(e) => e.target.blur()} // prevent scroll to change
            />
          </div>

          <div className="col-span-2 mt-2">
            <label className="block mb-2">Format</label>
            <input
              type="text"
              className="mr-2 border w-full h-[40px] px-2"
              value={formData?.format}
              onChange={(e) =>
                setFormData({ ...formData, format: e.target.value })
              }
            />
            <label className="block mb-2 text-gray-400">CS-&lt;@yymm&gt;-&lt;000&gt;</label>
            </div>

          <div className="col-span-4 mt-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData?.oneMonthOneSet}
                onChange={(e) => setFormData({ ...formData, oneMonthOneSet: e.target.checked })}
              />
              <label>Each month with different running set number</label>
            </div>
            <small className="text-gray-500">
              Hint: Format like PV-@yyyyMM-&lt;0000&gt;
            </small>
          </div>
        </div>

        <div className={`mt-4 overflow-x-auto ${!formData?.oneMonthOneSet ? "opacity-50 pointer-events-none" : ""}`}>
        <button
          onClick={addRow}
          className="mt-2 flex items-center gap-1 px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 mb-4"
          disabled={!formData?.oneMonthOneSet}
        >
          <Plus size={16} />
        </button>

        {/* <table className="w-full text-center border border-collapse">
          <thead>
            <tr className="bg-secondary text-white">
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
                  step="1"
                  min="0"
                  value={row.year}
                  onChange={(e) => updateYearValue(rowIndex, e.target.value)}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ''); 
                  }}
                  className="w-[60px] px-1 text-center"
                  disabled={!formData.oneMonthOneSet}
                  onWheel={(e) => e.target.blur()}
                />
                </td>
                {row.months.map((value, monthIndex) => (
                  <td key={monthIndex} className="p-1">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={value}
                      onChange={(e) => updateMonthValue(rowIndex, monthIndex, e.target.value)}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      }}
                      className="w-[30px] px-1 text-center"
                      disabled={!formData.oneMonthOneSet}
                      onWheel={(e) => e.target.blur()}
                    />
                  </td>
                ))}
                <td className="border p-1">
                  <button
                    onClick={() => deleteRow(rowIndex)}
                    className={`underline ${formData.oneMonthOneSet ? "text-blue-600" : "text-gray-400"}`}
                    disabled={!formData.oneMonthOneSet}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}

        <DocNoYearlyNumberingDataGrid
          data = {formData?.docNoFormatYearlyNumbers}
        />
      </div>

        <div className="mt-6 flex justify-end space-x-2">
        <button
                className="bg-red-600 text-white w-36 px-4 py-2 rounded hover:bg-red-700"
                onClick={onClose}
            >
                Cancel
            </button>
            <button
              className="bg-primary text-white w-36 px-4 py-2 rounded hover:bg-primary/90"
              onClick={() => {
                if (!formData?.format?.trim()) {
                  onError({
                    title: "Validation Error",
                    message: "format is required.",
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
