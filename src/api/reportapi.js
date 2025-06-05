import { ApiBaseUrl, postRequest, getRequest } from "./apiconfig";

const getSalesReportType = `${ApiBaseUrl}Report/GetAvailableSalesDocReportName`;
const getSalesDocReport = `${ApiBaseUrl}Report/GetSalesDocReport`;
const getSalesDocPaymentReport = `${ApiBaseUrl}Report/GetSalesDocPaymentReport`;
const getJobSheetForm = `${ApiBaseUrl}Report/GetJobSheetForm`;
const getDailyClosingData = `${ApiBaseUrl}DailyClosingSummary/GetResults`;
const getDailyClosingReport = `${ApiBaseUrl}DailyClosingSummary/GenerateReport`;
const getCommissionData = `${ApiBaseUrl}Commission/GetResults`;
const getCommissionReport = `${ApiBaseUrl}Commission/GenerateReport`;
const getOutstandingBalanceData = `${ApiBaseUrl}OutstandingBalance/GetResults`;
const getOutstandingBalanceReport = `${ApiBaseUrl}OutstandingBalance/GenerateReport`;
const getUncollectedOrderData = `${ApiBaseUrl}UncollectedOrder/GetResults`;
const getUncollectedOrderReport = `${ApiBaseUrl}UncollectedOrder/GenerateReport`;

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

export const GetDailyClosingData = ({companyId, date, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        date,
        offset,
        limit
    });

    return postRequest(getDailyClosingData, body);
}

export const GetDailyClosingReport = ({companyId, userId, reportName, date}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        reportName,
        date,
    });

    return postRequest(getDailyClosingReport, body);
}


export const GetCommissionReport = ({companyId, userId, reportName, fromDate, toDate}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        reportName,
        fromDate,
        toDate,
    });

    return postRequest(getCommissionReport, body);
}

export const GetCommissionData = ({companyId, offset, limit, fromDate, toDate}) =>{
    const body = JSON.stringify({
        companyId,
        fromDate,
        toDate,
        offset,
        limit
    });

    return postRequest(getCommissionData, body);
}

export const GetOutstandingBalanceData = ({companyId, offset, limit, fromDate, toDate}) =>{
    const body = JSON.stringify({
        companyId,
        fromDate,
        toDate,
        offset,
        limit
    });

    return postRequest(getOutstandingBalanceData, body);
}

export const GetOutStandingBalanceReport = ({companyId, fromDate, toDate, userId, reportName}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        reportName,
        fromDate,
        toDate,
    });

    return postRequest(getOutstandingBalanceReport, body);
}

export const GetUncollectedOrderData = ({companyId, offset, limit, fromDate, toDate}) =>{
    const body = JSON.stringify({
        companyId,
        fromDate,
        toDate,
        offset,
        limit
    });

    return postRequest(getUncollectedOrderData, body);
}

export const GetUncollectedOrderReport = ({companyId, fromDate, toDate, userId, reportName}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        reportName,
        fromDate,
        toDate,
    });

    return postRequest(getUncollectedOrderReport, body);
}