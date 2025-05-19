import { DropDownBox } from 'devextreme-react';
import { DollarSign, Percent, X } from 'lucide-react';
import { useCallback, useState, useEffect } from 'react'
import DataGrid, {
    Selection,
    Paging,
    Scrolling,
    SearchPanel,
    Column
} from "devextreme-react/data-grid";
import CustomStore from 'devextreme/data/custom_store';
import { getInfoLookUp } from '../../../api/infolookupapi';
import { GetItemGroup, GetItemType } from '../../../api/maintenanceapi';

const productGroupGridBoxDisplayExpr = (item) => item && `${item.itemGroupCode}-${item.description}`
const productTypeGridBoxDisplayExpr = (item) => item && `${item.itemTypeCode}-${item.description}`
const productClassificationGridBoxDisplayExpr = (item) => item && `${item.code}-${item.description}`


const UpdateProductModal = ({
    selectedItem,
    isOpen,
    isEdit,
    onConfirm,
    onError,
    onClose
}) => {
    const [formData, setFormData] = useState(null);

    const handleClose = () => {
        setFormData(null);
        setProductGroup(null);
        setProductType(null);
        setClassification(null)
        onClose();
    }

    useEffect(() => {
        if (isOpen) {
            setFormData(selectedItem);
            setProductGroup({ itemGroupId: selectedItem.itemGroupId });
            setProductType({ itemTypeId: selectedItem.itemTypeId });
            setClassification({ code: selectedItem.classification });
        }
    }, [isOpen, selectedItem, isEdit]);

    const companyId = sessionStorage.getItem("companyId");
    const userId = sessionStorage.getItem("userId");
    const [productType, setProductType] = useState({ itemTypeId: null, itemTypeCode: "", description: "" });
    const [isTypeBoxOpened, setIsTypeBoxOpened] = useState(false);
    const [productGroup, setProductGroup] = useState({ itemGroupId: null, itemGroupCode: "", description: "" });
    const [classification, setClassification] = useState({ code: "", description: "" })
    const [isGroupBoxOpened, setIsGroupBoxOpened] = useState(false);
    const [isClassificationBoxOpened, setIsClassificationBoxOpened] = useState(false);
    const [productMinPrice, setProductMinPrice] = useState(null);
    const [productCost, setProductCost] = useState(null);
    const [hasCommission, setHasCommission] = useState(false);

    const productGroupStore = new CustomStore({
        key: "itemGroupId",

        load: async (loadOptions) => {
            const filter = loadOptions.filter;
            let keyword = filter?.[2]?.[2] || "";


            const params = {
                keyword: keyword || "",
                offset: loadOptions.skip,
                limit: loadOptions.take,
                type: "item_group",
                companyId,
            };
            const res = await getInfoLookUp(params);
            return {
                data: res.data,
                totalCount: res.totalRecords,
            };
        },
        byKey: async (key) => {
            const res = await GetItemGroup({
                companyId,
                userId,
                id: key
            });
            return res.data;
        }
    })

    const productTypeStore = new CustomStore({
        key: "itemTypeId",

        load: async (loadOptions) => {
            const filter = loadOptions.filter;
            let keyword = filter?.[2]?.[2] || "";


            const params = {
                keyword: keyword || "",
                offset: loadOptions.skip,
                limit: loadOptions.take,
                type: "item_type",
                companyId,
            };
            const res = await getInfoLookUp(params);
            return {
                data: res.data,
                totalCount: res.totalRecords,
            };
        },
        byKey: async (key) => {
            const res = await GetItemType({
                companyId,
                userId,
                id: key
            });
            return res.data;
        }
    })

    const classificationStore = new CustomStore({
        key: "code",
        load: async (loadOptions) => {
            const filter = loadOptions.filter;
            let keyword = filter?.[2]?.[2] || "";
            const params = {
                keyword: keyword || "",
                offset: loadOptions.skip,
                limit: loadOptions.take,
                type: "classification",
                companyId,
            };

            const res = await getInfoLookUp(params);
            return {
                data: res.data,
                totalCount: res.totalRecords,
            };
        },
        byKey: async (key) => {
            const params = {
                keyword: key,
                offset: 0,
                limit: 1,
                type: "classification",
                companyId,
            };

            const res = await getInfoLookUp(params);
            return res.data?.[0];
        }
    })

    const classificationOnSelectionChanged = useCallback((e) => {
        const selected = e.selectedRowsData?.[0];
        if (selected) {
            setClassification({ code: selected.code, description: selected.description })
            setFormData(prev => ({ ...prev, classification: selected.code }))
            setIsClassificationBoxOpened(false);
        }
    }, [])

    const ProductClassificationGridRender = useCallback(() => (
        <DataGrid
            dataSource={classificationStore}
            showBorders={true}
            hoverStateEnabled
            selectedRowKeys={formData?.classification}
            onSelectionChanged={classificationOnSelectionChanged}
            height={"200px"}
            remoteOperations={{
                paging: true,
                filtering: true,
            }}
        >
            <Selection mode="single" />
            <Scrolling mode="infinite" />
            <Paging
                enabled={true}
                pageSize={10}
            />
            <SearchPanel visible={true} highlightSearchText />
            <Column dataField="code" caption="Code" />
            <Column dataField="description" caption="Desc" />
        </DataGrid>
    ), []);

    const handleProductClassificationGridBoxValueChanges = (e) => {
        if (!e.value) {
            setClassification({ code: "", description: "" })
            setFormData(prev => ({ ...prev, classification: "" }))
        }
    }

    const onProductClassificationGridBoxOpened = useCallback((e) => {
        if (e.name === 'opened') {
            setIsClassificationBoxOpened(e.value);
        }
    }, [])

    const productGroupDataGridOnSelectionChanged = useCallback((e) => {
        const selected = e.selectedRowsData?.[0];
        if (selected) {
            setFormData(prev => ({ ...prev, itemGroupId: selected.itemGroupId }));
            setProductGroup({ itemGroupId: selected.itemGroupId, itemGroupCode: selected.itemGroupCode, description: selected.description })
            setIsGroupBoxOpened(false);
        }
    }, []);

    const ProductGroupGridRender = useCallback(() => (
        <DataGrid
            dataSource={productGroupStore}
            showBorders={true}
            hoverStateEnabled
            selectedRowKeys={productGroup.itemGroupId}
            onSelectionChanged={productGroupDataGridOnSelectionChanged}
            height={"200px"}
            remoteOperations={{
                paging: true,
                filtering: true,
            }}
        >
            <Selection mode="single" />
            <Paging
                enabled={true}
                pageSize={10}
            />
            <Scrolling mode="infinite" />

            <SearchPanel
                visible={true}
                width="100%"
                highlightSearchText={true}
            />
            <Column dataField="itemGroupCode" caption="Code" />
            <Column dataField="description" caption="Desc" />
        </DataGrid>
    ), []);

    const handleProductGroupGridBoxValueChanges = (e) => {
        if (!e.value) {
            setProductGroup({ itemGroupId: "", itemGroupCode: "", description: "" })
        }
    }

    const onProductGroupGridBoxOpened = useCallback((e) => {
        if (e.name === 'opened') {
            setIsGroupBoxOpened(e.value);
        }
    }, [])


    const handleTypeSelection = useCallback((e) => {
        const selected = e.selectedRowsData?.[0];
        if (selected && productType.itemTypeId !== selected.itemTypeId) {
            setFormData(prev => ({ ...prev, itemTypeId: selected.itemTypeId }));
            setProductType({ itemTypeId: selected.itemTypeId, itemTypeCode: selected.itemTypeCode, description: selected.description });
            setIsTypeBoxOpened(false);
        }
    }, [])

    const ProductTypeGridRender = useCallback(() => (
        <DataGrid
            dataSource={productTypeStore}
            showBorders={true}
            hoverStateEnabled={true}
            selectedRowKeys={[productType.itemTypeId]}
            onSelectionChanged={handleTypeSelection}
            height={"200px"}
            remoteOperations={{
                paging: true,
                filtering: true,
            }}
        >
            <Selection mode="single" />
            <Paging
                enabled={true}
                pageSize={10}
            />
            <Scrolling mode="infinite" />

            <SearchPanel
                visible={true}
                width="100%"
                highlightSearchText={true}
            />
            <Column dataField="itemTypeCode" caption="Code" />
            <Column dataField="description" caption="Desc" />
        </DataGrid>
    ), []);

    const handleProductTypeChanged = (e) => {
        if (!e.value) {
            setProductType({ itemTypeId: "", itemGroupCode: "", description: "" });
        }
    }

    const onProductTypeGridBoxOpened = useCallback((e) => {
        if (e.name === 'opened') {
            setIsTypeBoxOpened(e.value);
        }
    }, []);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full overflow-y-auto text-secondary">
                    <div className="flex flex-row justify-between">
                        <h3 className="font-semibold mb-4">
                            {isEdit ? "Edit Product" : "New Product"}
                        </h3>
                        <div className='col-span-4' onClick={handleClose}>
                            <X size={20} />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-1">
                        <div className='col-span-4 flex flex-row'>
                            <div className='w-1/4'>Product Code</div>
                            <div className='w-1/4'>Product Type</div>
                            <div className='w-1/4'>Product Group</div>
                            <div className=" w-1/4 flex flex-row justify-end ">
                                <input
                                    type="checkbox"
                                    checked={formData?.isActive}
                                    className="mr-2"
                                    onChange={(e) =>
                                        setFormData({ ...formData, isActive: e.target.checked })
                                    }
                                />
                                <div className='flex items-center'>Active</div>

                            </div>
                        </div>
                        <div className="flex flex-col">

                            <input
                                type="text"
                                placeholder="Product Code"
                                value={formData?.itemCode}
                                onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                                className="mr-2 mt-2 border w-full h-[40px] px-2"
                            />
                        </div>
                        <div className="flex flex-col">

                            <DropDownBox
                                id="ProductTypeSelection"
                                value={productType?.itemTypeId || null}
                                placeholder='Product Type'
                                openOnFieldClick={true}
                                opened={isTypeBoxOpened}
                                displayExpr={productTypeGridBoxDisplayExpr}
                                onValueChanged={handleProductTypeChanged}
                                valueExpr="itemTypeId"
                                onOptionChanged={onProductTypeGridBoxOpened}
                                contentRender={ProductTypeGridRender}
                                className="border mt-2 rounded px-2 py-[2px] bg-white w-full"
                                dataSource={productTypeStore}
                                dropDownOptions={{
                                    width: 450
                                }}
                            />
                        </div>
                        <div className="flex flex-col">

                            <DropDownBox
                                id="ProductGroupSelection"
                                value={productGroup?.itemGroupId || null}
                                placeholder='Product Group'
                                openOnFieldClick={true}
                                opened={isGroupBoxOpened}
                                displayExpr={productGroupGridBoxDisplayExpr}
                                onValueChanged={handleProductGroupGridBoxValueChanges}
                                valueExpr="itemGroupId"
                                onOptionChanged={onProductGroupGridBoxOpened}
                                contentRender={ProductGroupGridRender}
                                className="border mt-2 rounded px-2 py-[2px] bg-white w-full"
                                dataSource={productGroupStore}
                                dropDownOptions={{
                                    width: 450
                                }}
                            />
                        </div>

                        <div className="flex flex-col col-span-2 mt-2">
                            <div>Product Name</div>
                            <input
                                type="text"
                                placeholder="Product Name"
                                value={formData?.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="mr-2 mt-2 border w-full h-[40px] px-2"
                            />
                        </div>
                        <div className="flex flex-col col-span-2 mt-2">
                            <div>Description</div>
                            <input
                                type="text"
                                placeholder="Product Description"
                                value={formData?.desc2}
                                onChange={(e) => setFormData({ ...formData, desc2: e.target.value })}
                                className="mr-2 mt-2 border w-full h-[40px] px-2"
                            />
                        </div>
                        <div className="flex flex-col mt-2">
                            <div>UOM</div>
                            <input
                                type="text"
                                placeholder="Product UOM"
                                value={formData?.itemUOM?.uom}
                                onChange={(e) => setFormData({ ...formData, itemUOM: { ...formData.itemUOM, uom: e.target.value } })}
                                className="mr-2 mt-2 border w-full h-[40px] px-2"
                            />
                        </div>
                        <div className="flex flex-col mt-2">
                            <div>Price</div>
                            <input
                                type="number"
                                placeholder="Product Price"
                                step="0.01"
                                value={formData?.itemUOM?.price}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                                        setFormData({ ...formData, itemUOM: { ...formData.itemUOM, price: val } });
                                    }
                                }}
                                className="mr-2 mt-2 border w-full h-[40px] px-2"
                            />
                        </div>
                        <div className="flex flex-col mt-2">
                            <div>Min Price</div>
                            <input
                                type="number"
                                placeholder="Min Price"
                                step="0.01"
                                value={formData?.itemUOM?.minSalePrice}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                                        setFormData({ ...formData, itemUOM: { ...formData.itemUOM, minSalePrice: val } });
                                    }
                                }}
                                className="mr-2 mt-2 border w-full h-[40px] px-2"
                            />
                        </div>
                        <div className="flex flex-col mt-2">
                            <div>Cost</div>
                            <input
                                type="number"
                                placeholder="Cost"
                                step="0.01"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                                        setFormData({ ...formData, itemUOM: { ...formData.itemUOM, cost: val } })
                                    }
                                }}
                                value={formData?.itemUOM?.cost}
                                className="mr-2 mt-2 border w-full h-[40px] px-2"
                            />
                        </div>
                        <div className="flex flex-col col-span-2 row-span-2 mt-2">
                            <div>Remark</div>
                            <textarea
                                type="text"
                                rows={7}
                                placeholder="Remark"
                                value={formData?.remark}
                                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                                className="mr-2 mt-2 border w-full h-full px-2 py-2"
                            />
                        </div>
                        <div className="flex flex-col col-span-2 mt-2">
                            <div>Barcode</div>
                            <input
                                type="text"
                                placeholder="Product Barcode"
                                value={formData?.itemUOM?.barcode}
                                onChange={(e) => setFormData({ ...formData, itemUOM: { ...formData.itemUOM, barcode: e.target.value } })}
                                className="mr-2 mt-2 border w-full h-[40px] px-2"
                            />
                        </div>

                        <div className="flex flex-col col-span-2 mt-2">
                            <div>Classification</div>
                            <DropDownBox
                                id="ProductClassificationSelection"
                                value={classification?.code || null}
                                placeholder='Product Classification'
                                openOnFieldClick={true}
                                opened={isClassificationBoxOpened}
                                displayExpr={productClassificationGridBoxDisplayExpr}
                                onValueChanged={handleProductClassificationGridBoxValueChanges}
                                valueExpr={"code"}
                                onOptionChanged={onProductClassificationGridBoxOpened}
                                contentRender={ProductClassificationGridRender}
                                className="border mt-2 rounded px-2 py-[2px] bg-white w-full"
                                dataSource={classificationStore}
                                dropDownOptions={{
                                    width: 450
                                }}
                            />
                        </div>

                        <div className="col-span-2 w-full h-full ">
                            <div className='flex flex-row'>
                                <input
                                    type="checkbox"
                                    checked={hasCommission}
                                    className="mr-2"
                                    onChange={(e) => {
                                        setHasCommission(e.target.checked)
                                        setFormData({
                                            ...formData,
                                            hasCommission: e.target.checked ?? hasCommission
                                        });
                                    }}
                                />
                                <div>Commission</div>

                            </div>
                            <div className="flex flex-col col-span-2 mt-2 border-[1px]  border-[#e5e7eb] p-2">

                                <div className={`flex-col items-center transition-opacity duration-200 ${hasCommission ? '' : 'opacity-50 pointer-events-none select-none'}`}>

                                    <div className="flex-row space-x-2">

                                        <input
                                            className='mt-2'
                                            type="checkbox"
                                            checked={formData?.itemCommission?.isPercentage}
                                            onChange={() => {
                                                setFormData({
                                                    ...formData,
                                                    itemCommission: {
                                                        ...formData.itemCommission,
                                                        isPercentage: true,
                                                        isFlat: false,
                                                    },
                                                });
                                            }}
                                        />
                                        <label>Percentage</label>


                                        <input
                                            type="checkbox"
                                            className='mt-2'
                                            checked={formData?.itemCommission?.isFlat}
                                            onChange={() => {
                                                setFormData({
                                                    ...formData,
                                                    itemCommission: {
                                                        ...formData.itemCommission,
                                                        isPercentage: false,
                                                        isFlat: true,
                                                    },
                                                });
                                            }}
                                        />
                                        <label>Flat Rate</label>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="Commission Value"
                                        step="0.01"
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                                                setFormData({ ...formData, itemCommission: { ...formData.itemCommission, value: val } });
                                            }
                                        }}
                                        value={formData?.itemCommission?.value}
                                        className="mt-2 border w-full h-[40px] px-2"
                                    />



                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="absolute bottom-0 right-0 bg-white py-4 pr-6 flex justify-end w-full border-t">
                        <div className="flex gap-1">
                            <button onClick={handleClose} className="bg-red-600 text-white w-36 px-4 py-2 rounded hover:bg-red-700">
                                Cancel
                            </button>
                            <button className="bg-primary text-white w-36 px-4 py-2 rounded hover:bg-primary/90"
                                onClick={() => {
                                    setProductMinPrice(null); setProductCost(null);
                                    if (!formData?.description.trim()) {
                                        onError({
                                            title: "Validation Error",
                                            message: "Item Name is required.",
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
            </div>

        </>
    )
}

export default UpdateProductModal;