import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { ebayapi } from '../../utils/Constants'
import './DataTable.css'


class Datatable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: (props.data && props.data.length !==0) ? props.data : [],
            columns: [],
            selectedColumn: []
        }
        this.tableRef = React.createRef();
    }

    componentWillMount() {
        this.createColumns();
    }

    createColumns() {
        const { tableData } = this.state;
        let getFieldNames = (tableData.length !== 0) ? Object.keys(tableData[0]) : [];
        getFieldNames.shift();
        let allColumns = getFieldNames.map((tag) => {
            let obj = { field: tag, header: tag }
            return obj
        })
        this.setState({ columns: allColumns, selectedColumn: allColumns })
    }


    onColumnToggle = (event) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = this.state.columns.filter(col => selectedColumns.some(sCol => sCol.field === col.field));
        this.setState({ selectedColumn: orderedSelectedColumns })
    }


    exportCSV = () => {
        this.tableRef.current.exportCSV();
    }
    renderHeader = () => {
        const { columns, selectedColumn } = this.state
        return (
            <div className="table-header">
                <Button type="button" icon="pi pi-external-link" label="Export" onClick={this.exportCSV}></Button>
                <MultiSelect value={selectedColumn} options={columns} optionLabel="header" onChange={this.onColumnToggle} style={{ width: '20em' }} />

            </div>
        )
    }

    dynamicColumns = () => {
        const { selectedColumn } = this.state
        return (
            selectedColumn.map((col) => (
                <Column key={col.field} field={col.field}
                    header={col.header} filter sortable
                    filterPlaceholder={`Search by ${col.header}`}
                    headerStyle={{ width: '220px' }}
                />
            ))
        )
    }




    render() {
        const { tableData } = this.state
       
        return (
            <div className="datatable-filter-demo">
                <Card>
                    <DataTable
                        ref={this.tableRef}
                        sortMode="multiple"
                        className="p-datatable-sm"
                        value={tableData}
                        reorderableColumns
                        resizableColumns
                        scrollable
                        columnResizeMode="fit"
                        selectionMode="single"
                        header="Responsive"
                        header={this.renderHeader()}
                        className="p-datatable-striped p-datatable-gridlines"
                        paginator rows={10}
                         loading={tableData.length ===0}
                        emptyMessage="No data found.">
                        {this.dynamicColumns()}
                    </DataTable>
                </Card>
            </div>
        )
    }

}


export default Datatable;



//       //  mongodb+srv://pricecompare:<password>@cluster0.aeaoq.mongodb.net/<dbname>?retryWrites=true&w=majorityOneauto@12




