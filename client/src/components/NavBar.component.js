import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { authenticationService } from '../services/authentication.service';

const NavBar = ({ currentUser, ...props }) => {
  // #TODO: Add page of recent searches
  const onLogout = async () => {
    await authenticationService.logout();
  };

  useEffect(() => {

  }, [currentUser])

  const authLinks = (
    <>
      {currentUser?.user?.role === 'ADMIN' &&
        <li className="nav-item me-2">
          <Link className="nav-link" to="/admin">Amministrazione App</Link>
        </li>
      }
      <li className="nav-item me-2">
        <button className="btn btn-outline-primary">
          <i className="fas fa-user-circle mr-2"></i>
          <Link className="hide-sm ses-link-button" to="/profile"> Ciao, {currentUser?.user.name}</Link>
        </button>
      </li>
      <li className="nav-item">
        <button className="btn btn-outline-primary" onClick={() => onLogout()}>
          <i className="fas fa-sign-out-alt"></i>
          <span className="hide-sm">Logout</span>
        </button>
      </li>

    </>
  );

  // return (
  //   <nav className="navbar navbar-expand-lg navbar-light bg-light">
  //     <a className="navbar-brand" href="#">Navbar w/ text</a>
  //     <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
  //       <span className="navbar-toggler-icon"></span>
  //     </button>
  //     <div className="collapse navbar-collapse" id="navbarText">
  //       <ul className="navbar-nav ms-auto">
  //         <li className="nav-item active">
  //           <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
  //         </li>
  //         <li className="nav-item">
  //           <a className="nav-link" href="#">Features</a>
  //         </li>
  //         <li className="nav-item">
  //           <a className="nav-link" href="#">Pricing</a>
  //         </li>
  //       </ul>
  //       <span className="navbar-text navbar-right">
  //         Navbar text with an inline element
  //       </span>
  //     </div>
  //   </nav>
  // )

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/search">
        <img
          src={`${process.env.PUBLIC_URL}/ses_logo.200x77.png`}
          alt="SES Logo"
        />
        <span className="h1" style={{ verticalAlign: 'middle' }}>MDH <span className="ses-primary">Search</span></span>
      </Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto me-5">{currentUser ? authLinks : ''}</ul>
      </div>
    </nav>
  );
};

export default NavBar;
