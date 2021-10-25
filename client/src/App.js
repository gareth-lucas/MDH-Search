import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./components/NavBar.component";
import LoadingSpinner from "./components/LoadingSpinner.component";
import ErrorDiv from "./components/ErrorDiv.component";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Administration from "./pages/Administration";
import PrivateRoute from "./routing/PrivateRoute";

const App = () => {
  const [state, setState] = useState({
    error: null,
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedPartner, setSelectedParter] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const cookie = document.cookie.match(/^(.*;)?\s*token\s*=\s*[^;]+(.*)?$/);
    if (cookie !== null) {
      setIsAuthenticated(true);
    }
  }, []);

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
        userName={userName}
      />
      <Switch>
        <PrivateRoute
          exact
          path="/"
          component={Home}
          isAuthenticated={isAuthenticated}
          loading={loading}
          setState={setState}
          setLoading={setLoading}
          results={results}
          onSelectResult={setSelectedParter}
          selectedPartner={selectedPartner}
          setResults={setResults}
          onClose={setSelectedParter}
        />
        <Route exact path="/admin" component={Administration} />
        <Route
          exact
          path="/login"
          render={(props) => (
            <Login
              {...props}
              setIsAuthenticated={setIsAuthenticated}
              isAuthenticated={isAuthenticated}
              setUserName={setUserName}
            />
          )}
        />
        <Route exact path="/register" component={Register} />
      </Switch>
    </Router>
  );
};

export default App;
