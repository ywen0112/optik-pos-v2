import { ApiBaseUrl, postRequest } from "./apiconfig";

const getDashBoardRecord = `${ApiBaseUrl}DashBoard/GetDashBoardRecord`;

export const GetDashBoardRecord = ({companyId, fromDate, toDate, keyword, offset, limit}) =>{
    const body = JSON.stringify({
        companyId,
        fromDate,
        toDate,
        keyword,
        offset,
        limit,
    });

    return postRequest(getDashBoardRecord, body);
};
