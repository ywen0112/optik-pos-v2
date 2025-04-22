import { useEffect, useState } from "react";
import { X } from 'lucide-react';

const AddSupplierModal = ({
  selectedSupplier,
  isEdit,
  isOpen,
  onConfirm,
  onError,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    isActive: true,
    customerCode: "",
    name: "",
    ic: "",
    dob: "",
    billingAddress: "",
    remark: "",
    phone1: "",
    phone2: "",
    email: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(
        isEdit && selectedSupplier
          ? selectedSupplier
          : {
              isActive: true,
              customerCode: "",
              name: "",
              ic: "",
              dob: "",
              billingAddress: "",
              remark: "",
              phone1: "",
              phone2: "",
              email: "",
            }
      );
    }
  }, [isOpen, selectedSupplier, isEdit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-y-auto text-secondary">
      <div className="flex flex-row justify-between">
            <h3 className="font-semibold mb-4">
                {isEdit ? "Edit Supplier" : "Add Supplier"}
            </h3>
            <div className='col-span-4' onClick={onClose}>
                <X size={20} />
            </div>
        </div>

        <div className="grid grid-cols-4 gap-1">
          <div className="col-span-4 flex justify-between items-center">
              <label className="block">Customer Code</label>
              <div className="flex items-center space-x-2">
                  <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                  }
                  />
                  <label>Active</label>
              </div>
              </div>

              <div className="col-span-2">
              <input
                  type="text"
                  className="mr-2 border w-full h-[40px] px-2"
                  placeholder="Customer Code"
                  value={formData.customerCode}
                  onChange={(e) =>
                  setFormData({ ...formData, customerCode: e.target.value })
                  }
              />
          </div>

          <div className="col-span-4 mt-2">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              className="mr-2 border w-full h-[40px] px-2"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="col-span-2 mt-2">
            <label className="block mb-2">IC</label>
            <input
              type="text"
              className="mr-2 border w-full h-[40px] px-2"
              placeholder="IC"
              value={formData.ic}
              onChange={(e) =>
                setFormData({ ...formData, ic: e.target.value })
              }
            />
          </div>

          <div className="col-span-2 mt-2">
            <label className="block mb-2">D.O.B</label>
            <input
              type="date"
              className="mr-2 border w-full h-[40px] px-2"
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
            />
          </div>

          <div className="col-span-2 mt-2">
            <label className="block mb-2">Billing Address</label>
            <textarea
              rows={4}
              className="mr-2 border w-full h-[80px] px-2 py-1"
              placeholder="Billing Address"
              value={formData.billingAddress}
              onChange={(e) =>
                setFormData({ ...formData, billingAddress: e.target.value })
              }
            />
          </div>

          <div className="col-span-2 mt-2">
            <label className="block mb-2">Remark</label>
            <textarea
              rows={4}
              className="mr-2 border w-full h-[80px] px-2 py-1"
              placeholder="Remark"
              value={formData.remark}
              onChange={(e) =>
                setFormData({ ...formData, remark: e.target.value })
              }
            />
          </div>

          <div className="col-span-1 mt-2">
            <label className="block mb-2">Phone</label>
            <input
              type="text"
              className="mr-2 border w-full h-[40px] px-2"
              placeholder="Phone"
              value={formData.phone1}
              onChange={(e) =>
                setFormData({ ...formData, phone1: e.target.value })
              }
            />
          </div>

          <div className="col-span-1 mt-2">
            <label className="block mb-2">Phone 2</label>
            <input
              type="text"
              className="mr-2 border w-full h-[40px] px-2"
              placeholder="Phone 2"
              value={formData.phone2}
              onChange={(e) =>
                setFormData({ ...formData, phone2: e.target.value })
              }
            />
          </div>

          <div className="col-span-2 mt-2">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              className="mr-2 border w-full h-[40px] px-2"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
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

export default AddSupplierModal;
