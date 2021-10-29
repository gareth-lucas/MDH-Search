import React, { useState, useEffect } from 'react';
import { PaginatedTableHeader } from './PaginatedTableHeader';
import { PaginatedTableBody } from './PaginatedTableBody';
import { PaginateTableFooter } from './PaginateTableFooter';
import './paginated-table.css';

export default function PaginatedTable(
    {
        data,
        columns,
        columnTitles,
        columnClassNames,
        rowsPerPage,
        filterableColumns,
        sortableColumns,
        totalsColumns,
        tableClassName
    }) {

    const [currentPage, setCurrentPage] = useState(1);
    const [viewData, setViewData] = useState(data);
    const [currentFilters, setCurrentFilters] = useState([]);
    const [currentSorters, setCurrentSorters] = useState([]);

    useEffect(() => {
        const loadData = () => {
            setViewData(data);
        }

        loadData();
    }, [data]);

    const applyCurrentFilters = () => {
        const filteredData = currentFilters.reduce((viewData, f) => {
            viewData = viewData.filter(row => {
                return row[f.name].toLowerCase().indexOf(f.value.toLowerCase()) >= 0
            });

            return viewData;
        }, data);

        setViewData(filteredData);
    }

    const applyCurrentSorters = () => {
        const sortedData = currentSorters.reduce((viewData, s) => {
            viewData = viewData.sort((a, b) => {
                if (a[s.name] > b[s.name]) return 1;
                return -1;
            });

            return viewData;
        }, viewData)

        setViewData(sortedData);
    }


    if (columnTitles && columns.length !== columnTitles.length) {
        return <div className="text-danger">Display Columns and Column Titles must be the same length!</div>
    }

    const changeCurrentPage = (p) => {
        setCurrentPage(p);
    }

    const handleFilter = (name, value) => {
        const index = currentFilters.findIndex(obj => obj.name === name);
        if (index < 0) { //filter not found in currentFilters
            currentFilters.push({ name: name, value: value });
        } else {
            if (value === '') { // remove the filter
                currentFilters.splice(index, 1);
            } else {
                currentFilters[index] = { name: name, value: value }
            }
        }

        setCurrentFilters(currentFilters);
        applyCurrentFilters();
    }

    const handleSorter = (name, asc) => {
        const index = currentSorters.findIndex(obj => obj.name === name);
        if (index < 0) { //filter not found in currentFilters
            currentSorters.push({ name: name, value: asc });
        } else {
            if (asc === '') { // remove the filter
                currentSorters.splice(index, 1);
            } else {
                currentSorters[index] = { name: name, value: asc }
            }
        }

        setCurrentSorters(currentSorters);
        applyCurrentSorters();
    }


    return (
        <>
            <table className={tableClassName}>
                <PaginatedTableHeader columns={columns}
                    columnTitles={columnTitles}
                    columnClassNames={columnClassNames}
                    filterableColumns={filterableColumns}
                    filters={currentFilters}
                    sortableColumns={sortableColumns}
                    sorters={currentSorters}
                    handleFilter={handleFilter}
                    handleSorter={handleSorter}
                />
                <PaginatedTableBody columns={columns}
                    columnClassNames={columnClassNames}
                    data={viewData}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    filters={currentFilters}
                    sorters={currentSorters}
                />
                <PaginateTableFooter columns={columns}
                    totalsColumns={totalsColumns}
                    dataItems={viewData}
                    rowsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={changeCurrentPage}
                />
            </table>
        </>
    )
}

PaginatedTable.defaultProps = {
    filterableColumns: [],
    sortableColumns: [],
    totalsColumns: [],
    tableClassName: "table",
    columnClassNames: [],
    data: [],
    columns: [],
    columnTitles: []
}