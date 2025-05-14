import { ApiBaseUrl, postRequest } from "./apiconfig";

const getSalesDocReport = `${ApiBaseUrl}Report/GetSalesDocReport`;
const previewSalesDocReport = `${ApiBaseUrl}Report/PreviewSalesDocReport`;
const getSalesDocPaymentReport = `${ApiBaseUrl}Report/GetSalesDocPaymentReport`;
const previewSalesDocPaymentReport = `${ApiBaseUrl}Report/PreviewSalesDocPaymentReport`;
const getJobSheetForm = `${ApiBaseUrl}Report/GetJobSheetForm`;

export const GetSalesDocReport = ({companyId, userId, id, name}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
        name
    });

    return postRequest(getSalesDocReport, body);
}

export const PreviewSalesDocReport = ({companyId, userId, id, name}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
        name
    });

    return postRequest(previewSalesDocReport, body);
}

export const GetSalesDocPaymentReport = ({companyId, userId, id, name}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
        name
    });

    return postRequest(getSalesDocPaymentReport, body);
}
export const PreviewSalesDocPaymentReport = ({companyId, userId, id, name}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
        name
    });

    return postRequest(previewSalesDocPaymentReport, body);
}
export const GetJobSheetForm = ({companyId, userId, id, name}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
        name
    });

    return postRequest(getJobSheetForm, body);
}