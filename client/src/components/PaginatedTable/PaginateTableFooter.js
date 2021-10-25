export const PaginateTableFooter = (
    {
        columns,
        totalsColumns,
        dataItems,
        rowsPerPage,
        setCurrentPage,
        currentPage
    }) => {

    var totalsRowMarkup = '';

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

    var buttons = [];



    const totalPages = Math.ceil(dataItems.length / rowsPerPage);

    if (totalPages > 1) {
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages;

        const pagesArray = [1, currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, totalPages].filter(p => (p > 0 || p <= totalPages));

        for (var x = 0; x < pagesArray.length; x++) {
            buttons.push(<button key={x} className="btn btn-secondary mx-1" name={`page_${pagesArray[x]}`} onClick={(e) => setCurrentPage(e)}>{pagesArray[x]}</button>)
        }
    }

    return (
        <tfoot>
            {totalsRowMarkup}
            <tr>
                <th colSpan={columns.length} className="text-center">
                    {buttons}
                </th>
            </tr>
        </tfoot>
    )
}