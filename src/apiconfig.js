export const ApiBaseUrl = "https://optikposwebsiteapi.absplt.com/";

//Users
export const UsersApi = `${ApiBaseUrl}Users/`;
export const GetUserLogins = `${UsersApi}GetUserLogins`;
export const GetSpecificUser = `${UsersApi}GetSpecificUser`;

//Cash Counter
export const CashCounterApi = `${ApiBaseUrl}CashCounter/`;
export const GetCounterSessionRecords  = `${CashCounterApi}GetCounterSessionRecords`;
export const GetCounterSummaryReport = `${CashCounterApi}GetCounterSummaryReport?CounterSessionId=`;
export const GetCashTransactionsRecords = `${CashCounterApi}GetCashTransactionsRecords`;
export const VoidCashTransaction = `${CashCounterApi}VoidCashTransaction`;