import React, { useEffect, useState } from 'react';

export const PaginatedTableBody = ({ columns, columnClassNames, data, currentPage, rowsPerPage }) => {

    const [viewData, setViewData] = useState();

    useEffect(() => {
        const sliceData = () => {
            const start = (currentPage - 1) * rowsPerPage;
            const end = (currentPage * rowsPerPage);

            setViewData(data.slice(start, end));
        }

        sliceData();
    }, [currentPage, data, rowsPerPage])

    return (
        <tbody>
            {(!viewData || viewData.length === 0) &&
                <tr>
                    <td colSpan={columns.length} className="text-center">No Data Found</td>
                </tr>
            }
            {viewData && viewData.map((row, idx) => {
                return (
                    <tr key={idx}>
                        {columns.map((f, i) => {
                            if (f !== '_actions') {
                                return <td key={i} className={columnClassNames[i] ? columnClassNames[i] : ''}>{row[f]}</td>
                            }

                            return <td key={i} className={columnClassNames[i] ? columnClassNames[i] : ''}>{row[f].map((a, idx2) => {
                                return <button key={idx2} className="button-link" onClick={(e) => a.onClick(row.id)}>{a.name}</button>
                            })
                            }</td>
                        })}
                    </tr>
                )
            })
            }
        </tbody>
    )
}