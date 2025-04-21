import { ApiBaseUrl, postRequest } from "./apiconfig";

//creditor
const getCreditorRecords = `${ApiBaseUrl}Creditor/GetRecords`;
const newCreditor = `${ApiBaseUrl}Creditor/New`;
const getCreditor = `${ApiBaseUrl}Creditor/Get`;
const saveCreditor = `${ApiBaseUrl}Creditor/Save`;
const deleteCreditor = `${ApiBaseUrl}Creditor/Delete`;

//debtor
const getDebtorRecords = `${ApiBaseUrl}Debtor/GetRecords`;
const newDebtor = `${ApiBaseUrl}Debtor/New`;
const getDebtor = `${ApiBaseUrl}Debtor/Get`;
const saveDebtor = `${ApiBaseUrl}Debtor/Save`;
const deleteDebtor = `${ApiBaseUrl}Debtor/Delete`;
const getLatestDebtorContactLens = `${ApiBaseUrl}Debtor/GetLatestDebtorContactLens`;
const getLatestDebtorSpectacles = `${ApiBaseUrl}Debtor/GetLatestDebtorSpectacles`;

//userRole
const getUserRoleRecords = `${ApiBaseUrl}UserRole/GetRecords`;
const newUserRole = `${ApiBaseUrl}UserRole/New`;
const getUserRole = `${ApiBaseUrl}UserRole/Get`;
const saveUserRole = `${ApiBaseUrl}UserRole/Save`;
const deleteUserRole = `${ApiBaseUrl}UserRole/Delete`;

//item
const getItemsRecords = `${ApiBaseUrl}Item/GetRecords`;
const newItem = `${ApiBaseUrl}Item/New`;
const getItem = `${ApiBaseUrl}Item/Get`;
const saveItem = `${ApiBaseUrl}Item/Save`;
const deleteItem = `${ApiBaseUrl}Item/Delete`;

//itemGroup
const getItemGroupsRecords = `${ApiBaseUrl}ItemGroup/GetRecords`;
const newItemGroup = `${ApiBaseUrl}ItemGroup/New`;
const getItemGroup = `${ApiBaseUrl}ItemGroup/Get`;
const saveItemGroup = `${ApiBaseUrl}ItemGroup/Save`;
const deleteItemGroup = `${ApiBaseUrl}ItemGroup/Delete`;

//itemType
const getItemTypesRecords = `${ApiBaseUrl}ItemType/GetRecords`;
const newItemType = `${ApiBaseUrl}ItemType/New`;
const getItemType = `${ApiBaseUrl}ItemType/Get`;
const saveItemType = `${ApiBaseUrl}ItemType/Save`;
const deleteItemType = `${ApiBaseUrl}ItemType/Delete`;

//paymentMethod
const getPaymentMethodsRecords = `${ApiBaseUrl}PaymentMethod/GetRecords`;
const newPaymentMethod = `${ApiBaseUrl}PaymentMethod/New`;
const editPaymentMethod = `${ApiBaseUrl}PaymentMethod/Edit`;
const savePaymentMethod = `${ApiBaseUrl}PaymentMethod/Save`;
const deletePaymentMethod = `${ApiBaseUrl}PaymentMethod/Delete`;

export const GetCreditorRecords = ({companyId, keyword, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        keyword,
        offset,
        limit,
    });

    return postRequest(getCreditorRecords, body);
};

export const NewCreditor = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(newCreditor, body);
};

export const GetCreditor = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getCreditor, body);
};

export const SaveCreditor = ({actionData, creditorId, creditorCode, companyName, isActive, identityNo, dob, address, remark, phone1, phone2, emailAddress}) =>{
    const body = JSON.stringify({
        actionData,
        creditorId,
        creditorCode,
        companyName,
        isActive,
        identityNo,
        dob,
        address,
        remark,
        phone1,
        phone2,
        emailAddress,
    });

    return postRequest(saveCreditor, body);
};

export const DeleteCreditor = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(deleteCreditor, body);
};

export const GetDebtorRecords = ({companyId, keyword, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        keyword,
        offset,
        limit,
    });

    return postRequest(getDebtorRecords, body);
};

export const NewDebtor = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(newDebtor, body);
};

export const GetDebtor = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getDebtor, body);
};

export const SaveDebtor = ({actionData, DebtorId, DebtorCode, companyName, isActive, identityNo, dob, address, remark, phone1, phone2, emailAddress, medicalIsDiabetes, medicalIsHypertension, medicalOthers, ocularIsSquint, ocularIsLazyEye, ocularHasSurgery, ocularOthers}) =>{
    const body = JSON.stringify({
        actionData,
        DebtorId,
        DebtorCode,
        companyName,
        isActive,
        identityNo,
        dob,
        address,
        remark,
        phone1,
        phone2,
        emailAddress,
        medicalIsDiabetes,
        medicalIsHypertension,
        medicalOthers,
        ocularIsSquint,
        ocularIsLazyEye,
        ocularHasSurgery,
        ocularOthers,
    });

    return postRequest(saveDebtor, body);
};

export const DeleteDebtor = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(deleteDebtor, body);
};

export const GetLatestDebtorContactLens = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getLatestDebtorContactLens, body);
};

export const GetLatestDebtorSpectacles = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getLatestDebtorSpectacles, body);
};

export const GetUserRoleRecords = ({companyId, keyword, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        keyword,
        offset,
        limit,
    });

    return postRequest(getUserRoleRecords, body);
};

export const NewUserRole = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(newUserRole, body);
};

export const GetUserRole = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getUserRole, body);
};

export const SaveUserRole = ({actionData, userRoleId, userRoleCode, description, accessRights}) =>{
    const body = JSON.stringify({
        actionData,
        userRoleId,
        userRoleCode,
        description,
        accessRights,
    });

    return postRequest(saveUserRole, body);
};

export const DeleteUserRole = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(deleteUserRole, body);
};

export const GetItemsRecords = ({companyId, keyword, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        keyword,
        offset,
        limit,
    });

    return postRequest(getItemsRecords, body);
};

export const NewItem = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(newItem, body);
};

export const GetItem = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getItem, body);
};

export const SaveItem = ({actionData, itemId, itemCode, isActive, description, desc2, itemGroupId, itemTypeId, classification, itemUOM, itemCommission}) =>{
    const body = JSON.stringify({
        actionData,
        itemId,
        itemCode,
        isActive,
        description,
        desc2,
        itemGroupId,
        itemTypeId,
        classification,
        itemUOM,
        itemCommission,
    });

    return postRequest(saveItem, body);
};

export const DeleteItem = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(deleteItem, body);
};

export const GetItemGroupsRecords = ({companyId, keyword, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        keyword,
        offset,
        limit,
    });

    return postRequest(getItemGroupsRecords, body);
};

export const NewItemGroup = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(newItemGroup, body);
};

export const GetItemGroup = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getItemGroup, body);
};

export const SaveItemGroup = ({actionData, itemGroupId, itemGroupCode, description, isNormalItem, isSpectacles, isContactLenses}) =>{
    const body = JSON.stringify({
        actionData,
        itemGroupId,
        itemGroupCode,
        description,
        isNormalItem,
        isSpectacles,
        isContactLenses,
    });

    return postRequest(saveItemGroup, body);
};

export const DeleteItemGroup = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(deleteItemGroup, body);
};

export const GetItemTypesRecords = ({companyId, keyword, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        keyword,
        offset,
        limit,
    });

    return postRequest(getItemTypesRecords, body);
};

export const NewItemType = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(newItemType, body);
};

export const GetItemType = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getItemType, body);
};

export const SaveItemType = ({actionData, itemTypeId, itemTypeCode, description}) =>{
    const body = JSON.stringify({
        actionData,
        itemTypeId,
        itemTypeCode,
        description,
    });

    return postRequest(saveItemType, body);
};

export const DeleteItemType = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(deleteItemType, body);
};

export const GetPaymentMethodRecords = ({companyId, keyword, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        keyword,
        offset,
        limit,
    });

    return postRequest(getPaymentMethodsRecords, body);
};

export const NewPaymentMethod = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(newPaymentMethod, body);
};

export const EditPaymentMethod = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(editPaymentMethod, body);
};

export const SavePaymentMethod = ({actionData, paymentMethodId, paymentMethodCode, paymentType}) =>{
    const body = JSON.stringify({
        actionData,
        paymentMethodId,
        paymentMethodCode,
        paymentType,
    });

    return postRequest(savePaymentMethod, body);
};

export const DeletePaymentMethod = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(deletePaymentMethod, body);
};