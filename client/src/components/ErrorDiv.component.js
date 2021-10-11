import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const ErrorDiv = ({ error, onClose }) => {

    if (!error) {
        return null;
    }

    return (
        <>
            <div style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                width: "600px",
                height: "300px",
                border: "5px solid red",
                borderRadius: "15px",
                padding: "10px",
                marginLeft: "-300px",
                marginTop: "-150px",
                textAlign: "center",
                backgroundColor: "#FFF",
                zIndex: "999"
            }}>

                <div style={{
                    float: "right",
                    height: "24px",
                    borderTopRightRadius: "12px",
                    cursor: "pointer"
                }}
                    onClick={e => onClose()}>
                    <FaTimes size={24} color="#F00" />
                </div>
                <FaExclamationTriangle size={64} color="#F00" />

                <div className="pt-3">{error}</div>

            </div>
        </>
    )
}

export default ErrorDiv;