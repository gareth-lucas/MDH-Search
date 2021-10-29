import React, { useEffect } from "react";
import { FaStar, FaQuestionCircle, FaTemperatureHigh } from "react-icons/fa";

const ResultsTable = ({ results, onSelectResult }) => {
  // listen to the results prop and render on change
  useEffect(() => {

  }, [results]);

  const createAddress = (address) => {
    if (!address || address[0] === null) {
      return <div style={{ borderBottom: "1px solid #EEE" }}>Unknown</div>
    }

    // if address is not an array, turn it into one
    if (!Array.isArray(address)) {
      address = [address];
    }

    // format the address string
    const formattedAddresses = address.map((a, idx) => {
      const addressElements = [a.street, a.civic_number, a.city, a.postal_code]
        .filter((a) => !!a)
        .join(", ");
      return (
        <div key={idx} style={{ borderBottom: "1px solid #EEE" }}>
          {addressElements}
        </div>
      );
    });

    return formattedAddresses;
  };

  // show record status
  // #TODO: Need to manage quarantined records, changed records.
  const getStatus = (status) => {
    switch (status) {
      case "GR":
        return <FaStar color="#FFD700" size={16} title="Golden Record" />;
      case "Q":
        return <FaTemperatureHigh color="#DC3545" size={16} title="Quarantena" />
      default:
        return <FaQuestionCircle color="#F00" size={16} title="Unknown" />;
    }
  };

  return (
    <div className="col-sm-6 pt-3">
      <h2>Tabella Risultati</h2>
      {results.records?.length > 0 && <div>Totale: {results.totalRecords}, Visualizzati: {results.totalResults} {results.totalResults < results.totalRecords && ' - raffinare i parametri di ricerca'}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>SAP ID</th>
            <th>Cognome</th>
            <th>Nome</th>
            <th>Indirizzo</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {results.records?.length > 0 &&
            results.records.map((r) => {

              return (
                <tr
                  key={r.recordId}
                  onClick={(e) => {
                    onSelectResult(r);
                  }}
                >
                  <td>{r.sap_id}</td>
                  <td>{r.name2}</td>
                  <td>{r.name1}</td>
                  <td>{createAddress(r.addresses)}</td>
                  <td>{getStatus(r.origin)}</td>
                </tr>
              );
            })}

          {!results.records?.length > 0 && (
            <tr>
              <td colSpan={5} className="text-center">
                Nessun Risultato Trovato
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
