import './App.css';
import { useState } from 'react';
import NavBar from './components/NavBar.component';
import SearchForm from './components/SearchForm.component';
import ResultsTable from './components/ResultsTable.component';
import SelectedPartner from './components/SelectedPartner.component';
import LoadingSpinner from './components/LoadingSpinner.component';
import ErrorDiv from './components/ErrorDiv.component';

function App() {

  const [state, setState] = useState({
    error: null
  });

  const [results, setResults] = useState([]);
  const [selectedPartner, setSelectedParter] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <LoadingSpinner visible={loading} />
      <ErrorDiv error={state.error} onClose={() => setState(s => ({ ...s, error: null }))} />
      <div className="container">
        <NavBar currentPage={"Test"} />
        <div className="row">
          <div className="col-sm-6 pt-3">
            <SearchForm setResults={setResults} setState={setState} setLoading={setLoading} />
          </div>
          <div className="col-sm-6 pt-3">
            <ResultsTable results={results} onSelectResult={setSelectedParter} />
          </div>
        </div>
        {selectedPartner &&
          <SelectedPartner selectedPartner={selectedPartner} onClose={e => setSelectedParter(null)} setLoading={setLoading} />
        }
      </div>

    </>
  );
}

export default App;
