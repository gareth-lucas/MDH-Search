import React, { useState } from "react";
import SearchForm from "../components/SearchForm.component";
import ResultsTable from "../components/ResultsTable.component";
import SelectedPartner from "../components/SelectedPartner.component";

const Home = ({
  setResults,
  setState,
  setLoading,
  results,
  onSelectResult,
  selectedPartner,
  onClose,
}) => {
  return (
    <div className="container">
      <div className="row">
        <SearchForm
          setResults={setResults}
          setState={setState}
          setLoading={setLoading}
        />
        <ResultsTable results={results} onSelectResult={onSelectResult} />
      </div>
      {selectedPartner && (
        <SelectedPartner
          selectedPartner={selectedPartner}
          onClose={() => onClose()}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default Home;
