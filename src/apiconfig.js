export const ApiBaseUrl = "https://optikposwebsiteapi.absplt.com/";
// export const ApiBaseUrl = "http://localhost:1014/";
export const ReportBaseUrl = "https://report.absplt.com/";
// export const ReportBaseUrl = "https://localhost:7254/";

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
export const NewDebtor = `${DebtorApi}New`;
export const EditDebtor = `${DebtorApi}Edit`;
export const SaveDebtor = `${DebtorApi}Save`;
export const DeleteDebtor = `${DebtorApi}Delete`;

//Debtor Type
export const DebtorTypeApi = `${ApiBaseUrl}DebtorType/`;
export const GetDebtorType = `${DebtorTypeApi}GetRecords`;

//Creditor
export const CreditorApi = `${ApiBaseUrl}Creditor/`
export const GetCreditorRecords = `${CreditorApi}GetRecords`;
export const NewCreditor = `${CreditorApi}New`;
export const EditCreditor = `${CreditorApi}Edit`;
export const SaveCreditor = `${CreditorApi}Save`;
export const DeleteCreditor = `${CreditorApi}Delete`;

//Debtor Type
export const CredtiorTypeApi = `${ApiBaseUrl}CreditorType/`;
export const GetCreditorType = `${CredtiorTypeApi}GetRecords`;

//Location
export const LocationApi = `${ApiBaseUrl}Location/`;
export const GetLocationRecords = `${LocationApi}GetRecords`;
export const NewLocation = `${LocationApi}New`;
export const EditLocation = `${LocationApi}Edit`;
export const SaveLocation = `${LocationApi}Save`;
export const DeleteLocation = `${LocationApi}Delete`;

//Sales
export const SalesApi = `${ApiBaseUrl}Sales/`;
export const NewSales = `${SalesApi}New`;
export const SaveSales = `${SalesApi}Save`;
export const SaveSalesPayment = `${SalesApi}SaveSalesPayment`;
export const GetSales = `${SalesApi}GetRecords`;
export const VoidSales = `${SalesApi}Void`;
export const GetJobSheetForm = `${SalesApi}GetJobSheetForm`

//Purchases
export const PurchasesApi = `${ApiBaseUrl}Purchases/`;
export const NewPurchases = `${PurchasesApi}New`;
export const SavePurchases = `${PurchasesApi}Save`;
export const SavePurchasePayment = `${PurchasesApi}SavePurchasePayment`;
export const GetPurchases = `${PurchasesApi}GetRecords`;
export const VoidPurchases = `${PurchasesApi}Void`;

//Credit Note
export const CreditNoteApi = `${ApiBaseUrl}CreditNote/`;
export const NewCreditNote = `${CreditNoteApi}New`;

//Item
export const ItemApi = `${ApiBaseUrl}Item/`;
export const GetItemRecords = `${ItemApi}GetRecords`;
export const NewItem = `${ItemApi}New`;
export const NewItemDetail = `${ItemApi}NewDetail`;
export const EditItem = `${ItemApi}Edit`;
export const SaveItem = `${ItemApi}Save`;
export const DeleteItem = `${ItemApi}Delete`;

//Item Type
export const ItemTypeApi = `${ApiBaseUrl}ItemType/`;
export const GetItemType = `${ItemTypeApi}GetRecords`;

//Item Group
export const ItemGroupApi = `${ApiBaseUrl}ItemGroup/`;
export const GetItemGroup = `${ItemGroupApi}GetRecords`;

//Access Rights
export const AccessRightApi = `${ApiBaseUrl}AccessRight/`;
export const GetAccessRightRecords = `${AccessRightApi}GetRecords`; 
export const EditAccessRight = `${AccessRightApi}Edit`;
export const SaveAccessRight = `${AccessRightApi}Save`;
export const NewAccessRight = `${AccessRightApi}New`;
export const DeleteAccessRight = `${AccessRightApi}Delete`;

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
export const GetDebtorEyePowerRecords = `${EyePowerApi}GetDebtorEyePowerRecords`;
export const EditEyePower = `${EyePowerApi}Edit`;
export const DeleteEyePower = `${EyePowerApi}Delete`;

//Audit Logs
export const AuditLogApi = `${ApiBaseUrl}AuditLog/`;
export const GetAuditLog = `${AuditLogApi}GetRecords`;
export const GetAllAuditChangeType = `${AuditLogApi}GetAllAuditChangeType`;

//Report
export const ReportApi = `${ApiBaseUrl}Report/`;
export const GetReportSelectionApi = `${ReportApi}GetReportsSelection`