import axios from "axios"
import { authHeader } from "../helpers/authHeader";

export const profileService = {
    getProfileById,
    updateProfile,
    getSavedSearchesByUser,
    createSavedSearch,
    deleteSearch
}

async function getProfileById(id) {

    const headers = authHeader();

    const profile = await axios.get(`http://${process.env.REACT_APP_API_SERVER}:${process.env.REACT_APP_API_PORT}/profile/${id}`, { headers: headers });

    return profile.data;
}

async function updateProfile(id, data) {
    const headers = authHeader();
    const user = await axios.put(`http://${process.env.REACT_APP_API_SERVER}:${process.env.REACT_APP_API_PORT}/profile/${id}`, data, { headers: headers });

    return user.data;
}

async function getSavedSearchesByUser(id, limit = 0) {
    const headers = authHeader();
    const searches = await axios.get(`http://${process.env.REACT_APP_API_SERVER}:${process.env.REACT_APP_API_PORT}/profile/${id}/searches?limit=${limit}`, { headers: headers });

    return searches.data;
}

async function createSavedSearch(id, data) {
    const headers = authHeader();
    const search = await axios.post(`http://${process.env.REACT_APP_API_SERVER}:${process.env.REACT_APP_API_PORT}/profile/${id}/searches`, data, { headers: headers });

    return search.data;
}

async function deleteSearch(id, idSearch) {
    const headers = authHeader();
    await axios.delete(`http://${process.env.REACT_APP_API_SERVER}:${process.env.REACT_APP_API_PORT}/profile/${id}/searches/${idSearch}`, { headers: headers });

    return;
}