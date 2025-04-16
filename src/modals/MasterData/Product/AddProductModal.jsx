import { DropDownBox } from 'devextreme-react';
import { DollarSign, Percent, X } from 'lucide-react';
import { useCallback, useState } from 'react'
import DataGrid, {
    Selection,
    Paging,
    Scrolling,
    SearchPanel,
    Column
} from "devextreme-react/data-grid";

import Switch from "react-switch"

const productTypeOptions = [
    { id: 1, name: "abc" },
    { id: 2, name: "bcd" },
    { id: 3, name: "cde" },
    { id: 4, name: "def" }
]

const UpdateProductModal = ({
    isOpen,
    isEdit,
    handleClose
}) => {
    const [productCode, setProductCode] = useState("");
    const [productType, setProductType] = useState({ id: null, name: "" });
    const [productTypeList, setProductTypeList] = useState(productTypeOptions)
    const [isTypeBoxOpened, setIsTypeBoxOpened] = useState(false);
    const [productGroup, setProductGroup] = useState({ id: null, name: "" });
    const [isGroupBoxOpened, setIsGroupBoxOpened] = useState(false);
    const [productName, setProductName] = useState("");
    const [productDesc, setProductDesc] = useState("");
    const [productUOM, setProductUOM] = useState("");
    const [productPrice, setProductPrice] = useState(null);
    const [productMinPrice, setProductMinPrice] = useState(null);
    const [productCost, setProductCost] = useState(null);
    const [productBarcode, setProductBarcode] = useState("");
    const [productCommissionValue, setProductCommissionValue] = useState(null);
    const [productRemark, setProductRemark] = useState("");
    const [commissionPercentage, setCommissionPercentage] = useState(true);
    const [hasCommission, setHasCommission] = useState(false);
    const [isActive, setIsActive] = useState(true);

    const handleTypeSelection = useCallback((e) => {
        const selected = e.selectedRowsData?.[0];
        if (selected) {
            setProductType(selected);
            setIsTypeBoxOpened(false);
        }
    }, [productType])

    const ProductTypeGridRender = useCallback(() => (
        <DataGrid
            dataSource={productTypeList}
            keyExpr="id"
            showBorders={true}
            hoverStateEnabled
            selectedRowKeys={[productType?.id]}
            onSelectionChanged={handleTypeSelection}
            height="100%"
        >
            <Selection mode="single" />
            <Scrolling mode="virtual" />
            <Paging enabled pageSize={5} />
            <SearchPanel visible highlightSearchText />
            <Column dataField="name" caption="Type" />
        </DataGrid>
    ), [productType, handleTypeSelection]);

    const handleGroupSelection = useCallback((e) => {
        const selected = e.selectedRowsData?.[0];
        if (selected) {
            setProductGroup(selected);
            setIsGroupBoxOpened(false);
        }
    }, [productType])

    const ProductGroupGridRender = useCallback(() => (
        <DataGrid
            dataSource={productTypeList}
            keyExpr="id"
            showBorders={true}
            hoverStateEnabled
            selectedRowKeys={[productGroup?.id]}
            onSelectionChanged={handleGroupSelection}
            height="100%"
        >
            <Selection mode="single" />
            <Scrolling mode="virtual" />
            <Paging enabled pageSize={5} />
            <SearchPanel visible highlightSearchText />
            <Column dataField="name" caption="Type" />
        </DataGrid>
    ), [productType, handleGroupSelection]);


    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full overflow-y-auto text-secondary text-xs">
                    <div className="flex flex-row justify-between">
                        <h3 className="text-lg font-semibold mb-4">
                            {isEdit ? "Edit Product" : "Add Product"}
                        </h3>
                        <div className='col-span-4' onClick={handleClose}>
                            <X size={20} />
                        </div>
                    </div>



                    <div className="grid grid-cols-4 gap-4 text-[13.3px]">

                        <div className="flex flex-col">
                            <div>Product Code</div>
                            <input
                                type="text"
                                placeholder="Product Code"
                                value={productCode}
                                onChange={(e) => setProductCode(e.target.value)}
                                className="mr-2 mt-2 border w-full h-[40px] px-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <div>Product Type</div>
                            <DropDownBox
                                value={productType?.id}
                                placeholder='Product Type'
                                displayExpr="name"
                                valueExpr="id"
                                opened={isTypeBoxOpened}
                                onOptionChanged={(e) => {
                                    if (e.name === "opened") {
                                        setIsTypeBoxOpened(e.value);
                                    }
                                }}
                                contentRender={ProductTypeGridRender}
                                className="border mt-2 rounded px-2 py-1 bg-white w-full"
                                dataSource={productTypeList}
                            />
                        </div>
                        <div className="flex flex-col">
                            <div>Product Group</div>
                            <DropDownBox
                                value={productGroup?.id}
                                placeholder='Product Group'
                                displayExpr="name"
                                valueExpr="id"
                                opened={isGroupBoxOpened}
                                onOptionChanged={(e) => {
                                    if (e.name === "opened") {
                                        setIsGroupBoxOpened(e.value);
                                    }
                                }}
                                contentRender={ProductGroupGridRender}
                                className="border mt-2 rounded px-2 py-1 bg-white w-full"
                                dataSource={productTypeList}
                            />
                        </div>
                        <div className="flex flex-row justify-center">
                        <input
                                    type="checkbox"
                                    checked={isActive}
                                    className="ml-2"
                                    onChange={(e) =>
                                        setIsActive(e.target.checked)
                                    }
                                />
                            <div className='flex items-center'>Active</div>

                        </div>
                        <div className="flex flex-col col-span-2">
                            <div>Product Name</div>
                            <input
                                type="text"
                                placeholder="Product Name"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                className="mr-2 mt-2 border w-full h-[40px] px-2"
                            />
                        </div>
                        <div className="flex flex-col col-span-2">
                            <div>Description</div>
                            <input
                                type="text"
                                placeholder="Product Description"
                                value={productDesc}
                                onChange={(e) => setProductDesc(e.target.value)}
                                className="mr-2 mt-2 border w-full h-[40px] px-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <div>UOM</div>
                            <input
                                type="text"
                                placeholder="Product UOM"
                                value={productUOM}
                                onChange={(e) => setProductUOM(e.target.value)}
                                className="mr-2 mt-2 border w-full h-[40px] px-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <div>Price</div>
                            <input
                                type="number"
                                placeholder="Product Price"
                                step="0.01"
                                value={productPrice}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                                        setProductPrice(val);
                                    }
                                }}
                                className="mr-2 mt-2 border w-full h-[40px] px-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <div>Min Price</div>
                            <input
                                type="number"
                                placeholder="Min Price"
                                step="0.01"
                                value={productMinPrice}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                                        setProductMinPrice(val);
                                    }
                                }}
                                className="mr-2 mt-2 border w-full h-[40px] px-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <div>Cost</div>
                            <input
                                type="number"
                                placeholder="Cost"
                                step="0.01"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                                        setProductCost(val);
                                    }
                                }}
                                value={productCost}
                                className="mr-2 mt-2 border w-full h-[40px] px-2"
                            />
                        </div>
                        <div className="flex flex-col col-span-2">
                            <div>Barcode</div>
                            <input
                                type="text"
                                placeholder="Product Barcode"
                                value={productBarcode}
                                onChange={(e) => setProductBarcode(e.target.value)}
                                className="mr-2 mt-2 border w-full h-[40px] px-2"
                            />
                        </div>

                        <div className="flex flex-col col-span-2">
                            <div className='flex flex-row'>
                                <div>Commission</div>
                                <input
                                    type="checkbox"
                                    checked={hasCommission}
                                    className="ml-2"
                                    onChange={(e) =>
                                        setHasCommission(e.target.checked)
                                    }
                                />
                            </div>
                            <div className={`grid grid-cols-[10%,auto] flex-row items-center transition-opacity duration-200 ${hasCommission ? '' : 'opacity-50 pointer-events-none select-none'}`}>
                                <Switch
                                    draggable={false}
                                    onChange={(checked) => setCommissionPercentage(checked)}
                                    checked={commissionPercentage}
                                    checkedIcon={<Percent size={15} style={{ margin: 'auto' }} />}
                                    uncheckedIcon={<DollarSign size={15} style={{ margin: 'auto' }} />}
                                />
                                <input
                                    type="number"
                                    placeholder="Commission Value"
                                    step="0.01"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                                            setProductCommissionValue(val);
                                        }
                                    }}
                                    value={productCommissionValue}
                                    className="ml-2 mt-2 border w-full h-[40px] px-2"
                                />

                            </div>

                        </div>
                        <div className="flex flex-col col-span-2">
                            <div>Remark</div>
                            <textarea
                                type="text"
                                rows={6}
                                placeholder="Remark"
                                value={productRemark}
                                onChange={(e) => setProductRemark(e.target.value)}
                                className="mr-2 mt-2 border w-full px-2 py-2"
                            />
                        </div>
                    </div>

                    <div className="absolute bottom-0 right-0 bg-white py-4 pr-6 flex justify-end w-full border-t">
                        <div className="flex gap-2">
                            <button onClick={handleClose} className="bg-red-600 text-white w-36 px-4 py-2 rounded hover:bg-red-700">
                                Cancel
                            </button>
                            <button className="bg-primary text-white w-36 px-4 py-2 rounded hover:bg-primary/90">
                                Save
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </>
    )
}

export default UpdateProductModal