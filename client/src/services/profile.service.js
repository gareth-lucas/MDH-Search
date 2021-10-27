import axios from "axios"
import { authHeader } from "../helpers/authHeader";

export const profileService = {
    getProfileById,
    updateProfile,
    getSavedSearchesByUser
}

async function getProfileById(id) {

    const headers = authHeader();

    const profile = await axios.get(`/profile/${id}`, { headers: headers });

    return profile.data;
}

async function updateProfile(id, data) {
    const headers = authHeader();
    const user = await axios.put(`/profile/${id}`, data, { headers: headers });

    return user.data;
}

async function getSavedSearchesByUser(id) {
    const headers = authHeader();
    const searches = await axios.get(`/profile/${id}/searches`, { headers: headers });

    return searches.data;
}