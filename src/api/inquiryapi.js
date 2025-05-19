import { ApiBaseUrl, CompanyApi, postRequest } from "./apiconfig";

//creditor
const getSalesInquiry = `${ApiBaseUrl}SalesInquiry/GetResults`;
const getItemInquiry = `${ApiBaseUrl}ItemInquiry/GetResults`;
const getItemHistory = `${ApiBaseUrl}ItemInquiry/GetItemHistorys`;

export const GetSalesInquiry = ({companyId, fromDate, toDate, id, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        fromDate,
        toDate,
        debtorId: id,
        offset,
        limit
    });
    return postRequest(getSalesInquiry, body);
}

export const GetItemInquiry = ({companyId, fromDate, toDate, id, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        fromDate,
        toDate,
        itemId: id,
        offset,
        limit
    });
    return postRequest(getItemInquiry, body);
}

export const GetItemHistorys = ({companyId, fromDate, toDate, id, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        fromDate,
        toDate,
        itemId: id,
        offset,
        limit
    });
    return postRequest(getItemHistory, body);
}
