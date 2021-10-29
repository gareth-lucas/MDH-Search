import React from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

const MessageDiv = ({ message, onClose }) => {

    if (!message) {
        return null;
    }

    return (
        <>
            <div className="ses-popup-container">

                <div className="ses-close-button" onClick={e => onClose()}>
                    <FaTimes size={24} color="#FFF" />
                </div>

                <div className="ses-popup-content">
                    <FaCheckCircle size={64} color="#198754" />

                    <div className="pt-3">{message}</div>
                </div>

            </div>
        </>
    )
}

export default MessageDiv;