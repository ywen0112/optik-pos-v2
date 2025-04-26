import { TrashIcon } from "lucide-react";
import { Column } from "devextreme-react/cjs/data-grid";
import StandardDataGridComponent from "../BaseDataGrid";

const DocNoYearlyNumberingDataGrid = ({ className, onError, onDelete, data }) => {

    return (
        <StandardDataGridComponent
            searchPanel={false}
            columnChooser={false}
            pager={false}
            dataSource={data}
        >
            <Column dataField="year" caption="Year" width={"60px"}/>
            <Column dataField="m1NextNumber" caption="Jan" width={"60px"}/>
            <Column dataField="m2NextNumber" caption="Feb" width={"60px"}/>
            <Column dataField="m3NextNumber" caption="Mar" width={"60px"}/>
            <Column dataField="m4NextNumber" caption="Apr" width={"60px"}/>
            <Column dataField="m5NextNumber" caption="May" width={"60px"}/>
            <Column dataField="m6NextNumber" caption="Jun" width={"60px"}/>
            <Column dataField="m7NextNumber" caption="Jul" width={"60px"}/>
            <Column dataField="m8NextNumber" caption="Aug" width={"60px"}/>
            <Column dataField="m9NextNumber" caption="Sep" width={"60px"}/>
            <Column dataField="m10NextNumber" caption="Oct" width={"60px"}/>
            <Column dataField="m11NextNumber" caption="Nov" width={"60px"}/>
            <Column dataField="m12NextNumber" caption="Dev" width={"60px"}/>
            <Column
                caption="Action"
                cellRender={(cellData) => (
                    <div className="flex flex-row justify-center space-x-2">

                        <div
                            className="text-red-600 hover:cursor-pointer flex justify-center"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(cellData.data);
                            }}
                        >
                            <TrashIcon size={20} />
                        </div>
                    </div>
                )}
            />


        </StandardDataGridComponent>
    );
};

export default DocNoYearlyNumberingDataGrid;