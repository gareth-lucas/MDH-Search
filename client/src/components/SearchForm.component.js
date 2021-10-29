import React from 'react';
import { FaCheckSquare, FaTimes } from "react-icons/fa";
import { useState } from "react";
import OperationDropdown from "./OperationDropdown.component";
import SavedSearchDropdown from './SavedSearchDropdown.component';
import { searchService } from '../services/search.service';
import { profileService } from '../services/profile.service';

const SearchForm = ({ setResults, setState, setLoading, currentUser, setMessage }) => {

  const initialForm = {
    SAP_ID: "",
    SAP_ID_OPERATION: "EQUALS",
    NAME1: "",
    NAME1_OPERATION: "EQUALS",
    NAME2: "",
    NAME2_OPERATION: "EQUALS",
    STREET: "",
    STREET_OPERATION: "EQUALS",
    CITY: "",
    CITY_OPERATION: "EQUALS",
    EMAIL: "",
    EMAIL_OPERATION: "EQUALS",
    POSTAL_CODE: "",
    POSTAL_CODE_OPERATION: "EQUALS",
    SEARCHTERM: "",
    SEARCHTERM_OPERATION: "EQUALS",
    GOLDEN: 'Y',
    QUARANTINE: 'N'
  }

  const [form, setForm] = useState(initialForm);
  const [formState, setFormState] = useState({
    error: null,
  });
  const [description, setDescription] = useState('');
  const [showField, setShowField] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [savedSearchDropdownKey, setSavedSearchDropdownKey] = useState(new Date());

  const updateDescription = e => {
    const val = e.target.value;

    setDescription(val);
  }

  const onChangeTextField = (e) => {
    const field = e.target.name;
    const value = e.target.value;

    setForm((f) => ({ ...f, [field]: value }));
  };

  const onChangeSelectField = (e) => {
    const field = e.target.name;
    const value = e.target.value;

    setForm((f) => ({ ...f, [field]: value }));
  };

  const onChangeCheckbox = (e) => {
    const checked = e.target.checked;
    const name = e.target.name;

    setForm((f) => ({ ...f, [name]: checked ? 'Y' : 'N' }));
  }

  const resetField = (name) => {
    const operationField = `${name}_OPERATION`;
    setForm((f) => ({ ...f, [name]: "", [operationField]: "EQUALS" }));
  };

  const setSavedSearch = (searchParams) => {
    if (!searchParams) {
      setForm(initialForm);
      return;
    }
    const params = JSON.parse(searchParams.searchParams);
    setForm(params);
  }

  const nameSavedSearch = () => {
    setShowField(true);
  }

  const createSavedSearch = async () => {
    if (description === '') {
      setDescriptionError(true);
      return;
    }

    const data = {
      description: description,
      idUser: currentUser.user.rowid,
      searchParams: JSON.stringify(form)
    }

    try {
      await profileService.createSavedSearch(currentUser.user.rowid, data);
      setMessage(`Ricerca salvata correttamente`);
      setDescription('');
      setShowField(false);
      setSavedSearchDropdownKey(new Date());
    } catch (err) {
      console.error(err);
      setFormState({ error: err.response.data.message });
    }
  }

  const submitForm = async () => {
    const output = {};

    // fields to display
    output.view = [
      "SAP_ID",
      "NAME2",
      "NAME1",
      "STREET",
      "CIVIC_NUMBER",
      "CITY",
      "POSTAL_CODE",
      "TITLE",
      "SEARCHTERM",
      "CITY",
      "STATE",
      "CREATIONDATE",
      "CREATEDBY",
      "MODIFYDATE",
      "MODIFIEDBY"
    ];

    // sort fields
    output.sort = {
      NAME2: {
        value: "ASC",
      },
      NAME1: {
        value: "ASC",
      },
    };

    // filter fields
    // ignore blank fields and operation fields
    const fields = Object.keys(form)
      .filter((k) => {
        return form[k].trim() !== "" && k.substr(-10) !== "_OPERATION";
      })
      .reduce((out, k) => {
        // reduce to a single object we can pass to the backend
        out[k] = { value: form[k], operator: form[`${k}_OPERATION`] };
        return out;
      }, {});

    // show error if no filter is selected
    output.filter = fields;
    if (Object.keys(output.filter).length === 0) {
      setState({ error: "Va specificato almeno un filtro" });
      return;
    }

    if (form.GOLDEN === 'N' && form.QUARANTINE === 'N') {
      setState({ error: "Specificare Golden Record e/o Quarantena" })
      return;
    }

    // show loading spinner
    setLoading(true);

    // call backend with data
    try {
      const results = await searchService.query(output);

      // pass results to parent component
      setResults(results);
    } catch (err) {
      // show the error on the form
      setFormState({ error: err.response.data.message });
    } finally {
      // whatever happens, hide the loading spinner.
      setLoading(false);
    }
  };

  return (
    <div className="col-sm-6 pt-3">
      <h2>Ricerca Business Partner</h2>
      <div className="form">
        {formState.error && (
          <div className="row text-danger">{formState.error}</div>
        )}
        <div className="form-group row my-2">
          <SavedSearchDropdown
            key={savedSearchDropdownKey}
            currentUser={currentUser}
            setLoading={setLoading}
            updateSavedSearch={setSavedSearch}
          />
        </div>
        <div className="form-group row">
          <label htmlFor="SAP_ID" className="col-sm-3 col-form-label">
            SAP ID
          </label>
          <div className="col-sm-2">
            <OperationDropdown
              name="SAP_ID_OPERATION"
              value={form.SAP_ID_OPERATION}
              onChange={(e) => onChangeSelectField(e)}
              className="form-control"
              fieldType="STRING"
            />
          </div>
          <div className="col-sm-5">
            <input
              className="form-control"
              type="text"
              name="SAP_ID"
              value={form.SAP_ID}
              onChange={(e) => onChangeTextField(e)}
              placeholder="SAP ID..."
            />
          </div>
          <div className="col-sm-1">
            <FaTimes
              size={16}
              style={{ cursor: "pointer" }}
              color="#F00"
              onClick={() => {
                resetField("SAP_ID");
              }}
            />
          </div>
        </div>
        <div className="form-group row pt-1">
          <label htmlFor="NAME2" className="col-sm-3 col-form-label">
            Cognome
          </label>
          <div className="col-sm-2">
            <OperationDropdown
              name="NAME2_OPERATION"
              value={form.NAME2_OPERATION}
              onChange={(e) => onChangeSelectField(e)}
              className="form-control"
              fieldType="STRING"
            />
          </div>
          <div className="col-sm-5">
            <input
              className="form-control"
              type="text"
              name="NAME2"
              value={form.NAME2}
              onChange={(e) => onChangeTextField(e)}
              placeholder="Cognome..."
            />
          </div>
          <div className="col-sm-1">
            <FaTimes
              size={16}
              style={{ cursor: "pointer" }}
              color="#F00"
              onClick={() => {
                resetField("NAME2");
              }}
            />
          </div>
        </div>

        <div className="form-group row pt-1">
          <label htmlFor="NAME1" className="col-sm-3 col-form-label">
            Nome
          </label>
          <div className="col-sm-2">
            <OperationDropdown
              name="NAME1_OPERATION"
              value={form.NAME1_OPERATION}
              onChange={(e) => onChangeSelectField(e)}
              className="form-control"
              fieldType="STRING"
            />
          </div>
          <div className="col-sm-5">
            <input
              className="form-control"
              type="text"
              name="NAME1"
              value={form.NAME1}
              onChange={(e) => onChangeTextField(e)}
              placeholder="Nome..."
            />
          </div>
          <div className="col-sm-1">
            <FaTimes
              size={16}
              style={{ cursor: "pointer" }}
              color="#F00"
              onClick={() => {
                resetField("NAME1");
              }}
            />
          </div>
        </div>

        <div className="form-group row pt-1">
          <label htmlFor="SEARCHTERM" className="col-sm-3 col-form-label">
            Search Term
          </label>
          <div className="col-sm-2">
            <OperationDropdown
              name="SEARCHTERM_OPERATION"
              value={form.SEARCHTERM_OPERATION}
              onChange={(e) => onChangeSelectField(e)}
              className="form-control"
              fieldType="STRING"
            />
          </div>
          <div className="col-sm-5">
            <input
              className="form-control"
              type="text"
              name="SEARCHTERM"
              value={form.SEARCHTERM}
              onChange={(e) => onChangeTextField(e)}
              placeholder="Search Term..."
            />
          </div>
          <div className="col-sm-1">
            <FaTimes
              size={16}
              style={{ cursor: "pointer" }}
              color="#F00"
              onClick={() => {
                resetField("SEARCHTERM");
              }}
            />
          </div>
        </div>

        <div className="form-group row pt-1">
          <label htmlFor="STREET" className="col-sm-3 col-form-label">
            Indirizzo
          </label>
          <div className="col-sm-2">
            <OperationDropdown
              name="STREET_OPERATION"
              value={form.STREET_OPERATION}
              onChange={(e) => onChangeSelectField(e)}
              className="form-control"
              fieldType="STRING"
            />
          </div>
          <div className="col-sm-5">
            <input
              className="form-control"
              type="text"
              name="STREET"
              value={form.STREET}
              onChange={(e) => onChangeTextField(e)}
              placeholder="Indrizzo..."
            />
          </div>
          <div className="col-sm-1">
            <FaTimes
              size={16}
              style={{ cursor: "pointer" }}
              color="#F00"
              onClick={() => {
                resetField("STREET");
              }}
            />
          </div>
        </div>

        <div className="form-group row pt-1">
          <label htmlFor="CITY" className="col-sm-3 col-form-label">City</label>
          <div className="col-sm-2">
            <OperationDropdown
              name="CITY_OPERATION"
              value={form.CITY_OPERATION}
              onChange={(e) => onChangeSelectField(e)}
              className="form-control"
              fieldType="STRING"
            />
          </div>
          <div className="col-sm-5">
            <input
              className="form-control"
              type="text"
              name="CITY"
              value={form.CITY}
              onChange={(e) => onChangeTextField(e)}
              placeholder="Città..."
            />
          </div>
          <div className="col-sm-1">
            <FaTimes
              size={16}
              style={{ cursor: "pointer" }}
              color="#F00"
              onClick={() => {
                resetField("CITY");
              }}
            />
          </div>
        </div>

        <div className="form-group row pt-1">
          <label htmlFor="POSTAL_CODE" className="col-sm-3 col-form-label">
            CAP
          </label>
          <div className="col-sm-2">
            <OperationDropdown
              name="POSTAL_CODE_OPERATION"
              value={form.POSTAL_CODE_OPERATION}
              onChange={(e) => onChangeSelectField(e)}
              className="form-control"
              fieldType="STRING"
            />
          </div>
          <div className="col-sm-5">
            <input
              className="form-control"
              type="text"
              name="POSTAL_CODE"
              value={form.POSTAL_CODE}
              onChange={(e) => onChangeTextField(e)}
              placeholder="CAP..."
            />
          </div>
          <div className="col-sm-1">
            <FaTimes
              size={16}
              style={{ cursor: "pointer" }}
              color="#F00"
              onClick={() => {
                resetField("POSTAL_CODE");
              }}
            />
          </div>
        </div>

        <div className="form-group row pt-1">
          <label htmlFor="EMAIL" className="col-sm-3 col-form-label">
            Email
          </label>
          <div className="col-sm-2">
            <OperationDropdown
              name="EMAIL_OPERATION"
              value={form.EMAIL_OPERATION}
              onChange={(e) => onChangeSelectField(e)}
              className="form-control"
              fieldType="STRING"
            />
          </div>
          <div className="col-sm-5">
            <input
              className="form-control"
              type="text"
              name="EMAIL"
              value={form.EMAIL}
              onChange={(e) => onChangeTextField(e)}
              placeholder="Email..."
            />
          </div>
          <div className="col-sm-1">
            <FaTimes
              size={16}
              style={{ cursor: "pointer" }}
              color="#F00"
              onClick={() => {
                resetField("EMAIL");
              }}
            />
          </div>
        </div>

        <div className="form-check mt-2">
          <input type="checkbox" name="GOLDEN" value="G" className="form-check-input" checked={form.GOLDEN === 'Y' ? 'checked' : ''} onChange={e => onChangeCheckbox(e)} />
          <label htmlFor="GOLDEN" className="form-check-label">Golden Records</label>
        </div>


        <div className="form-check">
          <input type="checkbox" name="QUARANTINE" value="Q" className="form-check-input" checked={form.QUARANTINE === 'Y' ? 'checked' : ''} onChange={e => onChangeCheckbox(e)} />
          <label htmlFor="QUARANTINE" className="form-check-label">Quarantena*</label>
        </div>

        <div>* Nella ricerca dei record in Quarantena, tutti i filtri funzionano in modalità "Inizia con"</div>

        <div className="row pt-1">
          <div className="col-sm-5">
            <button
              className="btn btn-primary mr-2"
              name="submit"
              onClick={(e) => submitForm()}
            >
              Cerca
            </button>
            <span> </span>
            <button className="btn btn-outline-primary ml-2" onClick={() => nameSavedSearch()}>Salva Ricerca</button>
          </div>
          <div className="col-sm-6 col-offset-sm-1">
            {showField &&
              <>
                <div className="row g-0">
                  <div className="col">
                    <input className="form-control col-sm-auto" style={{ width: "14rem" }} name="description" value={description} onChange={e => updateDescription(e)} type="text" placeholder="descrizione" />
                  </div>
                  <div className="col">
                    <FaCheckSquare color="#198754" size={40} style={{ cursor: "pointer" }} onClick={() => createSavedSearch()} />
                  </div>
                </div>
                {descriptionError &&
                  <div className="row"><div className="col text-danger">La descrizione non può essere blank</div></div>
                }
              </>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
