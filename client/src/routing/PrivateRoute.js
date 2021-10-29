import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({
  component: Component,
  currentUser,
  loading,
  setState,
  setLoading,
  results,
  onSelectResult,
  selectedPartner,
  setResults,
  onClose,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !currentUser ? (
          <Redirect to="/login" />
        ) : currentUser.passwordChange ?
          <Redirect to="/passwordReset" />
          : (
            <Component
              {...props}
              setState={setState}
              setLoading={setLoading}
              currentUser={currentUser}
              results={results}
              onSelectResult={onSelectResult}
              selectedPartner={selectedPartner}
              setResults={setResults}
              onClose={onClose}
            />
          )
      }
    />
  );
};

export default PrivateRoute;
