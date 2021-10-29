import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const SavedSearchDetail = ({ selectedSearch, onClose }) => {

    const [formattedSearch, setFormattedSearch] = useState([]);

    useEffect(() => {
        const trans = {
            NAME1: 'Nome',
            NAME2: 'Cognome',
            STREET: 'Indirizzo',
            CITY: 'Città',
            EMAIL: 'Email',
            POSTAL_CODE: 'CAP',
            SEARCHTERM: 'Search Term',
            GOLDEN: 'Golden Record',
            QUARANTINE: 'Quarantena',
            EQUALS: 'Uguale a',
            NOT_EQUALS: 'Non uguale a',
            STARTS_WITH: 'Inizia con',
            ENDS_WITH: 'Finisce con',
            CONTAINS: 'Contiene',
            IS_NOT_NULL: 'ha un valore',
            IS_NULL: 'è senza valore'
        }

        const realFields = ['NAME1', 'NAME2', 'STREET', 'CITY', 'EMAIL', 'POSTAL_CODE', 'SEARCHTERM', 'GOLDEN', 'QUARANTINE'];

        const formatSearch = () => {
            const params = JSON.parse(selectedSearch.searchParams);

            const formattedSearch = Object.keys(params).filter(k => (realFields.includes(k))).map(k => {
                var val = params[k];
                if (k === 'GOLDEN' || k === 'QUARANTINE') {
                    val = (params[k] === 'Y') ? <FaCheck color="#198754" size={16} /> : <FaTimes color="#F00" size={16} />
                }
                return { value: val, name: trans[k], operation: trans[params[`${k}_OPERATION`]] }
            });

            setFormattedSearch(formattedSearch);
        }


        if (selectedSearch) {
            formatSearch();
        }
    }, [selectedSearch])

    if (!selectedSearch) {
        return null;
    }



    return (
        <>
            <div className="ses-popup-container text-center">
                <div className="ses-close-button" onClick={e => onClose()}>
                    <FaTimes size={24} color="#FFF" />
                </div>

                <div className="ses-popup-content">
                    <h3>Ricerca Salvata - {selectedSearch.description}</h3>

                    {formattedSearch.filter(i => (i.value !== '')).map((i, idx) => {
                        return <div key={idx} className="d-flex w-50 justify-content-between" style={{ borderBottom: "1px solid #EEE" }}><div>{i.name} {i.operation?.toLowerCase() || ''}:</div><div>{i.value}</div></div>
                    })}


                </div>

            </div>
        </>
    )
}

export default SavedSearchDetail;