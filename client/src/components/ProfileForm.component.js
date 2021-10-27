import React, { useEffect, useState } from 'react';
import { authenticationService } from '../services/authentication.service';
import { profileService } from '../services/profile.service';

const ProfileForm = ({ currentUser }) => {

    const [error, setError] = useState(null);
    const [profile, setProfile] = useState({
        id: '',
        name: '',
        surname: '',
        email: '',
        lastLogin: ''
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await profileService.getProfileById(currentUser.user.rowid);
                setProfile({
                    id: profile.rowid,
                    name: profile.name,
                    surname: profile.surname,
                    email: profile.email,
                    lastLogin: profile.lastLogin
                });
            } catch (err) {
                console.error(err, err.response.data.message);
                setError(err.response.data.message);
            }
        }

        if (currentUser) {
            fetchProfile();
        }
    }, [currentUser])

    const onChange = e => {
        setProfile(p => ({ ...p, [e.target.name]: e.target.value }));
    }

    const doSubmit = async () => {

        const data = {
            name: profile.name,
            surname: profile.surname
        }

        try {
            const user = await profileService.updateProfile(currentUser.user.rowid, data);
            await authenticationService.updateUser(user);
        } catch (err) {
            console.error(err);
            setError(err.response.data.message);
        }
    }

    const doChangePassword = async () => {
        try {
            await authenticationService.resetPassword(currentUser.user.rowid);
        } catch (err) {
            console.error(err);
            setError(err.response.data.message);
        }
    }

    return (
        <>
            <h4>Profilo</h4>

            <div className="form">
                {error && <div className="text-danger">{error}</div>}
                <div className="form-group">
                    <label htmlFor="surname">Cognome</label>
                    <input className="form-control" type="text" name="surname" value={profile.surname} onChange={e => onChange(e)} placeholder="Cognome" />
                </div>

                <div className="form-group mt-2">
                    <label htmlFor="name">Nome</label>
                    <input className="form-control" type="text" name="name" value={profile.name} onChange={e => onChange(e)} placeholder="Nome" />
                </div>

                <div className="form-group mt-2">
                    <label htmlFor="email">Email/Username</label>
                    <input className="form-control" type="text" name="name" value={profile.email} placeholder="Email" readOnly />
                </div>

                <button onClick={() => doSubmit()} className="btn btn-primary mt-3">Salva Modifiche</button>

            </div>

            <h4 className="mt-3">Password</h4>
            <button onClick={() => doChangePassword()} className="btn btn-primary">Modifica Password</button>

        </>
    )
}

export default ProfileForm;