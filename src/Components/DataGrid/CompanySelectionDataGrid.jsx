import StandardDataGridComponent from "../BaseDataGrid"
import { TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    Column
} from "devextreme-react/data-grid"

const CompanySelectionDataGrid = ({ companies }) => {
    const navigate = useNavigate();
    
    const handleCompanySelect = (company) => {
        sessionStorage.setItem("userId", company.userId);
        sessionStorage.setItem("companyId", company.companyId);
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("accessRights", JSON.stringify(company.accessRight));
        sessionStorage.setItem("selectedCompany", JSON.stringify(company));

        navigate("/dashboard");
    };

    const handleCompanyDelete = (company) => {
        // Placeholder: Replace this with a real delete logic (API call, state update, etc.)
        // console.log("Delete company:", company);
        alert(`Delete company "${company.companyName}" clicked!`);
    };

    return (
        <>
            <StandardDataGridComponent
                height={"100%"}
                dataSource={companies}
                searchPanel={false}
                pager={false}
                pageSizeSelector={false}
                onCellClick={cellData => handleCompanySelect(cellData.key)}
                exportToExcel={false}
                columnChooser={false}
                showBorders={true}
                allowColumnReordering={false}
                allowColumnResizing={false}
                
            >
                <Column
                    dataField="companyName"
                    allowEditing={false}
                    headerCellRender={() =>{
                        return(
                            <div className="font-bold text-white">
                                Company Name
                            </div>
                        )
                    }}
                    cellRender={(cellData)=>{
                        return (
                            <div className="text-gray-700 hover:underline underline-offset-1">
                                {cellData.data.companyName}
                            </div>
                        )
                    }}
                />
                <Column
                    caption="Action"
                    width={"10%"}
                    headerCellRender={() =>{
                        return(
                            <div className="  font-bold text-white">
                                Action
                            </div>
                        )
                    }}
                    cellRender={(cellData) => {
                        return (
                            <div className="text-red-600 hover:cursor-pointer flex justify-center "
                            onClick={(e) => {
                                e.stopPropagation(); // prevent row click event (select)
                                handleCompanyDelete(cellData.data);
                            }}>
                                <TrashIcon size={20}/>
                            </div>
                        );
                    }}
                />
            </StandardDataGridComponent>
        </>
    )
}

export default CompanySelectionDataGrid