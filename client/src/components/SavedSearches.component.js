import React, { useState, useEffect } from "react";
import { profileService } from "../services/profile.service";

const SavedSearches = ({ currentUser }) => {

    const [error, setError] = useState(null);
    const [savedSearches, setSavedSearches] = useState([]);

    useEffect(() => {

        const fetchSearches = async () => {
            try {
                const searches = await profileService.getSavedSearchesByUser(currentUser.user.rowid);
                setSavedSearches(searches);
            } catch (err) {
                console.error(err, err.response.data.message);
                setError(err.response.data.message);
            }
        }

        fetchSearches();
    }, [currentUser])

    return (
        <>
            <h4>Richerche Salvate</h4>

            <table className="table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>SearchParams</th>
                    </tr>
                </thead>
                <tbody>
                    {savedSearches.map(s => {
                        return <tr key={s.rowid}><td>{s.description}</td><td>{s.searchParams}</td></tr>
                    })
                    }
                </tbody>
            </table>

        </>
    )
}

export default SavedSearches;