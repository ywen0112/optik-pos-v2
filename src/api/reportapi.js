import { ApiBaseUrl, ReportBaseUrl, postRequest, getRequest } from "./apiconfig";

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
const getStockBalanceData = `${ApiBaseUrl}StockBalance/GetResults`;
const getStockBalanceReport = `${ApiBaseUrl}StockBalance/GenerateReport`;
const getMonthlySalesSummaryData = `${ApiBaseUrl}MonthlySalesSummary/GetResults`;
const getMonthlySalesSummaryReport = `${ApiBaseUrl}MonthlySalesSummary/GenerateReport`;
const getSalesPerformanceSummaryData = `${ApiBaseUrl}SalesPerformanceSummary/GetResults`;
const getSalesPerformanceSummaryReport = `${ApiBaseUrl}SalesPerformanceSummary/GenerateReport`;
const getPurchaseReturnListingData = `${ApiBaseUrl}PurchaseReturnListing/GetResults`;
const getPurchaseReturnListingReport = `${ApiBaseUrl}PurchaseReturnListing/GenerateReport`;

export const GetReports = (companyId) => {
    return getRequest(`${ReportBaseUrl}reporting/GetReports/${companyId}`);
}

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

export const GetStockBalanceData = ({companyId, date, includeZeroQuantity, limit, offset, userId, reportName}) =>{
    const body = JSON.stringify({
        companyId,
        date,
        includeZeroQuantity,
        limit,
        offset,
        userId,
        reportName
    });

    return postRequest(getStockBalanceData, body);
}

export const GetStockBalanceReport = ({companyId, date, includeZeroQuantity, limit, offset, userId, reportName}) =>{
    const body = JSON.stringify({
        companyId,
        date,
        includeZeroQuantity,
        limit,
        offset,
        userId,
        reportName
    });

    return postRequest(getStockBalanceReport, body);
}

export const GetMonthlySalesSummaryData = ({companyId, offset, limit, year, month}) =>{
    const body = JSON.stringify({
        companyId,
        year,
        month,
        offset,
        limit
    });

    return postRequest(getMonthlySalesSummaryData, body);
}

export const GetMonthlySalesSummaryReport = ({companyId, year, month, userId, reportName}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        reportName,
        year,
        month,
    });

    return postRequest(getMonthlySalesSummaryReport, body);
}

export const GetSalesPerformanceSummaryData = ({companyId, fromDate, toDate, offset, limit}) => {
    const body = JSON.stringify({
        companyId,
        fromDate,
        toDate,
        offset,
        limit
    });

    return postRequest(getSalesPerformanceSummaryData, body);
}

export const GetSalesPerformanceReport = ({companyId, userId, reportName, fromDate, toDate}) => {
    const body = JSON.stringify({
        companyId,
        userId,
        reportName,
        fromDate,
        toDate
    });

    return postRequest(getSalesPerformanceSummaryReport, body);
}

export const GetPurchaseReturnListingData = ({companyId, fromDate, toDate, showIsDamage, offset, limit}) => {
    const body = JSON.stringify({
        companyId,
        fromDate,
        toDate,
        showIsDamage,
        offset,
        limit
    });

    return postRequest(getPurchaseReturnListingData, body);
}

export const GetPurchaseReturnListingReport = ({companyId, userId, reportName, fromDate, toDate, showIsDamage}) => {
    const body = JSON.stringify({
        companyId,
        userId,
        reportName,
        fromDate,
        toDate,
        showIsDamage
    });

    return postRequest(getPurchaseReturnListingReport, body);
}