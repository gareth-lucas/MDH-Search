import React, { useState, useEffect } from "react";
import { FaRegEye, FaTrashAlt } from "react-icons/fa";
import { profileService } from "../services/profile.service";
import SavedSearchDetail from "./SavedSearchDetail.component";

const SavedSearches = ({ currentUser, setUpdateTable }) => {

    const [error, setError] = useState(null);
    const [savedSearches, setSavedSearches] = useState([]);
    const [selectedSearch, setSelectedSearch] = useState(null);

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

    const showSearchDetail = (search) => {
        setSelectedSearch(search);
    }

    const deleteSearch = async (search) => {
        try {
            await profileService.deleteSearch(currentUser.user.rowid, search.rowid);
            setUpdateTable(new Date())
        } catch (err) {
            console.error(err);
            setError(err.response.data.message);
        }
    }

    return (
        <>
            <SavedSearchDetail selectedSearch={selectedSearch} onClose={() => setSelectedSearch(null)} />
            <h4>Richerche Salvate</h4>
            {error &&
                <div className="text-danger">{error}</div>
            }
            <table className="table">
                <thead>
                    <tr>
                        <th>Descrizione</th>
                        <th>Data Creazione</th>
                        <th className="text-center">Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {savedSearches.map(s => {
                        return (<tr key={s.rowid}>
                            <td>{s.description}</td>
                            <td>{new Date(s.creationDate).toLocaleString("it-ch")}</td>
                            <td>
                                <div className="d-flex justify-content-around">
                                    <FaRegEye size={16} onClick={() => showSearchDetail(s)} style={{ cursor: "pointer" }} />
                                    <FaTrashAlt size={16} onClick={() => deleteSearch(s)} style={{ cursor: "pointer" }} />
                                </div>
                            </td>
                        </tr>)
                    })
                    }
                </tbody>
            </table>

        </>
    )
}

export default SavedSearches;