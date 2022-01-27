import { BehaviorSubject } from 'rxjs';
import axios from 'axios';
import { authHeader } from '../helpers/authHeader';

const currentUserSubject = new BehaviorSubject(JSON.parse(sessionStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    resetPassword,
    changePassword,
    forgottenPassword,
    updateUser,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() { return currentUserSubject.value }
}

async function login(username, password) {
    if (username === "" || password === "") {
        return "Devono essere compilati tutti i campi"
    } else {
        try {
            const loginResult = await axios.post(`${process.env.REACT_APP_API_SCHEMA}://${process.env.REACT_APP_API_SERVER}:${process.env.REACT_APP_API_PORT}/security/login`, {
                email: username,
                password: password,
            });

            sessionStorage.setItem('currentUser', JSON.stringify(loginResult.data))
            currentUserSubject.next(loginResult.data)

            return loginResult.data;

        } catch (err) {
            console.error(err)
            throw err;
        };
    }
}

async function resetPassword(id) {
    const headers = authHeader();
    const profile = await axios.get(`${process.env.REACT_APP_API_SCHEMA}://${process.env.REACT_APP_API_SERVER}:${process.env.REACT_APP_API_PORT}/profile/${id}/resetPassword`, { headers: headers });
    sessionStorage.setItem('currentUser', JSON.stringify(profile.data))
    currentUserSubject.next(profile.data)
    return profile.data;
}

async function changePassword(data) {
    const headers = authHeader();
    const user = await axios.post(`${process.env.REACT_APP_API_SCHEMA}://${process.env.REACT_APP_API_SERVER}:${process.env.REACT_APP_API_PORT}/security/changePassword`, data, { headers: headers });
    return user.data;
}

async function forgottenPassword(email) {
    const headers = authHeader();
    const response = await axios.post(`${process.env.REACT_APP_API_SCHEMA}://${process.env.REACT_APP_API_SERVER}:${process.env.REACT_APP_API_PORT}/security/resetPassword`, { email: email }, { headers: headers });

    return response.data
}

async function updateUser(data) {
    sessionStorage.setItem('currentUser', JSON.stringify(data))
    currentUserSubject.next(data)
    return data;
}

async function logout() {
    sessionStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}