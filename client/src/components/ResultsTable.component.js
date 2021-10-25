import { useEffect } from "react";
import { FaStar, FaQuestionCircle } from "react-icons/fa";

const ResultsTable = ({ results, onSelectResult }) => {
  // listen to the results prop and render on change
  useEffect(() => {
    // if only one Record is returned, make it an array so it's easier to handle later
    if (results.Record && !Array.isArray(results.Record)) {
      results.Record = [results.Record];
    }
  }, [results]);

  const createAddress = (address) => {
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
      case "GoldenRecord":
        return <FaStar color="#FFD700" size={16} title="Golden Record" />;
      default:
        return <FaQuestionCircle color="#F00" size={16} title="Unknown" />;
    }
  };

  return (
    <div className="col-sm-6 pt-3">
      <h2>Tabella Risultati</h2>

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
          {results.Record &&
            results.Record.length &&
            results.Record.map((r) => {
              const fields = r.Fields.bupa;

              return (
                <tr
                  key={r.$.recordId}
                  onClick={(e) => {
                    console.log(r.$.recordId);
                    onSelectResult(r.$.recordId);
                  }}
                >
                  <td>{fields.sap_id}</td>
                  <td>{fields.name2}</td>
                  <td>{fields.name1}</td>
                  <td>{createAddress(fields.address)}</td>
                  <td>{getStatus(results.$.origin)}</td>
                </tr>
              );
            })}

          {!results.Record && (
            <tr>
              <td colSpan={2} className="text-center">
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
