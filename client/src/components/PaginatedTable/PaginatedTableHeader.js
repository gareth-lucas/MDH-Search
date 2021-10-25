import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import { PaginatedTableColumnFilter } from './PaginatedTableColumnFilter';

export const PaginatedTableHeader = ({ columns, columnTitles, columnClassNames, filterableColumns, sortableColumns, filters, sorters, handleFilter, handleSorter }) => {
    return (
        <thead>
            {(filterableColumns.length > 0 || sorters.length > 0) &&
                <tr>
                    {columns.map((c, i) => {
                        if (filterableColumns.includes(c)) {
                            return (
                                <th key={i} style={{ minWidth: "200px" }}>
                                    <PaginatedTableColumnFilter name={c}
                                        columnTitle={columnTitles[i]}
                                        filters={filters}
                                        handleFilter={handleFilter}
                                    />
                                </th>
                            )
                        } else {
                            return (<th key={i}></th>)
                        }
                    })
                    }
                </tr>
            }
            <tr style={{ height: "60px" }}>
                {columns.map((t, i) => {
                    const title = columnTitles[i];
                    if (sortableColumns.includes(t)) {
                        return (
                            <th key={i} className={columnClassNames[i] ? columnClassNames[i] : ''}>
                                <div>
                                    <div className="row align-items-center">
                                        <div className="col-1">
                                            <div className="row">
                                                <div className="col">
                                                    <FaAngleUp size={12} onClick={() => handleSorter(t, 'asc')} />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <FaAngleDown size={12} onClick={() => handleSorter(t, 'desc')} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <span>{title}</span>
                                        </div>
                                    </div>
                                </div>
                            </th>
                        )
                    }

                    return (
                        <th key={i} className={columnClassNames[i] ? columnClassNames[i] : ''} style={{ verticalAlign: "middle" }}>{title}</th>
                    )
                })
                }
            </tr>
        </thead>
    )
}