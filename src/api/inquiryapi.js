import { ApiBaseUrl, CompanyApi, postRequest } from "./apiconfig";

//creditor
const getSalesInquiry = `${ApiBaseUrl}SalesInquiry/GetResults`;

export const GetSalesInquiry = ({companyId, fromDate, toDate, id, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        fromDate,
        toDate,
        id,
        offset,
        limit
    });
    return postRequest(getSalesInquiry, body);
}
