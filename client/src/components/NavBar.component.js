const NavBar = (props) => {

    return (
        <div className="nav navbar bg-light">
            <img src={`${process.env.PUBLIC_URL}/ses_logo.200x77.png`} alt="SES Logo" />
        </div>
    );
}

export default NavBar;