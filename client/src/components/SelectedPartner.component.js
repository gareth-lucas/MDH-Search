import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { searchService } from '../services/search.service';

const SelectedPartner = ({ selectedPartner, setLoading }) => {

    const [state, setState] = useState({
        loading: true,
        error: null
    })
    const [partner, setPartner] = useState(null);

    const doSetPartner = (p) => {
        setPartner(p);
    }

    // load selected partner
    useEffect(() => {

        const fetchSelectedPartner = async () => {

            const origin = selectedPartner.origin;

            if (origin === 'GR') {
                try {
                    setLoading(true);
                    const response = await searchService.single(selectedPartner.recordId);
                    doSetPartner({ ...response.bupa, origin: 'GR' });
                } catch (err) {
                    console.error(err);
                    setState(s => ({ ...s, error: err }));
                } finally {
                    setState(s => ({ ...s, loading: false }))
                    setLoading(false);
                }
            } else if (origin === 'Q') {
                try {
                    setLoading(true);
                    const response = await searchService.fetchDuplicates(selectedPartner);
                    if (response.MatchResult && !Array.isArray(response.MatchResult)) {
                        response.MatchResult = [response.MatchResult];
                    }

                    const duplicateInfo = response.MatchResult.filter(m => (m.duplicate)).map(m => {
                        return {
                            recordId: m.duplicate.bupa.id,
                            sap_id: m.duplicate.bupa.sap_id,
                            name1: m.duplicate.bupa.name1,
                            name2: m.duplicate.bupa.name2,
                            address: {
                                city: m.duplicate.bupa.address.city,
                                state: m.duplicate.bupa.address.state,
                                street: m.duplicate.bupa.address.street,
                                postalCode: m.duplicate.bupa.address.postal_code,
                                civicNumber: m.duplicate.bupa.address.civic_number,
                                country: m.duplicate.bupa.address.country
                            }
                        }
                    })

                    setPartner(s => ({ ...s, ...selectedPartner, duplicateInfo: duplicateInfo }));
                } catch (err) {
                    console.error(err);
                    setState(s => ({ ...s, error: err.response.data.message }));
                } finally {
                    setState(s => ({ ...setState, loading: false }));
                    setLoading(false);
                }
            } else {
                console.error(`Unknown record origin`);
                setState(s => ({ ...s, error: `Unknown record origin`, loading: false }));
            }

        }

        fetchSelectedPartner();
    }, [selectedPartner, setLoading]);

    if (state.loading) {
        return null;
    }

    if (!partner) {
        return null;
    }

    return (
        <>
            <div>{JSON.stringify(partner)}</div>
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
                    onClick={e => setPartner(null)}>
                    <FaTimes size={24} color="#F00" />
                </div>
                {partner.origin === 'GR' &&
                    <>
                        <h2>{partner.sap_id} - {partner.name2} {partner.name1}</h2>

                        <ul className="list-group list-group-flush">
                            <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>SAP ID:</span><span>{partner.sap_id}</span></li>
                            <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Cognome:</span><span>{partner.name2}</span></li>
                            <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Nome:</span><span>{partner.name1}</span></li>
                            <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Search Term:</span><span>{partner.searchterm}</span></li>
                            <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Titolo:</span><span>{partner.title}</span></li>
                            <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Nome Esteso:</span><span>{partner.fullname}</span></li>
                            <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Creato:</span><span>{partner.created_date}</span></li>
                            <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Creato Da:</span><span>{partner.createdby}</span></li>
                            <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Ultima Modifica:</span><span>{partner.last_modified_date}</span></li>
                            <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Modificato Da:</span><span>{partner.modifiedby}</span></li>
                        </ul>
                    </>
                }
                {partner.origin === 'Q' &&
                    <>
                        <h2>Quarantena - {selectedPartner.sap_id} - {selectedPartner.name2} {selectedPartner.name1}</h2>

                        <ul className="list-group list-group-flush">
                            <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>SAP ID:</span><span>{selectedPartner.sap_id}</span></li>
                            <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Cognome:</span><span>{selectedPartner.name2}</span></li>
                            <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Nome:</span><span>{selectedPartner.name1}</span></li>
                            <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Transaction ID:</span><span>{selectedPartner.recordId}</span></li>
                            <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Creato:</span><span>{new Date(selectedPartner.createdDate).toLocaleString('it-CH')}</span></li>
                            <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Modificato:</span><span>{selectedPartner.updateDate}</span></li>
                            <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Causa Quarantena:</span><span>{selectedPartner.cause}</span></li>
                            <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Motivo:</span><span>{selectedPartner.reason}</span></li>
                            <li className="list-group-item"><span style={{ display: "inline-block", width: "200px", fontWeight: "bold" }}>Risoluzione:</span><span>{selectedPartner.resolution}</span></li>
                        </ul>

                        {partner.duplicateInfo &&
                            <>
                                <h4>Duplicati Potenziali</h4>
                                <ul>
                                    {partner.duplicateInfo.map(d => {
                                        return <li key={d.sap_id}>SAP ID: {d.sap_id} - {d.name2} {d.name1}</li>
                                    })}
                                </ul>
                            </>
                        }
                    </>
                }

            </div>
        </>
    )


}

export default SelectedPartner;