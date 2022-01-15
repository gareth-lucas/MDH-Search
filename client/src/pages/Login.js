import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authenticationService } from "../services/authentication.service";

const Login = (props) => {
  const { currentUser } = props;

  useEffect(() => {
    if (currentUser) {
      props.history.push("/search");
    }

  }, [currentUser, props.history]);

  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const checkEnter = (e) => {
    if (e.key === 'Enter') { //has enter been pressed?
      onSubmit();
    }
  }

  const onSubmit = async () => {
    try {
      const loginResult = await authenticationService.login(user.email, user.password);

      if (loginResult.passwordChange) {
        props.history.push(`/passwordReset?email=${encodeURI(loginResult.user.email)}`);
        return;
      }
    } catch (err) {
      console.error(err);
      setError(err.response.data.message);
    }
  };

  if (currentUser) {
    return null;
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-sm-3 text-center p-2 mt-3 ses-border ses-bg-secondary" style={{ borderRadius: "15px" }} onKeyPress={e => checkEnter(e)}>
          <h1>
            Account <span className="ses-primary">Login</span>
          </h1>
          {error &&
            <div className="text-danger">{error}</div>
          }
          <div className="form-group text-left">
            <input
              type="text"
              name="email"
              value={user.email}
              onChange={onChange}
              placeholder="Indirizzo Email / Username"
              className="form-control"
              autoFocus={true}
              required
            />
          </div>
          <div className="form-group mt-2">
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={onChange}
              placeholder="Password"
              className="form-control"
              required
            />
          </div>
          <input type="submit" value="Login" className="btn btn-primary mt-2" onClick={() => onSubmit()} />
          <div>
            <Link to="/resetPassword">password dimenticata?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
