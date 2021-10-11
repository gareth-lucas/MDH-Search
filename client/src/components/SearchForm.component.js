import axios from "axios";
import { FaTimes } from 'react-icons/fa';
import { useState } from "react"
import OperationDropdown from "./OperationDropdown.component";

const SearchForm = ({ setResults, setState, setLoading }) => {

    const [form, setForm] = useState({
        NAME1: '',
        NAME1_OPERATION: 'EQUALS',
        NAME2: '',
        NAME2_OPERATION: 'EQUALS',
        STREET: '',
        STREET_OPERATION: 'EQUALS',
        CITY: '',
        CITY_OPERATION: 'EQUALS',
        EMAIL: '',
        EMAIL_OPERATION: 'EQUALS',
        POSTAL_CODE: '',
        POSTAL_CODE_OPERATION: 'EQUALS',
        SEARCHTERM: '',
        SEARCHTERM_OPERATION: 'EQUALS',
    });
    const [formState, setFormState] = useState({
        error: null
    })

    const onChangeTextField = (e) => {
        const field = e.target.name;
        const value = e.target.value;

        setForm(f => ({ ...f, [field]: value }));
    }

    const onChangeSelectField = (e) => {
        const field = e.target.name;
        const value = e.target.value;

        setForm(f => ({ ...f, [field]: value }));
    }

    const submitForm = async () => {
        const output = {};
        output.view = ['SAP_ID', 'NAME2', 'NAME1', 'STREET', 'CIVIC_NUMBER', 'CITY', 'POSTAL_CODE'];
        output.sort = {
            NAME2: {
                value: 'ASC'
            },
            NAME1: {
                value: 'ASC'
            }
        }

        const fields = Object.keys(form).filter(k => {
            return form[k].trim() !== '' && (k.substr(-10) !== '_OPERATION');
        }).reduce((out, k) => {
            console.log(k)
            out[k] = { value: form[k], operator: form[`${k}_OPERATION`] }
            return out;
        }, {});

        output.filter = fields;
        if (Object.keys(output.filter).length === 0) {
            setState({ error: 'Va specificato almeno un filtro' });
            return;
        }

        setLoading(true);

        try {
            const results = await axios.post('http://localhost:3000/api/query?api-key=Hello', output);
            console.log(results.data);
            setResults(results.data.RecordQueryResponse);

        } catch (err) {
            setFormState({ error: err });
        } finally {
            setLoading(false);
        }

    }

    return (
        <>
            <h2>Ricerca Business Partner</h2>
            <div className="form">
                {formState.error && <div className="row text-danger">{formState.error}</div>}
                <div className="form-group row">
                    <label htmlFor="NAME2" className="col-sm-3 col-form-label">Cognome</label>
                    <div className="col-sm-2">
                        <OperationDropdown name="NAME2_OPERATION" value={form.NAME2_OPERATION} onChange={(e) => onChangeSelectField(e)} className="form-control" fieldType="STRING" />
                    </div>
                    <div className="col-sm-5">
                        <input className="form-control" type="text" name="NAME2" value={form.NAME2} onChange={(e) => onChangeTextField(e)} placeholder="Cognome..." />
                    </div>
                    <div className="col-sm-1">
                        <FaTimes size={16} style={{ cursor: "pointer" }} color="#F00" onClick={e => { setForm(f => ({ ...f, NAME2: '' })) }} />
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="NAME1" className="col-sm-3 col-form-label">Nome</label>
                    <div className="col-sm-2">
                        <OperationDropdown name="NAME1_OPERATION" value={form.NAME1_OPERATION} onChange={(e) => onChangeSelectField(e)} className="form-control" fieldType="STRING" />
                    </div>
                    <div className="col-sm-5">
                        <input className="form-control" type="text" name="NAME1" value={form.NAME1} onChange={(e) => onChangeTextField(e)} placeholder="Nome..." />
                    </div>
                    <div className="col-sm-1">
                        <FaTimes size={16} style={{ cursor: "pointer" }} color="#F00" onClick={e => { setForm(f => ({ ...f, NAME1: '' })) }} />
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="SEARCHTERM" className="col-sm-3 col-form-label">Termine Ricerca</label>
                    <div className="col-sm-2">
                        <OperationDropdown name="SEARCHTERM_OPERATION" value={form.SEARCHTERM_OPERATION} onChange={(e) => onChangeSelectField(e)} className="form-control" fieldType="STRING" />
                    </div>
                    <div className="col-sm-5">
                        <input className="form-control" type="text" name="SEARCHTERM" value={form.SEARCHTERM} onChange={(e) => onChangeTextField(e)} placeholder="Search Term..." />
                    </div>
                    <div className="col-sm-1">
                        <FaTimes size={16} style={{ cursor: "pointer" }} color="#F00" onClick={e => { setForm(f => ({ ...f, SEARCHTERM: '' })) }} />
                    </div>

                </div>

                <div className="form-group row">
                    <label htmlFor="STREET" className="col-sm-3 col-form-label">Indirizzo</label>
                    <div className="col-sm-2">
                        <OperationDropdown name="STREET_OPERATION" value={form.STREET_OPERATION} onChange={(e) => onChangeSelectField(e)} className="form-control" fieldType="STRING" />
                    </div>
                    <div className="col-sm-5">
                        <input className="form-control" type="text" name="STREET" value={form.STREET} onChange={(e) => onChangeTextField(e)} placeholder="Indrizzo..." />
                    </div>
                    <div className="col-sm-1">
                        <FaTimes size={16} style={{ cursor: "pointer" }} color="#F00" onClick={e => { setForm(f => ({ ...f, STREET: '' })) }} />
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="CITY" className="col-sm-3 col-form-label">City</label>
                    <div className="col-sm-2">
                        <OperationDropdown name="CITY_OPERATION" value={form.CITY_OPERATION} onChange={(e) => onChangeSelectField(e)} className="form-control" fieldType="STRING" />
                    </div>
                    <div className="col-sm-5">
                        <input className="form-control" type="text" name="CITY" value={form.CITY} onChange={(e) => onChangeTextField(e)} placeholder="Città..." />
                    </div>
                    <div className="col-sm-1">
                        <FaTimes size={16} style={{ cursor: "pointer" }} color="#F00" onClick={e => { setForm(f => ({ ...f, CITY: '' })) }} />
                    </div>
                </div>


                <div className="form-group row">
                    <label htmlFor="POSTAL_CODE" className="col-sm-3 col-form-label">CAP</label>
                    <div className="col-sm-2">
                        <OperationDropdown name="POSTAL_CODE_OPERATION" value={form.POSTAL_CODE_OPERATION} onChange={(e) => onChangeSelectField(e)} className="form-control" fieldType="STRING" />
                    </div>
                    <div className="col-sm-5">
                        <input className="form-control" type="text" name="POSTAL_CODE" value={form.POSTAL_CODE} onChange={(e) => onChangeTextField(e)} placeholder="CAP..." />
                    </div>
                    <div className="col-sm-1">
                        <FaTimes size={16} style={{ cursor: "pointer" }} color="#F00" onClick={e => { setForm(f => ({ ...f, POSTAL_CODE: '' })) }} />
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="EMAIL" className="col-sm-3 col-form-label">Email</label>
                    <div className="col-sm-2">
                        <OperationDropdown name="EMAIL_OPERATION" value={form.EMAIL_OPERATION} onChange={(e) => onChangeSelectField(e)} className="form-control" fieldType="STRING" />
                    </div>
                    <div className="col-sm-5">
                        <input className="form-control" type="text" name="EMAIL" value={form.EMAIL} onChange={(e) => onChangeTextField(e)} placeholder="Email..." />
                    </div>
                    <div className="col-sm-1">
                        <FaTimes size={16} style={{ cursor: "pointer" }} color="#F00" onClick={e => { setForm(f => ({ ...f, EMAIL: '' })) }} />
                    </div>
                </div>

                <div className="form-group">
                    <button type="submit" className="btn btn-primary" name="submit" onClick={(e) => submitForm()}>Cerca</button>
                </div>
            </div>
        </>
    )

}

export default SearchForm