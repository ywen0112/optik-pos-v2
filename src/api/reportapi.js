import { ApiBaseUrl, postRequest, getRequest } from "./apiconfig";

const getSalesReportType = `${ApiBaseUrl}Report/GetAvailableSalesDocReportName`;
const getSalesDocReport = `${ApiBaseUrl}Report/GetSalesDocReport`;
const getSalesDocPaymentReport = `${ApiBaseUrl}Report/GetSalesDocPaymentReport`;
const getJobSheetForm = `${ApiBaseUrl}Report/GetJobSheetForm`;
const getDailyClosing = `${ApiBaseUrl}DailyClosingSummary/GetResults`;
const getCommissionReport = `${ApiBaseUrl}Commission/GetResults`;

export const GetSalesReportType = ({companyId, isCashSales}) =>{
    return getRequest(`${getSalesReportType}?companyId=${companyId}&isCashSales=${isCashSales}`)
}

export const GetSalesDocReport = ({ companyId, userId, id, name, isCashSales }) => {
    const body = JSON.stringify({ companyId, userId, id, name });
    return postRequest(getSalesDocReport, body, { isCashSales });
};

export const GetSalesDocPaymentReport = ({ companyId, userId, id, name, isCashSales }) => {
    const body = JSON.stringify({ companyId, userId, id, name });
    return postRequest(getSalesDocPaymentReport, body, { isCashSales });
};

export const GetJobSheetForm = ({companyId, userId, id, name}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
        name
    });

    return postRequest(getJobSheetForm, body);
}

export const GetDailyClosing = ({companyId, userId, reportName, generateReport, date, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        reportName,
        generateReport,
        date,
        offset,
        limit
    });

    return postRequest(getDailyClosing, body);
}

export const GetCommissionReport = ({companyId, userId, reportName, generateReport, fromDate, toDate, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        reportName,
        generateReport,
        fromDate,
        toDate,
        offset,
        limit
    });

    return postRequest(getCommissionReport, body);
}