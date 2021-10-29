import React, { useState } from 'react';
import ProfileForm from '../components/ProfileForm.component';
import SavedSearches from '../components/SavedSearches.component';

const Profile = ({ currentUser, ...props }) => {

    const [updateTable, setUpdateTable] = useState(new Date());

    return (
        <>
            <div className="container">
                <h2 className="mt-2">Profilo di {currentUser.user.name}</h2>

                <div className="row">
                    <div className="col-sm-6">
                        <ProfileForm currentUser={currentUser} />
                    </div>

                    <div className="col-sm-6">
                        <SavedSearches key={updateTable} currentUser={currentUser} setUpdateTable={setUpdateTable} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;