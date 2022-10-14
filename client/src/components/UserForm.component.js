import React from 'react';
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { adminService } from '../services/admin.service';

const UserForm = ({ selectedUser, onHide, onUserCreate }) => {

    const initialForm = {
        name: '',
        surname: '',
        email: '',
        lastLogin: null,
        role: ''
    }

    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState({});

    useEffect(() => {

        const setSelectedUser = () => {
            setForm(f => ({ ...f, ...selectedUser }));
        }

        if (selectedUser) {
            setSelectedUser();
        }
    }, [selectedUser])

    const textFieldChange = (e) => {
        const name = e.target.name;
        const val = e.target.value;

        setForm(f => ({ ...f, [name]: val }));
    }

    const resetForm = () => {
        setForm(initialForm);
    }

    const doSave = async () => {
        const { name, surname, email, role } = form;

        if (name.trim() === '' || surname.trim() === '' || email.trim() === '' || role.trim() === '') {
            setError({ general: `Compilare tutti i campi` });
            return;
        }

        if (!email.match(/^[\w.]+@\w+\.\w+$/)) {
            setError({ general: `Indirizzo email non valido` });
            return;
        }

        try {
            var user;
            if (!selectedUser) {
                user = await adminService.createUser({ name: name, surname: surname, email: email, role: role });

            } else {
                user = await adminService.updateUser(selectedUser.rowid, { name: name, surname: surname, role: role });
            }

            onUserCreate(user);
            onHide();
        } catch (err) {
            console.error(err);
            setError(err);
        }
    }

    return (
        <>
            <div className="ses-popup-container">
                <div className="ses-close-button" onClick={() => onHide()}><FaTimes size={24} color="#FFF" /></div>
                <div className="ses-popup-content">
                    <h3>{selectedUser ? 'Modificare Utente' : 'Creare Nuovo Utente'}</h3>

                    {error.general &&
                        <div className="text-danger">{error.general}</div>
                    }

                    <div className="form">
                        <div className="form-group">
                            <label htmlFor="name">Nome</label>
                            <input name="name" type="text" className="form-control" placeholder="Nome" onChange={(e) => textFieldChange(e)} value={form.name} />
                        </div>

                        <div className="form-group mt-2">
                            <label htmlFor="name">Cognome</label>
                            <input name="surname" type="text" className="form-control" placeholder="Cognome" onChange={(e) => textFieldChange(e)} value={form.surname} />
                        </div>

                        <div className="form-group mt-2">
                            <label htmlFor="name">Indirizzo Email</label>
                            <input name="email" type="text" className="form-control" placeholder="Indirizzo Email" onChange={(e) => textFieldChange(e)} value={form.email} />
                        </div>

                        <div className="form-group mt-2">
                            <label htmlFor="role">Ruolo</label>
                            <select name="role" value={form.role} onChange={(e) => textFieldChange(e)} className="form-control">
                                <option value="">-- Selezionare --</option>
                                <option value="USER">Utente Normale</option>
                                <option value="ADMIN">Utente Amministratore</option>
                                <option value="DELETED">Utente Cancellato</option>
                            </select>
                        </div>

                        <div className="form-group mt-2">
                            <button className="btn btn-primary mr-2" onClick={e => doSave()}>Salva</button>
                            <button className="btn btn-danger" onClick={e => resetForm()}>Reset</button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default UserForm;