import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authenticationService } from "../services/authentication.service";

const PasswordReset = ({ currentUser, ...props }) => {

    const [form, setForm] = useState({
        old_password: '',
        password: '',
        repeat_password: ''
    });
    const [message, setMessage] = useState('');
    const [show, setShow] = useState(true);
    const [error, setError] = useState(null);
    const [queryString, setQueryString] = useState({
        email: null,
        resetCode: null
    });

    useEffect(() => {
        const fetchUrlQueryStringParams = () => {
            if (!props.history.location.search || props.history.location.search === '') {
                setQueryString({ email: null, resetCode: null });
                return;
            }

            const search = props.history.location.search.substr(1);
            const terms = search.split("&");
            const queryStringObj = terms.reduce((obj, t) => {
                const tsplit = t.split("=");
                const key = tsplit[0];
                const val = tsplit[1];
                obj[key] = val;
                return obj;
            }, {});

            if (!queryStringObj.resetCode) {
                queryStringObj.resetCode = sessionStorage.getItem('resetCode');
                if (queryStringObj.resetCode) {
                    sessionStorage.removeItem('resetCode');
                }
            }

            setQueryString(queryStringObj);
        }
        fetchUrlQueryStringParams()
    }, [props.history.location.search])

    useEffect(() => {
        const showCurrentUser = () => {
        }

        showCurrentUser();
    }, [currentUser])

    const onChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const onSubmit = async () => {
        if (form.password !== form.repeat_password) {
            setError(`Le nuove password non sono identiche`);
            return;
        } else if (form.old_password && form.old_password === form.password) {
            setError(`La nuova password non può essere uguale alla vecchia`);
            return;
        } else {
            setError(null);
        }



        const data = {
            email: queryString.email || currentUser?.user?.email,
            resetCode: queryString.resetCode || currentUser?.user?.resetCode,
            old_password: form.old_password,
            password: form.password,
            repeat_password: form.repeat_password
        }

        try {
            //await axios.post('/security/changePassword', data);
            await authenticationService.changePassword(data);
            await authenticationService.logout();
            setMessage(<span>La tua password è stata modificata.<br /> <Link to="/login">Vai alla pagina login</Link></span>);
            setShow(false);

        } catch (err) {
            console.error(err);
            setError(err.response.data.message);
        }
    }



    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    {show &&
                        <div className="col-sm-3 text-center p-2 mt-3 ses-border ses-bg-secondary" style={{ borderRadius: "15px" }}>
                            <h1>
                                Reset <span className="ses-primary">Password</span>
                            </h1>
                            <h6>Cambiare la tua password</h6>
                            {error &&
                                <div className="text-danger">{error}</div>
                            }
                            {currentUser?.passwordChange &&
                                <div className="form-group mt-2">
                                    <input
                                        type="password"
                                        name="old_password"
                                        value={form.old_password}
                                        onChange={onChange}
                                        placeholder="Vecchia Password"
                                        className="form-control"
                                        required
                                    />
                                </div>
                            }
                            <div className="form-group mt-2">
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={onChange}
                                    placeholder="Nuova Password"
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group mt-2">
                                <input
                                    type="password"
                                    name="repeat_password"
                                    value={form.repeat_password}
                                    onChange={onChange}
                                    placeholder="Ripetere Password"
                                    className="form-control"
                                    required
                                />
                            </div>
                            <input
                                type="submit"
                                value="Reset"
                                className="btn btn-primary mt-2"
                                onClick={() => onSubmit()}
                            />
                        </div>
                    }
                </div>

                {!!message &&
                    <div className="row justify-content-center mt-5">
                        <div className="col-sm-4 text-center">
                            <h4>{message}</h4>
                        </div>
                    </div>
                }
            </div>
        </>
    )

}

export default PasswordReset;