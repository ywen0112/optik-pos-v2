import React, { forwardRef } from 'react';
import DataGrid, {
    ColumnChooser,
    Export,
    Grouping,
    GroupPanel,
    LoadPanel,
    Pager,
    Paging,
    SearchPanel,
    Sorting,
    Selection,
    Scrolling
} from 'devextreme-react/data-grid';

const pageSizes = [10, 25, 50, 100];

const StandardDataGridComponent = ({
    ref,
    height,
    className,
    dataSource,
    children,
    groupPanel = false,
    searchPanel = true,
    pager = true,
    pageSizeSelector = true,
    defaultPageSize = 10,
    sorting = 'multiple',
    selection = 'none',
    scrollingMode = 'standard',
    columnAutoWidth = true,
    columnChooser = true,
    onEditorPreparing,
    onCellClick,
    allowColumnReordering,
    allowColumnResizing,
    showBorders,
    onLoading,
    onOptionChanged,
    columns,
    onRowUpdated,
    ...rest
}) => {
    return (
        <DataGrid
            ref={ref}
            height={height}
            className={className}
            dataSource={dataSource}
            allowColumnReordering
            allowColumnResizing
            columnResizingMode="widget"
            width="100%"
            columnAutoWidth={columnAutoWidth}
            showRowLines
            hoverStateEnabled
            showBorders
            onRowUpdated={onRowUpdated}
            onOptionChanged={onOptionChanged}
            onEditorPreparing={(e) => {
                if (e.parentType === 'searchPanel') {
                    e.editorOptions.maxLength = 100;
                }
                if (onEditorPreparing) {
                    onEditorPreparing(e);
                }
            }}
            onCellClick={(e) => {
                window.GLOBAL_GridLastCellClickTime = new Date().getTime();
                if (onCellClick) {
                    onCellClick(e);
                }
            }}
            {...rest}
        >
            <ColumnChooser enabled={columnChooser} mode={window.innerWidth >= 992 ? 'dragAndDrop' : 'select'} />
            <GroupPanel visible={groupPanel} />
            <Grouping autoExpandAll={false} />
            <SearchPanel visible={searchPanel} searchVisibleColumnsOnly />
            <Sorting mode={sorting} />
            <Selection mode={selection} />
            <Scrolling mode={scrollingMode} useNative />
            <Pager
                allowedPageSizes={pageSizes}
                showInfo
                showNavigationButtons
                showPageSizeSelector={pageSizeSelector}
                visible={pager}
            />
            <Paging enabled={pager} defaultPageSize={defaultPageSize} />
            <LoadPanel enabled={onLoading} />
            {children}
        </DataGrid>
    );
};

export default StandardDataGridComponent;
