import React, { useState, useEffect } from 'react';
import { FaTimesCircle } from 'react-icons/fa';

export const PaginatedTableColumnFilter = ({ name, columnTitle, handleFilter, filters }) => {

    const [value, setValue] = useState('');

    useEffect(() => {
        const setFilterValue = () => {
            if (filters.length === 0) return;

            const idx = filters.findIndex(obj => (obj.name === name));
            if (idx < 0) {
                setValue('');
            } else {
                setValue(filters[idx].value);
            }
        }

        setFilterValue();
    }, [filters, name])

    const doHandleFilter = (e) => {
        setValue(e.target.value);
        handleFilter(e.target.name, e.target.value);
    }

    const clearInput = (e) => {
        setValue('');
        handleFilter(name, '');
    }

    return (
        <>
            <input style={{ width: "150px" }} className="column-filter" autoComplete="off" name={name} value={value} onChange={(e) => doHandleFilter(e)} placeholder={`${columnTitle} Filter`} />
            <span><FaTimesCircle color={value === '' ? '#EEE' : '#F00'} size={16} onClick={(e) => clearInput(e)} /></span>
        </>
    )
}