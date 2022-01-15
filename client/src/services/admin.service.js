import { authHeader } from "../helpers/authHeader";
import axios from 'axios';

export const adminService = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser
}

async function getAllUsers() {
    const headers = authHeader();

    const userList = await axios.get(`http://${process.env.REACT_APP_API_SERVER}:${process.env.REACT_APP_API_PORT}/admin/users`, { headers: headers });

    return userList.data;
}

async function getUserById(id) {

}

async function getUserByEmail(email) {

}

async function createUser(data) {
    const headers = authHeader();
    const user = await axios.post(`http://${process.env.REACT_APP_API_SERVER}:${process.env.REACT_APP_API_PORT}/admin/users`, data, { headers: headers });

    return user.data;
}

async function updateUser(id, data) {
    const headers = authHeader();
    const user = await axios.put(`http://${process.env.REACT_APP_API_SERVER}:${process.env.REACT_APP_API_PORT}/admin/users/${id}`, data, { headers: headers });

    return user.data;
}

async function deleteUser(id) {

}