import React, { useState } from "react";
import SearchForm from "../components/SearchForm.component";
import ResultsTable from "../components/ResultsTable.component";
import SelectedPartner from "../components/SelectedPartner.component";
import MessageDiv from "../components/MessageDiv.component";

const Search = ({
  setState,
  setLoading,
  currentUser
}) => {

  const [results, setResults] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [message, setMessage] = useState(null);

  const doSetSelectedPartner = (p) => {
    setSelectedPartner(p);
  }

  return (
    <div className="container">
      <MessageDiv message={message} onClose={() => setMessage(null)} />
      <div className="row">
        <SearchForm
          setResults={setResults}
          setState={setState}
          setLoading={setLoading}
          currentUser={currentUser}
          setMessage={setMessage}
        />
        <ResultsTable results={results} onSelectResult={(result) => doSetSelectedPartner(result)} />
      </div>
      {selectedPartner && (
        <SelectedPartner
          selectedPartner={selectedPartner}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default Search;
