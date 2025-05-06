import { ApiBaseUrl, postRequest } from "./apiconfig";

//contactLens
const newContactLens = `${ApiBaseUrl}ContactLens/New`;
const getContactLen = `${ApiBaseUrl}ContactLens/Get`;
const saveContactLen = `${ApiBaseUrl}ContactLens/Save`;
const deleteContactLen = `${ApiBaseUrl}ContactLens/Delete`;

//spectacles
const newSpectacles = `${ApiBaseUrl}Spectacles/New`;
const getSpectacles = `${ApiBaseUrl}Spectacles/Get`;
const saveSpectacles = `${ApiBaseUrl}Spectacles/Save`;
const deleteSpectacles = `${ApiBaseUrl}Spectacles/Delete`;

export const NewContactLens = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(newContactLens, body);
};

export const GetContactLensProfile = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getContactLen, body);
};

export const SaveContactLensProfile = ({actionData, contactLensId, debtorId, salesOrderId, salesOrderDetailId, docDate, prescribedRXContactLens, actualRXContactLens}) =>{
    const body = JSON.stringify({
        actionData,
        contactLensId,
        debtorId,
        salesOrderId,
        salesOrderDetailId,
        docDate,
        prescribedRXContactLens,
        actualRXContactLens,
    });

    return postRequest(saveContactLen, body);
};

export const DeleteContactLen = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(deleteContactLen, body);
};

export const NewSpectacles = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(newSpectacles, body);
};

export const GetSpectaclesProfile = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getSpectacles, body);
};

export const SaveSpectacles = ({actionData, spectaclesId, debtorId, salesOrderId, salesOrderDetailId, docDate, prescribedRXSpectacles, actualRXSpectacles}) =>{
    const body = JSON.stringify({
        actionData,
        spectaclesId,
        debtorId,
        salesOrderId,
        salesOrderDetailId,
        docDate,
        prescribedRXSpectacles,
        actualRXSpectacles,
    });

    return postRequest(saveSpectacles, body);
};

export const DeleteSpectacles = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(deleteSpectacles, body);
};
