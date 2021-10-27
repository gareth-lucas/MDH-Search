import "./App.css";
import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { Redirect } from "react-router";
import NavBar from "./components/NavBar.component";
import LoadingSpinner from "./components/LoadingSpinner.component";
import ErrorDiv from "./components/ErrorDiv.component";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Administration from "./pages/Administration";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import PasswordReset from "./pages/PasswordReset";
import PrivateRoute from "./routing/PrivateRoute";
import { authenticationService } from "./services/authentication.service";

const App = () => {

  const [state, setState] = useState({
    error: null,
  });

  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      authenticationService.currentUser.subscribe(x => setCurrentUser(x))
    }

    fetchUser();
  }, [currentUser]);

  return (
    <>
      <LoadingSpinner visible={loading} />
      <ErrorDiv
        error={state.error}
        onClose={() => setState((s) => ({ ...s, error: null }))}
      />
      <NavBar
        currentUser={currentUser}
      />
      <Switch>
        <Route
          exact
          path="/"
          render={(props) => (
            <Redirect to="/login" />
          )}
        />
        <PrivateRoute
          exact
          path="/search"
          component={Search}
          currentUser={currentUser}
          loading={loading}
          setState={setState}
          setLoading={setLoading}
        />
        <PrivateRoute
          exact
          path="/admin"
          component={Administration}
          currentUser={currentUser}
        />
        <PrivateRoute
          exact
          path="/profile"
          component={Profile}
          currentUser={currentUser}
        />
        <Route
          exact
          path="/login"
          render={(props) => (
            <Login
              {...props}
              setCurrentUser={setCurrentUser}
              currentUser={currentUser}
            />
          )}
        />

        <Route
          exact
          path="/resetPassword"
          render={(props) => (
            <ResetPassword
              {...props}
              currentUser={currentUser}
            />
          )}
        />

        <Route
          exact
          path="/passwordReset"
          render={(props) => (
            <PasswordReset
              {...props}
              currentUser={currentUser}
            />
          )}
        />
      </Switch>
    </>
  );
};

export default App;
