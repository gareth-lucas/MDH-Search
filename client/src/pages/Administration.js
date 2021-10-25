import React, { useState } from "react";
import UserList from "../components/UserList.component";
import UserForm from "../components/UserForm.component";

const Administration = () => {

  const [selectedUser, setSelectedUser] = useState(null);

  const onUserSelect = (user) => {
    setSelectedUser(user);
  }

  return (
    <>
      <div className="container">
        <h2>Amministrazione</h2>

        <div style={{ height: "500px" }}>
          <UserList onUserSelect={(e) => onUserSelect(e)} />
        </div>

        <UserForm user={selectedUser} />
      </div>
    </>
  )

};

export default Administration;
