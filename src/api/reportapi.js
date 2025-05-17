import { ApiBaseUrl, postRequest, getRequest } from "./apiconfig";

const getSalesReportType = `${ApiBaseUrl}Report/GetAvailableSalesDocReportName`;
const getSalesDocReport = `${ApiBaseUrl}Report/GetSalesDocReport`;
const getSalesDocPaymentReport = `${ApiBaseUrl}Report/GetSalesDocPaymentReport`;
const getJobSheetForm = `${ApiBaseUrl}Report/GetJobSheetForm`;

export const GetSalesReportType = ({companyId}) =>{
    return getRequest(`${getSalesReportType}?companyId=${companyId}`)
}

export const GetSalesDocReport = ({companyId, userId, id, name}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
        name
    });

    return postRequest(getSalesDocReport, body);
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

export const GetJobSheetForm = ({companyId, userId, id, name}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
        name
    });

    return postRequest(getJobSheetForm, body);
}