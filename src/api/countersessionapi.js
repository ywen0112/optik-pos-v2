import {ApiBaseUrl, postRequest} from './apiconfig'

const getCounterSessionsRecords = `${ApiBaseUrl}CounterSession/GetRecords`;
const openCounterSession        = `${ApiBaseUrl}CounterSession/OpenCounterSession`;
const getActiveCounterSession   = `${ApiBaseUrl}CounterSession/GetActiveCounterSession`;
const closeCounterSession       = `${ApiBaseUrl}CounterSession/CloseCounterSession`;
const saveCounterSession        = `${ApiBaseUrl}CounterSession/Save`;

export const GetCounterSessionsRecords = ({companyId, keyword, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        keyword,
        offset,
        limit,
    });

    return postRequest(getCounterSessionsRecords, body);
};

export const OpenCountersession = ({actionData, openingBalance}) =>{
    const body = JSON.stringify({
        actionData,
        openingBalance,
    });

    return postRequest(openCounterSession, body);
}

export const GetActiveCounterSession = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(getActiveCounterSession, body);
};

export const CloseCounterSession = ({companyId, userId, id}) =>{
    const body = JSON.stringify({
        companyId,
        userId,
        id,
    });

    return postRequest(closeCounterSession, body);
};

export const SaveCounterSession = ({actionData, counterSessionId, inputCashAmount, inputCreditCardAmount, inputEWalletAmount, systemCashAmount, systemCreditCardAmount, systemEWalletAmount, cashVariance, creditCardVariance, eWalletVariance}) =>{
    const body = JSON.stringify({
        actionData,
        counterSessionId,
        inputCashAmount,
        inputCreditCardAmount,
        inputEWalletAmount,
        systemCashAmount,
        systemCreditCardAmount,
        systemEWalletAmount,
        cashVariance,
        creditCardVariance,
        eWalletVariance,
    });

    return postRequest(saveCounterSession, body);
};