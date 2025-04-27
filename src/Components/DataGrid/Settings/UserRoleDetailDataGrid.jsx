import { useRef } from "react";
import StandardDataGridComponent from "../../BaseDataGrid";
import { Column, Editing } from "devextreme-react/cjs/data-grid";

const UserRoleDetailTableDataGrid = ({selectedRole, className, onEdit, action}) =>{
    const userRoleDetailDataGridRef = useRef(null);

    return (
        <StandardDataGridComponent
            className={className}
            ref = {userRoleDetailDataGridRef}
            height={"100%"}
            dataSource={selectedRole}
            searchPanel={false}
            pager={false}
            pageSizeSelector={false}
            columnChooser={false}
            showBorders={true}
            allowColumnResizing={false}
            allowColumnReordering={false}
            allowEditing={true}
            onRowUpdated={onEdit}
        >
            <Editing
                mode="cell"
                allowUpdating={action === "edit" || action === "new"}
            />
            <Column dataField="module" caption="Module" />
            <Column dataField="allow" caption="Allow" dataType="boolean"/>
            <Column dataField="add" caption="Add" dataType="boolean"/>
            <Column dataField="view" caption="View" dataType="boolean"/>
            <Column dataField="edit" caption="Edit" dataType="boolean" />
            <Column dataField="delete" caption="Delete" dataType="boolean" />
            
        </StandardDataGridComponent>
    )
}

export default UserRoleDetailTableDataGrid;