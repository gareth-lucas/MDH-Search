import React from 'react';
import { useEffect, useState } from "react";
import { PaginatedTable } from '../components/PaginatedTable';
import { adminService } from '../services/admin.service';

const UserList = ({ onModify }) => {

    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const users = await adminService.getAllUsers();
                setUserList(users);
            } catch (err) {
                console.error(err);
                setError(err.response.data.message);
            } finally {
                setLoading(false);
            }

        }

        fetchUsers();
    }, []);

    if (loading) {
        return null;
    }

    const userTable = userList.map(u => {

        var dateString = '-';
        if (u.lastLogin !== null) {
            const llDate = new Date(u.lastLogin);
            dateString = llDate.toLocaleDateString('it-CH');
            const timeString = llDate.toLocaleTimeString('it-CH');

            dateString = dateString + " " + timeString;
        }

        return {
            name: u.name,
            surname: u.surname,
            email: u.email,
            lastLogin: dateString,
            role: u.role,
            _actions: [
                {
                    name: "modifica",
                    onClick: () => onModify(u)
                }
            ]

        }
    });
    const columns = ['surname', 'name', 'email', 'lastLogin', 'role', '_actions'];
    const columnTitles = ['Cognome', 'Nome', 'Email', 'Ultimo Login', 'Role', 'Actions'];
    const rowsPerPage = 15;

    return (
        <>
            <h3>Lista Utenze</h3><button className="btn btn-primary" onClick={() => onModify(null)}>Creare Nuovo Utente</button>

            {error && <h6 className="text-danger">{error}</h6>}
            <PaginatedTable
                data={userTable}
                columns={columns}
                columnTitles={columnTitles}
                filterableColumns={['surname']}
                rowsPerPage={rowsPerPage}
            />

        </>
    )
}

export default UserList;