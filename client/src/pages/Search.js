import React, { useState } from "react";
import SearchForm from "../components/SearchForm.component";
import ResultsTable from "../components/ResultsTable.component";
import SelectedPartner from "../components/SelectedPartner.component";

const Search = ({
  setState,
  setLoading
}) => {

  const [results, setResults] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);

  return (
    <div className="container">
      <div className="row">
        <SearchForm
          setResults={setResults}
          setState={setState}
          setLoading={setLoading}
        />
        <ResultsTable results={results} onSelectResult={(result) => setSelectedPartner(result)} />
      </div>
      {selectedPartner && (
        <SelectedPartner
          selectedPartner={selectedPartner}
          onClose={() => setSelectedPartner(null)}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default Search;
