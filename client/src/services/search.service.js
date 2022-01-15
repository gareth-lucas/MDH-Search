import { authHeader } from "../helpers/authHeader";
import axios from 'axios';

export const searchService = {
    query,
    single,
    quarantine,
    fetchDuplicates
}

async function query(data) {

    const headers = authHeader();

    const result = await axios.post(
        `http://${process.env.REACT_APP_API_SERVER}:${process.env.REACT_APP_API_PORT}/api/query`,
        data,
        { headers: headers }
    );

    return result.data;
}

async function single(selectedPartner) {
    const headers = authHeader();

    const result = await axios.get(`http://${process.env.REACT_APP_API_SERVER}:${process.env.REACT_APP_API_PORT}/api/query/${selectedPartner}`, { headers: headers });

    return result.data
}

async function quarantine(transactionId) {
    const headers = authHeader();
    const result = await axios.get(`http://${process.env.REACT_APP_API_SERVER}:${process.env.REACT_APP_API_PORT}/api/quarantine/${transactionId}`, { headers: headers });

    return result.data;
}

async function fetchDuplicates(partner) {
    const headers = authHeader();
    const result = await axios.post(`http://${process.env.REACT_APP_API_SERVER}:${process.env.REACT_APP_API_PORT}/api/quarantine/duplicates`, partner, { headers: headers });

    return result.data;
}