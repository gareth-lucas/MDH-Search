import e from "cors";
import { Fragment } from "react";
import { Link } from "react-router-dom";

const NavBar = ({ isAuthenticated, changeAuth, userName }) => {
  // #TODO: Add login, page of recent searches

  const onLogout = () => {
    //logout
    //clear data
    changeAuth(false);

    document.cookie = "token" + "=; Path=/; Expires=" + Date.now();
  };

  const authLinks = (
    <Fragment>
      <li>Hello, {userName}</li>
      <li>
        <a onClick={onLogout} href="/login">
          <i className="fas fa-sign-out-alt"></i>
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </Fragment>
  );

  return (
    <div className="navbar bg-light">
      <img
        src={`${process.env.PUBLIC_URL}/ses_logo.200x77.png`}
        alt="SES Logo"
      />
      <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
    </div>
  );
};

export default NavBar;
