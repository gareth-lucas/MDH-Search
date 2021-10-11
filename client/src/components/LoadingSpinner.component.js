const LoadingSpinner = ({ visible }) => {


    if (!visible) {
        return null;
    }

    return (
        <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            marginLeft: "-100px",
            marginTop: "-100px",
            zIndex: "999"
        }}>
            <img src={`${process.env.PUBLIC_URL}/Spinner-1s-200px.gif`} alt="Loading..." />
        </div>
    )


}

export default LoadingSpinner;