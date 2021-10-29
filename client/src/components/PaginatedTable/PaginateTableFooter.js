import React from 'react';

export const PaginateTableFooter = (
    {
        columns,
        totalsColumns,
        dataItems,
        rowsPerPage,
        setCurrentPage,
        currentPage
    }) => {

    var totalsRowMarkup = null;

    if (totalsColumns.length > 0) {
        const totalsRow = totalsColumns.reduce((totalsRow, tc) => {
            // for each total, we sum the dataItem[tc] and put it into the appropriate column.
            const tot = dataItems.reduce((tot, cur) => {
                tot = ((1 * tot) + (1 * cur[tc])).toFixed(2);

                return tot;
            }, 0);

            totalsRow[tc] = tot;
            return totalsRow;
        }, {});

        totalsRowMarkup = <tr>{columns.map(c => {
            return <th>{totalsRow[c] && totalsRow[c]}</th>
        })}</tr>;
    }


    const totalPages = Math.ceil(dataItems.length / rowsPerPage);
    if (!currentPage) currentPage = 1;

    if (totalPages <= 1) {
        return <tfoot>{totalsRowMarkup}</tfoot>
    }

    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const pagesArray = [1, currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, totalPages].filter((p, i, s) => {
        return ((p > 0 && p <= totalPages) && s.indexOf(p) === i)
    });

    const buttons = pagesArray.map(p => {
        const className = (p === currentPage) ? "btn btn-primary mx-1" : "btn btn-secondary mx-1";
        return <button key={p} className={className} onClick={() => setCurrentPage(p)}>{p}</button>
    });


    return (
        <tfoot>{totalsRowMarkup}<tr><th colSpan={columns.length} className="text-center">{buttons}</th></tr></tfoot>
    )
}