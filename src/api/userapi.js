import { ApiBaseUrl, postRequest } from "./apiconfig";

//Login
const loginUrl          = `${ApiBaseUrl}UserLogin/LoginUser`;

//User
const getUserRecords    = `${ApiBaseUrl}User/GetRecords`;
const getUser           = `${ApiBaseUrl}User/Get`;
const changePassword    = `${ApiBaseUrl}User/ChangePassword`;
const saveUser          = `${ApiBaseUrl}User/Save`;
const deleteUser        = `${ApiBaseUrl}User/Delete`;

//register
const inviteUser        = `${ApiBaseUrl}Register/InviteUser`;
const registerUser      = `${ApiBaseUrl}Register/RegisterUser`;
const registerCompany   = `${ApiBaseUrl}Register/RegisterCompany`;

export const LoginUser = ({userEmailAddress, userPassword}) =>{
    const body = JSON.stringify({
        userEmailAddress,
        userPassword,
    });

    return postRequest(loginUrl, body)
};

export const GetUserRecords = ({companyId, keyword, offset, limit}) => {
    const body = JSON.stringify({
        companyId,
        keyword,
        offset,
        limit,
    });

    return postRequest(getUserRecords, body);
};

export const GetSpecificUser = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getUser, body);
};

export const ChangePassword = ({userId, userPassword, userNewPassword}) => {
    const body = JSON.stringify({
        userId,
        userPassword,
        userNewPassword,
    });

    return postRequest(changePassword, body);
};

export const SaveUserUpdate = ({actionData, userId, userName, userEmailAddress, userRoleId}) => {
    const body = JSON.stringify({
        actionData,
        userId,
        userName,
        userEmailAddress,
        userRoleId,
    });

    return postRequest(saveUser, body);
};

export const DeleteUser = ({companyId, userId, id}) => {
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(deleteUser, body);
};

export const InviteUser = ({companyId, userId, userEmailAddress}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        userEmailAddress,
    });

    return postRequest(inviteUser, body);
};

export const RegisterUser = ({companyId, userName, userEmailAddress, userPassword}) =>{
    const body = JSON.stringify({
        companyId,
        userName,
        userEmailAddress,
        userPassword,
    });

    return postRequest(registerUser, body);
};

export const RegisterCompany = ({customerId, homeCurrency, location, companyName, userName, userEmailAddress, userPassword}) =>{
    const body = JSON.stringify({
        customerId,
        homeCurrency,
        location,
        companyName,
        userName,
        userEmailAddress,
        userPassword,
    });

    return postRequest(registerCompany, body);
};