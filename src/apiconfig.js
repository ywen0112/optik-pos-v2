export const ApiBaseUrl = "https://optikposwebsiteapistaging.4788511.xyz/";

//Users
export const UsersApi = `${ApiBaseUrl}Users/`;
export const GetUserLogins = `${UsersApi}GetUserLogins`;
export const GetSpecificUser = `${UsersApi}GetSpecificUser`;
export const GetUsers = `${UsersApi}GetUsers`;

//Cash Counter
export const CashCounterApi = `${ApiBaseUrl}CashCounter/`;
export const CheckCounterSession = `${CashCounterApi}CheckCounterSession`;
export const GetCounterSessionRecords  = `${CashCounterApi}GetCounterSessionRecords`;
export const GetCounterSummaryReport = `${CashCounterApi}GetCounterSummaryReport?CounterSessionId=`;
export const GetCashTransactionsRecords = `${CashCounterApi}GetCashTransactionsRecords`;
export const VoidCashTransaction = `${CashCounterApi}VoidCashTransaction`;
export const OpenCounterSession = `${CashCounterApi}OpenCounterSession`;
export const NewCashTransaction = `${CashCounterApi}NewCashTransaction`;

//Debtor
export const DebtorApi = `${ApiBaseUrl}Debtor/`;
export const GetDebtorRecords = `${DebtorApi}GetRecords`;

//Location
export const LocationApi = `${ApiBaseUrl}Location/`;
export const GetLocationRecords = `${LocationApi}GetRecords`;