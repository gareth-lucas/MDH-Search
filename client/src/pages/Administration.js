import React, { useState } from "react";
import UserList from "../components/UserList.component";
import UserForm from "../components/UserForm.component";

const Administration = () => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [mountKey, setMountKey] = useState(new Date());

  const onModify = (user) => {
    console.log(user);
    setSelectedUser(user);
    setShowForm(true);
  }

  return (
    <div className="container">
      <h2>Amministrazione</h2>

      {showForm &&
        <div className="col-sm-4">
          <UserForm
            selectedUser={selectedUser}
            onHide={() => setShowForm(false)}
            onUserCreate={() => setMountKey(new Date())}
          />
        </div>
      }

      <UserList key={mountKey}
        onModify={(u) => onModify(u)}
      />
    </div>
  )

};

export default Administration;
