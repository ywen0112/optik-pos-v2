import { ApiBaseUrl, postRequest } from "./apiconfig";

const newSalesOrderCollect = `${ApiBaseUrl}SalesOrderCollect/New`;
const newSalesOrderCollectDetail = `${ApiBaseUrl}SalesOrderCollect/NewDetail`;
const saveSalesOrderCollect = `${ApiBaseUrl}SalesOrderCollect/Save`;

export const NewSalesOrderCollect = ({companyId,userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(newSalesOrderCollect, body);
};

export const NewSalesOrderCollectDetail = () =>{
    const body = JSON.stringify({});

    return postRequest(newSalesOrderCollectDetail, body);
};

export const SaveSalesOrderCollect = ({actionData, salesOrderCollectId, salesOrderId, docNo, docDate, isVoid, details}) =>{
    const body = JSON.stringify({
        actionData,
        salesOrderCollectId,
        salesOrderId,
        docNo,
        docDate,
        isVoid,
        details,
    });

    return postRequest(saveSalesOrderCollect, body);
};
