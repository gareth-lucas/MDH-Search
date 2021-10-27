import axios from "axios";
import React, { useState } from "react";
const ResetPassword = (props) => {

    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const onChange = (e) => setEmail(e.target.value);

    const onSubmit = async () => {

        if (!email.match(/^[\w.]+@\w+\.\w+$/) && email !== 'admin') {
            setError('Inserire un indirizzo email valido');
            return false;
        } else {
            setError(null);
        }

        try {
            await axios.post(`/security/resetPassword`, { email: email });
            setMessage('Una mail è stata mandata all\'indirizzo indicato');
        } catch (err) {
            console.error(err);
            setMessage(err);
            setError(err);
        }
    }

    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-sm-3 text-center p-2 mt-3 ses-border ses-bg-secondary" style={{ borderRadius: "15px" }}>
                        <h1>
                            Reset <span className="ses-primary">Password</span>
                        </h1>
                        <h5>Digita il tuo <span className="ses-primary">Indirizzo Email</span></h5>
                        {error &&
                            <div className="text-danger">{error}</div>
                        }
                        <div className="form-group text-left mt-3">
                            <input
                                type="text"
                                name="email"
                                value={email}
                                onChange={onChange}
                                placeholder="Indirizzo Email"
                                className="form-control"
                                autoFocus={true}
                                required
                            />
                        </div>
                        <input
                            type="submit"
                            value="Richiedi Reset"
                            className="btn btn-primary mt-3"
                            onClick={() => onSubmit()}
                        />
                    </div>
                </div>

                {!!message &&
                    <div className="row justify-content-center mt-5">
                        <div className="col-sm-3 text-center">
                            <h4>{message}</h4>
                        </div>
                    </div>
                }
            </div>
        </>
    )

}

export default ResetPassword;