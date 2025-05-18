import { ApiBaseUrl, postRequest } from "./apiconfig";

//CashSales
const getCashSalesRecords       = `${ApiBaseUrl}CashSales/GetRecords`;
const newCashSales              = `${ApiBaseUrl}CashSales/New`;
const newCashSalesDetail        = `${ApiBaseUrl}CashSales/NewDetail`;
const getCashSale               = `${ApiBaseUrl}CashSales/Get`;
const saveCashSale              = `${ApiBaseUrl}CashSales/Save`;
const voidCashSale              = `${ApiBaseUrl}CashSales/Void`;

export const GetCashSalesRecords = ({companyId, keyword, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        keyword,
        offset,
        limit,
    });

    return postRequest(getCashSalesRecords, body);
};

export const NewCashSales = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(newCashSales, body);
};

export const NewCashSalesDetail = () =>{
    const body = JSON.stringify({});

    return postRequest(newCashSalesDetail, body);
};

export const GetCashSale = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getCashSale, body);
};

export const SaveCashSale = ({actionData, cashSalesId, docDate, debtorId, debtorName, remark, refNo, salesPersonUserID, roundingAdjustment, subTotal, total, isVoid, submitEInvoice, details}) =>{
    const body = JSON.stringify({
        actionData,
        cashSalesId,
        docDate,
        debtorId,
        debtorName,
        remark,
        refNo,
        salesPersonUserID,
        roundingAdjustment,
        subTotal,
        total,
        isVoid,
        submitEInvoice,
        details,
    });

    return postRequest(saveCashSale, body);
};

export const VoidCashSale = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(voidCashSale, body)
};

//CashSalesPayment
const getCashSalesPayments      = `${ApiBaseUrl}CashSalesPayment/GetRecords`;
const newCashSalePayment        = `${ApiBaseUrl}CashSalesPayment/New`;
const newCashSalePaymentDetail  = `${ApiBaseUrl}CashSalesPayment/NewDetail`;
const getCashSalesPayment       = `${ApiBaseUrl}CashSalesPayment/Get`;
const saveCashSalesPayment      = `${ApiBaseUrl}CashSalesPayment/Save`;
const voidCashSalesPayment      = `${ApiBaseUrl}CashSalesPayment/Void`;

export const GetCashSalesPaymentRecords = ({companyId, keyword, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        keyword,
        offset,
        limit,
    });

    return postRequest(getCashSalesPayments, body);
};

export const NewCashSalesPayment = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(newCashSalePayment, body);
};

export const NewCashSalesPaymentDetail = () =>{
    const body = JSON.stringify({});

    return postRequest(newCashSalePaymentDetail, body);
};

export const GetCashSalePayment = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getCashSalesPayment, body);
};

export const SaveCashSalePayment = ({actionData, cashSalesPaymentId, cashSalesId, docDate, remark, total, isVoid, details}) =>{
    const body = JSON.stringify({
        actionData,
        cashSalesPaymentId,
        cashSalesId,
        docDate,
        remark,
        total,
        isVoid,
        details,
    });

    return postRequest(saveCashSalesPayment, body);
};

export const VoidCashSalePayment = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(voidCashSalesPayment, body)
};

//PurchaseInvoice
const getPurchaseInvoiceRecords       = `${ApiBaseUrl}PurchaseInvoice/GetRecords`;
const newPurchaseInvoice             = `${ApiBaseUrl}PurchaseInvoice/New`;
const newPurchaseInvoiceDetail        = `${ApiBaseUrl}PurchaseInvoice/NewDetail`;
const getPurchaseInvoice               = `${ApiBaseUrl}PurchaseInvoice/Get`;
const savePurchaseInvoice             = `${ApiBaseUrl}PurchaseInvoice/Save`;
const voidPurchaseInvoice            = `${ApiBaseUrl}PurchaseInvoice/Void`;

export const GetPurchaseInvoiceRecords = ({companyId, keyword, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        keyword,
        offset,
        limit,
    });

    return postRequest(getPurchaseInvoiceRecords, body);
};

export const NewPurchaseInvoice = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(newPurchaseInvoice, body);
};

export const NewPurchaseInvoiceDetail = () =>{
    const body = JSON.stringify({});

    return postRequest(newPurchaseInvoiceDetail, body);
};

export const GetPurchaseInvoice = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getPurchaseInvoice, body);
};

export const SavePurchaseInvoice = ({actionData, purchaseInvoiceId, docDate, creditorId, creditorName, remark, refNo, supplierRef, purchasePersonUserID, subTotal, total, tax, isVoid, details}) =>{
    const body = JSON.stringify({
        actionData,
        purchaseInvoiceId,
        docDate,
        creditorId,
        creditorName,
        remark,
        refNo,
        supplierRef,
        purchasePersonUserID,
        subTotal,
        tax,
        total,
        isVoid,
        details,
    });

    return postRequest(savePurchaseInvoice, body);
};

export const VoidPurchaseInvoice = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(voidPurchaseInvoice, body)
};

//PurchaseInvoicePayment
const getPurchaseInvoicePayments      = `${ApiBaseUrl}PurchaseInvoicePayment/GetRecords`;
const newPurchaseInvoicePayment        = `${ApiBaseUrl}PurchaseInvoicePayment/New`;
const newPurchaseInvoicePaymentDetail  = `${ApiBaseUrl}PurchaseInvoicePayment/NewDetail`;
const getPurchaseInvoicePayment       = `${ApiBaseUrl}PurchaseInvoicePayment/Get`;
const savePurchaseInvoicePayment      = `${ApiBaseUrl}PurchaseInvoicePayment/Save`;
const voidPurchaseInvoicePayment      = `${ApiBaseUrl}PurchaseInvoicePayment/Void`;

export const GetPurchaseInvoicePaymentRecords = ({companyId, keyword, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        keyword,
        offset,
        limit,
    });

    return postRequest(getPurchaseInvoicePayments, body);
};

export const NewPurchaseInvoicePayment = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(newPurchaseInvoicePayment, body);
};

export const NewPurchaseInvoicePaymentDetail = () =>{
    const body = JSON.stringify({});

    return postRequest(newPurchaseInvoicePaymentDetail, body);
};

export const GetPurchaseInvoicePayment = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getPurchaseInvoicePayment, body);
};

export const SavePurchaseInvoicePayment = ({actionData, purchaseInvoicePaymentId, purchaseInvoiceId, docDate, remark, total, isVoid, details}) =>{
    const body = JSON.stringify({
        actionData,
        purchaseInvoicePaymentId,
        purchaseInvoiceId,
        docDate,
        remark,
        total,
        isVoid,
        details,
    });

    return postRequest(savePurchaseInvoicePayment, body);
};

export const VoidPurchaseInvoicePayment = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(voidPurchaseInvoicePayment, body)
};

//SalesOrder
const getSalesOrderRecords       = `${ApiBaseUrl}SalesOrder/GetRecords`;
const newSalesOrder            = `${ApiBaseUrl}SalesOrder/New`;
const newSalesOrderDetail        = `${ApiBaseUrl}SalesOrder/NewDetail`;
const getSalesOrder             = `${ApiBaseUrl}SalesOrder/Get`;
const saveSalesOrder            = `${ApiBaseUrl}SalesOrder/Save`;
const voidSalesOrder           = `${ApiBaseUrl}SalesOrder/Void`;

export const GetSalesOrderRecords = ({companyId, keyword, offset, limit, fromDate, toDate}) =>{
    const body = JSON.stringify({
        companyId,
        keyword,
        offset,
        limit,
        fromDate,
        toDate
    });

    return postRequest(getSalesOrderRecords, body);
};

export const NewSalesOrder = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(newSalesOrder, body);
};

export const NewSalesOrderDetail = () =>{
    const body = JSON.stringify({});

    return postRequest(newSalesOrderDetail, body);
};

export const GetSalesOrder = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getSalesOrder, body);
};

export const SaveSalesOrder = ({actionData, salesOrderId, docDate, debtorId, debtorName, remark, refNo, salesPersonUserID, practitionerUserId, nextVisitDate, roundingAdjustment, subTotal, total, isReady, isCollected, isVoid, submitEInvoice, details}) =>{
    const body = JSON.stringify({
        actionData,
        salesOrderId,
        docDate,
        debtorId,
        debtorName,
        remark,
        refNo,
        salesPersonUserID,
        practitionerUserId,
        nextVisitDate,
        roundingAdjustment,
        subTotal,
        total,
        isReady,
        isCollected,
        isVoid,
        submitEInvoice,
        details,
    });

    return postRequest(saveSalesOrder, body);
};

export const VoidSalesOrder = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(voidSalesOrder, body)
};

//SalesOrderPayment
const getSalesOrderPayments     = `${ApiBaseUrl}SalesOrderPayment/GetRecords`;
const newSalesOrderPayment       = `${ApiBaseUrl}SalesOrderPayment/New`;
const newSalesOrderPaymentDetail  = `${ApiBaseUrl}SalesOrderPayment/NewDetail`;
const getSalesOrderPayment      = `${ApiBaseUrl}SalesOrderPayment/Get`;
const saveSalesOrderPayment      = `${ApiBaseUrl}SalesOrderPayment/Save`;
const voidSalesOrderPayment      = `${ApiBaseUrl}SalesOrderPayment/Void`;

export const GetSalesOrderPaymentRecords = ({companyId, keyword, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        keyword,
        offset,
        limit,
    });

    return postRequest(getSalesOrderPayments, body);
};

export const NewSalesOrderPayment = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(newSalesOrderPayment, body);
};

export const NewSalesOrderPaymentDetail = () =>{
    const body = JSON.stringify({});

    return postRequest(newSalesOrderPaymentDetail, body);
};

export const GetSalesOrderPayment = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getSalesOrderPayment, body);
};

export const SaveSalesOrderPayment = ({actionData, salesOrderPaymentId, salesOrderId, docDate, remark, total, isVoid, details}) =>{
    const body = JSON.stringify({
        actionData,
        salesOrderPaymentId,
        salesOrderId,
        docDate,
        remark,
        total,
        isVoid,
        details,
    });

    return postRequest(saveSalesOrderPayment, body);
};

export const VoidSalesOrderPayment = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(voidSalesOrderPayment, body)
};

//StockAdjustment
const getStockAdjustmentRecords       = `${ApiBaseUrl}StockAdjustment/GetRecords`;
const newStockAdjustment            = `${ApiBaseUrl}StockAdjustment/New`;
const newStockAdjustmentDetail        = `${ApiBaseUrl}StockAdjustment/NewDetail`;
const getStockAdjustment            = `${ApiBaseUrl}StockAdjustment/Get`;
const saveStockAdjustment            = `${ApiBaseUrl}StockAdjustment/Save`;
const voidStockAdjustment         = `${ApiBaseUrl}StockAdjustment/Void`;

export const GetStockAdjustmentRecords = ({companyId, keyword, offset, limit, fromDate, toDate}) =>{
    const body = JSON.stringify({
        companyId,
        keyword,
        offset,
        limit,
        fromDate,
        toDate,
    });

    return postRequest(getStockAdjustmentRecords, body);
};

export const NewStockAdjustment = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(newStockAdjustment, body);
};

export const NewStockAdjustmentDetail = () =>{
    const body = JSON.stringify({});

    return postRequest(newStockAdjustmentDetail, body);
};

export const GetStockAdjustment = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getStockAdjustment, body);
};

export const SaveStockAdjustment = ({actionData, stockAdjustmentId, docDate, description, remark, total, isVoid, details}) =>{
    const body = JSON.stringify({
        actionData,
        stockAdjustmentId,
        docDate,
        description,
        remark,
        total,
        isVoid,
        details,
    });

    return postRequest(saveStockAdjustment, body);
};

export const VoidStockAdjustment = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(voidStockAdjustment, body)
};

//GoodsTransit
const getGoodsTransitRecords        =`${ApiBaseUrl}GoodsTransit/GetRecords`;
const newGoodsTransit               =`${ApiBaseUrl}GoodsTransit/New`;
const newGoodsTransitDetail         =`${ApiBaseUrl}GoodsTransit/NewDetail`;
const getGoodTransit                =`${ApiBaseUrl}GoodsTransit/Get`;
const saveGoodTransit               =`${ApiBaseUrl}GoodsTransit/Save`;
const voidGoodTransit               =`${ApiBaseUrl}GoodsTransit/Void`;

export const GetGoodsTransitRecords = ({companyId, fromDate, toDate, keyword, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        fromDate,
        toDate,
        keyword,
        offset,
        limit,
    });

    return postRequest(getGoodsTransitRecords, body);
};

export const NewGoodsTransit = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(newGoodsTransit, body);
};

export const NewGoodsTransitDetail = ({}) =>{
    const body = JSON.stringify({});
    return postRequest(newGoodsTransitDetail, body);
};

export const GetGoodsTransit =  ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getGoodTransit, body);
};

export const SaveGoodsTransit = ({actionData, goodsTransitId, docDate, description, remark, fromLocation, toLocation, total, isVoid, details}) =>{
    const body = JSON.stringify({
        actionData,
        goodsTransitId,
        docDate,
        description,
        remark,
        fromLocation,
        toLocation,
        total,
        isVoid,
        details,
    });

    return postRequest(saveGoodTransit, body);
};

export const VoidGoodsTransit =  ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(voidGoodTransit, body);
};
