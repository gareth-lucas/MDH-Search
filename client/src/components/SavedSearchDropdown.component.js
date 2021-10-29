import React, { useEffect, useState } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { profileService } from "../services/profile.service";

const SavedSearchDropdown = ({ currentUser, updateSavedSearch }) => {

    const [savedSearch, setSavedSearch] = useState('');
    const [savedSearches, setSavedSearches] = useState([]);

    useEffect(() => {

        const fetchSavedSearches = async () => {
            try {
                const searches = await profileService.getSavedSearchesByUser(currentUser.user.rowid, 10);
                setSavedSearches(searches);
            } catch (err) {
                console.error(err);
            }
        }

        fetchSavedSearches();
    }, [currentUser])

    const onChange = e => {
        const val = e.target.value;
        setSavedSearch(val);
        updateSavedSearch(savedSearches.find(s => (s.rowid.toString() === val.toString())));
    }

    const resetSearch = () => {
        setSavedSearch(null);
        updateSavedSearch(null);
    }

    if (savedSearches.length === 0) {
        return null;
    }

    return (
        <>
            <div className="row">
                <div className="col-sm-11">
                    <select name="savedSearches" value={savedSearch || ''} onChange={e => onChange(e)} className="form-control">
                        <option value=''>-- Seleziona ricerca salvata --</option>
                        {savedSearches.sort((a, b) => (new Date(b) > new Date(a) ? 1 : -1)).map(s => (<option key={s.rowid} value={s.rowid}>{s.description}</option>))}
                    </select>
                </div>
                <div className="col-sm-1">
                    <FaTimesCircle color="#F00" size={16} onClick={() => resetSearch()} style={{ cursor: "pointer" }} />
                </div>

            </div>
        </>
    )
}

export default SavedSearchDropdown;