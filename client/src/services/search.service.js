import { authHeader } from "../helpers/authHeader";
import axios from 'axios';

export const searchService = {
    query,
    single
}

async function query(data) {

    const headers = authHeader();

    const result = await axios.post(
        "/api/query",
        data,
        { headers: headers }
    );

    return result.data;
}

async function single(selectedPartner) {
    const headers = authHeader();

    const result = await axios.get(`/api/query/${selectedPartner}`, { headers: headers });

    return result.data
}