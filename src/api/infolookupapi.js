import { ApiBaseUrl, postRequest } from "./apiconfig";

const getClassificationCodes = `${ApiBaseUrl}InfoLookup/GetClassificationCodes`;
const getCreditors = `${ApiBaseUrl}InfoLookup/GetCreditors`;
const getDebtors = `${ApiBaseUrl}InfoLookup/GetDebtors`;
const getItemGroups = `${ApiBaseUrl}InfoLookup/GetItemGroups`;
const getItems = `${ApiBaseUrl}InfoLookup/GetItems`;
const getItemTypes = `${ApiBaseUrl}InfoLookup/GetItemTypes`;
const getItemUOMs = `${ApiBaseUrl}InfoLookup/GetItemUOMs`;
const getPaymentMethods = `${ApiBaseUrl}InfoLookup/GetPaymentMethods`;
const getUserRoles = `${ApiBaseUrl}InfoLookup/GetUserRoles`;
const getUsers = `${ApiBaseUrl}InfoLookup/GetUsers`;

export const getInfoLookUp = ({type, companyId, keyword, offset, limit}) =>{
    const url = "";
    switch(type){
        case "classification":
            url = getClassificationCodes;
            break;
        case "creditor":
            url = getCreditors;
            break;
        case "debtor":
            url = getDebtors;
            break;
        case "item_group":
            url = getItemGroups;
            break;
        case "item":
            url = getItems;
            break;
        case "item_type":
            url = getItemTypes;
            break;
        case "item_uom":
            url = getItemUOMs;
            break;
        case "payment_method":
            url = getPaymentMethods;
            break;
        case "user_role":
            url = getUserRoles;
            break;
        case "user":
            url = getUsers;
            break;
    }

    const body = JSON.stringify({
        companyId,
        keyword,
        offset,
        limit,
    });

    return postRequest(url, body);
};