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
import Alert from "./layout/Alert";

const App = () => {
  const [state, setState] = useState({
    error: null,
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedPartner, setSelectedParter] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [alert, setAlert] = useState(null);

  const showAlert = (msg, type) => {
    setAlert({ msg, type });

    setTimeout(() => setAlert(null), 5000);
  };

  useEffect(() => {
    const cookie = document.cookie.match(/^(.*;)?\s*token\s*=\s*[^;]+(.*)?$/);
    if (cookie !== null) {
      setIsAuthenticated(true);
    }
  }, [isAuthenticated]);

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
      {alert !== null && <Alert alert={alert} />}
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
              showAlert={showAlert}
            />
          )}
        />
        <Route
          exact
          path="/register"
          render={(props) => <Register {...props} showAlert={showAlert} />}
        />
      </Switch>
    </Router>
  );
};

export default App;
