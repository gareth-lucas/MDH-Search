import React, { useEffect } from "react";
import { FaStar, FaQuestionCircle, FaTemperatureHigh } from "react-icons/fa";
import { PaginatedTable } from "./PaginatedTable";

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


  var tableResults = [];
  if (results.records) {
    tableResults = results.records.map(r => ({
      id: r.sap_id,
      name2: r.name2,
      name1: r.name1,
      address: createAddress(r.addresses),
      origin: getStatus(r.origin),
      _actions: [
        {
          name: 'apri',
          onClick: e => { onSelectResult(r) }
        }
      ]
    }));
  }

  const columns = ['id', 'name2', 'name1', 'address', 'origin', '_actions'];
  const columnNames = ['SAP ID', 'Cognome', 'Nome', 'Indirizzo', 'Stato', 'Azioni'];

  return (
    <div className="col-sm-6 pt-3">
      <h2>Tabella Risultati</h2>
      {results.records?.length > 0 && <div>Totale: {results.totalRecords}, Visualizzati: {results.totalResults} {results.totalResults < results.totalRecords && ' - raffinare i parametri di ricerca'}</div>}

      <PaginatedTable
        data={tableResults}
        columns={columns}
        columnTitles={columnNames}
        rowsPerPage={10}
      />

    </div>
  )
};

export default ResultsTable;
