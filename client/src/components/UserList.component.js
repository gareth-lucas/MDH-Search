import axios from 'axios';
import { useEffect, useState } from "react";
import { PaginatedTable } from '../components/PaginatedTable';

const UserList = ({ onUserSelect }) => {

    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState([]);

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const users = await axios.get(`/admin/users`);
                setUserList(users.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }

        }


        fetchUsers();
    }, []);

    if (loading) {
        return null;
    }

    const userTable = userList.map(u => ({
        name: u.name,
        surname: u.surname,
        email: u.email,
        lastLogin: u.lastLogin,
        _actions: [
            {
                name: "Modifica",
                onClick: function (e) {
                    console.log("Hello");
                }
            }
        ]

    }))
    const columns = ['surname', 'name', 'email', 'lastLogin', '_actions'];
    const columnTitles = ['Cognome', 'Nome', 'Email', 'Ultimo Login', 'Actions'];
    const rowsPerPage = 20;

    return (
        <>
            <h3>Lista Utenze</h3>

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