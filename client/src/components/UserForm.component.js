import { useState } from "react";

const UserForm = (props) => {

    const initialForm = {
        name: '',
        surname: '',
        email: '',
        lastLogin: null,
        password: '',
        password2: '',
        role: ''
    }

    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState({});

    const textFieldChange = (e) => {
        const name = e.target.name;
        const val = e.target.value;

        setForm(f => ({ ...f, [name]: val }));
    }

    const checkPassword = (e) => {
        const password1 = form.password;
        const password2 = e.target.value;

        if (password1 !== password2) {
            setError({ password2: `Le password non coincidono` });
        } else {
            setError({ password2: null });
        }
    }

    const resetForm = () => {
        setForm(initialForm);
    }

    const doSave = () => {
        console.log(form);
    }

    return (
        <>
            <h3>User Form</h3>

            {error.general &&
                <div className="text-danger">{error}</div>
            }

            <div className="form">
                <div className="form-group">
                    <label htmlFor="name">Nome</label>
                    <input name="name" type="text" className="form-control" placeholder="Nome" onChange={(e) => textFieldChange(e)} value={form.name} />
                </div>

                <div className="form-group">
                    <label htmlFor="name">Cognome</label>
                    <input name="surname" type="text" className="form-control" placeholder="Cognome" onChange={(e) => textFieldChange(e)} value={form.surname} />
                </div>

                <div className="form-group">
                    <label htmlFor="name">Indirizzo Email</label>
                    <input name="email" type="text" className="form-control" placeholder="Indirizzo Email" onChange={(e) => textFieldChange(e)} value={form.email} />
                </div>

                <div className="form-group">
                    <label htmlFor="name">Password</label>
                    <input name="password" type="password" className="form-control" placeholder="" onChange={(e) => textFieldChange(e)} value={form.password} />
                </div>

                <div className="form-group">
                    <label htmlFor="name">Conferma Password</label>
                    <input name="password2" type="password" className="form-control" placeholder="" onChange={(e) => textFieldChange(e)} onBlur={e => checkPassword(e)} value={form.password2} />
                    <div className="text-danger">{error.password2}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="role">Ruolo</label>
                    <select name="role" value={form.role} onChange={(e) => textFieldChange(e)} className="form-control">
                        <option value="">-- Selezionare </option>
                        <option value="USER">Utente Normale</option>
                        <option value="ADMIN">Utente Amministratore</option>
                        <option value="DELETED">Utente Cancellato</option>
                    </select>
                </div>

                <div className="form-group">
                    <button className="btn btn-primary" onClick={e => doSave()}>Salva</button>
                    <button className="btn btn-danger" onClick={e => resetForm()}>Reset</button>
                </div>

            </div>
        </>
    )
}

export default UserForm;