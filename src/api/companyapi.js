import { ApiBaseUrl, postRequest } from "./apiconfig";

const getCompanyRecords     =`${ApiBaseUrl}Company/GetRecord`;
const getCompany            =`${ApiBaseUrl}Company/Get`;
const saveCompany           =`${ApiBaseUrl}Company/Save`;

export const GetCompanyRecords = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getCompanyRecords, body)
}

export const GetCompany = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getCompany, body)
}

export const SaveCompany = ({actionData, companyName, companyLogo, registrationNo, address, phone1, phone2, emailAddress}) =>{
    const body = JSON.stringify({
        actionData,
        companyName,
        companyLogo,
        registrationNo,
        address,
        phone1,
        phone2,
        emailAddress,
    });

    return postRequest(saveCompany, body);
}