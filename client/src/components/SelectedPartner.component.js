import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { searchService } from '../services/search.service';

const SelectedPartner = ({ selectedPartner, onClose, setLoading }) => {

    const [state, setState] = useState({
        loading: true,
        error: null
    })
    const [partner, setPartner] = useState({});

    // load selected partner
    // #TODO: pass javascript web token
    useEffect(() => {

        const fetchSelectedPartner = async () => {

            try {
                const response = await searchService.single(selectedPartner);
                setPartner(response);
            } catch (err) {
                console.error(err);
                setState(s => ({ ...s, error: err }));
            } finally {
                setLoading(false);
                setState(s => ({ ...s, loading: false }))
            }
        }

        if (selectedPartner) {
            setLoading(true);
            setState(s => ({ ...s, loading: true }))
            fetchSelectedPartner();
        } else {
            setPartner(null);
        }
    }, [selectedPartner, setLoading]);

    if (state.loading) {
        return null;
    }

    return (
        <>
            <div style={{
                width: "50%",
                position: "fixed",
                left: "50px",
                top: "50px",
                border: "5px solid #DDD",
                borderRadius: "15px",
                height: "600px",
                padding: "10px",
                backgroundColor: "#FFF"
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
                <h2>{partner.bupa.sap_id} - {partner.bupa.name2} {partner.bupa.name1}</h2>

                <ul className="list-group list-group-flush">
                    <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>SAP ID:</span><span>{partner.bupa.sap_id}</span></li>
                    <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Cognome:</span><span>{partner.bupa.name2}</span></li>
                    <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Nome:</span><span>{partner.bupa.name1}</span></li>
                    <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Search Term:</span><span>{partner.bupa.searchterm}</span></li>
                    <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Titolo:</span><span>{partner.bupa.title}</span></li>
                    <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Nome Esteso:</span><span>{partner.bupa.fullname}</span></li>
                    <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Creato:</span><span>{partner.bupa.created_date}</span></li>
                    <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Creato Da:</span><span>{partner.bupa.createdby}</span></li>
                    <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Ultima Modifica:</span><span>{partner.bupa.last_modified_date}</span></li>
                    <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Modificato Da:</span><span>{partner.bupa.modifiedby}</span></li>
                </ul>

            </div>
        </>
    )


}

export default SelectedPartner;