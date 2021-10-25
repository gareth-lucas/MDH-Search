import React, { useState, useEffect } from "react";
import axios from "axios";

const Register = (props) => {
  const { isAuthenticated, showAlert } = props;

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/");
    }

    //eslint-disable-next-line
  }, [isAuthenticated, props.history]);

  const [user, setUser] = useState({
    name: "",
    surname: "",
    email: "",
  });

  const { name, surname, email } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (name === "" || surname === "" || email === "") {
      showAlert("Please  enter all fields", "light");
    } else {
      // const url=`${process.env.DB_URL}/admin/users`
      axios
        .post("http://localhost:4000/admin/users", {
          email,
          name,
          surname,
        })
        .then((res) => {
          console.log(res);
          setUser({
            name: "",
            surname: "",
            email: "",
          });
          // showAlert(null);
          console.log("register");
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="form-container">
      <h1>
        Account <span className="text-primary">Register</span>
      </h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Surname</label>
          <input
            type="text"
            name="surname"
            value={surname}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <input
          type="submit"
          value="Register"
          className="btn btn-primary btn-block"
        />
      </form>
    </div>
  );
};

export default Register;
