import React, { useState, useEffect } from "react";
import axios from "axios";

const Login = (props) => {
  const { isAuthenticated, setIsAuthenticated, setUserName } = props;

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/");
    }

    //eslint-disable-next-line
  }, [isAuthenticated, props.history]);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [alert, setAlert] = useState(null);

  const { email, password } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      setAlert("Please fill in all fields");
    } else {
      console.log("login");
      // const url = `${process.env.DB_URL}/security/login`;
      axios
        .post("http://localhost:4000/security/login", {
          email,
          password,
        })
        .then((res) => {
          document.cookie = "token=" + res.data.token + "; Path=/;";
          setIsAuthenticated(true);
          const nameUser = res.data.user.name;
          setUserName(nameUser);
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="form-container">
      <h1>
        Account <span className="text-primary">Login</span>
      </h1>
      <form onSubmit={onSubmit}>
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
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <input
          type="submit"
          value="Login"
          className="btn btn-primary btn-block"
        />
      </form>
    </div>
  );
};

export default Login;
