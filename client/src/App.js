import "./App.css";
import { Fragment, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./components/NavBar.component";
import LoadingSpinner from "./components/LoadingSpinner.component";
import ErrorDiv from "./components/ErrorDiv.component";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Administration from "./pages/Administration";

const App = () => {
  const [state, setState] = useState({
    error: null,
  });

  const [results, setResults] = useState([]);
  const [selectedPartner, setSelectedParter] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <Router>
      <LoadingSpinner visible={loading} />
      <ErrorDiv
        error={state.error}
        onClose={() => setState((s) => ({ ...s, error: null }))}
      />
      <NavBar
        currentPage={"Test"}
        isAuthenticated={isAuthenticated}
        changeAuth={setIsAuthenticated}
      />
      <Switch>
        <Route
          exact
          path="/"
          render={(props) => (
            <Fragment>
              <Home
                setResults={setResults}
                setState={setState}
                setLoading={setLoading}
                results={results}
                onSelectResult={setSelectedParter}
                selectedPartner={selectedPartner}
                onClose={setSelectedParter}
              />
            </Fragment>
          )}
        />
        <Route exact path="/admin" component={Administration} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </Router>
  );
};

export default App;
