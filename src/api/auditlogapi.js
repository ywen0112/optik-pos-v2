import { ApiBaseUrl, postRequest, getRequest } from "./apiconfig";

const getAuditLogs      = `${ApiBaseUrl}AuditLog/GetRecords`;
const getAllChangeType  = `${ApiBaseUrl}AuditLog/GetAllAuditChangeTypes`;

export const GetAuditLogs = ({companyId, fromDate, toDate, userId, eventType, keyword, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        fromDate,
        toDate,
        userId,
        eventType,
        keyword,
        offset,
        limit,
    });

    return postRequest(getAuditLogs, body);
};

export const GetAllChangeTyp = ({companyId}) =>{
    const url = `${getAllChangeType}?companyId=${companyId}`

    return getRequest(url);
};