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

    const userList = await axios.get('/admin/users', { headers: headers });

    return userList.data;
}

async function getUserById(id) {

}

async function getUserByEmail(email) {

}

async function createUser(data) {
    const headers = authHeader();
    const user = await axios.post('/admin/users', data, { headers: headers });

    return user.data;
}

async function updateUser(id, data) {
    console.log(data);
    const headers = authHeader();
    const user = await axios.put(`/admin/users/${id}`, data, { headers: headers });

    return user.data;
}

async function deleteUser(id) {

}