export const ApiBaseUrl = "https://optikposwebsiteapistaging.4788511.xyz/";

//Users
export const UsersApi = `${ApiBaseUrl}Users/`;
export const GetUserLogins = `${UsersApi}GetUserLogins`;
export const GetSpecificUser = `${UsersApi}GetSpecificUser`;
export const GetUsers = `${UsersApi}GetUsers`;
export const UpdateUser = `${UsersApi}UpdateUser`;
export const ChangePassword = `${UsersApi}ChangePassword`;
export const DeleteUser = `${UsersApi}DeleteUser`;
export const InviteUser = `${UsersApi}InviteUser`;
export const InviteOwner = `${UsersApi}InviteOwner`;
export const RegisterUser = `${UsersApi}RegisterUser`;

//Cash Counter
export const CashCounterApi = `${ApiBaseUrl}CashCounter/`;
export const CheckCounterSession = `${CashCounterApi}CheckCounterSession`;
export const GetCounterSessionRecords  = `${CashCounterApi}GetCounterSessionRecords`;
export const GetCounterSummaryReport = `${CashCounterApi}GetCounterSummaryReport?CounterSessionId=`;
export const GetCashTransactionsRecords = `${CashCounterApi}GetCashTransactionsRecords`;
export const VoidCashTransaction = `${CashCounterApi}VoidCashTransaction`;
export const OpenCounterSession = `${CashCounterApi}OpenCounterSession`;
export const NewCashTransaction = `${CashCounterApi}NewCashTransaction`;
export const NewCloseCounterSession = `${CashCounterApi}NewCloseCounterSession`;
export const SaveCloseCounterSession = `${CashCounterApi}SaveCloseCounterSession`;

//Debtor
export const DebtorApi = `${ApiBaseUrl}Debtor/`;
export const GetDebtorRecords = `${DebtorApi}GetRecords`;

//Creditor
export const CreditorApi = `${ApiBaseUrl}Creditor/`
export const GetCreditorRecords = `${CreditorApi}GetRecords`;

//Location
export const LocationApi = `${ApiBaseUrl}Location/`;
export const GetLocationRecords = `${LocationApi}GetRecords`;

//Sales
export const SalesApi = `${ApiBaseUrl}Sales/`;
export const NewSales = `${SalesApi}New`;
export const SaveSales = `${SalesApi}Save`;
export const SaveSalesPayment = `${SalesApi}SaveSalesPayment`

//Purchases
export const PurchasesApi = `${ApiBaseUrl}Purchases/`;
export const NewPurchases = `${PurchasesApi}New`;
export const SavePurchases = `${PurchasesApi}Save`;
export const SavePurchasePayment = `${PurchasesApi}SavePurchasePayment`

//Credit Note
export const CreditNoteApi = `${ApiBaseUrl}CreditNote/`;
export const NewCreditNote = `${CreditNoteApi}New`;

//Item
export const ItemApi = `${ApiBaseUrl}Item/`;
export const GetItemRecords = `${ItemApi}GetRecords`;

//Access Rights
export const AccessRightApi = `${ApiBaseUrl}AccessRight/`;
export const GetAccessRightRecords = `${AccessRightApi}GetRecords`; 

//Company
export const CompanyApi = `${ApiBaseUrl}Company/`;
export const GetCompany = `${CompanyApi}GetCompany`;
export const EditCompany = `${CompanyApi}Edit`;
export const SaveCompany = `${CompanyApi}Save`;

//Eye Power
export const EyePowerApi = `${ApiBaseUrl}EyePower/`;
export const GetDebtorPreviousEyeProfile = `${EyePowerApi}GetDebtorPreviousEyeProfile`;
export const NewEyePower = `${EyePowerApi}New`;
export const SaveEyePower = `${EyePowerApi}Save`;
